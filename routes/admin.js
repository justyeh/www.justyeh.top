var express = require('express');
var router = express.Router();

var sessionMiddleware = require('../middleware/checkSession');

var userSys = require('../services/user')
var postSys = require('../services/post');

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
})
router.get('/post', async(req, res, next) => {

    var postStatus = req.query.status || 'published';
    var search = req.query.search || '';
    var pageNo = req.query.page || 1;

    var postCount = await postSys.getPostCount(postStatus, search);
    var result = await postSys.getPostList(postStatus, search, pageNo, 20);
    res.render('admin/post-list', {
        layout: 'admin-layout',
        title: '文章管理',
        activeSidebar: 'post',
        ...req.session.user,
        postStatus,
        search,
        postList: result.date,
        pageHtml: pager.createPageHtml(pageNo, postCount, '/page/')
    });
});

router.get('/post/eidt', async(req, res, next) => {
    var result = await postSys.getPostById(req.query.postId);
    res.render('admin/post-edit', {
        layout: 'admin-layout',
        title: '文章管理',
        activeSidebar: 'post',
        post: result.code == 200 ? result.data : null
    });
});



router.post('/post/edit', multer.single('poster'), async(req, res, next) => {
    var post = {
        title: req.body.title,
        poster: req.file ? `/uploads/${req.file.filename}` : '',
        summary: req.body.summary,
        tags: req.body.tags,
        markdown: req.body.markdown,
        status: req.body.status || 'published'
    }
    res.json({
        layout: 'admin-layout',
        activeSidebar: 'post',
        post: post
    });
});

router.get('/post/edit', async(req, res, next) => {
    res.render('admin/post-edit', {
        layout: 'admin-layout',
        activeSidebar: 'post',
    });
});

router.get('/post/list/:page', async(req, res, next) => {
    res.render('admin/post-list', {
        layout: 'admin-layout',
    });
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