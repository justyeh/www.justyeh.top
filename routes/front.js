var express = require('express');
var router = express.Router();

var errorRender = require('../utils/errorRender').errorRender;
var postSys = require('../services/post');

var helper = require('../utils/helper');
var pager = require('../utils/pager');

/* GET home page. */
async function renderPostList(page, res) {
    var result = await postSys.getPostListByPage(page);
    var postCount = await postSys.getPostCount();
    console.log(postCount)
    if (result.code !== 200) {
        errorRender(res, result)
    } else {
        res.render('front/index', {
            title: 'justyeh的前端博客',
            layout: 'front-layout',
            postList: result.data,
            pageHtml: pager.createPageHtml(1, 1, '/page/')
        });
    }
}
router.get('/', (req, res, next) => {
    renderPostList(1, res)
});

router.get('/pager/:page', (req, res, next) => {
    res.render('front/pager', {
        pageHtml: pager.createPageHtml(req.params.page, 6, '/pager/')
    });
});

router.get('/page/:pageNo', (req, res, next) => {
    renderPostList(req.params.pageNo, res)
        /*var result = await postSys.getPostListByPage();
        var postCount = await postSys.getPostCount();
        if (result.code !== 200) {
            errorRender(res, result)
        } else {
            res.render('front/index', {
                title: 'justyeh的前端博客',
                layout: 'front-layout',
                postList: result.data,
                pageHtml:pager.ceatePageHtml(1,postCount,'/page/')
            });
        }*/
});


router.get('/post/:postId', async(req, res, next) => {
    var result = await postSys.getPostById(req.params.postId);

    if (result.code == 200) {
        res.render('front/post', {
            layout: 'front-layout',
            title: result.data.meta_title,
            description: result.data.meta_description,
            keywords: helper.setHtmlKeyword(result.data.tagList),
            poster: '',
            updateAt: '',
            tags: result.data.tagList,
            htmlConetnt: helper.markdown2Htm(result.data.markdown),
            commentList: []
        });
    } else {
        errorRender(res, result)
    }
});

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