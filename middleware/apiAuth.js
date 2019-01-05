var serverConfig = require('../utils/serverConfig');

exports.apiAuth = (req, res, next) => {
    //有session：放行
    if (req.session.user) {
        return next()
    }
    
    let path = req.originalUrl.split("?")[0] || '';
    var reject = { code: 403, message: 'you dont have permission to access folder on this server' }

    //接口不需要登陆：放行
    if (serverConfig.apiWhiteList.indexOf(path) > -1) {
        return next();
    }

    //接口需要登陆
    var token = req.headers['authorization'];
    if (!token) {
        return res.json(reject)
    }
    try {
        let decoded = jwt.decode(token, serverConfig.jwtSecret); //解密获取的token
        if (decoded.exp <= Date.now()) { //校验有效期
            return res.json(reject);
        }
        next();
    } catch (err) {
        return res.json(reject)
    }

}