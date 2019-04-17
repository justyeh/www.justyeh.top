let database = require("../utils/database");
let tagSys = require("./tag");
let commentSys = require("./comment");

let helper = require("../utils/helper");

let getPostById = async postId => {
    if (!helper.isInteger(postId)) {
        return { code: 500, message: "无效的ID" };
    }
    var postInfo = await database.query(
        "select * from post where id = ?",
        postId
    );
    if (!postInfo) {
        return { code: 500, message: "服务器错误" };
    }
    if (postInfo.length == 0) {
        return { code: 400, message: "没有相关数据" };
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
        message: "success"
    };
};

let getPostList = async params => {
    if (
        !helper.isInteger(params.pageIndex) ||
        !helper.isInteger(params.pageSize)
    ) {
        return { code: 500, message: "无效的页码参数" };
    }

    let pageIndex = parseInt(params.pageIndex);
    let pageSize = parseInt(params.pageSize);

    let postList = await database.query(
        "select * from post where status = ? and title like ? order by id desc limit ?,?",
        [
            params.status,
            `%${params.keyword}%`,
            (pageIndex - 1) * pageSize,
            pageSize
        ]
    );

    let postCount = await getPostCount(params.status, params.keyword);

    if (postList) {
        getTagsList = [];
        postList.forEach(item => {
            getTagsList.push(tagSys.getTagListByPostId(item.id));
        });
        tagList = await Promise.all(getTagsList);
        if (tagList) {
            postList.map((item, index) => {
                (item.tagList = tagList[index].data || []),
                    (item.updatedAt = helper.timeago(item.updated_at));
            });
            return {
                code: 200,
                data: {
                    list: postList,
                    total: postCount
                },
                message: "success"
            };
        }
    }
    return { code: 500, message: "服务器错误" };
};

let getPostListByTagId = async (status, tagId) => {
    let tag = await database.query("SELECT name FROM tag WHERE id = ?", [
        tagId
    ]);
    if (!tag || tag.length == 0) {
        return { code: 400, message: "没有相关数据" };
    }
    let postList = await database.query(
        "SELECT post.* from post,post_tag WHERE post.id = post_tag.post_id AND post.status = ? AND post_tag.tag_id = ? order by id desc",
        [status, tagId]
    );
    if (tag && postList) {
        getTagsList = [];
        postList.forEach(item => {
            getTagsList.push(tagSys.getTagListByPostId(item.id));
        });
        tagList = await Promise.all(getTagsList);

        if (tagList) {
            postList.map((item, index) => {
                (item.tagList = tagList[index].data || []),
                    (item.updatedAt = helper.timeago(item.updated_at));
            });
            return {
                code: 200,
                data: {
                    name: tag[0].name,
                    list: postList
                },
                message: "success"
            };
        }
    }
    return { code: 500, message: "服务器错误" };
};

let getAllPost = async () => {
    let postList = await database.query("select title,markdown from post ");
    if (postList) {
        return { code: 200, data: { list: postList }, message: "success" };
    }
    return { code: 500, message: "服务器错误" };
};

let getPostCount = async (postStatus, search) => {
    var result = null;
    if (search) {
        result = await database.query(
            "select count(id) as `count` from post where status = ? and title like ?",
            [postStatus, `%${search}%`]
        );
    } else {
        result = await database.query(
            "select count(id) as `count` from post where status = ?",
            [postStatus]
        );
    }
    return result[0].count || 0;
};

let addPost = async post => {
    var insertRow = await database.query(
        "insert into post(title,poster,summary,markdown,status,allow_comment,updated_at) values(?,?,?,?,?,?,?)",
        [
            post.title,
            post.poster,
            post.summary,
            post.markdown,
            post.status,
            post.allow_comment,
            new Date().getTime()
        ]
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

let updatePost = async post => {
    var result = await database.query(
        "update post set title=?,poster=?,summary=?,markdown=?,status=?,allow_comment=?,updated_at=? where id = ?",
        [
            post.title,
            post.poster,
            post.summary,
            post.markdown,
            post.status,
            post.allow_comment,
            new Date().getTime(),
            post.id
        ]
    );
    if (result && result.affectedRows > 0) {
        return { code: 200, message: "update success" };
    } else {
        return { code: 500, message: "update fail" };
    }
};

let deletePost = async postId => {
    var result = await database.query("delete from post where id = ?", [
        postId
    ]);
    if (result && result.affectedRows > 0) {
        return { code: 200, message: "delete success" };
    } else {
        return { code: 500, message: "delete fail" };
    }
};

let updatePostTag = async (postId, tagList) => {
    let insertTags = [];
    let existTags = [];
    tagList.forEach(item => {
        if (parseInt(item.id) === -1) {
            insertTags.push(item.name);
        } else {
            existTags.push(item.id);
        }
    });

    if (insertTags.length > 0) {
        let insertValus = insertTags.map(item => [item]);
        let insertRes = await database.query("INSERT INTO tag(name) VALUES ?", [
            insertValus
        ]);

        if (insertRes && insertRes.insertId) {
            for (let i = 0; i < insertRes.affectedRows; i++) {
                existTags.push(insertRes.insertId + i);
            }
        }
    }

    let deleteRes = await database.query(
        "delete from post_tag where post_id = ?",
        postId
    );
    if (deleteRes) {
        if (existTags.length > 0) {
            let values = existTags.map(item => [postId, item]);
            let insertTags = await database.query(
                "insert into post_tag(post_id,tag_id) values ?",
                [values]
            );
            if (insertTags) {
                return { code: 200, message: "update post_tag success" };
            }
        } else {
            return { code: 200, message: "update post_tag success" };
        }
    }
    return { code: 500, message: "update post_tag fail" };
};

exports.getPostById = getPostById;
exports.getPostList = getPostList;
exports.getPostListByTagId = getPostListByTagId;
exports.getAllPost = getAllPost;
exports.getPostCount = getPostCount;
exports.addPost = addPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.updatePostTag = updatePostTag;
