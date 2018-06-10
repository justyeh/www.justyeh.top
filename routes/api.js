var express = require('express');
var router = express.Router();

var apiAuthMiddleware = require('../middleware/apiAuth');

var tagSys = require('../services/tag')
var commentSys = require('../services/comment')

//router.use(apiAuthMiddleware.apiAuth)

router.get('/', function(req, res, next) {
    res.json({ message: "welcome to justyeh.com api server" })
});

router.get('/test401', function(req, res, next) {
    res.status(401).send('无权访问!!!');
});

router.get('/tag/search', async(req, res, next) => {
    if (!req.query.name || req.query.name.trim() == '') {
        res.json({ code: 200, data: [], message: 'success' })
    }
    res.json(await tagSys.getTagByName(req.query.name))
});

router.post('/tag/add', async(req, res, next) => {
    res.json(await tagSys.addTag(req.body.name));
});

router.post('/tag/update', async(req, res, next) => {
    res.json(await tagSys.updateTag(req.body.name, req.body.id));
});

router.post('/comment/add', async(req, res, next) => {
    res.json(await commentSys.addComment(req.body.id, req.body.name, req.body.content));
});




module.exports = router;