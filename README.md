# test-repo

## Running the server

This project includes a minimal, zero-dependency HTTP server (built on Node's
`node:http` module) that exposes a health-check endpoint.

Requirements: Node.js >= 18. No third-party dependencies.

```sh
npm start              # listens on http://0.0.0.0:3000
PORT=8080 npm start    # override the port (also honors HOST)
```

## Health check

`GET /health` returns `200` with a small JSON body while the process is able to
serve HTTP:

```sh
$ curl -i http://localhost:3000/health
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"status":"ok"}
```

This is a **liveness** check only: the handler performs no database, network, or
disk I/O, so a slow dependency can't make a healthy process look dead. It is
unauthenticated and needs no query params or headers. `HEAD /health` is also
supported for monitors that probe with `HEAD`.

## Tests

```sh
npm test
```
