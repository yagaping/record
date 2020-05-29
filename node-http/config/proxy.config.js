
// 动态获取 配置文件
module.exports = function (NODE_ENV) {
	if (!NODE_ENV) {
		NODE_ENV = process.env.NODE_ENV
	}
	if (NODE_ENV === 'prod') {
		return require('./proxy.prod.config');
	} else {
		return require('./proxy.dev.config');
	}
};