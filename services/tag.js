let database = require("../utils/database");
let helper = require("../utils/helper");

let getTagListByPostId = async postId => {
    var tagRows = await database.query(
        "select id,name from tag where id in (select tag_id from post_tag where post_id = ?)",
        [postId]
    );
    if (tagRows) {
        return { code: 200, data: tagRows, message: "success" };
    }
    return { code: 500, message: "服务器错误" };
};

let getTagList = async () => {
    var tagRows = await database.query("select * from tag order by id desc");
    if (tagRows) {
        var queryList = [];
        tagRows.forEach(item => {
            queryList.push(
                database.query(
                    "select id,title from post where id in (select post_id from post_tag where tag_id = ?)",
                    [item.id]
                )
            );
        });
        var postList = await Promise.all(queryList);
        if (postList) {
            tagRows.forEach((item, index) => {
                item.postList = postList[index] || [];
            });
            return { code: 200, data: tagRows, message: "success" };
        }
    }
    return { code: 500, message: "服务器错误" };
};

let getTagById = async tagId => {
    var tagRows = await database.query("select id,name from tag where id = ?", [
        tagId
    ]);
    if (tagRows) {
        return { code: 200, data: tagRows, message: "success" };
    }
    return { code: 500, message: "服务器错误" };
};

let getTagByName = async name => {
    var tagRows = await database.query(
        "select id,name from tag where name like ?",
        `%${name}%`
    );
    if (tagRows) {
        return { code: 200, data: tagRows, message: "success" };
    }
    return { code: 500, message: "服务器错误" };
};

let addTag = async tagName => {
    var insertRow = await database.query("insert into tag(name) values(?)", [
        tagName
    ]);
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

let updateTag = async (tagName, tagId) => {
    var updateRow = await database.query(
        "update tag set name = ? where id = ?",
        [tagName, tagId]
    );
    if (updateRow && updateRow.affectedRows > 0) {
        return { code: 200, message: "update success" };
    } else {
        return { code: 500, message: "update fail" };
    }
};

let deleteTag = async tagId => {
    if (!helper.isInteger(tagId)) {
        return { code: 500, message: "无效的ID" };
    }
    var deletePostTag = await database.query(
        "delete from post_tag where tag_id = ?",
        [tagId]
    );
    if (deletePostTag) {
        var deleteTag = await database.query("delete from tag where id = ?", [
            tagId
        ]);
        if (deleteTag) {
            return { code: 200, message: "delete success!" };
        }
    }
    return { code: 200, message: "delete faild!" };
};

exports.getTagListByPostId = getTagListByPostId;
exports.getTagList = getTagList;
exports.getTagById = getTagById;
exports.getTagByName = getTagByName;
exports.addTag = addTag;
exports.updateTag = updateTag;
exports.deleteTag = deleteTag;
