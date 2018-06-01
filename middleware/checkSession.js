exports.sessionAuth = (req, res, next) => {
    console.log(req.session.user)
    if (req.session.user || req.url == '/login') {
        next()
    } else {
        res.render('admin/login')
    }
}
