import { weatherFind } from '../services/discovery/weather';
export default {
    namespace: 'weatherAlarm',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //天气预警
        *findWeather({ payload,callback }, { call, put}) {
            const response = yield call(weatherFind, payload);
            yield put({
                type: 'weather',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        weather(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
