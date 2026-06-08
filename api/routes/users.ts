/**
 * User routes - User profile management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/users/me - Get current user profile
 */
router.get('/me', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId as string
    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId参数' })
      return
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(userId)) as any
    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' })
      return
    }

    const { password: _, ...userWithoutPassword } = user

    // Get user badge count
    const badgeCount = db.prepare('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ? AND is_duplicate = 0').get(Number(userId)) as { count: number }

    // Get service record count
    const serviceCount = db.prepare('SELECT COUNT(*) as count FROM service_records WHERE user_id = ?').get(Number(userId)) as { count: number }

    // Get honor count
    const honorCount = db.prepare('SELECT COUNT(*) as count FROM honors WHERE user_id = ?').get(Number(userId)) as { count: number }

    // Get pinned badges
    const pinnedBadges = db.prepare(`
      SELECT b.*, ub.pinned, ub.unlocked_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ? AND ub.pinned = 1 AND ub.is_duplicate = 0
      ORDER BY ub.unlocked_at DESC
    `).all(Number(userId))

    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        stats: {
          badgeCount: badgeCount.count,
          serviceCount: serviceCount.count,
          honorCount: honorCount.count,
        },
        pinnedBadges,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户信息失败' })
  }
})

/**
 * GET /api/users/:id - Get user by id
 */
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const userId = Number(req.params.id)
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any
    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' })
      return
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户信息失败' })
  }
})

/**
 * PUT /api/users/:id - Update user profile
 */
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const userId = Number(req.params.id)
    const { name, school, avatar } = req.body

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any
    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' })
      return
    }

    const updates: string[] = []
    const values: any[] = []

    if (name !== undefined) { updates.push('name = ?'); values.push(name) }
    if (school !== undefined) { updates.push('school = ?'); values.push(school) }
    if (avatar !== undefined) { updates.push('avatar = ?'); values.push(avatar) }

    if (updates.length === 0) {
      res.status(400).json({ success: false, error: '没有需要更新的字段' })
      return
    }

    values.push(userId)
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values)

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any
    const { password: _, ...userWithoutPassword } = updatedUser

    res.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    res.status(500).json({ success: false, error: '更新用户信息失败' })
  }
})

export default router
