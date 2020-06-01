import { findPermission } from '../services/systemManage/bkAccout';

export default {
  namespace: 'permission',

  state: {
    data: {
      children: [],
    },
  },

  effects: {
      //查询初始所有权限
      *findPermission({ payload, callback }, { call, put }) {
        const response = yield call (findPermission, payload);
        yield put({
          type: 'permissionData',
          payload: response,
        });
        if (callback && response) callback(response);
      },
  },

  reducers: {
    permissionData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
