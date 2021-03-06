const path = require('path')
const fs = require('fs')
const koaSend = require('koa-send')

module.exports = function(config, app) {
  let maxage = 365 * 24 * 60 * 60 * 1000 // one year
  let folder = config.root

  return async function(ctx, next) {
    let reqPath = ctx.path
    let filePath = path.resolve(folder, `.${reqPath}`)
    let exists = await fs.existsSync(filePath)

    let result
    if (exists) {
      result = await koaSend(ctx, reqPath, {
        root: folder,
        maxage,
        setHeaders: function(res, path, stats) {
          if (/\/sw\/.+\.js/.test(reqPath)) {
            res.setHeader('Service-Worker-Allowed', '/')
          }

          res.setHeader('Author', 'Xiaows')
          // res.setHeader('Cache-Control', 'no-store')
        }
      })
    }

    if (!result) {
      ctx.status = 404
      ctx.body = `404 | Not Found | ${ctx.path}`
    }
  }
}
