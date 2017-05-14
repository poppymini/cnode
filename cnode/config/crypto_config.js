// 关于加密配置的文件

// 加载模块
var crypto = require('crypto');

/**
* 定义加密字符串的方法 cryptoStr()
* @param string inputStr 输入的字符串
* @param string outStr 输出的加密字符串
*/
function cryptoStr(inputStr){
	// 设置加密的方式 -- sha1
	var sha1 = crypto.createHash('sha1');

	// 加密
	sha1.update(inputStr);

	// 接收加密的结果
	var outStr = sha1.digest('hex');

	// 返回
	return outStr;
}

// 向外暴露模块
module.exports = cryptoStr;