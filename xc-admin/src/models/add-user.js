import { 
  queryUserApi,
  versionApi,
  versionTagsApi,
  retentionApi,
  realDataApi,
  payStateApi,
  saveStateApi,
  queryTagsApi,
  queryTagsApi2,
  userSaveApi 
} from '../services/api';

export default {
  namespace: 'addUser',

  state: {
    list: [],
    versionArr:[],
    loading: false,
  },

  effects: {
    *query({ payload, callback }, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( queryUserApi, payload)
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *getVersion({ payload, callback },{ call, put }){
      const response = yield call( versionApi, payload )
      yield put({
        type:'saveVersion',
        payload:response,
      })
    },
    *versionTagsApi({ payload, callback },{ call, put }){
      const response = yield call( versionTagsApi, payload )
      yield put({
        type:'saveVersion',
        payload:response,
      })
    },
    *retentionData({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(retentionApi, payload)
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryRealData({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( realDataApi, payload )
      callback && callback(response);
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryPayState({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( payStateApi, payload )
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *querySaveState({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( saveStateApi, payload )
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryTags({ payload, callback}, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(queryTagsApi, payload)
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryTags2({ payload, callback}, { call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(queryTagsApi2, payload)
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryUserSave({payload, callback},{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call(userSaveApi, payload)
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
  },  

  reducers: {
    saveVersion( state, { payload } ){
      const { result } = payload;
      return {
        ...state,
        versionArr:result||[],
      }
    },
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:payload.loading
      }
    },
  },
};
