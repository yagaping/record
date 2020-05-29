import { findModule, updateModule, deleteModule, addModule } from '../services/systemManage/log';
export default {
    
    namespace: 'module',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //模块管理
        *getModuleList({ payload, callback }, { call, put }) {
            const response = yield call(findModule, payload);
            yield put({
                type: '_getModuleList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addModuleList({ payload, callback }, { call, put }) {
            const response = yield call(addModule, payload);
            if(callback && response) callback(response);
        },
        *updateModuleList({ payload, callback }, { call, put }) {
            const response = yield call(updateModule, payload);
            if(callback && response) callback(response);
        },
        *deleteModuleList({ payload, callback }, { call, put }) {
            const response = yield call(deleteModule, payload);
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getModuleList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}