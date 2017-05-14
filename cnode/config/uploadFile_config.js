// 上传文件操作的配置文件

// 加载模块
var multer = require('multer');
var timestamp = require('time-stamp');
var uid = require('uid');
var path = require('path');

/**
*	定义上传文件的函数uploadFile()
* 	@param fieldName string  表单中用于提交的文件的name值
*	@param savePath string 用于存储文件的地址
*	@param allowType array 允许上传的文件类型
*	@param fileSize number 允许上传的文件大小最大值
*/
function uploadFile(fieldName,savePath,allowType,fileSize){
	// 设置存储的位置和文件名的设置
	var storage = multer.diskStorage({
		destination:function(req,file,cb){
			// 该位置的目录一定要是存在的
			cb(null, savePath);	
		},
		filename:function(req,file,cb){
			/*
				上传文件的文件名：
					时间戳+随机数+扩展名
			*/
			var hz = path.extname(file.originalname);
			var filename = timestamp('YYYY')+timestamp('MM')+timestamp('DD')+timestamp('HH')+timestamp('mm')+timestamp('ss')+timestamp('ms')+uid(10)+hz;

			// 进行存储
			cb(null,filename);
		}
	});

	// 实例化上传
	var upload = multer({
		// 设置存储方式
		storage:storage,
		// 设置过滤的文件类型
		fileFilter:function(req,file,cb){
			// 定义允许上传的文件类型数组
			// var allowType = ['image/jpeg','image/png','image/gif'];

			// 检测该类型是否在允许的范围内
			if(allowType.indexOf(file.mimetype)!=-1){
				cb(null,true);
			}else{
				// 文件类型不符合的信息传递给前台页面
				var err = new Error('文件类型错误');

				// 设置错误标记
				err.code = 'fileType';

				// 传递错误
				cb(err);

				// 不允许存储
				cb(null,false)
			}
		},

		// 允许上传的文件最大值
		limits:{
			fileSize:fileSize	
		}
	}).single(fieldName);

	// 返回对象
	return upload;
}

// 向外暴露
module.exports = uploadFile;