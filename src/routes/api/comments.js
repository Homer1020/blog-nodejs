const { Router } = require('express')
const { comment, dhelete, update } = require('../../controllers/comment')

const router = Router()

router.post('/comment', comment)
router.delete('/comments/delete/:id', dhelete)
router.put('/comments/:id/update', update)

module.exports = router