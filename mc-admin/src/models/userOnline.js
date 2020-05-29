import { 
  queryOnline,
  addOnlineApi,
  modOnlineApi,
  queryUserMessageApi,
  addMessageApi,
  modMessageApi,
  deleteUserOnlineApi,
  deleteUserMessageApi,
  queryBlackListApi,
  deleteBlackApi,
  addBlackApi,
  modBlackApi
} from '../services/api';
export default {
  namespace: 'userOnline',

  state: {
      data: {
          dataList: [],
          total: 0
      },
  },

  effects: {
     *queryUserList({ payload, callback }, { call, put }){
       const res = yield call( queryOnline, payload );
       yield put({
         type:'saveData',
         payload:res
       })
     },
     *addOnline({ payload, callback },{ call, put }){
       const res = yield call( addOnlineApi, payload );
       callback && callback(res);
     },
     *modOnline({ payload, callback },{ call, put }){
      const res = yield call( modOnlineApi, payload );
      callback && callback(res);
    },
    *queryUserMessage({ payload, callback},{ call, put }){
      const res = yield call( queryUserMessageApi, payload );
       yield put({
         type:'saveData',
         payload:res
       })
    },
    *addMessage({ payload, callback },{ call, put }){
      const res = yield call( addMessageApi, payload );
      callback && callback(res);
    },
    *modMessage({ payload, callback },{ call, put }){
      const res = yield call( modMessageApi, payload );
      callback && callback(res);
    },
    *deleteUserOnline({ payload, callback },{ call, put }){
      const res = yield call(deleteUserOnlineApi, payload );
      callback && callback(res);
    },
    *deleteUserMessage({ payload, callback },{ call, put }){
      const res = yield call(deleteUserMessageApi, payload );
      callback && callback(res);
    },
    *queryBlackList({ payload, callback },{ call, put }){
      const res = yield call( queryBlackListApi, payload );
       yield put({
         type:'saveData',
         payload:res
       })
    },
    *deleteBlack({ payload, callback },{ call, put }){
      const res = yield call(deleteBlackApi, payload );
      callback && callback(res);
    },
    *addBlack({ payload, callback },{ call, put }){
      const res = yield call( addBlackApi, payload );
      callback && callback(res);
    },
    *modBlack({ payload, callback },{ call, put }){
      const res = yield call( modBlackApi, payload );
      callback && callback(res);
    },
  },

  reducers: {
    saveData( state, { payload }){
      return {
        ...state,
        ...payload,
      }
    },
  },
};
