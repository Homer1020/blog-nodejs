const { validationResult } = require("express-validator");
const fs = require('fs')
const path = require('path')

exports.profileFormValidation = (req, res, next) => {

  const file = req.file;
  const vResult = validationResult(req)
  const vErrors = vResult.mapped()

  if(file?.err) {
    vErrors[file.field] = {
      type: 'field',
      value: undefined,
      msg: file.err,
      path: file.field,
      location: 'body'
    }
  }

  if(req.path === '/perfil' && Object.keys(vErrors).length === 1 && vErrors.password.value === '') {
    return next()
  }

  if (!vResult.isEmpty()) {
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

exports.loginFormValidation = (req, res, next) => {

  const vResult = validationResult(req)
  const vErrors = vResult.mapped()

  if (!vResult.isEmpty()) {
    const filledValues = req.body;
    req.flash('vErrors', { vErrors, filledValues })
    return res.redirect('back')
  }
  return next()
}

exports.publicationFormValidation = (req, res, next) => {

  const file = req.file;
  const vResult = validationResult(req)
  const vErrors = vResult.mapped()

  if(file?.err) {
    vErrors.thumbnail = {
      type: 'field',
      value: undefined,
      msg: file.err,
      path: 'thumbnail',
      location: 'body'
    }
  }

  if(!req.file && !req.path.startsWith('/publicacion/editar/')) {
    vErrors.thumbnail = {
      type: 'field',
      value: undefined,
      msg: 'La imagén es requerida',
      path: 'thumbnail',
      location: 'body'
    }
  }

  if (!vResult.isEmpty() || vErrors.thumbnail) {
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

exports.validation = (req, res, next) => {
  const vResult = validationResult(req)
  const vErrors = vResult.mapped()

  console.log(req.body)

  if (!vResult.isEmpty()) {
    const filledValues = req.body;
    req.flash('vErrors', { vErrors, filledValues })
    return res.redirect('back')
  }
  return next()
}