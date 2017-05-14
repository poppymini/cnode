// 定义检测用户是否登录的中间件
function userCheck(req,res,next){
	// 判断session.user是否存在，如果存在说明是登录，不存在说明没有登录
	if(!req.session.user){
		// 终止程序，跳转
		res.redirect('/user/login');
		// 终止程序
		return;
	}

	// 移交权限给下一个
	next();
}

// 向外暴露模块
module.exports = userCheck;