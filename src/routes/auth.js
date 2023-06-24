const { Router } = require('express')
const router = Router()
const { registerView, register, loginView, login, logout, profile, saveProfile } = require('../controllers/auth')
const { isNotAuthenticated, isAuthenticated } = require('../middlewares/auth')
const uploadWithValidation = require('../middlewares/upload')
const { body } = require('express-validator')
const { profileFormValidation, loginFormValidation } = require('../middlewares/validations')

router.get('/registro', isNotAuthenticated, registerView)
router.post('/registro',
  isNotAuthenticated,
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 3 })
    .withMessage('El nombre debe contener minimo 3 caracteres')
    .trim(),
  body('lastname')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 3 })
    .withMessage('El apellido debe contener minimo 3 caracteres')
    .trim(),
  body('nickname')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe contener minimo 3 caracteres')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Debe ser una dirección de correo valida')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener minimo 8 caracteres'),
  profileFormValidation,
  register
)
router.get('/login', isNotAuthenticated, loginView)
router.post('/login',
  isNotAuthenticated,
  body('email')
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Debe ser una dirección de correo valida')
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe contener minimo 3 caracteres')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener minimo 8 caracteres'),
  loginFormValidation,
  login
)
router.get('/logout', isAuthenticated, logout)
router.get('/perfil', isAuthenticated, profile)
router.post('/perfil',
  isAuthenticated,
  uploadWithValidation,
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 3 })
    .withMessage('El nombre debe contener minimo 3 caracteres')
    .trim(),
  body('lastname')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 3 })
    .withMessage('El apellido debe contener minimo 3 caracteres')
    .trim(),
  body('nickname')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe contener minimo 3 caracteres')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Debe ser una dirección de correo valida')
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener minimo 8 caracteres')
    .optional(),
  profileFormValidation,
  saveProfile
)

module.exports = router