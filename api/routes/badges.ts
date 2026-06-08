/**
 * Badge routes - Badge system management
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/badges - Get all badges grouped by category, with user unlock status
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null

    const badges = db.prepare('SELECT * FROM badges ORDER BY category, rarity DESC, id').all() as any[]

    const badgesWithStatus = badges.map((badge) => {
      let unlocked = false
      let pinned = false
      let unlockedAt = null

      if (userId) {
        const userBadge = db.prepare(
          'SELECT pinned, unlocked_at, is_duplicate FROM user_badges WHERE user_id = ? AND badge_id = ?'
        ).get(userId, badge.id) as any
        if (userBadge) {
          unlocked = true
          pinned = Boolean(userBadge.pinned)
          unlockedAt = userBadge.unlocked_at
        }
      }

      return { ...badge, unlocked, pinned, unlockedAt }
    })

    // Group by category
    const grouped = {
      level: badgesWithStatus.filter((b) => b.category === 'level'),
      role: badgesWithStatus.filter((b) => b.category === 'role'),
      blindbox: badgesWithStatus.filter((b) => b.category === 'blindbox'),
    }

    res.json({ success: true, data: grouped })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取徽章列表失败' })
  }
})

/**
 * GET /api/badges/series - Get badge series with collection progress
 */
router.get('/series', (req: Request, res: Response): void => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null

    const seriesList = db.prepare(
      "SELECT DISTINCT series FROM badges WHERE series IS NOT NULL ORDER BY series"
    ).all() as { series: string }[]

    const seriesData = seriesList.map(({ series }) => {
      const badges = db.prepare(
        'SELECT * FROM badges WHERE series = ? ORDER BY rarity DESC'
      ).all(series) as any[]

      const badgesWithStatus = badges.map((badge) => {
        let unlocked = false
        if (userId) {
          const userBadge = db.prepare(
            'SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ? AND is_duplicate = 0'
          ).get(userId, badge.id)
          unlocked = Boolean(userBadge)
        }
        return { ...badge, unlocked }
      })

      const collected = badgesWithStatus.filter((b) => b.unlocked).length
      const total = badgesWithStatus.length

      return {
        series,
        badges: badgesWithStatus,
        progress: { collected, total, percentage: Math.round((collected / total) * 100) },
      }
    })

    res.json({ success: true, data: seriesData })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取徽章系列失败' })
  }
})

/**
 * PUT /api/badges/:id/pin - Toggle pin status for a badge
 */
router.put('/:id/pin', (req: Request, res: Response): void => {
  try {
    const badgeId = Number(req.params.id)
    const { userId } = req.body

    if (!userId) {
      res.status(400).json({ success: false, error: '缺少userId' })
      return
    }

    const userBadge = db.prepare(
      'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?'
    ).get(userId, badgeId) as any

    if (!userBadge) {
      res.status(404).json({ success: false, error: '用户未拥有该徽章' })
      return
    }

    const newPinned = userBadge.pinned ? 0 : 1
    db.prepare('UPDATE user_badges SET pinned = ? WHERE user_id = ? AND badge_id = ?')
      .run(newPinned, userId, badgeId)

    res.json({ success: true, data: { pinned: Boolean(newPinned) } })
  } catch (error) {
    res.status(500).json({ success: false, error: '切换徽章置顶失败' })
  }
})

export default router
