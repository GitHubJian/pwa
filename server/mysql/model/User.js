module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    endpoint: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    auth: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    p256dh: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  })
}
