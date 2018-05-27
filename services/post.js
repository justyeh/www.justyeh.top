let database = require('../utils/database');

exports.getPostById = async(id) => {
    var post = await database.query('select * from posts where id = ?', id);
    if (post && post[0].length > 0) {
        return { code: 200, data: post[0][0], message: 'success' }
    } else {
        return { code: 400, message: '无效的ID' }
    }
}