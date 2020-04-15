const root = process.cwd()

const secret = require('../public/secret')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { pathConfig, webpackConfig } = require('../webpack/webpack.config.dev')

module.exports = function(options, app) {
  const allEntry = webpackConfig.entry

  const compiler = webpack(webpackConfig)
  const devMiddlewareInstance = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats
  })

  const hotMiddlewareInstance = webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10
  })

  app.use(async function(ctx, next) {
    if (ctx.path.endsWith('.html')) {
      const entryKey = 'index'
      const entryVal = allEntry[entryKey]

      // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=5000&reload=true',
      compiler.apply(new SingleEntryPlugin(root, entryVal, entryKey))

      compiler.apply(
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: pathConfig.templatePath,
          chunks: ['index', 'install'],
          title: 'Pwa Test',
          VAPID_PUBLIC_KEY: secret.VAPID_PUBLIC_KEY,
          inject: 'body',
          minify: true
        })
      )

      await devMiddlewareInstance.invalidate()

      await next()
    } else {
      await next()
    }
  })

  app.use(async function(ctx, next) {
    ctx.status = 200

    await devMiddlewareInstance(ctx.req, ctx.res, next)
  })

  app.use(async (ctx, next) => {
    await hotMiddlewareInstance(ctx.req, ctx.res, next)
  })
}
