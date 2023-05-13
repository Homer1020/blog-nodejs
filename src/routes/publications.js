const { Router } = require('express')
const upload = require('../config/upload')
const { isAuthenticated } = require('../middlewares/auth')
const { index, create, show, edit, update, store, destroy, trash, trashIndex, restore } = require('../controllers/publication')

const router = Router()

router.get('/', isAuthenticated, index) // ok
router.get('/publicacion/crear', isAuthenticated, create) // ok
router.get('/publicacion/papelera', isAuthenticated, trashIndex) // ok +-
router.get('/publicacion/:slug', show) // ok
router.get('/publicacion/editar/:slug', isAuthenticated, edit)
router.post('/publicacion/editar/:slug', isAuthenticated, upload.single('thumbnail'), update)
router.post('/publicacion/crear', isAuthenticated, upload.single('thumbnail'), store)
router.post('/publicacion/eliminar/:id', isAuthenticated, trash)
router.post('/publicacion/eliminar/:id/force', isAuthenticated, destroy)
router.post('/publicacion/restaurar/:id/', isAuthenticated, restore)

module.exports = router