const http = require('node:http')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// Liveness health check for uptime monitoring (see issue #27).
//
// This handler is intentionally cheap and self-contained: it performs no
// database, network, or disk I/O, so a slow dependency can never make a healthy
// process look dead. It is unauthenticated and requires no params or headers.
function handleRequest(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  if (pathname === '/health') {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, {
        Allow: 'GET, HEAD',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      })
      res.end(JSON.stringify({ error: 'method_not_allowed' }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    })
    // A HEAD response carries headers only, never a body.
    res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok' }))
    return
  }

  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  })
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ error: 'not_found' }))
}

function createServer() {
  return http.createServer(handleRequest)
}

// Only bind a port when run directly (`node src/server.js`), so tests can import
// createServer and listen on an ephemeral port instead.
if (require.main === module) {
  createServer().listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`)
  })
}

module.exports = { createServer, handleRequest }
