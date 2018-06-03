var express = require('express');
var router = express.Router();

var sessionMiddleware = require('../middleware/checkSession');

var userSys = require('../services/user')
var postSys = require('../services/post');

var errorRender = require('../utils/errorRender').errorRender;

var helper = require('../utils/helper');
var pager = require('../utils/pager');
var multer = require('../utils/fileUpload')

//router.use(sessionMiddleware.sessionAuth)

router.post('/login', async(req, res, next) => {
    var result = await userSys.login(req.body.email, req.body.password);
    if (!result || result.code !== 200) {
        res.render('admin/login', {
            email: req.body.email,
            password: req.body.password,
            error: result.message
        });
    } else {
        req.session.user = result.data;
        res.redirect('/admin');
    }
});

router.get('/', async(req, res, next) => {
    res.redirect('/admin/post')
});

router.get('/post', async(req, res, next) => {

    var postStatus = req.query.status || 'published';
    var search = req.query.search || '';
    var pageNo = req.query.page || 1;


    var postCount = await postSys.getPostCount(postStatus, search);
    var result = await postSys.getPostList(postStatus, search, pageNo, 20);
    if (result.code == 200) {
        res.render('admin/post-list', {
            layout: 'admin-layout',
            title: '文章管理',
            activeSidebar: 'post',
            ...req.session.user,
            postStatus,
            search,
            postList: result.data,
            pageNo,
            pageHtml: pager.createPageHtml(pageNo, postCount, '/page/')
        });
    } else {
        errorRender(res, result)
    }
});


router.get('/post/edit', async(req, res, next) => {
    var result = await postSys.getPostById(req.query.id);
    res.render('admin/post-edit', {
        layout: 'admin-layout',
        title: '文章管理',
        activeSidebar: 'post',
        post: result.code == 200 ? result.data : null
    });
});

router.post('/post/edit', multer.single('poster'), async(req, res, next) => {
    var post = {
        id: req.body.id,
        title: req.body.title,
        poster: req.file ? '/' + req.file.filename : req.body.poster_url || '',
        summary: req.body.summary,
        markdown: req.body.markdown,
        status: req.body.status
    }
    var result = null;
    if (req.body.id) {
        result = await postSys.updatePost(post);
    } else {
        result = await postSys.addPost(post);
    }
    if (result.code == 200) {
        var updatePostTagResult = await postSys.upadtePostTag(result.data.id || req.body.id, req.body.tags.split(','));
        if (updatePostTagResult.code == 200) {
            res.redirect('/admin/post');
        } else {
            errorRender(res, updatePostTagResult);
        }
    } else {
        errorRender(res, result);
    }

});




router.get('/tag/edit', async(req, res, next) => {
    res.render('admin/tag-edit', {
        layout: 'admin-layout',
        activeSidebar: 'post',
    });
});

router.get('/tag/list/:page', async(req, res, next) => {
    res.render('admin/tag-list', {
        layout: 'admin-layout',
        activeSidebar: 'tag',
    });
});

router.get('/message', async(req, res, next) => {
    res.render('admin/message-list', {
        layout: 'admin-layout',
        activeSidebar: 'message',
    });
});

module.exports = router;