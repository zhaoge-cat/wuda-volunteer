/**
 * Blind box routes - Blind box draw and collection
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

// Rarity weights for blind box draws
const RARITY_WEIGHTS = { common: 70, rare: 25, legendary: 5 }

/**
 * GET /api/blindbox/draw-count - Get available draw count for user
 * Every completed service record gives 1 draw
 */
router.get('/draw-count', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null
    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId参数' })
      return
    }

    const completedServices = db.prepare(
      "SELECT COUNT(*) as count FROM service_records WHERE user_id = ? AND level IN ('excellent','good','pass')"
    ).get(userId) as { count: number }

    const drawsUsed = db.prepare(
      'SELECT COUNT(*) as count FROM blind_box_draws WHERE user_id = ?'
    ).get(userId) as { count: number }

    const available = Math.max(0, completedServices.count - drawsUsed.count)

    res.json({ success: true, data: { available, total: completedServices.count, used: drawsUsed.count } })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取抽奖次数失败' })
  }
})

/**
 * POST /api/blindbox/draw - Draw a blind box
 */
router.post('/draw', (req: Request, res: Response): void => {
  try {
    const { userId } = req.body
    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId' })
      return
    }

    // Check available draws
    const completedServices = db.prepare(
      "SELECT COUNT(*) as count FROM service_records WHERE user_id = ? AND level IN ('excellent','good','pass')"
    ).get(userId) as { count: number }

    const drawsUsed = db.prepare(
      'SELECT COUNT(*) as count FROM blind_box_draws WHERE user_id = ?'
    ).get(userId) as { count: number }

    const available = completedServices.count - drawsUsed.count
    if (available <= 0) {
      res.status(400).json({ success: false, error: '没有可用的抽奖次数' })
      return
    }

    // Determine rarity by weighted random
    const rand = Math.random() * 100
    let rarity: string
    if (rand < RARITY_WEIGHTS.legendary) {
      rarity = 'legendary'
    } else if (rand < RARITY_WEIGHTS.legendary + RARITY_WEIGHTS.rare) {
      rarity = 'rare'
    } else {
      rarity = 'common'
    }

    // Get blindbox badges of that rarity
    const candidates = db.prepare(
      "SELECT * FROM badges WHERE category = 'blindbox' AND rarity = ?"
    ).all(rarity) as any[]

    if (candidates.length === 0) {
      res.status(500).json({ success: false, error: '没有可抽取的徽章' })
      return
    }

    // Random pick from candidates
    const badge = candidates[Math.floor(Math.random() * candidates.length)]

    // Check if user already has this badge
    const existingBadge = db.prepare(
      'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?'
    ).get(userId, badge.id) as any

    const isNew = !existingBadge
    const isDuplicate = !isNew

    // Add to user_badges if new
    if (isNew) {
      db.prepare('INSERT INTO user_badges (user_id, badge_id, pinned, is_duplicate) VALUES (?, ?, 0, 0)')
        .run(userId, badge.id)
    }

    // Record the draw
    db.prepare('INSERT INTO blind_box_draws (user_id, badge_id, is_new) VALUES (?, ?, ?)')
      .run(userId, badge.id, isNew ? 1 : 0)

    // Determine animation type based on rarity
    const animationType = rarity === 'legendary' ? 'legendary' : rarity === 'rare' ? 'rare' : 'common'

    res.json({
      success: true,
      data: {
        badge,
        isNew,
        isDuplicate,
        animationType,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '抽奖失败' })
  }
})

/**
 * GET /api/blindbox/collection - Get user's blind box collection
 */
router.get('/collection', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null
    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId参数' })
      return
    }

    const collection = db.prepare(`
      SELECT b.*, ub.pinned, ub.unlocked_at, ub.is_duplicate,
             d.drawn_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      LEFT JOIN blind_box_draws d ON d.user_id = ub.user_id AND d.badge_id = ub.badge_id
      WHERE ub.user_id = ? AND b.category = 'blindbox'
      ORDER BY b.series, b.rarity DESC
    `).all(userId)

    // Group by series
    const bySeries: Record<string, any[]> = {}
    for (const item of collection as any[]) {
      const series = item.series || 'other'
      if (!bySeries[series]) bySeries[series] = []
      bySeries[series].push(item)
    }

    res.json({ success: true, data: { collection, bySeries } })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取盲盒收藏失败' })
  }
})

export default router
