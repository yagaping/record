import { 
  userfeedbackListApi,
  deleteApi,
  detailApi,
 } from '../services/api';

export default {
  namespace: 'userFeedback',

  state: {
    list: [],
    pagination:{},
    loading: true,
  },

  effects: {
    *queryUserFeedbackList({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true,
        }
      })
      const response = yield call(userfeedbackListApi, payload)
      yield put({
        type:'saveUserFeedbackList',
        payload:response,
      })
      callback && callback(response)
    },
    *delete({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(deleteApi, payload)
      callback && callback(response);
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryDetail({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(detailApi, payload )
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
  },

  reducers: {
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      }
    },
    saveUserFeedbackList( state, { payload }){
      const { data, total,index,size, } = payload.result;
      const pagination = { 
        current: index+1,
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
