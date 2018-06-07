let database = require('../utils/database');

let helper = require('../utils/helper');

exports.getCommentCount = async (isRead) => {
    var result = await database.query('select count(id) as count from comment where is_read = ?', [isRead]);
    return result ? result[0].count : 0
}

exports.getCommentList = async (isRead, pageNo, pageSize) => {

    console.log(isRead, pageNo, pageSize)

    if (!helper.isInteger(pageNo)) {
        return { code: 500, message: '无效的页码' }
    }

    let commentList = await database.query('select * from comment where is_read = ? order by updated_at desc limit ?,?', [isRead, ((pageNo - 1) * pageSize), pageSize]);

    if (commentList) {

        var queryList = commentList.map(item => {
            return database.query('select id,title from post where id = ?', [item.post_id])
        });

        var commentWithPost = await Promise.all(queryList);
        commentList.forEach((item, index) => {
            item.post = commentWithPost[index] ? commentWithPost[index][0] : {}
        })

        return { code: 200, data: commentList, message: 'success' }
    }

    return { code: 500, message: '服务器错误' }

}

exports.getCommentListByPostId = async (postId, isRead, isShow) => {
    var result = await database.query('select * from comment where post_id = ? and is_read = ? and is_show = ? order by updated_at desc', [postId, isRead, isShow]);
    if (result) {
        return { code: 200, data: result, message: 'success' }
    }
    return { code: 500, message: '系统错误' }
}

exports.addComment = async (postId, name, content) => {
    console.log(postId, name, content)
    if (!postId || !name || !content) {
        return { code: 500, message: '参数错误' }
    }
    var insertRow = await database.query('insert into comment(post_id,name,content,updated_at) values(?,?,?,?)', [
        postId,
        name,
        content,
        new Date().getTime(),
    ]);

    if (insertRow && insertRow.insertId) {
        return { code: 200, data: { id: insertRow.insertId }, message: 'insert success' }
    } else {
        return { code: 500, message: 'insert fail' }
    }
}

exports.updateComment = async (isShow, commentId) => {
    var result = await database.query(`insert into comment(update comment set is_show = ? where id = ?`, [isShow, commentId])
    if (result && result.affectedRows >= 0) {
        return { code: 200, message: 'update success' }
    } else {
        return { code: 500, message: 'update fail' }
    }
}