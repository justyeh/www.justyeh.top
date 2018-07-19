let database = require('../utils/database');
let tagSys = require('./tag');
let commentSys = require('./comment');

let helper = require('../utils/helper');

exports.getPostById = async (postId) => {
    if (!helper.isInteger(postId)) {
        return { code: 500, message: '无效的ID' }
    }
    var postInfo = await database.query('select * from post where id = ?', postId);
    if (!postInfo) {
        return { code: 500, message: '服务器错误' }
    }
    if (postInfo.length == 0) {
        return { code: 400, message: '没有相关数据' }
    }
    var post = postInfo[0];
    //post tag
    var tagResult = await tagSys.getTagListByPostId(postId);
    post.tagList = tagResult.data || [];
    //post comment
    var commentResult = await commentSys.getCommentListByPostId(postId);
    post.commentList = commentResult.data || [];
    return {
        code: 200,
        data: { ...post },
        message: 'success'
    }
}

exports.getPostList = async (postStatus, search, pageNo, pageSize) => {
    if (!helper.isInteger(pageNo)) {
        return { code: 500, message: '无效的页码' }
    }
    let postList = await database.query('select * from post where status = ? and title like ? order by id desc limit ?,?', [postStatus, `%${search || ''}%`, ((pageNo - 1) * pageSize), pageSize]);
    if (postList) {
        getTagsList = [];
        postList.forEach(item => {
            getTagsList.push(tagSys.getTagListByPostId(item.id));
        });
        tagList = await Promise.all(getTagsList);
        if (tagList) {
            postList.map((item, index) => {
                item.tagList = tagList[index].data || [],
                item.updatedAt = helper.timeago(item.updated_at)
            });
            return { code: 200, data: postList, message: 'success' };
        }
    }
    return { code: 500, message: '服务器错误' }
}

exports.getPostListByTagId = async (postStatus, tagId) => {
    if (!helper.isInteger(tagId)) {
        return { code: 500, message: '无效的ID' }
    }

    var tagInfo = await tagSys.getTagById(tagId);
    if (!tagInfo || tagInfo.length == 0) {
        return { code: 400, message: '没有相关数据' }
    }

    var postList = await database.query('select * from post where status = ? and id in (select post_id from post_tag where tag_id = ?) order by id desc', [postStatus, tagId]);
    if (postList) {
        getTagsList = [];
        postList.forEach(item => {
            getTagsList.push(tagSys.getTagListByPostId(item.id));
        });
        tagList = await Promise.all(getTagsList);
        if(tagList){
            postList.map((item, index) => {
                item.tagList = tagList[index].data || [],
                item.updatedAt = helper.timeago(item.updated_at)
            });
            return {code: 200,data: {...tagInfo.data[0],postList},message: 'success'}
        }
    }
    return { code: 500, message: '服务器错误' }
}

exports.getPostCount = async (postStatus, search) => {
    var result = null;
    if(search){
        result = await database.query('select count(id) as `count` from post where status = ? and title like ?', [postStatus, `%${search || ''}%`]);
    }else{
        result = await database.query('select count(id) as `count` from post where status = ?', [postStatus]);
    }
    return result[0].count || 0
}

exports.addPost = async post => {
    var insertRow = await database.query('insert into post(title,poster,summary,markdown,status,updated_at) values(?,?,?,?,?,?)', [
        post.title,
        post.poster,
        post.summary,
        post.markdown,
        post.status,
        new Date().getTime()
    ]);

    if (insertRow && insertRow.insertId) {
        return { code: 200, data: { id: insertRow.insertId }, message: 'insert success' }
    } else {
        return { code: 500, message: 'insert fail' }
    }
}

exports.updatePost = async post => {
    var result = await database.query('update post set title=?,poster=?,summary=?,markdown=?,status=? where id = ?', [
        post.title,
        post.poster,
        post.summary,
        post.markdown,
        post.status,
        post.id
    ]);
    if (result && result.affectedRows > 0) {
        return { code: 200, message: 'update success' }
    } else {
        return { code: 500, message: 'update fail' }
    }
}

exports.updatePostTag = async (postId, tagList) => {
    var deleteOldTag = await database.query('delete from post_tag where post_id = ?', postId);
    if (deleteOldTag) {
        var insertList = tagList.map(item => {
            return database.query('insert into post_tag(post_id,tag_id) values(?,?)', [postId, item])
        });
        if (insertList.length == 0) {
            return { code: 200, message: 'update post_tag success' }
        }
        var insertNewTag = await Promise.all(insertList);
        if (insertNewTag) {
            return { code: 200, message: 'update post_tag success' }
        }
    }
    return { code: 500, message: 'update post_tag fail' }
}