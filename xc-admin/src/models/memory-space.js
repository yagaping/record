import { 
  memorySpaceListApi,
 } from '../services/api';

export default {
  namespace: 'memorySpace',

  state: {
    list: [],
    pagination:{},
    loading: true,
  },

  effects: {
    *queryMemorySpaceList({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true,
        }
      })
      const response = yield call(memorySpaceListApi, payload)
      yield put({
        type:'saveMemorySpaceList',
        payload:response,
      })
      callback && callback(response)
    },
  },

  reducers: {
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      }
    },
    saveMemorySpaceList( state, { payload }){
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
