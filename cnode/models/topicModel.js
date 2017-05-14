// 创建一个跟话题集合相关的模型

// 加载mongoose模块
var mongoose = require('../config/db_config');

// 创建骨架
var topicSchema = new mongoose.Schema({
	// 字段名称，设置类型，约束
	topicname : String,
	uid:{
		type:'ObjectId',
		ref:'cnode_user'
	},
	tid:{
		type:'ObjectId',
		ref:'cnode_type'
	},
	content:String,
	viewnum:{
		type:Number,
		default:0
	},
	posttime:{
		type:Date,
		default:new Date()
	},
	reply:[{
		type:'ObjectId',
		ref:'cnode_user'
	}],
	collect:[{
		type:'ObjectId',
		ref:'cnode_user'
	}]
});

// 创建模型
var topicModel = mongoose.model('cnode_topic',topicSchema);

// 向外暴露
module.exports = topicModel;