import { revisePwd } from '../services/systemManage/bkAccout';
export default {
    namespace: 'changePwd',

    state: {
        data: {
            // dataList: [],
            // pagination: {},
        },
    },

    effects: {
         //修改密码
        *ChangePwd({ payload, callback }, { call, put }) {
            const response = yield call(revisePwd, payload);
            yield put({
                type: '_changePwd',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _changePwd(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
