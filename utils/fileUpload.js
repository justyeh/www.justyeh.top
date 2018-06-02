var multer = require('multer');

var storage = multer.diskStorage({
    destination: process.cwd() + '/uploads', //设置上传目录
    filename: function(req, file, callback) { //设置文件名
        var fileFormat = (file.originalname).split(".");
        callback(null, new Date().getTime() + '-' + file.fieldname + "." + fileFormat[fileFormat.length - 1]);
    }
});

var upload = multer({
    storage: storage
});

module.exports = upload;