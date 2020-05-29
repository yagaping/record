import { queryRole } from '../services/systemManage/bkAccout';

export default {
  namespace: 'roleData',

  state: {
    data: {
      roleList: [],
    },
  },

  effects: {
      //查询所有角色
      *allRole({ payload, callback }, { call, put }) {
        const response = yield call(queryRole, payload);
        yield put({
          type: 'searchRoleData',
          payload: response,
        });
        if (callback && response) callback(response);
      }
  },

  reducers: {
    searchRoleData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
