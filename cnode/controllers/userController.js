// 定义与用户模块相关的控制器

// 加载字符串加密模块
var cryptoStr = require('../config/crypto_config');

// 加载的对应cnode_users集合的模型
var userModel = require('../models/userModel');

// 加载获取ip地址的模块
var getIp = require('../config/getIp_config');

// 加载发送邮件的模块
var sendMail = require('../config/mail_config');

// 加载格式化时间戳模块
var timestamp = require('time-stamp');

// 加载文件上传模块
var uploadFile = require('../config/uploadFile_config');

// 加载缩放图片的模块
var resizeImg = require('../config/resizeImg_config');

// 定义对象
var userController = {};

// 定义匹配注册路由的方法
userController.reg = function(req,res){
	// 响应页面
	res.render('home/reg');
};

// 定义处理用户注册数据的方法
userController.doReg = function(req,res){
	/*
		用户现在注册数据给服务器：
			1. 检测该用户名是否可用！
			2. 检测邮箱是否可用
			3. 密码加密
	*/ 

	// 去数据库进行用户名的验证
	var con = {
		username : req.body.username
	}

	// 连接数据库进行查询
	userModel.findOne(con,function(err,data){
		if(data){
			// 说明账户已经存在了,返回错误提示信息
			req.flash('errMsg','账户名已存在');

			// 跳转到注册页面
			res.redirect('/user/reg');

			// 终止程序
			return;
		}else{
			// 验证邮箱是否唯一
			var con = {
				email : req.body.email
			};

			// 查询
			userModel.findOne(con,function(err,data){
				if(data){
					// 邮箱已经被占用了!
					req.flash('errMsg','邮箱已经被占用');
					res.redirect('/user/reg');

					// 终止程序
					return;
				}else{
					// console.log(req.ip);

					// 没有问题，进行注册就OK了....
					var userData = {
						username : req.body.username,

						// 密码加密
						userpwd : cryptoStr(req.body.userpwd),
						email : req.body.email,
						regip : getIp(req.ip)
					};

					// 注册--添加数据
					userModel.create(userData,function(err,msg){
						// console.log(err);
						// console.log(msg);

						if(err){
							// 说明注册失败了
							req.flash('errMsg','操作异常，请重新尝试');

							// 跳转到注册页面
							res.redirect('back');
						}else{
							// 发送邮件
							sendMail(userData.username,userData.email,msg._id);

							// 响应提示用户激活邮箱的页面

							// 跳转到账户注册成功，请激活邮箱的页面
							res.redirect('/user/emailActive');
						}
					})
				}
			})

		}
	})
};

// 显示账户注册成功，提示激活的页面
userController.emailActive = function(req,res){
	res.render('home/emailactive');
}

// 处理用户激活
userController.active = function(req,res){
	// 接收谁要激活
	var con = {
		_id : req.query._id
	}

	// console.log(con);

	// 操作users集合，激活账户
	userModel.update(con,{active:1},function(err,msg){
		// console.log(err);
		// console.log(msg);

		if(err){
			// 激活失败了
		}else{
			// 激活成功
			// 跳转到激活成功的页面提示
			res.redirect('/user/activeok');
		}
	})
};


// 激活成功的页面展示
userController.activeok = function(req,res){
	res.render('home/activeok');
}

// 处理用户登录的方法
userController.doLogin = function(req,res){
	// 获取用户输入的数据
	var con = {
		username : req.body.username,
		// 密码加密
		userpwd : cryptoStr(req.body.userpwd)
	};

	/*
		判断：
			1. 账户和密码是否正确
			2. 如果账户是正确的，判断用户的邮箱是否已经验证
	*/

	// 以该条件查询users集合
	userModel.findOne(con,function(err,data){
		// console.log(err); // 只能表示是否执行错误了
		if(!data){
			// 账户或密码错误
			req.flash('errMsg','账户或密码错误,请重新尝试');

			// 跳转
			res.redirect('/user/login');

			// 终止程序
			return;
		}

		// console.log(data);

		// 判断账户是否已经激活
		if(data.active==0){
			// 未激活账户，跳转到提示用户激活账户的页面
			// res.redirect('/user/emailActive');
			req.flash('errMsg','请到注册邮箱中激活账户！');

			//  跳转
			res.redirect('back');

			// 终止程序
			return;
		}

		// 更新用户的登录时间 
		// 每天第一次用户登录时是否要给金币

		// 进行判断 是否是每天的第一次进行登录

		// 上一次登录时间 data.logintime
		// 当前时间 new Date
		var logintime = data.logintime;
		var now = new Date();
		// 比较天 20170228格式
		var logintimeStr = timestamp('YYYY',logintime)+timestamp('MM',logintime)+timestamp('DD',logintime);
		var nowStr = timestamp('YYYY',now)+timestamp('MM',now)+timestamp('DD',now);

		// 定义变量
		var gold = data.gold;

		// 判断是否是第一次登录
		if((nowStr-logintimeStr)>=1){
			// 金币 +10
			gold += 10;
		}

		// 我们要更新的数据
		var newData = {
			logintime : new Date(),
			gold : gold
		};

		// 条件
		var con = {
			_id : data._id
		}

		// 更新数据
		userModel.update(con,newData,function(err,msg){
			// console.log(err)
			// console.log(msg);
			if(!err){
				// 成功存储用户信息，跳转首页
				// 将用户的信息存储到session中，跳转到首页
				req.session.user = data;

				// 跳转
				res.redirect('/');
			}
		});		
	})
}

