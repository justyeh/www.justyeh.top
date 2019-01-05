exports.sessionAuth = (req, res, next) => {
    if(req.session.user){
        if(req.url == '/login'){
            res.redirect('/admin/post')
        }else{
            next();
        }
    }else{
        if(req.url == '/login'){
            next();
        }else{
            res.redirect('/admin/login')
        }
    }
}
