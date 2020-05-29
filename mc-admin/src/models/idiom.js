import { idiomListAdd, idiomListDelete, idiomListUpdate, idiomList, publishIdiom } from '../services/discovery/risingKnowledge';
export default {
    
    namespace: 'idiom',

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
        *getIdiomList({ payload, callback }, { call, put }) {
            const response = yield call(idiomList, payload);
            yield put({
                type: '_getIdiomList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *deleteIdiomList({ payload, callback }, { call, put }) {
            const response = yield call(idiomListDelete, payload);
            if(callback && response) callback(response);
        },
        *addIdiomList({ payload, callback }, { call, put }) {
            const response = yield call(idiomListAdd, payload);
            if(callback && response) callback(response);
        },
        *updateIdiomList({ payload, callback }, { call, put }) {
            const response = yield call(idiomListUpdate, payload);
            if(callback && response) callback(response);
        },
        *publish({ payload, callback }, { call, put }) {
            const response = yield call(publishIdiom, payload);
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getIdiomList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}