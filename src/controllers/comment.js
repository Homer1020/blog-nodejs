const Comment = require('../models/Comment')
const { Op } = require('sequelize')

exports.comment = async (req, res) => {
	try {

		if(!req.session.userId) throw new Error('Es necesario tener una cuenta')

		const countAllByUser = await Comment.count({
			where: {
				user_id: req.session.userId,
				[Op.and]: {
					post_id: req.body.post_id
				}
			}
		})

		if(countAllByUser === 5) throw new Error('Solo se permiten 5 comentarios por publicación para cada usuario')

		const comment = await Comment.create({
			...req.body,
			user_id: req.session.userId
		})

		return res.json({
			ok: true,
			comment
		})

	} catch(err) {
		res.status(300).json({
			ok: false,
			err: err.message
		})
	}
}

exports.dhelete = async (req, res) => {
	const comment = await Comment.findByPk(req.params.id, {
		include: 'Post'
	})

	if(comment.user_id === req.session.userId || comment.Post.user_id === req.session.userId) {
		await comment.destroy()

		return res.json({
			ok: true,
			comment
		})

	}

	return res.json({
		ok: false,
		message: 'Acceso denegando'
	})
	
}

exports.update = async (req, res) => {
	const comment = await Comment.findByPk(req.params.id)

	const { body } = req.body

	if(comment.user_id === req.session.userId || comment.Post.user_id === req.session.userId) {
		await comment.update({
			body
		})

		return res.json({
			ok: true,
			comment
		})
	}

	return res.json({
		ok: false,
		message: 'Acceso denegando'
	})
}