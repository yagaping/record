import { parse } from 'qs';
import { 
  queryNoticeApi,
  appVersionApi,
  addNoticeApi 
} from '../services/api';

export default {
  namespace: 'notice',

  state: {
    list: [],
    pagination: {},
    appVersion:[],
    loading: false,
  },

  effects: {
    *queryNotice({ payload, callback },{ call, put }){
      const response = yield call( queryNoticeApi, payload )
      yield put({
        type:'saveNotice',
        payload:response
      })
    },
    *queryAppVersion({ payload, callback},{ call, put }){
      const response = yield call(appVersionApi, payload )
      yield put({
        type:'saveAppVersion',
        payload:response
      })
    },
    *addNotice({ payload, callback },{ call, put }){
      const response = yield call( addNoticeApi, payload )
      callback && callback(response)
    },
  },

  reducers: {
    saveNotice( state, { payload }){
      const { data, index, size, total } = payload.result;
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
        pagination
      }
    },
    saveAppVersion( state, { payload }){
      const { result } = payload;
      return {
        ...state,
        appVersion:result
      }
    },
  },
};
