let database = require('../utils/database');

let helper = require('../utils/helper');
exports.getPostTags = async(postId) => {
    var tagRows = await database.query('select tag_id from post_tag where post_id = ?', postId);
    var queryList = [];
    tagRows.forEach(item => {
        queryList.push(database.query('select id,name from tag where id = ?', item.tag_id))
    });
    return helper.reduceArrayDimension(await Promise.all(queryList));
}

exports.getTagById = async(tagId) => {
    return await database.query('select id,name from tag where id = ?', tagId);
}

exports.getTagByName = async name => {
    var tagList = await database.query('select id,name from tag where name like ?', `%${name}%`);
    if (!tagList) {
        return { code: 500, message: '服务器错误' }
    }
    return { code: 200, data: tagList, message: 'success' }
}

exports.addTag = async tagName => {
    var insertRow = await database.query('insert into tag(name) values(?)', tagName);

    if (insertRow && insertRow.insertId) {
        return { code: 200, data: { id: insertRow.insertId }, message: 'insert success' }
    } else {
        return { code: 500, message: 'insert fail' }
    }
}