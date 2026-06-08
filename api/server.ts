/**
 * local server entry file, for local development and production
 */

// 立即打印日志，确保能看到
console.error('[SERVER] Process starting...')
process.stderr.write('[SERVER] stderr: Server initialization beginning\n')

import app from './app.js'

/**
 * start server with port
 */
const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'

console.error(`[SERVER] About to listen on ${HOST}:${PORT}`)

const server = app.listen(PORT, HOST, () => {
  console.error(`[SERVER] ✓ Server is listening on http://${HOST}:${PORT}`)
  console.log(`[SERVER] ✓ Server is listening on http://${HOST}:${PORT}`)
})

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.error('[SERVER] SIGTERM signal received')
  server.close(() => {
    console.error('[SERVER] Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.error('[SERVER] SIGINT signal received')
  server.close(() => {
    console.error('[SERVER] Server closed')
    process.exit(0)
  })
})

export default app
