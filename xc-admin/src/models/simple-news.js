import {
  simpleNewsApi,
  deleteNewsApi,
} from '../services/simple-news-api';

export default {
  namespace: 'simpleNews',

  state: {
    simpleNewsList:null,
    pagination:{

    },
    loading:false,
  },

  reducers: {
    loadingData( state, { payload }){
      return {
        state,
        loading:payload.loading,
      }
    },
    //简洁新闻  
    saveSimpleNews( state, { payload }){
      const { data, total, index, size } = payload;
      const pagination = {
        total,
        current:index,
        pageSize:size,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        pagination,
        simpleNewsList:data,
        loading:false,
      };
    },
  },

  effects: {
    *querySimpleNews({ payload }, { call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
       const response = yield call( simpleNewsApi, payload );
       yield put({
         type:'saveSimpleNews',
         payload:response.result,
       });
    },
    *deleteNews({ payload, callback }, { call, put }){
      const response = yield call( deleteNewsApi, payload );
      callback && callback( response );
    },
  },
};

