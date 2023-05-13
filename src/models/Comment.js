const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Comment = db.define('Comment', {
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

module.exports = Comment