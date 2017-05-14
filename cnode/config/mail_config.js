  // 定义发送邮件验证的模块

// 加载模块
var nodemailer = require('nodemailer');

// 以QQ的smtp服务器发送邮件服务

/* 
	需要在QQ中开启smtp服务：
		开启 POP3/SMTP服务 -- 
*/


/**
* 定于发送邮件的函数 sendMail()
* @param string username 注册的账户名
* @param string email 要验证的email地址
* @param string _id 用于标志用户的_id
*/
function sendMail(username,email,_id){
	// 定义传输的协议
	var transporter = nodemailer.createTransport({
		// 定义服务器
		host:'smtp.qq.com',

		// 权限验证
		auth:{
			user:'xdlnode@qq.com',		// 用户

			// 密码不是邮箱的密码，是授权码
			pass:'pefejanvlxmwdiad'			
		}
	});

	// 定义要发送的参数
	var mailOptions = {
		from:'XDLNode官网<xdlnode@qq.com>',			// 发件人
		to:email,		// 收件人
		subject:'XDLNode官网账户邮件激活',			// 邮件主题
		html:'<h3>尊贵的 '+username+' ，您好</h3><p>欢迎注册XDLNode官网，请点击下面的链接激活账户 <a href="http://192.168.120.249/user/active?_id='+_id+'" target="_blank">账户激活链接</a></p>'
	};

	// 发送
	transporter.sendMail(mailOptions,function(err,info){
		// console.log(err);
		// console.log(info);
	})
}

sendMail('sunwu','justbecoder@aliyun.com','111')

// 向外暴露
module.exports = sendMail;