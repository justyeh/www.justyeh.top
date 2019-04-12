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
