const sequelize = require('./connect')

const User = sequelize.import('./model/User.js')

exports.init = function() {
  sequelize.sync()
}

exports.User = User
