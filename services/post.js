
let database = require('../utils/database');
let tagSys = require('./tag');

let helper = require('../utils/helper');

exports.getPostById = async (postId) => {
    let postInfo = await database.query('select * from posts where id = ?', postId);
    if (!postInfo) {
        return { code: 500, message: '服务器错误' }
    }
    if (postInfo.length == 0) {
        return { code: 400, message: '无效的ID' }
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
    return await database.query('select count(id) from posts');
}

exports.getPostCount = async () => {
    var result = await database.query('select count(id) as `count` from posts');
    console.log(result)
    return result[0].count || 0
}

exports.addPost = async post => {
    var result = await database.query(`insert into posts(title,meta_description) values(?,?)`, ['测试数据', '测试数据meta_description'])
}



async function main() {
    console.log(result)
}
//main()