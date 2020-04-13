const path = require('path')

const { VAPID_PUBLIC_KEY } = require('./config')

module.exports = function(config, app) {
  return async function(ctx, next) {
    if (!ctx.url.endsWith('.html')) {
      return await next()
    }

    ctx.body = ctx.renderToString({
      VAPID_PUBLIC_KEY: VAPID_PUBLIC_KEY
    })
  }
}
