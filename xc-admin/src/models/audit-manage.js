import { 
  logDataApi
} from '../services/audit-manage-api';

export default {
  namespace: 'auditManage',

  state: {
    logList:[],
    loading:false,
  },
  reducers: {
    changeData(state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    saveLogData( state, { payload }){
      let array = [];
      let i=1;
      for(let item in payload){
        let obj = {};
        obj.name = item;
        obj.index = i;
        i++;
        obj.data = payload[item];
        array.push(obj);
      }
      
      return {
        ...state,
        logList:array,
        loading:false,
      }
    },
  },
  effects: {
    *queryLogData( { payload }, { call, put }){
      yield put({
        type:'changeData',
        payload:{
          loading:true,
        },
      });
        const response = yield call(logDataApi, payload);
        yield put({
          type:'saveLogData',
          payload:response.result,
        });
    },
  },
};
