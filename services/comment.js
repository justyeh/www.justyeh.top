let database = require('../utils/database');


var getCommentListByPostId = async postId => {
    return result = await database.query('select * from comment where post_id = ?', postId);
}


var addComment = async comment => {
    var result = await database.query(`insert into comment(post_id,name,comment,updated_at) values(?,?,?,${new Date().getTime()})`, [comment.postId, comment.name, comment.content])
}