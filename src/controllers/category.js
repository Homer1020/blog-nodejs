const Category = require('../models/Category')
const Post = require('../models/Post')

exports.index = async (req, res) => {
  let { page } = req.query
	page = !isNaN(+page) ? page : 1

  const categories = await Category.findAndCountAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 6,
		offset: (page - 1) * 6,
  })

  const allPostsLength = categories.count
  const numOfPages = Math.ceil(allPostsLength / 6)

  return res.render('categories/index', {
    categories: categories.rows,
    pagination: {
      allPostsLength,
      numOfPages,
      page
    }
  })
}

exports.create = (req, res) => {
  return res.render('categories/create', {
    category: new Category()
  })
}

exports.store = async (req, res) => {
  try {
    await Category.create(req.body)
    req.flash('info', 'Se creo la categoría correctamente.')
    return res.redirect('/categorias')
  } catch(err) {
    req.flash('error', 'Error al crear categoría.')
    return res.redirect('/categorias')
  }
}

exports.edit = async (req, res) => {
  const { name } = req.params
  const category = await Category.findOne({ where: { name } })
  return res.render('categories/edit', {
    category
  })
}

exports.destroy = async (req, res) => {
  try {

    const { id } = req.params

    await Category.destroy({
      where: {
        id
      }
    })

    req.flash('info', 'Se elimino la categoría correctamente')
    return res.redirect('/categorias')

  } catch(err) {

    req.flash('error', 'No se pudo eliminar la categoría')
    return res.redirect('/categorias')

  }
}

exports.update = async (req, res) => {
  try {

    await Category.update(req.body, {
      where: {
        name: req.params.name
      }
    })
    req.flash('info', 'Se actualizo correctamente.')
    return res.redirect(`/categorias/editar/${ req.body.name }`);

  } catch(err) {
    req.flash('error', 'No se pudo actualizar.')
    return res.redirect('back')
  }

}

exports.show = async (req, res) => {
  const category = await Category.findOne({
    where: { name: req.params.name },
    include: Post
  })

  res.render('categories/show', {
    category: category
  });
}