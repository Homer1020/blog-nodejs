const { Router } = require('express')
const router = Router()

const pagesController = require('../controllers/pages')

router.use(require('./publications'))
router.use(require('./categories'))
router.use(require('./auth'))

router.use('/api', require('./api/comments.js'))

router.get('/blog', pagesController.blog)
router.get('/blog/categoria/:category', pagesController.blog)

module.exports = router