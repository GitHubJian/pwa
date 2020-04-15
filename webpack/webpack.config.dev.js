const root = process.cwd()
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const { pathConfig, baseConfig } = require('./webpack.config.base.js')

const devConfig = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

exports.pathConfig = pathConfig

exports.webpackConfig = merge(baseConfig, devConfig)
