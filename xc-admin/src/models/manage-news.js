import { 
  sendNewsListApi,
  someNewsApi,
  deleteNewsApi,
} from '../services/news-edit-api';

export default {
  namespace: 'manageNews',

  state: {
    queryList:[],
    pagination:{},
    loading:false,
  },
  reducers: {
    changeData( state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    saveSendNews( state, { payload }){
      const { data, index, size, total  } = payload;
      const pagination = { 
        current: index+1,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      }
      return {
        ...state,
        pagination,
        queryList:data,
        loading:false,
      }
    },
  },
  effects: {
    *querySendNews({ payload }, { call, put }){
      yield put({
        type:'changeData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( sendNewsListApi, payload );
      yield put({
        type:'saveSendNews',
        payload:response.result,
      });
    },
    *querySomeNews({ payload, callback },{ call, put }){
      const response = yield call(someNewsApi, payload);
      callback && callback(response);
    },
    *deleteNews({ payload, callback },{ call, put }){
      const response = yield call(deleteNewsApi, payload);
      callback && callback(response);
    },
  },
};
