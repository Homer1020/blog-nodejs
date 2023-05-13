const { Op } = require("sequelize")
const Post = require('../models/Post')
const Category = require('../models/Category')
const Comment = require('../models/Comment')
const User = require('../models/User')
const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')

exports.index = async (req, res) => {
  const posts = await Post.findAll({
    where: {
      user_id: req.session.userId
    }
  });

  res.render('publications/index', {
    posts
  });
}

exports.create = async (req, res) => {

  const categories = await Category.findAll()

  res.render('publications/create.pug', {
    post: new Post,
    categories
  })
}

exports.show = async (req, res) => {
  const { slug } = req.params
  const post = await Post.findOne({
    where: { slug },
    include: [
      'User',
      {
        model: Comment,
        include: User
      }
    ]
  })
  return res.render('publications/show', {
    post
  })
}

exports.edit = async (req, res) => {
  try {
    const { slug } = req.params
    const post = await Post.findOne({ where: { slug }, include: 'User' })

    if(post.User.id !== req.session.userId) throw new Error('Acceso Denegado')
    
    const categories = await Category.findAll()
    return res.render('publications/edit', {
      post,
      categories
    })
  } catch(err) {
    req.flash('error', err?.message || 'Error en la petición')
    return res.redirect('/')
  }
}

exports.update = async (req, res) => {
  try {
    const { title, slug, content, category } = req.body
    const newDataPost = { title, slug, content, category_id: category }
    if(req.file) {
      newDataPost.thumbnail = req.file.filename
      const image = await Jimp.read(req.file.path)
      image
        .cover(800, 600) 
        .quality(90)
        .writeAsync(`./src/public/files/${req.file.filename}`)
    }

    const post = await Post.findOne({
      where: {
        slug: req.params.slug
      },
      include: 'User'
    })

    if(post.thumbnail && req.file) {
      const pathToDelete = `../public/files/${ post.thumbnail }`
      if(fs.existsSync(path.join(__dirname, pathToDelete))) {
        fs.unlinkSync(path.join(__dirname, pathToDelete))
        console.log('File removed')
      }
    }

    await post.update(newDataPost)

    if(post.User.id !== req.session.userId) throw new Error('Acceso Denegado')

    req.flash('info', 'Se actualizo correctamente')
    return res.redirect(`/publicacion/${ slug }`)

  } catch(err) {
    req.flash('error', err?.message || 'Error en la petición')
    return res.redirect('/')
  }
}

exports.store = async (req, res) => {
  try {
    const { title, slug, content, category } = req.body
    const image = await Jimp.read(req.file.path)
    image
      .cover(800, 600) 
      .quality(90)
      .writeAsync(`./src/public/files/${req.file.filename}`)
    await Post.create({
      thumbnail: req.file.filename,
      title,
      slug,
      content,
      category_id: category,
      user_id: req.session.userId
    })
    req.flash('info', 'Se creo la publicación correctamente')
    res.redirect('/')
  } catch(err) {
    console.log(err)
    req.flash('error', 'Error al crear la publicación')
    res.redirect('/publicacion/crear')
  }
}

exports.trash = async (req, res) => {
  try {

    const post = await Post.findOne({
      where: {id: req.params.id},
      include: 'User'
    })

    if(post.User.id !== req.session.userId) throw new Error('Acceso Denegado')

    await post.destroy()

    req.flash('info', 'Se elimino correctamente')
    return res.redirect('/')

  } catch(err) {
    req.flash('error', err?.message || 'Error en la petición')
    return res.redirect('back')
  }
}

exports.trashIndex = async (req, res) => {
  try {

    const posts = await Post.findAll({
      where: { deletedAt: { [Op.not]: null }, user_id: req.session.userId },
      paranoid: false,
    })

    res.render('publications/trash', {
      posts
    })

  }catch(err) {
    console.log(err)
    return res.status(400).json({
      ok: false,
      message: 'Ocurrio un error'
    })
  }
}

exports.destroy = async (req, res) => {
  try {

    const post = await Post.findOne({
      where: {id: req.params.id},
      paranoid: false,
      include: 'User'
    })

    if(post.User.id !== req.session.userId) throw new Error('Acceso Denegado')

    if(post.thumbnail) {
      const pathToDelete = `../public/files/${ post.thumbnail }`
      if(fs.existsSync(path.join(__dirname, pathToDelete))) {
        fs.unlinkSync(path.join(__dirname, pathToDelete))
        console.log('File removed')
      }
    }

    await post.destroy({ force: true })

    req.flash('info', 'Se elimino correctamente')
    return res.redirect('/publicacion/papelera')

  } catch(err) {
    req.flash('error', err?.message || 'Error en la petición')
    return res.redirect('back')
  }
}

exports.restore = async (req, res) => {
  try {

    const post = await Post.findOne({
      where: {id: req.params.id},
      paranoid: false,
      include: 'User'
    })

    if(post.User.id !== req.session.userId) throw new Error('Acceso Denegado')

    await post.restore()

    req.flash('info', 'Se restauro la publicación correctamente')
    return res.redirect(`/publicacion/${ post.slug }`)

  } catch(err) {
    req.flash('error', err?.message || 'Error en la petición')
    return res.redirect('back')
  }
}