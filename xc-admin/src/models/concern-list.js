import { 
  concernListApi, 
  deleteApi, 
  concernDetailApi,
  stayConcernApi,
  deleteStayApi,
  concernTypeApi,
  addConcernApi,
  modifeApi,
} from '../services/concern-list-api';


export default {
  namespace: 'concernList',
  state: {
    concernList:[],
    concernDetailList:[],
    concernTypeData:[],
    loading:false,
    pagination:{},
  },

  reducers: {

    // 更改加载状态
    changeLoading(state, { payload }) {
      const { loading } = payload;
      return {
        ...state,
        loading, 
      };
    },
    saveConcernList( state, { payload }){
      const { data, index, size, total } = payload;
      const pagination = {
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        concernList:data,
        pagination,
        loading:false,
      }
    },
    saveConcernDetail( state, { payload }){
      const { data, index, size, total } = payload;
      const pagination = {
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
       return {
        ...state,
        pagination,
        loading:false,
        concernDetailList:data,
      };
    },
    saveStayConcern(state, { payload }){
      const { data, index, size, total } = payload;
      const pagination = {
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        concernList:data,
        pagination,
        loading:false,
      }
    },
    saveConcernType(state, { payload }){

      return {
        ...state,
        concernTypeData:Object.keys(payload).length?payload:[],
      }
    },
   
  },

  effects: {
    *queryConcern({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( concernListApi, payload );
      yield put({
        type:'saveConcernList',
        payload:response.result,
      });
    },
    *delete({ payload, callback }, { call, put }){
      const response = yield call(deleteApi, payload );
      callback && callback(response);
    },
    *queryConcernDetail({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( concernDetailApi, payload );
      yield put({
        type:'saveConcernDetail',
        payload:response.result,
      });
    },
    *queryStayConcern({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(stayConcernApi, payload);
      yield put({
        type:'saveStayConcern',
        payload:response.result,
      });
    },
    *deleteStay({ payload, callback }, { call, put }){
      const response = yield call( deleteStayApi, payload );
      callback && callback(response);
    },
    *concernType({ payload },{ call, put }){
      const response = yield call(concernTypeApi, payload);
      yield put({
        type:'saveConcernType',
        payload:response.result,
      });
    },
    *addConcern({ payload, callback },{ call, put }){
  
      const response = yield call( addConcernApi, payload );
      callback && callback(response);
    },
    *modifieData({ payload, callback }, { call, put }){
      const response = yield call( modifeApi, payload );
      callback && callback(response);
    },
  }  
};

