var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// 设置模板引擎
var ejs = require('ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');+
app.engine('html', ejs.__express);

// 设置favicon.ico
app.use(favicon(path.join(__dirname, './static/favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//设置静态文件目录
app.use(express.static(path.join(__dirname, './public'))); //html,pdf,project
app.use(express.static(path.join(__dirname, './static'))); //image,css,js
app.use(express.static(path.join(__dirname, './uploads'))); //image upload dir

//session中间件
app.use(session({
    secret: 'justyeh.top',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //设置一天有效期
}));


//路由
var front = require('./routes/front');
var admin = require('./routes/admin');
var api = require('./routes/api');


app.use('/', front);
app.use('/admin', admin);
app.use('/api', api);


// 404
app.use(function(req, res, next) {
    var err = new Error('This page could not be found.');
    err.status = 404;
    next(err);
});

// 其他错误
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        code: req.app.get('env') === 'development' ? err.status : null,
    });
});

module.exports = app;