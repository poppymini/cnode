// 路由中转文件，负责中转与用户模块相关的路由

// 加载路由方法
var express = require('express');
var router = express.Router();

// 加载控制器
var userCtrl = require('../controllers/userController');

// 加载自定义的中间件
var userCheck = require('../middlewares/userCheck');
// console.log(userCheck);

// 匹配用户注册路由
router.get('/reg',userCtrl.reg);

// 匹配处理用户注册数据的路由
router.post('/doReg',userCtrl.doReg);

// 匹配显示账户注册成功，提示激活邮箱的页面
router.get('/emailActive',userCtrl.emailActive);

// 匹配用户激活邮箱的路由
router.get('/active',userCtrl.active);

// 设置用户激活成功的路由
router.get('/activeok',userCtrl.activeok);

// 显示登录的页面
router.get('/login',userCtrl.login);

// 处理用户登录的数据
router.post('/doLogin',userCtrl.doLogin);

// 用户退出
router.get('/logout',userCtrl.logout);

/*
	在某些情况下用户是必须登录：显示个人信息，修改个人信息
*/

// 显示用户信息的路由 --- 用户未登录是不允许进入个人信息设置
router.get('/setting',userCheck,userCtrl.setting);

// 获取用户更新数据
router.post('/update',userCheck,userCtrl.update);


// 修改密码的路由
router.post('/updatepwd',userCheck,userCtrl.updatepwd);

module.exports = router;
