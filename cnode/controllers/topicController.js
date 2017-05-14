// 定义话题控制器

// 创建控制器对象
var topicController = {};

// 加载分类模型
var typeModel = require('../models/typeModel');

// 加载话题模型
var topicModel = require('../models/topicModel');

// 加载用户模型
var userModel = require('../models/userModel');

// 加载回复模型
var replyModel = require('../models/replyModel');

// 加载eventproxy模块，解决回调函数深度嵌套
var EventProxy = require('eventproxy');
var ep = new EventProxy();

// 设置对应的方法
topicController.create = function(req,res){
	// 分配话题类型到模板中
	typeModel.find(function(err,typeData){
		res.render('home/topicCreate',{typeData:typeData});
	}).sort({ordernum:-1});
}

// 处理用户提交的数据
topicController.doCreate = function(req,res){
	// post提交
	// console.log(req.body);

	var data = {
		topicname : req.body.topicname,// 话题的标题
		tid : req.body.tid,	// 话题的分类
		uid:req.session.user._id, // 谁登录，谁发表的
		content:req.body.content,	// 发表的内容
	}

	// console.log(data);

	// 写入数据库
	topicModel.create(data,function(err,info){
		// console.log(err);  // 应当有一个判定
		// console.log(info);

		// 返回的info中的_id的值，将该数据压入到当前用户文档的topic数组中
		// 命令里面向数组中压入数据 db.cnode_users.update({_id:11},{$push:{topic:话题_id}})
		var con = {
			_id:req.session.user._id
		};
		userModel.update(con,{$push:{topic:info._id}},function(err,userInfo){
			// console.log(err);
			// console.log(info);

			// 判断是否成功
			if(!err){
				// 跳转当前话题详情页 -- 拼接的是发表的话题的_id
				res.redirect('/topic/show/'+info._id);
			}else{
				// 提示数据异常，返回发表话题页面
			}
		})
	})
};

// 显示话题详情页
topicController.showDetail = function(req,res){
	// 获取地址栏传递的参数
	var con = {
		_id : req.params._id
	}

	// 监测 
	// 该回调函数会等着三个消息：
	ep.all('viewNum','topicData','replyData',function(memeda,topicData,replyData){
		res.render('home/topicDetail',{data:topicData,replyData:replyData});
	})

	// 更新当前话题的浏览数量
	topicModel.update(con,{$inc:{viewnum:1}},function(err){
		// 如果更新成功，那么触发
		ep.emit('viewNum');
	});

	// 查询该话题的详情
	topicModel.findOne(con).populate('uid',{username:1,userpic:1,gold:1,mark:1}).populate('tid',{typename:1}).exec(function(err,data){
		// 触发，将data传递过来
		ep.emit('topicData',data);
	});

	// 查询所有的属于该话题的回复
	var con = {
		tid : req.params._id
	};
	replyModel.find(con).populate('uid',{username:1,userpic:1}).exec(function(err,replyData){
			// 触发
			ep.emit('replyData',replyData);
			})


	/*
	// 更新，更新该话题的浏览数量
	topicModel.update(con,{$inc:{viewnum:1}},function(err){
		// 查询当前话题的详情，当前发表话题的用户信息，该话题所属的分类
		topicModel.findOne(con).populate('uid',{username:1,userpic:1,gold:1,mark:1}).populate('tid',{typename:1}).exec(function(err,data){
			// 响应模板，分配数据

			// 根据data.reply回复的数组获取所有的回复相关信息
			var con = {
				_id:{$in:data.reply}
			}
			replyModel.find(con).populate('uid',{username:1,userpic:1}).exec(function(err,replyData){
				res.render('home/topicDetail',{data:data,replyData:replyData});
			})
			
		});
	});
	*/

	// 查询所有该话题的回复 $in reply
};

// 回复话题
topicController.reply = function(req,res){
	// 获取该话题下回复的长度
	var con = {
		_id : req.body.tid
	}
	topicModel.findOne(con,{reply:1},function(err,info){
		// console.log(data);

		// 获取用户传递的数据
		var data = {
			content : req.body.content,
			tid : req.body.tid,
			uid : req.session.user._id,	// 当前登录的账户
			// 楼层的计算
			floor:info.reply.length+1
		};

		// 产生数据
		replyModel.create(data,function(err,info){
			if(!err&&info){
				// 肯定成功了
				// 向topicModel中更新reply
				topicModel.update(con,{$push:{reply:info._id}},function(err,data){
					res.redirect('back')
				})
			}else{
				res.redirect('back')	
			}
		})
	});	
};

// 收藏话题
topicController.collect = function(req,res){
	// 用户没有登录
	if(!req.session.user){
		// 返回对应的结果
		res.send('nologin');

		// 终止程序执行
		return;
	}

	/*
		当前话题 _id req.query._id
		当前登录用户 _id req.session.user._id
	*/
	var topicCon = {
		_id : req.query._id
	}
	// 用户
	var userCon = {
		_id : req.session.user._id
	}

	// 查询话题是否已经被收藏，应该是两个条件
	var con = {
		// 当前话题的_id
		_id : req.query._id,
		// 当前登录用户的_id
		collect:req.session.user._id
	}

	// 判断是否已经收藏
	topicModel.findOne(con,function(err,data){
		if(data){
			// 已经收藏了
			// console.log('已经收藏了');

			// 在话题集合和用户集合中移除对应的数据
			ep.all('removeTopic','removeUser',function(){
				// 响应
				res.send('removeOk');
			})

			topicModel.update(topicCon,{$pull:{collect:req.session.user._id}},function(err){
				// 触发
				ep.emit('removeTopic');
			});

			// 移除用户集合中的数据
			userModel.update(userCon,{$pull:{collectTopic:req.query._id}},function(err){
				ep.emit('removeUser');
			});

		}else{
			// 还没有收藏
			// console.log('还没有收藏');

			// 将该信息存储到topic集合中的collect中，存储到user集合中的collectTopic

			// 监听两个操作全部完成
			ep.all('updateTopic','updateUser',function(){
				// 返回消息
				res.send('collectOk');
			})

			topicModel.update(topicCon,{$push:{collect:req.session.user._id}},function(err){
				// 成功触发
				ep.emit('updateTopic');
			});

			// 更新用户集合
			userModel.update(userCon,{$push:{collectTopic:req.query._id}},function(err){
				ep.emit('updateUser');
			});
		}
	})
}


// 向外暴露
module.exports = topicController;