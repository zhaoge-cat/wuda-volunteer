/**
 * local server entry file, for local development and production
 */
import app from './app.js'

/**
 * start server with port
 */
const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'

console.log('Starting Express server initialization...')

const server = app.listen(PORT, HOST, () => {
  console.log(`✓ Server is listening on http://${HOST}:${PORT}`)
})

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

export default app
