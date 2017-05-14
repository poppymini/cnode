var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 加载session模块
var session = require('express-session');
var flash = require('connect-flash');


// 加载路由文件
var indexRouter = require('./routes/indexRouter');
var userRouter = require('./routes/userRouter');
var topicRouter = require('./routes/topicRouter');

// console.log(topicRouter);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置session
app.use(session({
  secret:'suibianxie',
  resave:true,
  rolling:true,
  cookie:{
    // 用户活跃的保存时间
    maxAge:1000*60*10,
    path:'/'
  }
}));

// 设置 flash
app.use(flash());

// 设置接收一次性的错误信息
app.use(function(req,res,next){
  // 保存错误信息
  res.locals.errMsg = req.flash('errMsg');

  // 存储用户的信息 user 变量在模板页面的任何一个位置都可以获取
  res.locals.user = req.session.user;

  // 移交权限给下一个
  next();
});

// 设置路由给指定的路由处理文件
app.use('/', indexRouter);

/*
	登录 /user/login
	退出 /user/logout
	注册 /user/reg
*/
app.use('/user', userRouter);

// 话题路由
app.use('/topic',topicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
