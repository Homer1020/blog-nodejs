const { Router } = require('express')
const router = Router()

const pagesController = require('../controllers/pages')

router.use(require('./publications'))
router.use(require('./categories'))
router.use(require('./auth'))

router.use('/api', require('./api/comments.js'))

router.get('/blog', pagesController.blog)
router.get('/blog/search', pagesController.search)
router.get('/sobre-mi', pagesController.about)
router.get('/contacto', pagesController.contact)

module.exports = router