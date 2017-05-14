// 该文件是对应cnode_users集合的数据模型

// 加载mongoose模块
var mongoose = require('../config/db_config');

// 创建骨架
var userSchema = new mongoose.Schema({
	username:{
		type : String,
		unique:true
	},
	userpwd:{
		type:String
	},
	userpic:{
		type:String,
		default:''
	},
	sex:{
		type:Number,
		default:3
	},
	gold:{
		type:Number,
		default:20
	},
	regtime:{
		type:Date,
		default:new Date()
	},
	email:{
		type:String,
		unique:true
	},
	mark:{
		type:String,
		default:''
	},
	regip:{
		type:String
	},
	logintime:{
		type:Date,
		// 用户第一次注册时，设置登录时间就是注册时间
		default:new Date()
	},

	// active 值 表示是否已经激活了，0表示未激活，1表示激活
	active:{
		type:Number,
		default:0
	},
	// 话题数组列表
	topic:[{
		type:'ObjectId',
		ref : 'cnode_topic'
	}],
	collectTopic:[{
		type:'ObjectId',
		ref:'cnode_topic'
	}],

	// 用户等级
	level:{
		type:Number,
		default:0
	}
});

// 创建模型
var userModel = mongoose.model('cnode_user',userSchema);

// 向外暴露模型
module.exports = userModel;