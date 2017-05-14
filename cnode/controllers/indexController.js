// 专门的处理与index相关的数据--控制器

// 加载话题模型
var topicModel = require('../models/topicModel');

// 加载用户模型
var userModel = require('../models/userModel');

// 加载分类模型
var typeModel = require('../models/typeModel');

// 加载eventProxy模板，解决深度回调
var eventProxy = require('eventproxy');

// 获取ep对象
var ep = new eventProxy();

// 定义对象
var indexController = {};

// 设置处理首页路由的方式
indexController.index = function(req,res){
	/*
		首页查询需要的数据：
			1. 分页的话题列表
			2. 无人回复的话题（5条） {reply:[]}
			3. 积分榜(前10名)
			4. 获取分类信息
	*/
	// 监听
	ep.all('topicData','userData','replyZeroData','typeData',function(topicData,userData,replyZeroData,typeData){
		// 响应数据
		res.render('Index',{
			// 话题数据列表
			data:topicData.data,
			page:topicData.page,
			pageMax:topicData.pageMax,

			// 传递金币排名前10的数据
			userData:userData,

			// 传递无人回复的话题
			replyZeroData:replyZeroData,

			// 传递分类信息
			typeData:typeData
		});
	});

	// 查询分类信息
	typeModel.find(function(err,typeData){
		// 触发
		ep.emit('typeData',typeData);
	}).sort({ordernum:-1});

	// 查询无人回复的话题
	topicModel.find({reply:[]},{topicname:1},function(err,data){
		// 分配数据到前台模板 -- 触发
		ep.emit('replyZeroData',data);

	}).limit(5).sort({posttime:-1});

	// 按照金币查询金币排名前十的成员
	userModel.find({},{username:1,gold:1},function(err,userData){
		// 分配数据给模板 -- 触发
		ep.emit('userData',userData);
	}).sort({gold:-1}).limit(10);


	// 查找数据 话题、用户信息、模块信息 // 做分页处理
	/*
		总的条数
		确定查询的范围
	*/

	// 获取当前分类的条件
	var tid = req.query.tab;

	// 判断当用户没有选择分类时，不添加分类条件
	var con = {};
	if(tid){
		con.tid = tid;
	}
	
	topicModel.find(con).populate('uid',{userpic:1}).populate('tid',{typename:1}).count(function(err,total){
		// 声明每页的条数
		var pageSize = 20;

		// 当前的页数
		var page = req.query.page?req.query.page:1;

		// 页数的最大值
		var pageMax = Math.ceil(total/pageSize);

		// 判断 最大临界值
		if(page>=pageMax){
			page = pageMax;
		}

		// 判断 最小的临界值
		if(page<=1){
			page = 1;
		}

		// 计算偏移量
		var pageOffset = (page-1)*pageSize;

		

		// 查询
		topicModel.find(con).populate('uid',{userpic:1}).populate('tid',{typename:1}).skip(pageOffset).limit(pageSize).sort({posttime:-1}).exec(function(err,data){
				// 响应模板 -- 触发
				var topicData = {
					data:data,
					page:page,
					pageMax:pageMax
				};

				// 触发
				ep.emit('topicData',topicData);
			});
	})	
};

// 向外暴露
module.exports = indexController;