import { queryCard, changeCard } from '../services/time/timeCard';
export default {
    namespace: 'timeCard',

    state: {
        data: {
            tabListIos: [],
            tabListAz: [],
        },
    },

    effects: {
         //卡片管理
        *queryCard({ payload, callback }, { call, put }) {
            const response = yield call(queryCard, payload);
            yield put({
                type: '_cardList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *changeCard({ payload, callback }, { call, put }) {
            const response = yield call(changeCard, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _cardList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
