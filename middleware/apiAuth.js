var serverConfig = require('../utils/serverConfig');

exports.apiAuth = (req, res, next) => {
    //有session：放行
    if (req.session.user) {
        next()
    }

    let path = req.originalUrl;

    var reject = { code: 403, message: 'you dont have permission to access folder on this server' }

    //接口不需要登陆：放行
    console.log(path, serverConfig.apiNeedAuth.indexOf(path) < 0)
    if (serverConfig.apiNeedAuth.indexOf(path) < 0) {
        return next();
    }

    //接口需要登陆
    var token = req.headers['authorization'];
    console.log(token)
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