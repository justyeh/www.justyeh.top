var express = require('express');
var router = express.Router();

var apiAuthMiddleware = require('../middleware/apiAuth');

var tagSys = require('../services/tag')
var commentSys = require('../services/comment')

router.use(apiAuthMiddleware.apiAuth)

router.get('/', function (req, res, next) {
    res.json({ message: "welcome to justyeh.top api server" })
});

router.get('/test401', function (req, res, next) {
    res.status(401).send('无权访问!!!');
});

router.get('/tag/search', async (req, res, next) => {
    if (!req.query.name || req.query.name.trim() == '') {
        res.json({ code: 200, data: [], message: 'success' })
    }
    res.json(await tagSys.getTagByName(req.query.name))
});

router.post('/tag/add', async (req, res, next) => {
    res.json(await tagSys.addTag(req.body.name));
});

router.post('/tag/update', async (req, res, next) => {
    res.json(await tagSys.updateTag(req.body.name, req.body.id));
});


router.get('/getCommentByPostId', async (req, res, next) => {
    res.json(await commentSys.getCommentListByPostId(req.query.postId));
});

router.post('/comment/add', async (req, res, next) => {+
    res.json(await commentSys.addComment(req.body.postId, req.body.name, req.body.content,req.body.updated_at));
});

router.post('/comment/updateShowCode', async (req, res, next) => {
    res.json(await commentSys.updateShowCode(req.body.showCode, req.body.id));
});

router.post('/comment/setRead', async (req, res, next) => {
    res.json(await commentSys.setCommentRead(req.body.id));
});


module.exports = router;