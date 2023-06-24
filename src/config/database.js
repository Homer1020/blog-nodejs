const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_HOST } = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false
});

module.exports = db