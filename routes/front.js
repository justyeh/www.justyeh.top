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
    if (result.code !== 200) {
        errorRender(res, result)
    } else {
        res.render('front/index', {
            title: 'justyeh的前端博客',
            layout: 'front-layout',
            postList: result.data,
            pageHtml: pager.createPageHtml(pageNo, postCount, '/page/')
        });
    }
}


router.get('/post/:postId', async(req, res, next) => {
    var result = await postSys.getPostById(req.params.postId);
    if (result.code == 200) {
        res.render('front/post', {
            layout: 'front-layout',
            title: result.data.title,
            description: result.data.summary,
            keywords: helper.setHtmlKeyword(result.data.tagList),
            poster: result.data.poster,
            updatedAt: helper.timeago(result.data.updated_at),
            tags: result.data.tagList,
            htmlConetnt: helper.markdown2Htm(result.data.markdown),
            commentList: []
        });
    } else {
        errorRender(res, result)
    }
});

router.get('/tag/:tagId', async(req, res, next) => {
    var result = await postSys.getPostListByTagId('published', req.params.tagId);
    if (result.code == 200) {
        res.render('front/tag', {
            layout: 'front-layout',
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

router.get('/search', async(req, res, next) => {
    var result = await postSys.getPostListBySearch('published', req.query.search || '');
    if (result.code == 200) {
        res.render('front/search', {
            layout: 'front-layout',
            title: result.data.search + '的搜索结果',
            description: result.data.search + '的搜索结果',
            keywords: result.data.search,

            search: result.data.search,
            postList: result.data.postList
        });
    } else {
        errorRender(res, result)
    }
})

router.get('/tool', async(req, res, next) => {
    res.render('front/tool', {
        title: '工具',
        layout: 'front-layout'
    });
});

router.get('/about', async(req, res, next) => {
    res.render('front/about', {
        title: '关于我',
        layout: 'front-layout'
    });
});

module.exports = router;