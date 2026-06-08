/**
 * Benefit routes - Benefit management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null
    const benefits = db.prepare('SELECT * FROM benefits ORDER BY type, id').all() as any[]
    const benefitsWithStatus = benefits.map((benefit) => {
      let unlocked = false; let unlockedAt = null
      if (userId) {
        const userBenefit = db.prepare('SELECT unlocked_at FROM user_benefits WHERE user_id = ? AND benefit_id = ?').get(userId, benefit.id) as any
        if (userBenefit) { unlocked = true; unlockedAt = userBenefit.unlocked_at }
        else {
          const user = db.prepare('SELECT composite_score FROM users WHERE id = ?').get(userId) as any
          if (user) {
            const avgScore = db.prepare('SELECT AVG(total_score) as avg FROM service_records WHERE user_id = ?').get(userId) as { avg: number | null }
            let userLevel = 'improve'
            const score = avgScore.avg ?? 0
            if (score >= 90) userLevel = 'excellent'
            else if (score >= 75) userLevel = 'good'
            else if (score >= 60) userLevel = 'pass'
            const levelOrder = ['improve', 'pass', 'good', 'excellent']
            const requiredLevel = benefit.required_level
            if (requiredLevel && levelOrder.indexOf(userLevel) >= levelOrder.indexOf(requiredLevel)) unlocked = true
          }
        }
      }
      return { ...benefit, unlocked, unlockedAt }
    })
    const grouped: Record<string, any[]> = {}
    for (const b of benefitsWithStatus) { if (!grouped[b.type]) grouped[b.type] = []; grouped[b.type].push(b) }
    res.json({ success: true, data: { benefits: benefitsWithStatus, grouped } })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取权益列表失败' })
  }
})

export default router
