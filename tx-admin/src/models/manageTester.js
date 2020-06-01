import { 
  queryTesterDataApi,
  addTesterApi,
  updateTesterApi,
  deleteTesterApi
} from '../services/xiaoCheng/testerManage';
export default {
  namespace: 'manageTester',

  state: {
      data: {
          dataList: [],
          pagination:{},
      },
      loading:false,
  },
  reducers: {
    changeLoading(state, { _ }){
      return {
        ...state,
        loading:true,
      }
    },
    saveData( state, { payload }){
      const { dataList,pageNum, pageSize,total } = payload.data;
      return {
        ...state,
        data:{
          dataList,
          pagination:{
            pageSize,
            current:pageNum,
            total,
            showTotal:(total)=>`共 ${total} 条`,
            showQuickJumper:true,
            showSizeChanger:true,
          },
        },
        loading:false,
      }
    },
  },
  effects: {
    *queryData({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
      })
      const response = yield call( queryTesterDataApi, payload );
      yield put({
        type:'saveData',
        payload:response,
      })
      callback && callback(response);
    },
    *addTester({ payload, callback },{ call, put }){
      const response = yield call(addTesterApi, payload )
      callback && callback(response);
    },
    *updateData({ payload, callback },{ call, put }){
      const response = yield call(updateTesterApi, payload)
      callback && callback(response)
    },
    *deleteTester({ payload, callback },{call, put }){
      const response = yield call(deleteTesterApi, payload)
      callback && callback(response);
    },
  },
};
