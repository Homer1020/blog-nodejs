const { DataTypes } = require('sequelize')
const db = require('../config/database')
const Role = require('./Role')

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  'role_id': {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }
}, {
  tableName: 'users'
})

module.exports = User