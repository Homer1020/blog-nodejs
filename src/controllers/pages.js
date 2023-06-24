const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')
const { Op } = require('sequelize')

exports.blog = async (req, res) => {

	let posts = [];
	let category = false
	let { page } = req.query
	page = !isNaN(+page) ? page : 1

	// el numero total de todos los posts
	let allPostsLength = null;

	if(req.query?.category) {
		const cat = await Category.findOne({
			where: {
				name: req.query.category,
			},
			include: [
				{
					model: Post,
					include: [
						User,
						'Category'
					],
					order: [
						['id', 'DESC']
					],
					limit: 6,
					offset: (page - 1) * 6,
				}
			]
		})
		posts = cat.Posts
		allPostsLength = await Post.count({ where: { category_id: cat.id } })
		category = cat.displayName
	} else {
		allPostsLength = await Post.count()
		posts = await Post.findAll({
			include: [
				{
					model: User
				},
				'Category'
			],
			limit: 6,
			offset: (page - 1) * 6,
			order: [
				['id', 'DESC']
			],
		})
	}
	const numOfPages = Math.ceil(allPostsLength / 6)
	const allCategories = await Category.findAll()

	return res.render('blog', {
		posts,
		allCategories,
		category,
		pagination: {
			allPostsLength,
			numOfPages,
			page
		}
	})
}

exports.search = async (req, res) => {
	let { q, page } = req.query

	page = !isNaN(+page) ? page : 1

	if(!q) {
		return res.redirect('/blog')
	}

	const posts = await Post.findAndCountAll({
		where: {
			title: {
				[Op.like]: `%${ q }%`
			}
		},
		order: [
			['id', 'DESC']
		],
		include: [User, Category],
		limit: 6,
		offset: (page - 1) * 6,
	})

	const allPostsLength = posts.count
	const numOfPages = Math.ceil(allPostsLength / 6)

	return res.render('search', {
		posts: posts.rows,
		pagination: {
			allPostsLength,
			numOfPages,
			page
		},
		q
	})
}

exports.contact = (req, res) => {
	res.render('contact')
}

exports.about = (req, res) => {
	res.render('about')
}