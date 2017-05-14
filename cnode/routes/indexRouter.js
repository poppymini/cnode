// 该文件是路由文件，只负责路由的中转
// 将路由交给指定的控制器进行数据的处理

var express = require('express');
var router = express.Router();

// 记载指定的控制器
var indexCtrl = require('../controllers/indexController');

// console.log(indexController);

// 将首页的路由交给indexCtrl.index方法进行处理
router.get('/',indexCtrl.index);


module.exports = router;
