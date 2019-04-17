let database = require("../utils/database");

let helper = require("../utils/helper");

let getCommentCount = async isRead => {
    var result = await database.query(
        "select count(id) as count from comment where is_read = ?",
        [isRead]
    );
    return result ? result[0].count : 0;
};

let getCommentList = async params => {
    if (
        !helper.isInteger(params.pageIndex) ||
        !helper.isInteger(params.pageSize)
    ) {
        return { code: 500, message: "无效的页码参数" };
    }

    let pageIndex = parseInt(params.pageIndex);
    let pageSize = parseInt(params.pageSize);

    let commentList = await database.query(
        "select comment.*,post.id as postId,post.title as postTitle from comment,post where comment.post_id = post.id and comment.is_read = ? order by updated_at desc limit ?,?",
        [params.isRead, (pageIndex - 1) * pageSize, pageSize]
    );

    let commentCount = await getCommentCount(params.isRead);
    if (commentList) {
        return {
            code: 200,
            data: {
                list: commentList,
                total: commentCount
            },
            message: "success"
        };
    }
    return { code: 500, message: "服务器错误" };
};

let getCommentListByPostId = async postId => {
    var result = await database.query(
        "select name,content,updated_at from comment where post_id = ? and is_show = 1 order by updated_at desc",
        [postId]
    );
    if (result) {
        return { code: 200, data: result, message: "success" };
    }
    return { code: 500, message: "系统错误" };
};

let addComment = async (postId, name, contacts, content, updated_at) => {
    if (!postId || !name || !content) {
        return { code: 500, message: "参数错误" };
    }
    var insertRow = await database.query(
        "insert into comment(post_id,name,contacts,content,updated_at) values(?,?,?,?,?)",
        [postId, name, contacts, content, updated_at || Date.now()]
    );

    if (insertRow && insertRow.insertId) {
        return {
            code: 200,
            data: { id: insertRow.insertId },
            message: "insert success"
        };
    } else {
        return { code: 500, message: "insert fail" };
    }
};

let setCommentRead = async commentIds => {
    var result = await database.query(
        `update comment set is_read = 1 where id in (?)`,
        [commentIds]
    );
    if (result && result.affectedRows >= 0) {
        return { code: 200, message: "update success" };
    } else {
        return { code: 500, message: "update fail" };
    }
};

let deleteComment = async commentIds => {
    var result = await database.query(`delete from comment where id in (?)`, [
        commentIds
    ]);
    if (result && result.affectedRows >= 0) {
        return { code: 200, message: "update success" };
    } else {
        return { code: 500, message: "update fail" };
    }
};

exports.getCommentCount = getCommentCount;
exports.getCommentList = getCommentList;
exports.getCommentListByPostId = getCommentListByPostId;
exports.addComment = addComment;
exports.setCommentRead = setCommentRead;
exports.deleteComment = deleteComment;
