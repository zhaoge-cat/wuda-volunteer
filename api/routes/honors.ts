/**
 * Honor routes - Honor management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req: Request, res: Response): void => {
  try {
    const { period, category, userId } = req.query
    let honors: any[]
    if (userId) {
      honors = db.prepare('SELECT * FROM honors WHERE user_id = ? ORDER BY date DESC').all(Number(userId))
    } else if (period) {
      honors = db.prepare('SELECT * FROM honors WHERE period = ? ORDER BY date DESC').all(period as string)
    } else if (category) {
      honors = db.prepare('SELECT * FROM honors WHERE type = ? ORDER BY date DESC').all(category as string)
    } else {
      honors = db.prepare('SELECT * FROM honors ORDER BY date DESC').all()
    }
    const enrichedHonors = honors.map((honor: any) => {
      const user = db.prepare('SELECT name, school, avatar FROM users WHERE id = ?').get(honor.user_id) as any
      return { ...honor, user: user || null }
    })
    res.json({ success: true, data: enrichedHonors })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取荣誉列表失败' })
  }
})

export default router
