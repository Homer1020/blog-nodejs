const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Role = db.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
})

module.exports = Role