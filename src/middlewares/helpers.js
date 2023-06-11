const { validationResult } = require("express-validator");
const fs = require('fs')
const path = require('path')

exports.formValidation = (req, res, next) => {
  const vResult = validationResult(req);
  const vErrors = vResult.mapped();

  console.log({ vErrors })

  const passwordValidation = Object.keys(vErrors).length && vErrors.password.value === ""

  if (!vResult.isEmpty() || passwordValidation) {
		const filledValues = req.body;
    req.flash('vErrors', { vErrors, filledValues })
    if(req.file) {
      const pathToDelete = `../public/files/${ req.file.filename }`
      if(fs.existsSync(path.join(__dirname, pathToDelete))) {
        fs.unlinkSync(path.join(__dirname, pathToDelete))
        console.log('File removed')
      }
    }
		return res.redirect('back')
  }
  return next()
}