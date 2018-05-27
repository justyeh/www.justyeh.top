var express = require('express');
var router = express.Router();

var errorRender = require('../utils/errorRender').errorRender;
var postSys = require('../services/post');

var helper = require('../utils/helper')

/* GET home page. */
router.get('/', async(req, res, next) => {
    res.render('front/index', {
        title: 'justyeh的前端博客',
        layout: 'front-layout'
    });
});

router.get('/page/:page', async(req, res, next) => {
    res.render('front/index', {
        title: 'justyeh的前端博客',
        layout: 'front-layout'
    });
});

router.get('/post/:postId', async(req, res, next) => {
    var result = await postSys.getPostById(req.params.postId);
    if (result.code == 200) {
        res.render('front/post', {
            layout: 'front-layout',
            title: result.data.meta_title,
            description: result.data.meta_description,
            keywords: [],
            poster: '',
            updateAt: '',
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