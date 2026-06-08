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
 * 健康检查 - 放在所有路由之前，无依赖
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
  })
})

/**
 * 延迟加载路由 - 如果导入失败，至少健康检查还能工作
 */
try {
  console.log('Loading routes...')
  
  const { default: authRoutes } = await import('./routes/auth.js')
  app.use('/api/auth', authRoutes)
  console.log('✓ auth routes loaded')
  
  const { default: userRoutes } = await import('./routes/users.js')
  app.use('/api/users', userRoutes)
  console.log('✓ users routes loaded')
  
  const { default: badgeRoutes } = await import('./routes/badges.js')
  app.use('/api/badges', badgeRoutes)
  console.log('✓ badges routes loaded')
  
  const { default: blindboxRoutes } = await import('./routes/blindbox.js')
  app.use('/api/blindbox', blindboxRoutes)
  console.log('✓ blindbox routes loaded')
  
  const { default: activityRoutes } = await import('./routes/activities.js')
  app.use('/api/activities', activityRoutes)
  console.log('✓ activities routes loaded')
  
  const { default: honorRoutes } = await import('./routes/honors.js')
  app.use('/api/honors', honorRoutes)
  console.log('✓ honors routes loaded')
  
  const { default: evaluationRoutes } = await import('./routes/evaluations.js')
  app.use('/api/evaluations', evaluationRoutes)
  console.log('✓ evaluations routes loaded')
  
  const { default: benefitRoutes } = await import('./routes/benefits.js')
  app.use('/api/benefits', benefitRoutes)
  console.log('✓ benefits routes loaded')
  
  const { default: adminRoutes } = await import('./routes/admin.js')
  app.use('/api/admin', adminRoutes)
  console.log('✓ admin routes loaded')
  
  console.log('All routes loaded successfully!')
} catch (error) {
  console.error('Error loading routes:', error)
  console.error('Stack:', (error as Error).stack)
}

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
