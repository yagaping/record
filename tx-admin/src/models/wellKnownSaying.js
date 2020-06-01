import { quotesAdd, quotesDelete, quotesUpdate, quotes, publishQuotes} from '../services/discovery/risingKnowledge';
export default {
    
    namespace: 'wellKnownSaying',

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
        *getQuotes({ payload, callback }, { call, put }) {
            const response = yield call(quotes, payload);
            yield put({
                type: '_getIncidentList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addQuotes({ payload, callback }, { call, put }) {
            const response = yield call(quotesAdd, payload);
            if(callback && response) callback(response);
        },
        *updateQuotes({ payload, callback }, { call, put }) {
            const response = yield call(quotesUpdate, payload);
            if(callback && response) callback(response);
        },
        *deleteQuotes({ payload, callback }, { call, put }) {
            const response = yield call(quotesDelete, payload);
            if(callback && response) callback(response);
        },
        *publish({ payload, callback }, { call, put }) {
            const response = yield call(publishQuotes, payload);
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