// 创建与话题分类有关的路由

// 加载mongoose模块
var mongoose = require('../config/db_config');

// 创建对应的骨架
var typeSchema = new mongoose.Schema({
	typename : {
		type:String,
		unique:true
	},
	// 排序数字，数字越大越靠前显示
	ordernum:{
		type:Number,
		default:0
	}
});

// 创建模型
var typeModel = mongoose.model('cnode_type',typeSchema);

// 向外暴露
module.exports = typeModel;