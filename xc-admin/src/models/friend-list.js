import { 
  friendListApi,
 } from '../services/api';

export default {
  namespace: 'friendList',

  state: {
    list: [],
    pagination:{},
    loading: true,
  },

  effects: {
    *queryFriendList({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
      })
      const response = yield call(friendListApi, payload)
      yield put({
        type:'saveFriendList',
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
    saveFriendList( state, { payload }){
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
