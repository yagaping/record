import { query as queryUsers, queryCurrent } from '../services/user';
import { getMenu } from '../services/menu';
import {getMenuData} from "../common/menu";

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menuData: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      const response = {
        name: '测试用户',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        notifyCount: 12,
      };
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    //菜单
    *getMenu({ payload, callback }, { call, put }) {
      const response = yield call(getMenu, payload);
      if(response && response.code == '0') {
        const menus = getMenuData(response.data.menu)
        yield put({
          type: 'saveMenus',
          payload: menus,
        });
      }
      if (callback && response) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveMenus(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
