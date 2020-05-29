module.exports = {
	"/news-api -> http://b-i.mc.cn/": {
		changeOrigin: true,
		pathRewrite: {
			'^/news-api' : '',     // rewrite path
		},
	},
	"/comment-api -> http://b-i.mc.cn/": {
		changeOrigin: true,
		pathRewrite: {
			'^/comment-api' : '',     // rewrite path
		},
	},
    "/app-api -> http://b-i.mc.cn/": {
        changeOrigin: true,
        pathRewrite: {
            '^/app-api' : '',     // rewrite path
        },
    },
};