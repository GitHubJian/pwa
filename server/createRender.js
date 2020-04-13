const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const template = fs.readFileSync(
  path.resolve(__dirname, './template.ejs'),
  'utf-8'
)

module.exports = function(options, app) {
  return ejs.compile(template, options)
}
