const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Post = db.define('Post', {
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  paranoid: true
})

module.exports = Post