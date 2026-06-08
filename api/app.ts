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

console.error('[APP] Module loading started')

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 初始化标志
let initComplete = false
let initError: string | null = null
const routeStatus: Record<string, boolean> = {}

console.error('[APP] Starting route initialization...')

/**
 * 健康检查 - 最优先
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
    initialized: initComplete,
    routeStatus: routeStatus,
    error: initError,
  })
})

/**
 * 异步加载路由
 */
async function initializeRoutes() {
  try {
    console.error('[APP] Loading database...')
    await import('./db.js')
    console.error('[APP] ✓ Database loaded')
    
    const routes = [
      { name: 'auth', path: './routes/auth.js', prefix: '/api/auth' },
      { name: 'users', path: './routes/users.js', prefix: '/api/users' },
      { name: 'badges', path: './routes/badges.js', prefix: '/api/badges' },
      { name: 'blindbox', path: './routes/blindbox.js', prefix: '/api/blindbox' },
      { name: 'activities', path: './routes/activities.js', prefix: '/api/activities' },
      { name: 'honors', path: './routes/honors.js', prefix: '/api/honors' },
      { name: 'evaluations', path: './routes/evaluations.js', prefix: '/api/evaluations' },
      { name: 'benefits', path: './routes/benefits.js', prefix: '/api/benefits' },
      { name: 'admin', path: './routes/admin.js', prefix: '/api/admin' },
    ]

    for (const route of routes) {
      try {
        console.error(`[APP] Loading ${route.name}...`)
        const module = await import(route.path)
        app.use(route.prefix, module.default)
        routeStatus[route.name] = true
        console.error(`[APP] ✓ ${route.name} routes loaded`)
      } catch (err) {
        const error = err as Error
        console.error(`[APP] ✗ Failed to load ${route.name}: ${error.message}`)
        routeStatus[route.name] = false
        initError = `${route.name} failed: ${error.message}`
      }
    }

    console.error('[APP] ✓ All routes initialized successfully')
    initComplete = true
  } catch (error) {
    const err = error as Error
    console.error('[APP] ✗ CRITICAL ERROR:', err.message)
    console.error('[APP] Stack:', err.stack)
    initError = err.message
  }
}

// 立即启动初始化
console.error('[APP] Calling initializeRoutes()...')
initializeRoutes().catch((err) => {
  console.error('[APP] Unhandled error in initializeRoutes:', err)
})

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[APP] Server error:', error.message)
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

console.error('[APP] Module export complete')
export default app
