import { queryPeriod, addPeriod, modifyPeriod, removePeriod } from '../services/discovery/period';
export default {
    namespace: 'period',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //经期小贴士
        *findPeriod({ payload,callback }, { call, put}) {
            const response = yield call(queryPeriod, payload);
            yield put({
                type: 'period',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addPeriod({ payload,callback }, { call, put}) {
            const response = yield call(addPeriod, payload);
            if (callback && response) callback(response);
        },
        *modifyPeriod({ payload,callback }, { call, put}) {
            const response = yield call(modifyPeriod, payload);
            if (callback && response) callback(response);
        },
        *removePeriod({ payload,callback }, { call, put}) {
            const response = yield call(removePeriod, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        period(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
