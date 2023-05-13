exports.isAuthenticated = (req, res, next) => {
	if(req.session?.userId) return next()
	return res.redirect('/login')
}

exports.isNotAuthenticated = (req, res, next) => {
	if(!req.session?.userId) return next()
	return res.redirect('/')
}

exports.isAdmin = (req, res, next) => {
	if(req.session?.userRoleId === 1) return next()
	req.flash('error', 'Acceso Denegando')
	return res.redirect('back')
}