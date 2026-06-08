/**
 * Evaluation routes - Service evaluation management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/evaluations/:userId - Get user's evaluations
 */
router.get('/:userId', (req: Request, res: Response): void => {
  try {
    const userId = Number(req.params.userId)

    const evaluations = db.prepare(`
      SELECT sr.*, s.date as shift_date, s.start_time, s.end_time, s.location as shift_location,
             a.title as activity_title
      FROM service_records sr
      JOIN shifts s ON sr.shift_id = s.id
      JOIN activities a ON s.activity_id = a.id
      WHERE sr.user_id = ?
      ORDER BY sr.created_at DESC
    `).all(userId)

    // Calculate stats
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_evaluations,
        AVG(total_score) as avg_score,
        SUM(CASE WHEN level = 'excellent' THEN 1 ELSE 0 END) as excellent_count,
        SUM(CASE WHEN level = 'good' THEN 1 ELSE 0 END) as good_count,
        SUM(CASE WHEN level = 'pass' THEN 1 ELSE 0 END) as pass_count,
        SUM(CASE WHEN level = 'improve' THEN 1 ELSE 0 END) as improve_count
      FROM service_records
      WHERE user_id = ?
    `).get(userId) as any

    res.json({ success: true, data: { evaluations, stats } })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取评价列表失败' })
  }
})

/**
 * POST /api/evaluations - Create evaluation
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { userId, serviceRecordId, attendance, quality, responsibility, discipline } = req.body

    if (!userId || !serviceRecordId) {
      res.status(400).json({ success: false, error: '缺少必要参数' })
      return
    }

    // Calculate total score
    const totalScore = (attendance ?? 0) * 0.25 + (quality ?? 0) * 0.30 + (responsibility ?? 0) * 0.25 + (discipline ?? 0) * 0.20

    // Determine level
    let level: string
    if (totalScore >= 90) level = 'excellent'
    else if (totalScore >= 75) level = 'good'
    else if (totalScore >= 60) level = 'pass'
    else level = 'improve'

    db.prepare(`
      UPDATE service_records
      SET attendance_score = ?, quality_score = ?, responsibility_score = ?, discipline_score = ?,
          total_score = ?, level = ?
      WHERE id = ? AND user_id = ?
    `).run(attendance ?? 0, quality ?? 0, responsibility ?? 0, discipline ?? 0, totalScore, level, serviceRecordId, userId)

    // Update user composite score
    const avgScore = db.prepare(
      'SELECT AVG(total_score) as avg FROM service_records WHERE user_id = ?'
    ).get(userId) as { avg: number | null }

    db.prepare('UPDATE users SET composite_score = ? WHERE id = ?')
      .run(avgScore.avg ?? 0, userId)

    // Check and award level badges
    const excellentCount = db.prepare(
      "SELECT COUNT(*) as count FROM service_records WHERE user_id = ? AND level = 'excellent'"
    ).get(userId) as { count: number }

    if (excellentCount.count >= 1) {
      // Award gold badge (id=1) if not already have it
      const existing = db.prepare('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = 1').get(userId)
      if (!existing) {
        db.prepare('INSERT OR IGNORE INTO user_badges (user_id, badge_id, pinned, is_duplicate) VALUES (?, 1, 0, 0)').run(userId)
      }
    }

    const goodCount = db.prepare(
      "SELECT COUNT(*) as count FROM service_records WHERE user_id = ? AND level IN ('excellent','good')"
    ).get(userId) as { count: number }

    if (goodCount.count >= 1) {
      const existing = db.prepare('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = 2').get(userId)
      if (!existing) {
        db.prepare('INSERT OR IGNORE INTO user_badges (user_id, badge_id, pinned, is_duplicate) VALUES (?, 2, 0, 0)').run(userId)
      }
    }

    res.json({
      success: true,
      data: { totalScore: Math.round(totalScore * 100) / 100, level },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '创建评价失败' })
  }
})

export default router
