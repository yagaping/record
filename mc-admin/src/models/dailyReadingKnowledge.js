import { 
  queryDataApi,
  queryTypeApi,
  addDataApi,
  modifeDataApi,
  deleteApi
 } from '../services/discovery/risingKnowledge';

export default {
  namespace: 'dailyReadingKnowledge',

  state: {
    loading:false,
    data:{
      list:[],
    },
    typeData:[],
    pagination:{
    },
    loading:false,
    test:1,
  },
  reducers: {
    changeData(state,{_}){
      return {
        ...state,
        loading:true,
      }
    },
    queryDataSave(state, { payload }){
      if(payload.code != 0 || !Object.keys(payload.data).length){
        return {
          ...state,
          loading:false,
        }
      }
      const { dataList,pageNum,pageSize,total } = payload.data.data; 
      return {
        ...state,
        data:{
          list:dataList||[],
        },
        pagination:{
          pageSize,
          current:pageNum,
          total,
          showTotal:(total)=>`共 ${total} 条`,
          showQuickJumper:true,
          showSizeChanger:true,
        },
        loading:false,
      }
    },
    saveType( state, { payload }){
      if(payload.code !=0||!Object.keys(payload.data).length){
        return {
          ...state
        }
      }
      return {
        ...state,
        typeData:payload.data,
      }
    },
  },
  effects: {
    *queryData({ payload ,callback },{ call, put }){
      yield put({
        type:'changeData'
      })
      const response = yield call(queryDataApi, payload )
      yield put({
        type:'queryDataSave',
        payload:response,
      })
      callback && callback(response)

    },
    *queryType({ payload, callback},{ call, put }){
      const response = yield call(queryTypeApi, payload );
      yield put({
        type:'saveType',
        payload:response,
      })
      callback && callback(response);
    },
    *addData({ payload, callback },{ call, put }){
      const response = yield call(addDataApi, payload )
      callback && callback(response)
    },
    *modifeData({ payload, callback },{ call, put }){
      const response = yield call(modifeDataApi, payload );
      callback && callback(response)
    },
    *deleteData({ payload, callback },{ call, put }){
      const response = yield call(deleteApi, payload )
      callback && callback(response);
    },
    *publishData({ payload, callback },{ call, put }){
      const response = yield call(publishApi, payload);
      callback && callback(response);
    },
  },
};
