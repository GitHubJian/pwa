const path = require('path')
const fs = require('fs')
const koa = require('koa')
const koaStatic = require('koa-static')
const http = require('http')

const port = 8419

const app = new koa()

app.use(koaStatic(path.resolve(__dirname, '../static')))

http.createServer(app.callback()).listen(port, function() {
  console.log(`✨ Server Run: http://localhost:${port}`)
})
