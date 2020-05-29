
import {
  query,
  byDateQuery,
} from '../services/news-audit';

export default {
  namespace: 'newsAudit',
  state: {
      list:{
        successData:{
        },
        errorData:{
        }
      },
      queryList:{
        successData:{
        },
        errorData:{
        }
      },
    loading:false,
  },

  reducers: {
    changeLoading(state,{ payload }){
      return {
        ...state,
        loading:payload.loading
      }
    },
    querySuccess(state, {payload} ) {
      const { successData, errorData } = payload;
      let list = {
        successData,
        errorData
      };
      return {
        ...state,
        list,
        loading:false,
      };
    },
    byDateSuccess(state,{ payload }){
      const { errorData, successData } = payload;
      let queryList = {
      errorData,
      successData
      };
      return {
        ...state,
        queryList,
        loading:false,
      }
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(query, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload:response.result,
        });
      }
    },
    *byDate({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(byDateQuery, payload );
      callback && callback(response);
      yield put({
        type:'byDateSuccess',
        payload:response.result,
      });
    },
  },
};

