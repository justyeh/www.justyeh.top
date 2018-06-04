let database = require('../utils/database');

let helper = require('../utils/helper');

exports.getCommentCount = async (isRead) =>{
    var result = await database.query('select count(id) as count from comment where is_read = ?',[isRead]);
    return result ? result[0].count : 0
}

exports.getCommentList = async (isRead, pageNo, pageSize) => {

    if (!helper.isInteger(pageNo)) {
        return { code: 500, message: '无效的页码' }
    }

    let commentList = await database.query('select * from comment where is_read = ? group by post_id order by updated_at desc limit ?,?', [isRead, ((pageNo - 1) * pageSize), pageSize]);

    if (commentList) {
        return { code: 200, data: commentList, message: 'success' }
    }

    return { code: 500, message: '服务器错误' }

}

exports.getCommentListByPostId = async (postId, isShow) => {
    var result = await database.query('select * from comment where post_id = ? and is_show = ', [postId, isShow]);
    if (result) {
        return { code: 500, data: result, message: 'success' }
    }
    return { code: 500, message: '系统错误' }
}

exports.addComment = async (postId, comment) => {
    var insertRow = await database.query('insert into comment(post_id,name,content,updated_at,is_read,is_show) values(?,?,?,?,?,?)', [
        postId,
        comment.name,
        comment.content,
        new Date().getTime(),
        0,
        1
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