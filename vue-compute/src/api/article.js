import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const article = {    
    // 新闻列表    
    articleList (params) {        
        return axios.get(`/api1/v1/q_skw`,{params});    
    },    
    // 新闻详情,演示    
    articleDetail (id, params) {        
        return axios.get(`${base.sq}/movie/top250/${id}`, {            
            params: params        
        });    
    },
    // post提交    
    login (params) {        
        return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));    
    },
    // 其他接口
    auidoList ( params ){
      return axios.post(`${base.i4}/v1/q_cols`,qs.stringify(params))
    },
    search( params ){
        return axios.post(`/api2`,qs.stringify(params))
    },
}

export default article;