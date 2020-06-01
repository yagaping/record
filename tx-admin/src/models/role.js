import { roleList, editRoleState, editRole, addRole, roleRemove, findPermission} from '../services/systemManage/bkAccout';

export default {
  namespace: 'role',

  state: {
    data: {
      dataList: [],
      totla: 0
    },
  },

  effects: {
      //查询角色
      *fetchRoleList({ payload, callback }, { call, put }) {
        const response = yield call(roleList, payload);
        yield put({
          type: 'queryRoleList',
          payload: response,
        });
        if (callback && response) callback(response);
      },
      *editRoleState({ payload, callback }, { call, put }) {
        const response = yield call(editRoleState, payload);
        if (callback && response) callback(response);
      },
      *editRole({ payload, callback }, { call, put }) {
        const response = yield call(editRole, payload);
        if (callback && response) callback(response);
      },
      *addRole({ payload, callback }, { call, put }) {
        const response = yield call(addRole, payload);
        if (callback && response) callback(response);
      },
      *roleRemove({ payload, callback }, { call, put }) {
        const response = yield call(roleRemove, payload);
        if (callback && response) callback(response);
      },
      //查询初始所有权限
      *findPermission({ payload, callback }, { call, put }) {
        const response = yield call (findPermission, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback && response) callback(response);
      },
  },

  reducers: {
    queryRoleList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
