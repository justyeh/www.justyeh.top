exports.sessionAuth = (req, res, next) => {
    if (req.session.user || req.url == '/login') {
        next()
    } else {
        res.render('admin/login')
    }
}
