module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/jiutian/'
    : '/',
    devServer:{
      proxy:{
        '/api1':{
          target:'http://order.diyring.cc/union',
          ws: true,
          changeOrigin: true,
          pathRewrite:{
            '^/api1':'/api'  // 重写地址
          }
        },
        '/api2':{
          target:'http://yesno.wtf/api',
          ws: true,
          changeOrigin: true,
          pathRewrite:{
            '^/api2':''  // 重写地址
          }
        }
      }
    },
}