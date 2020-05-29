import { findModuleName } from '../services/systemManage/log';
export default {
    
    namespace: 'module_Name',

    state: {
        data: {
            data: [],
        },
    },

    effects: {
        //模块名称
        *getModuleName({ payload, callback }, { call, put }) {
            const response = yield call(findModuleName, payload);
            yield put({
                type: '_getModuleName',
                payload: response,
            });
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getModuleName(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}