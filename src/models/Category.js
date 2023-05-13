const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Category = db.define('Category', {
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'categories'
})

module.exports = Category