
module.exports = {

    "/news-api -> http://39.108.174.140:7002/": {
        // "/news-api ->  http://192.168.1.53:8083/": {
            // "/news-api -> http://192.168.1.75:8083/": {
        changeOrigin: true,
        pathRewrite: {
            '^/news-api' : '',     // rewrite path
        },
    },
    // "/comment-api -> http://mc.s1.natapp.cc ": {
    "/comment-api -> http://39.108.174.140:7002/": {
        // "/comment-api -> http://192.168.1.75:8083/": {

        changeOrigin: true,
        pathRewrite: {
            '^/comment-api' : '',     // rewrite path
        },
    },
    // "/app-api -> http://mc.s1.natapp.cc/":{
    // "/app-api -> http://192.168.1.53:8083/": {
     "/app-api -> http://39.108.174.140:7002/": {
        changeOrigin: true,
        pathRewrite: {
            '^/app-api' : '',     // rewrite path
        },
    },
	  "/work-api -> http://39.108.174.140:8081/": {
        changeOrigin: true,
        pathRewrite: {
            '^/work-api' : '',     // rewrite path
        },
    },
	"/tx-api -> https://test-q.mc.cn/": {
        changeOrigin: true,
        pathRewrite: {
            '^/tx-api' : '',     // rewrite path
        },
    },
	
};
