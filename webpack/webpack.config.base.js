const NODE_ENV = process.env.NODE_ENV || 'development'
const isDevelopment = NODE_ENV == 'development'

const secret = require('../public/secret')

const root = process.cwd()
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const pathConfig = {
  root: root,
  src: path.resolve(root, 'src'),
  static: path.resolve(root, 'static'),
  templatePath: path.resolve(__dirname, 'template.ejs')
}

exports.pathConfig = pathConfig

exports.baseConfig = {
  mode: isDevelopment ? 'development' : 'production',
  target: 'web',
  entry: {
    index: path.resolve(pathConfig.src, 'js/index.js')
  },
  output: {
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash].js',
    path: pathConfig.static,
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@src': pathConfig.src
    },
    extensions: ['.js'],
    mainFiles: ['index', 'main']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env']],
              plugins: [
                ['@babel/plugin-transform-runtime'],
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-transform-modules-commonjs'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production'
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment
        ? 'css/[name].css'
        : 'css/[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: pathConfig.templatePath,
      chunks: ['index'],
      title: 'Pwa Test',
      VAPID_PUBLIC_KEY: secret.VAPID_PUBLIC_KEY,
      inject: 'body',
      minify: true
    })
  ]
}
