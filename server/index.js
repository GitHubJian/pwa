const path = require('path')
const koa = require('koa')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const http = require('http')
const router = require('./router')
const createRender = require('./createRender')
const pageMiddleware = require('./pageMiddleware')

const port = 8419
const app = new koa()
app.context.renderToString = createRender({})

app.use(koaBody())

app.use(router.routes()).use(router.allowedMethods())

app.use(pageMiddleware())

app.use(koaStatic(path.resolve(__dirname, '.')))

http.createServer(app.callback()).listen(port, function() {
  console.log(`✨ Server Run: http://localhost:${port}`)
})
