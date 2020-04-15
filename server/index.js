const root = process.cwd()
const path = require('path')
const koa = require('koa')
const koaBody = require('koa-body')
const http = require('http')
const router = require('./router')
const hmrMiddleware = require('./hmrMiddleware')
const assetsMiddleware = require('./assetsMiddleware')

const port = 8419
const app = new koa()

app.use(koaBody())

app.use(router.routes()).use(router.allowedMethods())

hmrMiddleware({}, app)

app.use(
  assetsMiddleware({
    root: path.resolve(root, 'static')
  })
)

http.createServer(app.callback()).listen(port, function() {
  console.log(`✨ Server Run: http://localhost:${port}`)
})
