let database = require('../utils/database');
let crypto = require('crypto');

exports.login = async (email, password) => {
    if (email == '' || password == '') {
        return { code: 400, message: '账户信息不完整' }
    }
    var user = await database.query('select name,image from user where email = ? and password = ?', [email, crypto.createHash('sha1').update(password).digest('hex')]);
    if (!user) {
        return { code: 500, message: '服务器错误！' }
    }

    if (user.length > 0) {
        return {
            code: 200, data: { ...user[0] }, message: 'success'
        }
    } else {
        return { code: 400, message: '邮箱或密码错误' }
    }
}