var serverConfig = require("../utils/serverConfig");
let jwt = require("jwt-simple");

exports.apiAuth = (req, res, next) => {
    //有session：放行
    if (req.session.user) {
        return next();
    }

    let path = req.originalUrl.split("?")[0] || "";
    var reject = {
        code: 401,
        message: "you dont have permission to access folder on this server"
    };

    //接口在白名单，不需要登陆：放行
    if (serverConfig.apiWhiteList.indexOf(path) > -1) {
        return next();
    }

    //接口需要登陆
    var token = req.headers["authorization"] || req.query.token;
    if (!token) {
        return res.json(reject);
    }
    try {
        let decoded = jwt.decode(token, serverConfig.jwtSecret); //解密获取的token
        if (!decoded.uid || !decoded.exp) {
            throw "error";
        }
        //校验有效期
        if (decoded.exp <= Date.now()) {
            return res.json({ code: 401, message: "token is expired" });
        }
        next();
    } catch (err) {
        return res.json(reject);
    }
};
