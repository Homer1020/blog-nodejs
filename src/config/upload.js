const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, './src/public/files')
  },
  filename: async (req, file, callback) => {
    const acceptedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ]
    if(!acceptedMimeTypes.includes(file.mimetype)) {
      return callback('Solo puedes adjuntar una imagen', null)
    }
    let aux = file.originalname.split('.')
    let ext = aux[aux.length - 1]
    callback(null, Date.now() + '.' + ext)
  }
})

const upload = multer({storage})

module.exports = upload