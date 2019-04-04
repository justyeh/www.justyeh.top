var express = require("express");
var router = express.Router();

var apiAuthMiddleware = require("../middleware/apiAuth");

var tagSys = require("../services/tag");
var commentSys = require("../services/comment");
var postSys = require("../services/post");
var userSys = require("../services/user");

router.use(apiAuthMiddleware.apiAuth);

router.get("/", function(req, res, next) {
    res.json({
        code: 200,
        message: "welcome to justyeh.top api server"
    });
});

//登录
router.post("/user/login", async function(req, res, next) {
    res.json(await userSys.login(req.body.email, req.body.password));
});

//前台-获取评论列表
router.get("/getCommentByPostId", async (req, res, next) => {
    res.json(await commentSys.getCommentListByPostId(req.query.postId));
});
//前台-发表评论
router.post("/comment/add", async (req, res, next) => {
    res.json(
        await commentSys.addComment(
            req.body.postId,
            req.body.name,
            req.body.content,
            req.body.updated_at
        )
    );
});

//后台-评论相关
router.get("/comment/list", async (req, res, next) => {
    res.json(
        await commentSys.getCommentList({
            isRead: req.query.isRead || 0,
            pageIndex: req.query.pageIndex || 1,
            pageSize: req.query.pageSize || 10
        })
    );
});

router.post("/comment/updateShowCode", async (req, res, next) => {
    res.json(await commentSys.updateShowCode(req.body.showCode, req.body.id));
});

router.post("/comment/setRead", async (req, res, next) => {
    res.json(await commentSys.setCommentRead(req.body.id));
});

router.post("/comment/delete", async (req, res, next) => {
    res.json(await commentSys.deleteComment(req.body.id));
});

//获取post列表
router.get("/post/list", async (req, res, next) => {
    res.json(
        await postSys.getPostList({
            status: req.query.status || "published",
            keyword: req.query.keyword || "",
            pageIndex: req.query.pageIndex || 1,
            pageSize: req.query.pageSize || 10
        })
    );
});

//获取标签列表
router.get("/tag/list", async (req, res, next) => {
    res.json(await tagSys.getTagList(req.body.name));
});

router.post("/tag/add", async (req, res, next) => {
    res.json(await tagSys.addTag(req.body.name));
});

router.post("/tag/update", async (req, res, next) => {
    res.json(await tagSys.updateTag(req.body.name, req.body.id));
});

module.exports = router;
