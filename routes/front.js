var express = require("express");
var router = express.Router();

var errorRender = require("../utils/errorRender").errorRender;
var postSys = require("../services/post");

var helper = require("../utils/helper");
var pager = require("../utils/pager");

router.get("/", (req, res, next) => {
    renderPostList(1, res);
});

router.get("/page/:pageNo", (req, res, next) => {
    renderPostList(req.params.pageNo, res);
});

async function renderPostList(pageNo, res) {
    let pageSize = 15;
    var result = await postSys.getPostList({
        status: "published",
        keyword: "",
        pageIndex: pageNo,
        pageSize
    });

    if (result.code == 200) {
        res.render("front/index", {
            seo: {
                title: "justyeh的前端博客",
                description: "justyeh的前端博客",
                keywords: "justyeh的前端博客"
            },
            postList: result.data.list,
            pageHtml: pager.createPageHtml(
                pageNo,
                result.data.total,
                pageSize,
                "/page/"
            )
        });
    } else {
        errorRender(res, result);
    }
}

router.get("/search", async (req, res, next) => {
    let pageIndex = req.query.pageIndex || 1;
    let pageSize = 10000;
    let keyword = req.query.keyword || "";

    var result = await postSys.getPostList({
        status: "published",
        keyword,
        pageIndex,
        pageSize
    });
    if (result.code == 200) {
        res.render("front/search", {
            seo: {
                title: keyword + "的搜索结果",
                description: keyword + "的搜索结果",
                keywords: keyword
            },
            keyword: keyword,
            postList: result.data.list,
        });
    } else {
        errorRender(res, result);
    }
});

router.get("/post/:postId", async (req, res, next) => {
    var result = await postSys.getPostById(req.params.postId);
    if (result.code == 200) {
        res.render("front/post", {
            seo: {
                title: result.data.title,
                description: result.data.summary,
                keywords: helper.setHtmlKeyword(result.data.tagList)
            },
            title: result.data.title,
            id: result.data.id,
            poster: result.data.poster,
            updatedAt: helper.timeago(result.data.updated_at),
            content: helper.markdown2Html(result.data.markdown),
            tagList: result.data.tagList,
            allowComment: result.data.allow_comment,
            commentList: result.data.commentList
        });
    } else {
        errorRender(res, result);
    }
});

router.get("/tag/:tagId", async (req, res, next) => {
    var result = await postSys.getPostListByTagId(
        "published",
        req.params.tagId
    );
    if (result.code == 200) {
        res.render("front/tag", {
            seo: {
                title: result.data.name + "的相关文章",
                description: result.data.name + "的相关文章",
                keywords: result.data.name
            },
            tagName: result.data.name,
            postList: result.data.postList
        });
    } else {
        errorRender(res, result);
    }
});

router.get("/about", async (req, res, next) => {
    res.render("front/about", {
        seo: {
            title: "关于我"
        }
    });
});

module.exports = router;
