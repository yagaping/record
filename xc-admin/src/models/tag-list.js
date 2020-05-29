import { 
  tagListApi, deleteTagApi,parentTagListApi,
  addTagApi,
  updateTagApi
 } from '../services/api';

export default {
  namespace: 'tagList',

  state: {
    list: [],
    pagination:{},
    loading: true,
    parentTag:[],
  },

  effects: {
    *queryList({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
      })
      const response = yield call(tagListApi, payload)
      yield put({
        type:'saveList',
        payload:response,
      })
      callback && callback(response)
    },
    *delete({ payload, callback }, { call, put }){
      const response = yield call( deleteTagApi, payload )
      callback && callback( response )
    },
    *parentTag({ payload, callback }, { call, put }){
      const response = yield call(parentTagListApi, payload);
      yield put({
        type:'saveParentTag',
        payload:response,
      })
      callback && callback( response )
    },
    *addTag({ payload, callback },{ call, put }){
      const response = yield call(addTagApi, payload )
      callback && callback( response )
    },
    *updateTag({payload, callback}, { call, put }){
      const response = yield call(updateTagApi, payload )
      callback && callback( response )
    },
  },

  reducers: {
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:true,
      }
    },
    saveList( state, { payload }){
      const { data, total, index, size, } = payload.result;
      const pagination = { 
        current: index+1,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      }
      return {
        ...state,
        list:data,
        pagination,
        loading:false,
      }
    },
    saveParentTag( state, { payload }){
      const { result:{result} } = payload;
      return {
        ...state,
        parentTag:result
      }
    },
  },
};