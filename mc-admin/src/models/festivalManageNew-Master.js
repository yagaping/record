import { newQueryFestival, newFestivalUpDate, newFestivalUpload } from '../services/discovery/festival';
export default {
    namespace: 'festivalManageNew',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //新节日节气
        *queryFestival({ payload, callback }, { call, put }) {
            const response = yield call(newQueryFestival, payload);
            yield put({
                type: '_newQueryFestival',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *festivalUpDate({ payload, callback }, { call, put }) {
            const response = yield call(newFestivalUpDate, payload);
            if (callback && response) callback(response);
        },
        *festivalUpLoad({ payload, callback }, { call, put }) {
            const response = yield call(newFestivalUpload, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _newQueryFestival(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
