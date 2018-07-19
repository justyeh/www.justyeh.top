var express = require('express');
var router = express.Router();

var errorRender = require('../utils/errorRender').errorRender;
var postSys = require('../services/post');

var helper = require('../utils/helper');
var pager = require('../utils/pager');


router.get('/', (req, res, next) => {
    renderPostList(1, res)
});

router.get('/page/:pageNo', (req, res, next) => {
    renderPostList(req.params.pageNo, res)
});

async function renderPostList(pageNo, res) {
    var result = await postSys.getPostList('published', null, pageNo, 10);
    var postCount = await postSys.getPostCount('published', );
    if (result.code == 200) {
        res.render('front/index', {
            layout:'front-layout',
            title: 'justyeh的前端博客',
            description: 'justyeh的前端博客',
            keywords: 'justyeh的前端博客',

            postList: result.data,
            pageHtml: pager.createPageHtml(pageNo, postCount, 15, '/page/')
        });
    } else {
        errorRender(res, result)
    }
}

router.get('/search', async (req, res, next) => {
    var search = req.query.search || '';
    var postCount = await postSys.getPostCount('published', search);
    var result = await postSys.getPostList('published',search, 1, postCount);
    if (result.code == 200) {
        res.render('front/search', {
            layout:'front-layout',
            title: result.data.search + '的搜索结果',
            description: result.data.search + '的搜索结果',
            keywords: result.data.search,

            search: result.data.search,
            postList: result.data
        });
    } else {
        errorRender(res, result)
    }
});

router.get('/post/:postId', async (req, res, next) => {
    var result = await postSys.getPostById(req.params.postId);
    if (result.code == 200) {
        res.render('front/post', {
            layout:'front-layout',
            title: result.data.title,
            description: result.data.summary,
            keywords: helper.setHtmlKeyword(result.data.tagList),

            id: result.data.id,
            poster: result.data.poster,
            updatedAt: helper.timeago(result.data.updated_at),
            htmlConetnt: helper.markdown2Htm(result.data.markdown),
            tagList: result.data.tagList,
            allowComment:result.data.allow_comment,
            commentList: result.data.commentList
        });
    } else {
        errorRender(res, result)
    }
});

router.get('/tag/:tagId', async (req, res, next) => {
    var result = await postSys.getPostListByTagId('published', req.params.tagId);
    if (result.code == 200) {
        res.render('front/tag', {
            layout:'front-layout',
            title: result.data.name + '的相关文章',
            description: result.data.name + '的相关文章',
            keywords: result.data.name,

            tagName: result.data.name,
            postList: result.data.postList
        });
    } else {
        errorRender(res, result)
    }
});

router.get('/about', async (req, res, next) => {
    res.render('front/about', {
        layout: 'front-layout',
        title: '关于我',
    });
});

module.exports = router;