let database = require("../utils/database");
let crypto = require("crypto");

let jwt = require("jwt-simple");
let jwtSecret = require("../utils/serverConfig").jwtSecret;

let login = async (email, password) => {
    if (email == "" || password == "") {
        return { code: 400, message: "账户信息不完整" };
    }
    let cryptoPassword = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex");
    var user = await database.query(
        "select id,name,image,email from user where email = ? and password = ?",
        [email, cryptoPassword]
    );
    if (!user) {
        return { code: 500, message: "服务器错误！" };
    }
    if (user.length > 0) {
        let expires = Date.now() + 7 * 24 * 60 * 60 * 1000; //设置七天有效期
        let token = jwt.encode(
            {
                uid: user[0].id,
                exp: expires
            },
            jwtSecret
        );

        return {
            code: 200,
            data: {
                user: user[0],
                token
            },
            message: "success"
        };
    } else {
        return { code: 400, message: "邮箱或密码错误" };
    }
};

exports.login = login;
