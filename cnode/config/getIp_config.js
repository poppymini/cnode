// 获取ip地址
// var ip = '::ffff:127.0.0.1';

/**
* 定义获取ip地址函数 getIp();
* @param string ip 输入的IP地址
* return string ip 输出的IP地址
*/ 
function getIp(ip){
	// 最后一个:的索引
	var index = ip.lastIndexOf(':');

	// 截取IP地址
	var ip = ip.slice(index+1);
	
	// 返回结果
	return ip;
}

// 向外暴露模块
module.exports = getIp;
