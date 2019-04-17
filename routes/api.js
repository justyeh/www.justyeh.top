var path = require("path");
var archiver = require("archiver");
var fs = require("fs");
var fse = require("fs-extra");
var express = require("express");
var router = express.Router();

var apiAuthMiddleware = require("../middleware/apiAuth");

var tagSys = require("../services/tag");
var commentSys = require("../services/comment");
var postSys = require("../services/post");
var userSys = require("../services/user");
var multer = require("../utils/fileUpload");

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

//前台-发表评论
router.post("/comment/add", async (req, res, next) => {
    res.json(
        await commentSys.addComment(
            req.body.postId,
            req.body.name,
            req.body.contacts,
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

router.post("/comment/setRead", async (req, res, next) => {
    res.json(await commentSys.setCommentRead(req.body.ids));
});

router.post("/comment/delete", async (req, res, next) => {
    res.json(await commentSys.deleteComment(req.body.ids));
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

//根据id获取Post详情
router.get("/post/detail/:id", async (req, res, next) => {
    res.json(await postSys.getPostById(req.params.id));
});

//添加Post
router.post("/post/add", multer.single("poster"), async (req, res, next) => {
    let post = req.body;
    post.poster = req.file ? "/" + req.file.filename : req.body.poster || "";
    let addRes = await postSys.addPost(post);
    if (addRes.code === 200) {
        postSys.updatePostTag(addRes.data.id, JSON.parse(post.tag));
    }
    res.json(addRes);
});

//编辑Post
router.post("/post/update", multer.single("poster"), async (req, res, next) => {
    let post = req.body;
    post.poster = req.file ? "/" + req.file.filename : req.body.poster || "";
    let updateRes = await postSys.updatePost(post);
    if (updateRes.code === 200) {
        postSys.updatePostTag(post.id, JSON.parse(post.tag));
    }
    res.json(updateRes);
});

//获取post的comment
router.get("/postComment", async (req, res, next) => {
    res.json(await commentSys.getCommentListByPostId(req.query.id));
});

//获取标签列表
router.get("/tag/list", async (req, res, next) => {
    res.json(await tagSys.getTagList(req.body.name));
});

router.post("/tag/add", async (req, res, next) => {
    res.json(await tagSys.addTag(req.body.name));
});

router.post("/tag/delete", async (req, res, next) => {
    res.json(await tagSys.deleteTag(req.body.id));
});

router.post("/tag/update", async (req, res, next) => {
    res.json(await tagSys.updateTag(req.body.name, req.body.id));
});

router.get("/tag/search", async (req, res, next) => {
    res.json(await tagSys.getTagByName(req.query.name));
});

//系统设置
router.get("/setting/backup", async (req, res, next) => {
    try {
        //get post list
        let postRes = await postSys.getAllPost();
        if (postRes.code !== 200) {
            throw "error";
        }
        //write post's markdown as a file
        let backupPath = path.resolve(__dirname, "../backup/markdown/");
        let backupFile = path.resolve(__dirname, "../backup/backup.zip");

        fse.ensureDirSync(backupPath);
        postRes.data.list.forEach(post => {
            fse.outputFileSync(
                path.resolve(backupPath, `${post.title}.md`),
                post.markdown
            );
        });
        //archive
        let output = fs.createWriteStream(backupFile);
        let archive = archiver("zip", { zlib: { level: 9 } });
        output.on("close", function() {
            res.download(backupFile);
        });
        archive.on("warning", err => {
            throw err;
        });
        archive.on("error", err => {
            throw err;
        });
        archive.pipe(output);
        archive.directory(backupPath, false);
        archive.finalize();
    } catch (error) {
        res.end(error.toString());
    }
});

module.exports = router;
