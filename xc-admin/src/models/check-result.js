import { 
  resultApi, 
} from '../services/check-result-api';

export default {
  namespace: 'checkResult',

  state: {
    checkResultData:[],
    loading:false,
  },

  reducers: {
    changeDataLoading( state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    resultSave( state, { payload }){
      let checkResultData = payload;
      for(let i=0;i<checkResultData.length;i++){
        checkResultData[i].id = i+1;
      }
      return {
        ...state,
        checkResultData,
        loading:false,
      };
    },
  },
  effects: {
    *queryResult( { payload }, { call, put }){
      yield put({
        type:'changeDataLoading',
        payload:{
          loading:true,
        },
      });
       const  response = yield call(resultApi, payload );
       yield put({
         type:'resultSave',
         payload:response.result,
       });
    },
  }
};
