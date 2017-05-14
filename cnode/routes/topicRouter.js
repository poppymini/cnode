// 路由文件---话题路由
var express = require('express');
var router = express.Router();

// 加载话题控制器
var topicCtrl = require('../controllers/topicController');

// 加载中间件，检测用户是否登录
var userCheck = require('../middlewares/userCheck');

// 设置路由

// 创建话题的路由
router.get('/create',userCheck,topicCtrl.create);

// 获取用户提交的数据
router.post('/doCreate',userCheck,topicCtrl.doCreate);

// 显示话题详情
router.get('/show/:_id',topicCtrl.showDetail);

// 创建回复话题的路由
router.post('/reply',userCheck,topicCtrl.reply);

// 创建收藏话题的路由
router.get('/collect',topicCtrl.collect);

// 向外暴露
module.exports = router;