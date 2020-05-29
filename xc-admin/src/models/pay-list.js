import { 
  payListApi,
 } from '../services/api';

export default {
  namespace: 'payList',

  state: {
    list: [],
    pagination:{},
    loading: true,
  },

  effects: {
    *queryPayList({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
      })
      const response = yield call(payListApi, payload)
      yield put({
        type:'savePayList',
        payload:response,
      })
      callback && callback(response)
    },
  },

  reducers: {
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:true,
      }
    },
    savePayList( state, { payload }){
      const { data, total,index,size, } = payload.result;
      const pagination = { 
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      }
      return {
        ...state,
        list:data,
        pagination,
        loading:false,
      }
    },
  },
};
