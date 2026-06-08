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

// 初始化标志
let initComplete = false
let initError: string | null = null

/**
 * 同步导入所有路由 - 在模块加载时执行
 */
function initializeRoutes() {
  try {
    console.log('[App] Initializing routes...')
    
    // 动态导入和挂载路由
    import('./routes/auth.js').then((m) => {
      app.use('/api/auth', m.default)
      console.log('[App] ✓ auth routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load auth routes:', err.message)
      initError = `Auth routes failed: ${err.message}`
    })

    import('./routes/users.js').then((m) => {
      app.use('/api/users', m.default)
      console.log('[App] ✓ users routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load users routes:', err.message)
      initError = `Users routes failed: ${err.message}`
    })

    import('./routes/badges.js').then((m) => {
      app.use('/api/badges', m.default)
      console.log('[App] ✓ badges routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load badges routes:', err.message)
    })

    import('./routes/blindbox.js').then((m) => {
      app.use('/api/blindbox', m.default)
      console.log('[App] ✓ blindbox routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load blindbox routes:', err.message)
    })

    import('./routes/activities.js').then((m) => {
      app.use('/api/activities', m.default)
      console.log('[App] ✓ activities routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load activities routes:', err.message)
    })

    import('./routes/honors.js').then((m) => {
      app.use('/api/honors', m.default)
      console.log('[App] ✓ honors routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load honors routes:', err.message)
    })

    import('./routes/evaluations.js').then((m) => {
      app.use('/api/evaluations', m.default)
      console.log('[App] ✓ evaluations routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load evaluations routes:', err.message)
    })

    import('./routes/benefits.js').then((m) => {
      app.use('/api/benefits', m.default)
      console.log('[App] ✓ benefits routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load benefits routes:', err.message)
    })

    import('./routes/admin.js').then((m) => {
      app.use('/api/admin', m.default)
      console.log('[App] ✓ admin routes loaded')
    }).catch((err) => {
      console.error('[App] ✗ Failed to load admin routes:', err.message)
    })

    console.log('[App] All route imports initiated')
    initComplete = true
  } catch (error) {
    const err = error as Error
    console.error('[App] ✗ CRITICAL ERROR during initialization:', err.message)
    console.error('[App] Stack:', err.stack)
    initError = err.message
  }
}

// 立即初始化路由
initializeRoutes()

/**
 * 健康检查
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
    initialized: initComplete,
    error: initError,
  })
})

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[App] Server error:', error.message)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
    message: error.message,
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
