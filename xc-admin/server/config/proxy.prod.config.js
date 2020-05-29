module.exports = {
  '/app-api -> http://b-i.mc.cn/': {
    changeOrigin: true,
    pathRewrite: {
      '^/app-api': '',
    },
  },
  '/work-api -> http://47.111.128.153/': {
    changeOrigin: true,
    pathRewrite: {
      '/work-api': '',
    },
  },
  '/scheduler-api -> http://127.0.0.1:6003/': {
    changeOrigin: true,
    pathRewrite: {
      '/scheduler-api': '',
    },
  },
};
