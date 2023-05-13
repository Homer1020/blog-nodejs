const { Router } = require('express')
const { index, create, store, edit, destroy, update, show } = require('../controllers/category')
const { isAdmin } = require('../middlewares/auth')
const router = Router()

router.get('/categorias', isAdmin, index)
router.get('/categorias/crear', isAdmin, create)
router.get('/categorias/:name', show)
router.get('/categorias/editar/:name', isAdmin, edit)
router.post('/categorias/editar/:name', isAdmin, update)
router.post('/categorias/crear', isAdmin, store)
router.post('/categorias/eliminar/:id', isAdmin, destroy)

module.exports = router