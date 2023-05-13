const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')

exports.blog = async (req, res) => {

	let posts = [];
	let category = false

	if(req.params.category) {
		const cat = await Category.findOne({ where: { name: req.params.category }, include: [{
			model: Post,
			include: User
		}]})
		posts = cat.Posts

		category = cat.displayName
	} else {
		posts = await Post.findAll({
			include: [{
				model: User
			}]
		})
	}

	const allCategories = await Category.findAll()

	return res.render('blog', {
		posts,
		allCategories,
		category
	})
}