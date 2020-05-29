import { findByChoose, saveChoose, deleteChoose, modifyChoose } from '../services/discovery/eventRemind';
export default {
    
    namespace: 'eventName',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //事件名称
        *findByChoose({ payload, callback }, { call, put }) {
            const response = yield call(findByChoose, payload);
            yield put({
                type: '_eventName',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *saveChoose({ payload, callback }, { call, put }) {
            const response = yield call(saveChoose, payload);
            if(callback && response) callback(response);
        },
        *deleteChoose({ payload, callback }, { call, put }) {
            const response = yield call(deleteChoose, payload);
            if(callback && response) callback(response);
        },
        *modifyChoose({ payload, callback }, { call, put }) {
            const response = yield call(modifyChoose, payload);
            if(callback && response) callback(response);
        }
    },

    reducers: {
        _eventName(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}