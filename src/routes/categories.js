const { Router } = require('express')
const { index, create, store, edit, destroy, update, show } = require('../controllers/category')
const { isAdmin } = require('../middlewares/auth')
const { body } = require('express-validator')
const router = Router()
const { validation } = require('../middlewares/validations')

router.get('/categorias', isAdmin, index)
router.get('/categorias/crear', isAdmin, create)
router.get('/categorias/:name', show)
router.get('/categorias/editar/:name', isAdmin, edit)
router.post('/categorias/editar/:name', isAdmin, update)
router.post('/categorias/crear',
	isAdmin,
	body('displayName')
		.notEmpty()
		.withMessage('El nombre es requerido'),
	body('name')
    .notEmpty()
    .withMessage('El slug es requerido'),
  validation,
	store
)
router.post('/categorias/eliminar/:id', isAdmin, destroy)

module.exports = router