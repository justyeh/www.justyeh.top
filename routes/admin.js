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

router.get('/logout', async (req, res, next) => {
    req.session.user = null;
    res.redirect('/admin');
});

router.get('/', async (req, res, next) => {
    res.redirect('/admin/post')
});

router.get('/post', async (req, res, next) => {

    var postStatus = req.query.status || 'published';
    var search = req.query.search || '';
    var pageNo = req.query.page || 1;

    var postCount = await postSys.getPostCount(postStatus, search);
    var result = await postSys.getPostList(postStatus, search, pageNo, 10);
    if (result.code == 200) {
        res.render('admin/post-list', {
            layout: 'admin-layout',
            title: '文章管理',
            activeSidebar: 'post',
            postStatus,
            search,
            postList: result.data,
            pageNo,
            pageHtml: pager.createPageHtml(pageNo, postCount, 10, `?status=${postStatus}&search=${search}&page=`)
        });
    } else {
        errorRender(res, result)
    }
});


router.get('/post/edit', async (req, res, next) => {
    var params = {
        layout: 'admin-layout',
        title: '文章管理',
        activeSidebar: 'post',
        postStatus: req.query.status || 'published',
        pageNo: req.query.page || 1,
    }
    if(req.query.id){
        var result = await postSys.getPostById(req.query.id);
        if(result.code == 200){
            params.post = result.data;
            res.render('admin/post-edit', params)
        }else{
            errorRender(res, result);
        }
    }else{
        res.render('admin/post-edit', params)
    }
});

router.post('/post/edit', multer.single('poster'), async (req, res, next) => {
    var post = {
        id: req.body.id || null,
        title: req.body.title,
        poster: req.file ? '/' + req.file.filename : req.body.poster_url || '',
        summary: req.body.summary,
        markdown: req.body.markdown,
        status: req.body.status || 'published',
        allow_comment: req.body.allow_comment || 1
    }

    var result = null;
    if (post.id) {
        result = await postSys.updatePost(post);
    } else {
        result = await postSys.addPost(post);
        post.id = result.data.id
    }

    if (result.code == 200) {
        var updatePostTagResult = await postSys.updatePostTag(post.id, req.body.tags ? req.body.tags.split(',') : []);
        if (updatePostTagResult.code == 200) {
            res.redirect(`/admin/post?status=${req.body.postStatus}&page=${req.body.pageNo}`);
        } else {
            errorRender(res, updatePostTagResult);
        }
    } else {
        errorRender(res, result);
    }

});

router.get('/tool', async (req, res, next) => {
    //var result = await tagSys.getTagList();
    //if (result.code == 200) {
        res.render('admin/tool', {
            layout: 'admin-layout',
            title: 'Tool管理',
            activeSidebar: 'tool',
            //tool:{}
        });
   // } else {
    //    errorRender(res, result)
   // }
});

router.get('/tag', async (req, res, next) => {
    var result = await tagSys.getTagList();
    if (result.code == 200) {
        res.render('admin/tag-list', {
            layout: 'admin-layout',
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
        res.render('admin/comment-list', {
            layout: 'admin-layout',
            title: '评论管理',
            activeSidebar: 'comment',
            isRead: isRead || 0,
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
        layout: 'admin-layout',
        activeSidebar: 'setting',
    });
});

router.get('/setting/backup', async (req, res, next) => {
    res.sendFile();
});


module.exports = router;