// 加载mongoose模块
var mongoose = require('../config/db_config');

// 创建骨架
var replySchema = new mongoose.Schema({
	content:String,
	tid:{
		type:'ObjectId',
		ref:'cnode_topic'
	},
	uid:{
		type:'ObjectId',
		ref:'cnode_user'
	},
	posttime:{
		type:Date,
		default:new Date()
	},
	floor:{
		type:Number
	},
	like:[{
		type:'ObjectId',
		ref:'cnode_user'
	}]
});

// 创建模型
var replyModel = mongoose.model('cnode_reply',replySchema);

// 向外暴露
module.exports = replyModel;