import { queryWeather, uploadWeather } from '../services/discovery/weather';
export default {
    namespace: 'weatherManage',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
         //天气
        *queryWeather({ payload, callback }, { call, put }) {
            const response = yield call(queryWeather, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *uploadWeather({ payload, callback }, { call, put }) {
            const response = yield call(uploadWeather, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
