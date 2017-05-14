// 数据库配置文件

// 加载mongoose模块
var mongoose = require('mongoose');

// 定义数据库连接的配置项
var hostName = '127.0.0.1';	// 主机地址
var port = '27017';		// 端口号
var dbName = 'cnode';		// 数据库名称
var dbUser = '';		// 数据库用户
var dbPwd = '';			// 连接的用户密码

// 连接数据库
var dbUrl = "mongodb://"+hostName+":"+port+"/"+dbName;

// 连接判断
mongoose.connect(dbUrl,function(err){
	if(err){
		console.log('数据库连接失败了....');
	}
});

// 向外暴露mongoose模块
module.exports = mongoose;