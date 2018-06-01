let database = require('../utils/database');

let helper = require('../utils/helper');
exports.getPostTags = async (postId) => {
    var tagRows = await database.query('select tag_id from post_tag where post_id = ?', postId);
    var queryList = [];
    tagRows.forEach(item => {
        queryList.push(database.query('select id,name from tag where id = ?', item.tag_id))
    });
    return helper.reduceArrayDimension(await Promise.all(queryList));
}


exports.getTagById = async (tagId) => {
    return await database.query('select id,name,description from tag where id = ?', tagId);
}
