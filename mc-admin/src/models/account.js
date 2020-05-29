import { queryUser, addUser, removeUser, resetPwd, editUser, editUserState } from '../services/systemManage/bkAccout';
export default {
    namespace: 'account',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(queryUser, payload);
            yield put({
              type: 'searchAccount',
              payload: response,
            });
            if (callback && response) callback(response);
        },
        *add({ payload, callback }, { call, put }) {
          const response = yield call(addUser, payload);
          if (callback && response) callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
          const response = yield call(removeUser, payload);
          if (callback && response) callback(response);
        },
        *reset({ payload, callback }, { call, put }) {
          const response = yield call(resetPwd, payload);
          if (callback && response) callback(response);
        },
        *edit({ payload, callback }, { call, put }) {
          const response = yield call(editUser, payload);
          if (callback && response) callback(response);
        },
        *editState({ payload, callback }, { call, put }) {
          const response = yield call(editUserState, payload);
          if (callback && response) callback(response);
        },
    },

    reducers: {
        searchAccount(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
