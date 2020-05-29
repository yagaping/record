import { getAllPermission } from '../services/systemManage/bkAccout';
export default {
    namespace: 'authority',

    state: {
        data: {
            children: [],
        },
    },

    effects: {
        //获取所有权限
        *getAllPermission({ payload, callback }, { call, put }) {
            const response = yield call(getAllPermission, payload);
            yield put({
                type: '_queryAllPermission',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _queryAllPermission(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