// 显示用户登录页面
userController.login = function(req,res){
	res.render('home/login');
};

// 用户退出
userController.logout = function(req,res){
	// 销毁用户的session信息 req.session.user
	req.session.user = null;

	// 跳转首页
	res.redirect('/');
};

// 显示个人信息
userController.setting = function(req,res){
	res.render('home/setting');
};

// 更新个人信息
userController.update = function(req,res){
	// 应该只用当前要更新的信息是要更新谁的
	var con = {
		// 从session信息，获取用户的_id
		_id : req.session.user._id
	}

	// 用户每一次上传都必须更新头像吗？

	// 涉及到用户上传头像 --- 用到用户上传头像的模块
	// 调用文件上传
	var upload = uploadFile('userpic','public/uploads',['image/gif','image/jpeg','image/png','image/jpg'],1024*1024);

	// 文件上传
	upload(req,res,function(err){
		// 进行数据判定
		if(err){
			// 匹配错误信息
			switch(err.code){
				case 'fileType':
					var errMsg = '文件类型不符合....';
				break;
				case 'LIMIT_FILE_SIZE':
					var errMsg = '文件太大了...';
				break;
			}

			// 使用req.flash()响应错误信息给相应的页面
			req.flash('errMsg',errMsg)

			// 跳转会上传文件的页面
			res.redirect('/user/setting');

			// 终止程序的执行
			return;
		}

		// 定义要更新的数据
		var newData = {
			mark : req.body.mark
		}

		// 如果req.file是undefined说明用户是没有上传头像的		
		// console.log(req.file);
		if(req.file){
			// 对图片进行缩放...
			resizeImg(req.file.path,req.file.path,120,120,function(err){
				if(!err){
					// 缩放成功
					// 说明上传了文件 -- 更新头像
					newData.userpic = req.file.filename;

					// 等缩放图片完成之后，再进行更新
					// 进行更新
					userModel.update(con,newData,function(err,info){
						// console.log(err);
						// console.log(info);

						// 用户现在查看到的数据是存储session中，用户不重新登录那么session会改变吗 --- 需要对session重新赋值
						if(!err){
							userModel.findOne(con,function(err,data){
								// 重新赋值
								req.session.user = data;

								// 跳转回个人信息页面
								res.redirect('back');
							})
						}
					})
				}
			});
		}else{
			// 进行更新
			userModel.update(con,newData,function(err,info){
				// console.log(err);
				// console.log(info);

				// 用户现在查看到的数据是存储session中，用户不重新登录那么session会改变吗 --- 需要对session重新赋值
				if(!err){
					userModel.findOne(con,function(err,data){
						// 重新赋值
						req.session.user = data;

						// 跳转回个人信息页面
						res.redirect('back');
					})
				}
			})
		}

			
	})
};

// 修改密码
userController.updatepwd = function(req,res){
	/*
		1. 输入原密码，获取原密码去数据库进行查询，验证成功，将新密码进行加密存储，提示修改成功，让用户退出重新登录一次
		2. 邮件验证：（扩展--5分）
			a. 发送修改密码的邮件
			b. 用户单击邮件中的链，跳转到网站的一个修改密码的页面,携带用户的信息
			c. 让用户输入新密码，将新密码进行加密存储，提示修改成功，让用户退出重新登录一次
		3. 使用短信进行验证：（扩展--5分）
			a. 向绑定的手机发送短信验证
			b. 获取用户输入的数据和系统产生的验证是否一致
			c. 如果验证通过，输入新密码，将新密码进行加密存储，提示修改成功，让用户退出重新登录一次

			// 阿里大鱼 短信验证平台
	*/
}

// 向外暴露模块
module.exports = userController;