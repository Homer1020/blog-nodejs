const upload = require('../config/upload')
const multer = require('multer')

module.exports = (req, res, next) => {
  const field = req.path === '/perfil' ? 'picture' : 'thumbnail'	
  upload.single(field)(req, res, err => {
    if (err instanceof multer.MulterError) {
      req.file = { err, field }
    }else if(err) {
      req.file = { err, field }
    }
    next()
  })
}