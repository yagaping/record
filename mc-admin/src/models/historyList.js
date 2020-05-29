import { queryHistoryList, addHistoryList, modifyHistoryList, removeHistoryList, peopleExamine } from '../services/discovery/risingKnowledge';
export default {
    namespace: 'historyList',

    state: {
        data: {
            dataList: [],
        },
    },

    effects: {
        //历史事件查询
        *findAffair({ payload,callback }, { call, put}) {
            const response = yield call(queryHistoryList, payload);
            yield put({
                type: 'historyList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addAffair({ payload,callback }, { call, put}) {
            const response = yield call(addHistoryList, payload);
            if (callback && response) callback(response);
        },
        *modifyAffair({ payload,callback }, { call, put}) {
            const response = yield call(modifyHistoryList, payload);
            if (callback && response) callback(response);
        },
        *removeAffair({ payload,callback }, { call, put}) {
            const response = yield call(removeHistoryList, payload);
            if (callback && response) callback(response);
        },
        *peopleExamine({ payload,callback }, { call, put}) {
            const response = yield call(peopleExamine, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        historyList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
