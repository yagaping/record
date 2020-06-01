import { weatherType } from '../services/discovery/weather';
export default {
    namespace: 'weatherType',

    state: {
        data: []
    },

    effects: {
        //天气类型
        *weatherType({ payload,callback }, { call, put}) {
            const response = yield call(weatherType, payload);
            yield put({
                type: 'weather_type',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        weather_type(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
