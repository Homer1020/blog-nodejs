require('dotenv').config()
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const router = require('../routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helpers = require('../helpers')
const User = require('../models/User')

require('../models/relations')

const app = express()

// settings
app.set('PORT', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

// middlewares
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // activar solo en https
}))
app.use(flash())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/', async (req, res, next) => {
  res.locals.messages = req.flash('info')
  res.locals.errors = req.flash('error')
  res.locals.vErrors = req.flash('vErrors')
  res.locals.isAuthenticated = req.session?.userId || false
  res.locals.isAdmin = req.session?.userRoleId === 1
  res.locals.isNotGuess = req.session?.userRoleId !== 3
  if(res.locals.isAuthenticated) {
    res.locals.user = await User.findByPk(req.session.userId, {
      attributes: {exclude: ['password', 'createdAt', 'updatedAt', 'role_id']},
    })
  }
  res.locals.helpers = helpers

  return next()
})

app.use(router)

module.exports = app
