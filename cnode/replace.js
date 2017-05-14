// 定义要替换的字符串
var str = '迷药，枪支，法轮功都是不好东东!';

var res = str.replace(/迷药|枪支|法轮功/g,function(patt){
	// 根据匹配到的不同数据，返回不同的结果
	switch(patt){
		case '枪支':
			return '**';
		break;
		case '迷药':
			return '**';
		break;
		case '法轮功':
			return '***';
		break;
	}
});

console.log(res);