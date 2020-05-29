import { 
  articleList,
  deleteArticle,
  addArticleApi,
  modifyArticleApi
 } from '../services/api';


export default {
  namespace: 'article',

  state: {
    data:{
      dataList:[],
      total:0
    }
  },

  effects: {
    *query({ payload, callback}, { call, put }){
      const res = yield  call(articleList, payload);
      callback && callback( res );
      yield put({
        type:'saveList',
        payload:res
      })
    },
    *delete({ payload, callback },{ call, put }){
      const res = yield call( deleteArticle, payload );
      callback && callback( res );
    },
    *addArticle({ payload, callback }, { call, put }){
      const res = yield call( addArticleApi, payload );
      callback && callback(res);
    },
    *modifyArticle({ payload, callback }, { call, put }){
      const res = yield call( modifyArticleApi, payload );
      callback && callback(res);
    }
  },

  reducers: {
    saveList(state, { payload }){
      return {
        ...state,
        ...payload
      }
    },
  },
};
