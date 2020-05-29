import { 
  queryApi, 
  deleteRowApi,
  errorDataApi,
  deleteErrorApi,
} from '../services/platform-api';

export default {
  namespace: 'platform',
  state:{
    userBack:{
      index: 0,
      list: [],
      pagination: {},
    },
    errorData:{
      list:[],
      pagination: {},
    },
    loading: false,
  },
  reducers:{
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    querySuccess( state , { payload } ){

        const { data, size, total, index } = payload;
        const pagination = {
          current: index + 1,
          pageSize: size,
          total,
        };
        return {
          ...state,
          userBack:{
            index,
            list:data,
            pagination,
          },
          loading:false,
        }
    },
    saveError(state , { payload }){
    
      const { data, size, total, index } = payload;
      const pagination = {
        current: index,
        pageSize: size,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
      };
      return {
        ...state,
        errorData:{
          list:data,
          pagination,
        },
        loading:false,
      }
    },
  },
  effects:{
    *query({ payload },{ call, put }){
        yield put({
          type: 'changeTableLoading',
          payload: {
            loading: true,
          },
        });
        const response = yield call( queryApi, payload );
        if( response.code === 0 ){
            yield put({
              type:'querySuccess',
              payload:response.result,
            });
        }
    },
    *deleteRow({ payload, callback }, { call, put }){
      const response = yield call(deleteRowApi, payload );
      callback && callback(response);
    },
    *errorList({ payload, callback }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(errorDataApi, payload );
      yield put({
        type:'saveError',
        payload:response.result,
      });
    },
    *deleteError({ payload, callback }, { call, put }){
      const response = yield call( deleteErrorApi, payload );
      callback && callback(response);
    },
  },
};

