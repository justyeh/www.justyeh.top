var express = require('express');
var router = express.Router();

var apiAuthMiddleware = require('../middleware/apiAuth');

var tagSys = require('../services/tag')

router.use(apiAuthMiddleware.apiAuth)

router.get('/', function(req, res, next) {
    res.json({ message: "welcome to justyeh.com api server" })
});

router.get('/tag/search', async(req, res, next) => {
    if (!req.query.name || req.query.name.trim() == '') {
        res.json({ code: 200, data: [], message: 'success' })
    }
    res.json(await tagSys.getTagByName(req.query.name))
});

router.post('/tag/add', async(req, res, next) => {
    if (!req.query.name || req.query.name.trim() == '') {
        res.json({ code: 200, data: [], message: 'success' })
    }
    res.json(await tagSys.getTagByName(req.query.name))
});


module.exports = router;