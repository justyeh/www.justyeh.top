
let database = require('../utils/database');
let tagSys = require('./tag');

let helper = require('../utils/helper');

exports.getPostById = async (postId) => {

    if (!helper.isInteger(postId)) {
        return { code: 500, message: '无效的ID' }
    }

    let postInfo = await database.query('select * from posts where id = ?', postId);
    if (!postInfo) {
        return { code: 500, message: '服务器错误' }
    }
    if (postInfo.length == 0) {
        return { code: 400, message: '没有相关数据' }
    }
    let tagList = await tagSys.getPostTags(postId);
    return {
        code: 200,
        data: { ...postInfo[0], tagList },
        message: 'success'
    }
}

exports.getPostListByPage = async (pageNo, pageSize) => {
    if (!helper.isInteger(pageNo)) {
        return { code: 500, message: '无效的页码' }
    }
    var pageSize = pageSize || 10;
    let postList = await database.query('select id,title,image,meta_description from posts  order by id desc limit ?,?', [((pageNo - 1) * pageSize), pageSize]);
    if (!postList) {
        return { code: 500, message: '服务器错误' }
    }

    searchList = [];
    postList.forEach(item => {
        searchList.push(tagSys.getPostTags(item.id))
    });
    tagList = await Promise.all(searchList);
    postList.map((item, index) => {
        item.tags = tagList[index]
    })
    return { code: 200, data: postList, message: 'success' };
}

exports.getPostListByTagId = async tagId => {
    if (!helper.isInteger(tagId)) {
        return { code: 500, message: '无效的ID' }
    }

    var tagInfo = await tagSys.getTagById(tagId);
    if (!tagInfo || tagInfo.length == 0) {
        return { code: 400, message: '没有相关数据' }
    }

    var postList = await database.query('select * from posts where id in (select post_id from post_tags where tag_id = ?)', tagId);

    if (!postList) {
        return { code: 500, message: '服务器错误' }
    }

    searchList = [];
    postList.forEach(item => {
        searchList.push(tagSys.getPostTags(item.id))
    });
    tagList = await Promise.all(searchList);
    postList.map((item, index) => {
        item.tags = tagList[index]
    });

    return {
        code: 200,
        data: {
            ...tagInfo[0],
            postList
        },
        message: 'success'
    }
}

exports.getPostListByKeyword = async keyword => {

    var postList = await database.query('select * from posts where meta_title LIKE "%?%"', keyword);

    if (!postList) {
        return { code: 500, message: '服务器错误' }
    }

    searchList = [];
    postList.forEach(item => {
        searchList.push(tagSys.getPostTags(item.id))
    });
    tagList = await Promise.all(searchList);
    postList.map((item, index) => {
        item.tags = tagList[index]
    });

    return {
        code: 200,
        data: {
            keyword,
            postList
        },
        message: 'success'
    }

}

exports.getPostCount = async () => {
    var result = await database.query('select count(id) as `count` from posts');
    return result[0].count || 0
}

exports.addPost = async post => {
}

