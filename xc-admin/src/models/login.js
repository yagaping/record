import { routerRedux } from 'dva/router';
import { userLogin, userLogout, menuListApi,
  logOutApi,
} from '../services/api';
import { isSuccess, notificationError } from '../utils/common';
import Cookie from 'js-cookie';
import { getCookieUserInfo, setCookieUserInfo} from '../utils/cookie-common';


export default {
  namespace: 'login',

  state: {
    menuConfig: [
      {
        
      }
    ],
    currentUser:'',
    status: -1, // -1 未登录 0 登录
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(userLogin, payload);
     
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (isSuccess(response)) {
        yield put({
          type:'saveCurrentUser',
          payload:response.result,
        });
        // save cookie
         // 获取菜单
        const menuList = yield call(menuListApi, {});
        setCookieUserInfo(response);
        localStorage.setItem('menuList',JSON.stringify(menuList.result));
        // router push home '/home'
        if (response.message === null || response.message === undefined || response.message.length === 0) {
          yield put(routerRedux.push('/'));
        } else if (response.message.length) {
          yield put(routerRedux.push(response.message));
          // yield put(routerRedux.push('/'));
        }
      } else if (callback) {
        // notificationError(response);
        // callback
        callback(response);
      }
    },
    *logout(_, { call, put }) {
      yield call(logOutApi, _);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      Cookie.remove('USER_INFO');//删除登录cookie
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }){
    const currentUser = {
      name:payload.username,
      avatar:null,
      userid:payload.id,
    };
    localStorage.setItem('currentUser',JSON.stringify(currentUser));
      return {
        ...state,
        currentUser,
      };
    },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.code,
        userInfo: payload.result,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
  subscriptions: {
    
    loginStatus({ dispatch, history }) {
      const cookieUserInfo = getCookieUserInfo();
      if (cookieUserInfo && cookieUserInfo.code === 0) {
        dispatch({
          type: 'changeLoginStatus',
          payload: cookieUserInfo,
        });
      } else {
        if(history.location.pathname.lastIndexOf('/user/login')==-1){
          history.push('/user/login');
        }
      }
    },
  },
};
