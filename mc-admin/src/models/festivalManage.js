import { queryFestival, festivalUpload } from '../services/discovery/festival';
export default {
    namespace: 'festivalManage',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //节日节气
        *queryFestival({ payload, callback }, { call, put }) {
            const response = yield call(queryFestival, payload);
            yield put({
                type: '_festivalList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *festivalUpload({ payload, callback }, { call, put }) {
            const response = yield call(festivalUpload, payload);
            // yield put({
            //     type: 'save',
            //     payload: response,
            // });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _festivalList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
