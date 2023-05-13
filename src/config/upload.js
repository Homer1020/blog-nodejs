const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, './src/public/files')
  },
  filename: async (req, file, callback) => {
    let aux = file.originalname.split('.')
    let ext = aux[aux.length - 1]
    callback(null, Date.now() + '.' + ext)
  }
})

const upload = multer({storage})

module.exports = upload