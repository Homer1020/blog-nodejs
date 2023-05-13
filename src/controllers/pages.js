const Post = require('../models/Post')
const User = require('../models/User')

exports.blog = async (req, res) => {
	const posts = await Post.findAll({
		include: [{
			model: User
		}]
	})
	return res.render('blog', {
		posts
	})
}