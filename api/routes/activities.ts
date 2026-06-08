/**
 * Activity routes - Activity management and registration
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/activities - List all activities
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const status = req.query.status as string
    let activities: any[]

    if (status && ['upcoming', 'ongoing', 'completed'].includes(status)) {
      activities = db.prepare('SELECT * FROM activities WHERE status = ? ORDER BY date DESC').all(status)
    } else {
      activities = db.prepare('SELECT * FROM activities ORDER BY date DESC').all()
    }

    res.json({ success: true, data: activities })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取活动列表失败' })
  }
})

/**
 * GET /api/activities/my - Get user's registered activities
 */
router.get('/my', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null
    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId参数' })
      return
    }

    const registrations = db.prepare(`
      SELECT r.*, a.title, a.description, a.date, a.location, a.status as activity_status
      FROM registrations r
      JOIN activities a ON r.activity_id = a.id
      WHERE r.user_id = ?
      ORDER BY a.date DESC
    `).all(userId)

    res.json({ success: true, data: registrations })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取我的活动失败' })
  }
})

/**
 * GET /api/activities/:id - Get activity detail
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const activityId = Number(req.params.id)
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId) as any
    if (!activity) {
      res.status(404).json({ success: false, error: '活动不存在' })
      return
    }

    const shifts = db.prepare('SELECT * FROM shifts WHERE activity_id = ? ORDER BY date, start_time').all(activityId)

    const registrations = db.prepare(`
      SELECT r.*, u.name as user_name, u.phone, u.school
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.activity_id = ?
      ORDER BY r.registered_at DESC
    `).all(activityId)

    res.json({ success: true, data: { ...activity, shifts, registrations } })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取活动详情失败' })
  }
})

/**
 * POST /api/activities/:id/register - Register for activity
 */
router.post('/:id/register', (req: Request, res: Response): void => {
  try {
    const activityId = Number(req.params.id)
    const { userId, role } = req.body

    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId' })
      return
    }

    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId) as any
    if (!activity) {
      res.status(404).json({ success: false, error: '活动不存在' })
      return
    }

    // Check if already registered
    const existing = db.prepare(
      'SELECT * FROM registrations WHERE user_id = ? AND activity_id = ? AND status != ?'
    ).get(userId, activityId, 'cancelled')

    if (existing) {
      res.status(409).json({ success: false, error: '已报名该活动' })
      return
    }

    db.prepare('INSERT INTO registrations (user_id, activity_id, role, status) VALUES (?, ?, ?, ?)')
      .run(userId, activityId, role || 'volunteer', 'registered')

    // Update shifts_filled
    db.prepare('UPDATE activities SET shifts_filled = shifts_filled + 1 WHERE id = ?')
      .run(activityId)

    res.json({ success: true, data: { message: '报名成功' } })
  } catch (error) {
    res.status(500).json({ success: false, error: '活动报名失败' })
  }
})

export default router
