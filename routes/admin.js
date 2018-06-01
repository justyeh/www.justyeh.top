var express = require('express');
var router = express.Router();
var sessionMiddleware = require('../middleware/checkSession');
var userSys = require('../services/user')

//router.use(sessionMiddleware.sessionAuth)

router.post('/login', async (req, res, next) => {
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


router.get('/', async (req, res, next) => {
    var postStatus = req.query.status || 'published';
    var search = req.query.search || '';

    var postCount = await postSys.getPostCount({postStatus, search});
    var result = await postSys.getPostListByPage({postStatus, search, pageNo});

    res.render('admin/post-list', {
        layout: 'admin-layout',
        title: '文章列表',
        ...req.session.user,
        activeSidebar: 'post',
        postStatus,
        search,
        postList: result.date,
        pageHtml: pager.createPageHtml(pageNo, postCount, '/page/')
    });
});

router.get('/post/edit', async (req, res, next) => {
    res.render('admin/post-edit', {
        layout: 'admin-layout',
        activeSidebar: 'post',
    });
});

router.get('/post/list/:page', async (req, res, next) => {
    res.render('admin/post-list', {
        layout: 'admin-layout',
    });
});

router.get('/tag/edit', async (req, res, next) => {
    res.render('admin/tag-edit', {
        layout: 'admin-layout',
        activeSidebar: 'post',
    });
});

router.get('/tag/list/:page', async (req, res, next) => {
    res.render('admin/tag-list', {
        layout: 'admin-layout',
        activeSidebar: 'tag',
    });
});


router.get('/message', async (req, res, next) => {
    res.render('admin/message-list', {
        layout: 'admin-layout',
        activeSidebar: 'message',
    });
});



module.exports = router;
