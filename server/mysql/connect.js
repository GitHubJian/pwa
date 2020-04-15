const Sequelize = require('sequelize')

const connect = new Sequelize('pwa', 'root', 'P@ssw0rd', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 3e4,
    idle: 1e4
  }
})

// connect
//   .authenticate()
//   .then(() => {
//     console.log('Success.')
//   })
//   .catch(err => {
//     console.error('Failed', err)
//   })

module.exports = connect
