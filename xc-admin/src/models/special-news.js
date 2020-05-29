import { 
  specialApi,
  deleteSpecialApi,
  detailApi,
  deleteDetaiApi,
  modifeSpecialApi,
  updateSpecialApi,
} from '../services/special-news-api';
import { modifeApi } from '../services/concern-list-api';

export default {
  namespace: 'specialNews',

  state: {
    speicalData:[],
    detailData:[],
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
    saveSpecial( state, { payload }){
      const { data, index, size, total, } = payload; 
      const pagination ={
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        pagination,
        speicalData:data,
        loading:false,
      }
    },
    saveDetail( state, { payload }){
      const { data, index, size, total, } = payload; 
      const pagination ={
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        detailData:data,
        pagination,
        loading:false,
      }
    },
  },
  effects: {
    *querySpecial({ payload }, { call, put }){
      yield put({
        type:'changeData',
        payload:{
          loading:true,
        },
      });
      const response = yield call(specialApi, payload);
      yield put({
        type:'saveSpecial',
        payload:response.result
      });
    },
    *deleteSpecial({ payload, callback }, { call, put }){
      const response = yield call( deleteSpecialApi, payload );
      callback && callback(response);
    },
    *queryDetail( { payload, callback }, { call, put }){
      yield put({
        type:'changeData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( detailApi, payload );
      yield put({
        type:'saveDetail',
        payload:response.result
      });
    },
    *deleteDetail({ payload, callback }, { call, put }){
      const response = yield call( deleteDetaiApi, payload );
      callback && callback(response);
    },
    *modifieData({payload, callback}, { call, put }){
      const response = yield call(modifeSpecialApi, payload);
      callback && callback(response);
    },
    *updateSpecial({ payload, callback },{ call, put }){
      const response = yield call( updateSpecialApi, payload );
      callback && callback(response);
    },
  },
};
