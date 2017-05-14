// 缩放图片的模块

// 加载模块
var gm = require('gm');
var fs = require('fs');

/**
* 定义缩放图片的函数 resizeImg()
* @param string imgSrc 要缩放的图片的位置
* @param string imgDes 缩放完成之后存放的路径
* @param number width  目标缩放的宽度
* @param number height  目标缩放的高度
* @param callback callback 接收错误信息的回调函数
*/
function resizeImg(imgSrc,imgDes,width,height,callback){
	gm(imgSrc).resize(width,height).write(imgDes,function(err){
		callback(err);
	});
}

// 向外暴露模块
module.exports = resizeImg;