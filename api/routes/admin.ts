/**
 * Admin routes - Admin dashboard and management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/admin/stats - Get admin dashboard stats
 */
router.get('/stats', (req: Request, res: Response): void => {
  try {
    const totalVolunteers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get() as { count: number }
    const totalActivities = db.prepare('SELECT COUNT(*) as count FROM activities').get() as { count: number }
    const ongoingActivities = db.prepare("SELECT COUNT(*) as count FROM activities WHERE status = 'ongoing'").get() as { count: number }
    const totalRegistrations = db.prepare('SELECT COUNT(*) as count FROM registrations').get() as { count: number }
    const totalServiceRecords = db.prepare('SELECT COUNT(*) as count FROM service_records').get() as { count: number }
    const avgScore = db.prepare('SELECT AVG(total_score) as avg FROM service_records').get() as { avg: number | null }

    const recentActivities = db.prepare(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT 5'
    ).all()

    const recentRegistrations = db.prepare(`
      SELECT r.*, u.name as user_name, a.title as activity_title
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN activities a ON r.activity_id = a.id
      ORDER BY r.registered_at DESC LIMIT 10
    `).all()

    res.json({
      success: true,
      data: {
        totalVolunteers: totalVolunteers.count,
        totalActivities: totalActivities.count,
        ongoingActivities: ongoingActivities.count,
        totalRegistrations: totalRegistrations.count,
        totalServiceRecords: totalServiceRecords.count,
        avgScore: avgScore.avg ? Math.round(avgScore.avg * 100) / 100 : 0,
        recentActivities,
        recentRegistrations,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取统计数据失败' })
  }
})

/**
 * POST /api/admin/shifts - Create shift
 */
router.post('/shifts', (req: Request, res: Response): void => {
  try {
    const { activity_id, date, start_time, end_time, location, volunteers_needed } = req.body

    if (!activity_id || !date || !start_time || !end_time) {
      res.status(400).json({ success: false, error: '缺少必要参数' })
      return
    }

    const result = db.prepare(
      'INSERT INTO shifts (activity_id, date, start_time, end_time, location, volunteers_needed) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(activity_id, date, start_time, end_time, location || null, volunteers_needed || 0)

    const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(result.lastInsertRowid)
    res.json({ success: true, data: shift })
  } catch (error) {
    res.status(500).json({ success: false, error: '创建班次失败' })
  }
})

/**
 * GET /api/admin/shifts - List shifts
 */
router.get('/shifts', (req: Request, res: Response): void => {
  try {
    const activityId = req.query.activityId ? Number(req.query.activityId) : null

    let shifts: any[]
    if (activityId) {
      shifts = db.prepare('SELECT * FROM shifts WHERE activity_id = ? ORDER BY date, start_time').all(activityId)
    } else {
      shifts = db.prepare('SELECT * FROM shifts ORDER BY date, start_time').all()
    }

    // Enrich with activity info
    const enrichedShifts = shifts.map((shift: any) => {
      const activity = db.prepare('SELECT title FROM activities WHERE id = ?').get(shift.activity_id) as any
      return { ...shift, activity_title: activity?.title || '' }
    })

    res.json({ success: true, data: enrichedShifts })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取班次列表失败' })
  }
})

/**
 * POST /api/admin/attendance/check-in - Check in
 */
router.post('/attendance/check-in', (req: Request, res: Response): void => {
  try {
    const { userId, shiftId } = req.body
    if (!userId || !shiftId) {
      res.status(400).json({ success: false, error: '缺少必要参数' })
      return
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    // Check if service record exists for this user+shift
    const existing = db.prepare(
      'SELECT * FROM service_records WHERE user_id = ? AND shift_id = ?'
    ).get(userId, shiftId) as any

    if (existing) {
      db.prepare('UPDATE service_records SET check_in_time = ? WHERE id = ?').run(now, existing.id)
    } else {
      db.prepare(
        'INSERT INTO service_records (user_id, shift_id, check_in_time) VALUES (?, ?, ?)'
      ).run(userId, shiftId, now)
    }

    // Update registration status
    const shift = db.prepare('SELECT activity_id FROM shifts WHERE id = ?').get(shiftId) as any
    if (shift) {
      db.prepare(
        "UPDATE registrations SET status = 'checked_in' WHERE user_id = ? AND activity_id = ? AND status = 'registered'"
      ).run(userId, shift.activity_id)
    }

    res.json({ success: true, data: { check_in_time: now } })
  } catch (error) {
    res.status(500).json({ success: false, error: '签到失败' })
  }
})

/**
 * POST /api/admin/attendance/check-out - Check out
 */
router.post('/attendance/check-out', (req: Request, res: Response): void => {
  try {
    const { userId, shiftId } = req.body
    if (!userId || !shiftId) {
      res.status(400).json({ success: false, error: '缺少必要参数' })
      return
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    db.prepare('UPDATE service_records SET check_out_time = ? WHERE user_id = ? AND shift_id = ?')
      .run(now, userId, shiftId)

    // Update registration status
    const shift = db.prepare('SELECT activity_id FROM shifts WHERE id = ?').get(shiftId) as any
    if (shift) {
      db.prepare(
        "UPDATE registrations SET status = 'completed' WHERE user_id = ? AND activity_id = ? AND status = 'checked_in'"
      ).run(userId, shift.activity_id)
    }

    res.json({ success: true, data: { check_out_time: now } })
  } catch (error) {
    res.status(500).json({ success: false, error: '签退失败' })
  }
})

/**
 * GET /api/admin/volunteers - List all volunteers with stats
 */
router.get('/volunteers', (req: Request, res: Response): void => {
  try {
    const volunteers = db.prepare("SELECT * FROM users WHERE role != 'admin' ORDER BY composite_score DESC").all() as any[]

    const volunteersWithStats = volunteers.map((user: any) => {
      const { password: _, ...userWithoutPassword } = user

      const serviceCount = db.prepare('SELECT COUNT(*) as count FROM service_records WHERE user_id = ?').get(user.id) as { count: number }
      const badgeCount = db.prepare('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ? AND is_duplicate = 0').get(user.id) as { count: number }
      const honorCount = db.prepare('SELECT COUNT(*) as count FROM honors WHERE user_id = ?').get(user.id) as { count: number }
      const registrationCount = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE user_id = ?').get(user.id) as { count: number }

      return {
        ...userWithoutPassword,
        stats: {
          serviceCount: serviceCount.count,
          badgeCount: badgeCount.count,
          honorCount: honorCount.count,
          registrationCount: registrationCount.count,
        },
      }
    })

    res.json({ success: true, data: volunteersWithStats })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取志愿者列表失败' })
  }
})

export default router
