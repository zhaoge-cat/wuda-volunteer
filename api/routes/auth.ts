/**
 * Auth routes - User authentication
 */
import { Router, type Request, type Response } from 'express'
import db from '../db.js'

const router = Router()

router.post('/login', (req: Request, res: Response): void => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) {
      res.status(400).json({ success: false, error: '手机号和密码不能为空' })
      return
    }
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any
    if (!user || user.password !== password) {
      res.status(401).json({ success: false, error: '手机号或密码错误' })
      return
    }
    const { password: _, ...userWithoutPassword } = user
    res.json({ success: true, data: { token: String(user.id), user: userWithoutPassword } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: '登录失败' })
  }
})

router.post('/register', (req: Request, res: Response): void => {
  try {
    const { name, phone, password, school } = req.body
    if (!name || !phone || !password) {
      res.status(400).json({ success: false, error: '姓名、手机号和密码不能为空' })
      return
    }
    const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone)
    if (existing) {
      res.status(409).json({ success: false, error: '该手机号已注册' })
      return
    }
    const result = db.prepare('INSERT INTO users (name, phone, password, school) VALUES (?, ?, ?, ?)').run(name, phone, password, school || null)
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any
    const { password: _, ...userWithoutPassword } = user
    res.json({ success: true, data: { token: String(user.id), user: userWithoutPassword } })
  } catch (error) {
    res.status(500).json({ success: false, error: '注册失败' })
  }
})

export default router
