import { routerRedux } from 'dva/router';
import { fakeAccountLogin, loginOut, getCodeApi, codeLoginApi } from '../services/systemManage/bkAccout';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response1 = yield call(fakeAccountLogin, payload);
      callback && callback(response1)
      if(response1) {
        const response = response1 && response1.data;
        yield put({
          type: 'changeLoginStatus',
          payload: response1.code == '-1' ? payload : response,
        });
        let realName = response.realName || -1;
        let userId = response.id || -1;
        if( response.isChange === 1 ){
          realName = -1;
          userId = -1;
        }
        localStorage.setItem('realName', JSON.stringify(realName)); 
        localStorage.setItem('userId', JSON.stringify(userId)); 
        // Login successfully
        if (response.status === 'ok' && response.isChange === 0) {
          reloadAuthorized();
          if(response.isFirst === 0){
            yield put(routerRedux.push('/systemManagement/change-pwd'));
          }else{
            yield put(routerRedux.push('/indexPage'));
          }
          
        }
      }
    },
    *getCode({payload,callback},{ call, put }){
      const response = yield call(getCodeApi, payload)
      callback && callback(response)
    },
    *codeLogin({ payload, callback},{ call, put }){
      const response = yield call(codeLoginApi, payload);
      const { data } = response;
      callback && callback(response);
      if(data && data.status === 'ok'){
          localStorage.setItem('realName', JSON.stringify(data.realName||-1)); 
          localStorage.setItem('userId', JSON.stringify(data.id||-1)); 
          reloadAuthorized();
          yield put(routerRedux.push('/indexPage'));
      }
    },
    *logout({ payload }, {call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        const response = yield call(loginOut, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
        localStorage.removeItem('realName'); 
        localStorage.removeItem('userId'); 
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        isChange:payload.isChange,
        status: payload.status,
        type: payload.type,
        currentUser: payload.realName,
        userName:payload.currentAuthority
      };
    },
  },
};
