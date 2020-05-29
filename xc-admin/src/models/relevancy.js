import { 
  shiwuDataApi,
  parentItemApi,
  updatefuziApi
 } from '../services/api';

export default {
  namespace: 'relevancy',

  state: {
    list: [],
    pagination:{},
    loading: true,
  },

  effects: {
    *query({ payload, callback}, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true,
        }
      })
      const response = yield call(shiwuDataApi, payload)
      callback && callback( response )
      yield put({
        type:'loadingChange',
        payload:{
          loading:false,
        }
      })
    },
    *addParentItem({ payload, callback },{ call, put }){
      const response = yield call(parentItemApi,payload)
      callback && callback(response)
    },
    *updatefuzi({ payload, callback }, {call, put }){
      const response = yield call(updatefuziApi, payload)
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
  },
};
