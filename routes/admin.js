var express = require('express');
var router = express.Router();

var sessionMiddleware = require('../middleware/session')

router.use(sessionMiddleware.sessionAuth)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('admin/index', {
        title: 'Express',
        layout: ''
    });
});

router.get('/post/edit', function (req, res, next) {
    res.render('admin/post-edit', {
        layout: null
    });
});

router.get('/post/list/:page', function (req, res, next) {
    res.render('admin/post-list', {
        layout: null
    });
});

router.get('/tag/edit', function (req, res, next) {
    res.render('admin/tag-edit', {
        layout: null
    });
});

router.get('/tag/list/:page', function (req, res, next) {
    res.render('admin/tag-list', {
        layout: null
    });
});



module.exports = router;
