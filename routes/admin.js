var express = require('express');
var router = express.Router();

var sessionMiddleware = require('../middleware/checkSession');

var userSys = require('../services/user');
var postSys = require('../services/post');
var tagSys = require('../services/tag');
var commentSys = require('../services/comment');

var errorRender = require('../utils/errorRender').errorRender;

var helper = require('../utils/helper');
var pager = require('../utils/pager');
var multer = require('../utils/fileUpload')

router.use(sessionMiddleware.sessionAuth);

router.get('/', async (req, res, next) => {
    res.redirect('/admin/post');
});

router.get('/login', async (req, res, next) => {
    res.render('admin/login');
});

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
        res.redirect('/admin/post');
    }
});

router.get('/logout', async (req, res, next) => {
    req.session.user = null;
    res.redirect('/admin/login');
});



router.get('/post', async (req, res, next) => {
    var postStatus = req.query.status || 'published';
    var keyword = req.query.keyword || '';
    var pageNo = req.query.page || 1;

    var postCount = await postSys.getPostCount(postStatus, keyword);
    var result = await postSys.getPostList(postStatus, keyword, pageNo, 10);
    if (result.code == 200) {
        res.render('admin/post-list', {
            user: req.session.user,
            title: '文章管理',
            activeSidebar: 'post',
            postStatus,
            keyword,
            postList: result.data,
            pageNo,
            pageHtml: pager.createPageHtml(pageNo, postCount, 10, `?status=${postStatus}&keyword=${keyword}&page=`)
        });
    } else {
        errorRender(res, result)
    }
});


router.get('/post/form', async (req, res, next) => {
    var renderData = {
        user: req.session.user,
        title: '文章管理',
        activeSidebar: 'post',
        post: {}
    }
    if (req.query.id) {
        var result = await postSys.getPostById(req.query.id);
        if (result.code == 200) {
            renderData.post = result.data;
            res.render('admin/post-form', renderData)
        } else {
            errorRender(res, result);
        }
    } else {
        res.render('admin/post-form', renderData)
    }
});

router.post('/post/edit', multer.single('poster'), async (req, res, next) => {
    var post = {
        id: req.body.id || '',
        title: req.body.title,
        poster: req.file ? '/' + req.file.filename : req.body.poster_url || '',
        summary: req.body.summary,
        markdown: req.body.markdown,
        status: req.body.status || 'published',
        allow_comment: req.body.allow_comment.length > 0 ? parseInt(req.body.allow_comment) : 1
    }
    var result = null;
    if (post.id) {
        result = await postSys.updatePost(post);
    } else {
        result = await postSys.addPost(post);
    }
    if (result.code == 200) {
        var updatePostTagResult = await postSys.updatePostTag(post.id || result.data.id, req.body.tags ? req.body.tags.split(',') : []);
        if (updatePostTagResult.code == 200) {
            let query = req.headers.referer.split('?');
            if (query.length > 0) {
                res.redirect(`/admin/post?${query[1]}`);
            } else {
                res.redirect(`/admin/post`);
            }
        } else {
            errorRender(res, updatePostTagResult);
        }
    } else {
        errorRender(res, result);
    }
});

router.get('/post/delete', async (req, res, next) => {
    if (req.query.id) {
        var result = await postSys.deletePost(req.query.id);
        if (result.code == 200) {
            let query = req.headers.referer.split('?');
            if (query.length > 0) {
                res.redirect(`/admin/post?${query[1]}`);
            } else {
                res.redirect(`/admin/post`);
            }
        } else {
            errorRender(res, result);
        }
    } else {
        errorRender(res, {
            code: 500,
            message: '参数异常'
        });
    }
});

router.get('/tag', async (req, res, next) => {
    var result = await tagSys.getTagList();
    if (result.code == 200) {
        res.render('admin/tag-list', {
            user: req.session.user,
            title: '标签管理',
            activeSidebar: 'tag',
            tagList: result.data
        });
    } else {
        errorRender(res, result)
    }
});

router.get('/tag/del', async (req, res, next) => {
    var result = await tagSys.deleteTag(req.query.id);
    if (result.code == 200) {
        res.redirect('/admin/tag')
    } else {
        errorRender(res, result)
    }
});

router.get('/comment', async (req, res, next) => {
    var isRead = req.query.is_read || '0';
    var pageNo = req.query.page || 1;

    var commentCount = await commentSys.getCommentCount(isRead);
    var result = await commentSys.getCommentList(isRead, pageNo, 15);
    if (result.code == 200) {
        result.data.forEach(item => {
            item.updatedAt = helper.formatTimestamp('yyyy-MM-dd hh:mm:ss', item.updated_at);
            delete item.updated_at;
        });
        res.render('admin/comment-list', {
            user: req.session.user,
            title: '评论管理',
            activeSidebar: 'comment',
            isRead,
            commentList: result.data,
            pageNo,
            pageHtml: pager.createPageHtml(pageNo, commentCount, 3, `?is_read=${isRead}&page=`)
        });
    } else {
        errorRender(res, result)
    }
});



router.get('/setting', async (req, res, next) => {
    res.render('admin/setting', {
        title: '系统设置',
        user: req.session.user,
        activeSidebar: 'setting',
    });
});

router.get('/setting/backup', async (req, res, next) => {
    res.sendFile();
});


module.exports = router;