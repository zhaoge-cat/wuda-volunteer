/**
 * Wuda Tourism Volunteer Service Platform - Express App
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import badgeRoutes from './routes/badges.js'
import blindboxRoutes from './routes/blindbox.js'
import activityRoutes from './routes/activities.js'
import honorRoutes from './routes/honors.js'
import evaluationRoutes from './routes/evaluations.js'
import benefitRoutes from './routes/benefits.js'
import adminRoutes from './routes/admin.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/blindbox', blindboxRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/honors', honorRoutes)
app.use('/api/evaluations', evaluationRoutes)
app.use('/api/benefits', benefitRoutes)
app.use('/api/admin', adminRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
