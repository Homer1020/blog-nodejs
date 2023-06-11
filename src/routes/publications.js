const { Router } = require('express')
const upload = require('../config/upload')
const { isAuthenticated, isNotGuess } = require('../middlewares/auth')
const { index, create, show, edit, update, store, destroy, trash, trashIndex, restore } = require('../controllers/publication')
const { body } = require('express-validator')

const router = Router()

router.get('/', isAuthenticated, isNotGuess, index)
router.get('/publicacion/crear', create)
router.get('/publicacion/papelera', isAuthenticated, isNotGuess, trashIndex)
router.get('/publicacion/:slug', show)
router.get('/publicacion/editar/:slug', isAuthenticated, isNotGuess, edit)
router.post('/publicacion/editar/:slug', isAuthenticated, isNotGuess, upload.single('thumbnail'), update)
router.post('/publicacion/crear',
  // isAuthenticated,
  // isNotGuess,
  // upload.single('thumbnail'),
  body('title')
    .notEmpty()
    .withMessage('El título es requerido'),
  store
)
router.post('/publicacion/eliminar/:id', isAuthenticated, isNotGuess, trash)
router.post('/publicacion/eliminar/:id/force', isAuthenticated, isNotGuess, destroy)
router.post('/publicacion/restaurar/:id/', isAuthenticated, isNotGuess, restore)

module.exports = router