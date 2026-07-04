const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('../src/server')

let server
let baseUrl

before(async () => {
  server = createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  baseUrl = `http://127.0.0.1:${port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

test('GET /health returns 200 with {"status":"ok"}', async () => {
  const res = await fetch(`${baseUrl}/health`)
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('content-type'), 'application/json')
  assert.equal(res.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await res.json(), { status: 'ok' })
})

test('GET /health ignores query params', async () => {
  const res = await fetch(`${baseUrl}/health?probe=1`)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { status: 'ok' })
})

test('HEAD /health returns 200 with no body', async () => {
  const res = await fetch(`${baseUrl}/health`, { method: 'HEAD' })
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('cache-control'), 'no-store')
  assert.equal(await res.text(), '')
})

test('non-GET/HEAD method on /health returns 405', async () => {
  const res = await fetch(`${baseUrl}/health`, { method: 'POST' })
  assert.equal(res.status, 405)
  assert.equal(res.headers.get('allow'), 'GET, HEAD')
})

test('unknown route returns 404', async () => {
  const res = await fetch(`${baseUrl}/nope`)
  assert.equal(res.status, 404)
})
