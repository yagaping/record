import {
  queryNavList,
  addNewApi,
  navEditApi,
  deleteApi,
} from '../services/nav-manage';

export default {
  namespace: 'navManage',
  state: {
    navList:{
      list:[],
      pagination:{},
    },
    loading:false,
  },

  reducers: {
    changeTableLoaing( state, { payload } ){
      return {
        ...state,
        loading:payload,
      };
    },
    queryNavListSuccess(state,{ payload }){
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
        navList:{
          list:data,
          pagination
        },
        loading:false,
      }
    },
  },

  effects: {
    *queryNavList( { payload }, { call, put }){
      yield put({
        type:'changeTableLoaing',
        payload:true,
      });

      const response = yield call( queryNavList, payload );
 
      if(response.code === 0){
        yield put({
          type:'queryNavListSuccess',
          payload:response.result,
        });
      }
    },
    *addNew({ payload, callback },{ call, put }){
      const response = yield call(addNewApi, payload);
      callback && callback(response);
    },
    *navEdit( { payload, callback }, { call, put } ){
      const response = yield call( navEditApi, payload);
      callback && callback(response);
    },
    *delete({ payload, callback }, { call, put }){
      const response = yield call( deleteApi, payload );
      callback && callback(response);
    },  
  },
};

