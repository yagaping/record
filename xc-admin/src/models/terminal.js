import { 
  devideApi,
  networkApi,
  arealApi,
  userTerminalApi
} from '../services/api';

export default {
  namespace: 'terminal',

  state: {
    loading:false,
  },

  effects: {
    *queryDevice({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( devideApi, payload );
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryNetwork({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const response = yield call( networkApi, payload )
      callback && callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryAreal({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true
        }
      })
      const  response = yield call(arealApi, payload)
      callback & callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
    *queryUserTerminal({ payload, callback },{ call, put }){
      yield put({
        type:'loadingChange',
        payload:{
          loading:true,
        }
      })
      const  response = yield call(userTerminalApi, payload)
      callback & callback(response)
      yield put({
        type:'loadingChange',
        payload:{
          loading:false
        }
      })
    },
  },

  reducers: {
    loadingChange( state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      }
    },
  },
};
