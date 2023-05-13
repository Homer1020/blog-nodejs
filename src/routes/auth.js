const { Router } = require('express')
const router = Router()
const { registerView, register, loginView, login, logout, profile, saveProfile } = require('../controllers/auth')
const { isNotAuthenticated, isAuthenticated } = require('../middlewares/auth')
const upload = require('../config/upload')

router.get('/registro', isNotAuthenticated, registerView)
router.post('/registro', isNotAuthenticated, register)
router.get('/login', isNotAuthenticated, loginView)
router.post('/login', isNotAuthenticated, login)
router.get('/logout', isAuthenticated, logout)
router.get('/perfil', isAuthenticated, profile)
router.post('/perfil', isAuthenticated, upload.single('picture'), saveProfile)

module.exports = router