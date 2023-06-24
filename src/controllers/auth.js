const bcrypt = require('bcrypt')
const User = require('../models/User')
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

exports.registerView = (req, res) => {
	return res.render('auth/register')
}

exports.register = async (req, res) => {
	try {
		const data = req.body
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(data.password, salt)
		data.password = hash

		await User.create(data)

		req.flash('info', 'Se creo tu cuenta correctamente')
		return res.redirect('/login')

	} catch(err) {
		console.log(err)
		req.flash('error', 'No se pudo crear la cuenta')
		return res.redirect('back')
	}
}

exports.loginView = (req, res) => {
	return res.render('auth/login')
}

exports.login = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				email: req.body.email
			}
		})
		if(!(user && bcrypt.compareSync(req.body.password, user.password))) {
			req.flash('error', 'Usuario o contraseña incorrectos')
			return res.redirect('/login')
		}

		req.session.userId = user.id
		req.session.userRoleId = user.role_id

		req.flash('info', `Bienvenido ${ user.name } ${ user.lastname }`)

		return res.redirect(user.role_id === 3 ? '/blog' : '/')
	} catch(err) {
		req.flash('error', 'Ocurrio un error')
		return res.redirect('/login')
	}
}

exports.logout = (req, res) => {
	req.session.userId = null
	req.flash('info', '¡Hasta pronto!')
	return res.redirect('/login')
}

exports.profile = (req, res) => {
	return res.render('auth/profile')
}

exports.saveProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.session.userId)

		if(req.file) {
			if(user.picture) {
        const pathToDelete = `../public/files/${ user.picture }`
        if(fs.existsSync(path.join(__dirname, pathToDelete))) {
          fs.unlinkSync(path.join(__dirname, pathToDelete))
          console.log('File removed')
        }
      }
			user.picture = req.file.filename
	    const image = await Jimp.read(req.file.path)
			image
	      .cover(100, 100) 
	      .quality(90)
	      .writeAsync(`./src/public/files/${req.file.filename}`)
		}

		const { name, lastname, nickname, password, email } = req.body

		user.name = name
		user.lastname = lastname
		user.nickname = nickname
		user.email = email
		if(password) {
			const salt = bcrypt.genSaltSync(10)
			const hash = bcrypt.hashSync(password, salt)
			user.password = hash
		}

		await user.save()

		req.flash('info', 'Se guardo el usuario correctamente')
		res.redirect('/perfil')
	} catch(err) {
		console.log(err)
		req.flash('error', 'Error al edirar usuario')
		return res.redirect('back')
	}
}