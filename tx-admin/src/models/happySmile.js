import { happySmileAdd, happySmileDelete, happySmileUpdate, happySmile, publishHappySmile } from '../services/discovery/risingKnowledge';
export default {
    
    namespace: 'happySmile',

    state: {
        data: {
            data: {
                dataList: [],
                total: 0
            }
        },
    },

    effects: {
        //事件管理
        *getHappySmile({ payload, callback }, { call, put }) {
            const response = yield call(happySmile, payload);
            yield put({
                type: '_getIncidentList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addHappySmile({ payload, callback }, { call, put }) {
            const response = yield call(happySmileAdd, payload);
            if(callback && response) callback(response);
        },
        *updateHappySmile({ payload, callback }, { call, put }) {
            const response = yield call(happySmileUpdate, payload);
            if(callback && response) callback(response);
        },
        *deleteHappySmile({ payload, callback }, { call, put }) {
            const response = yield call(happySmileDelete, payload);
            if(callback && response) callback(response);
        },
        *publish({ payload, callback }, { call, put }) {
            const response = yield call(publishHappySmile, payload);
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getIncidentList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}