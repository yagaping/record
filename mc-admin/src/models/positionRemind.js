import { getPoiont } from '../services/discovery/positionRemind';
export default {
    
    namespace: 'positionRemind',

    state: {
        data: {
            PositionRecordPage: {
                records: []
            },
            PositionRemindPage: []
        },
    },

    effects: {
        //地图散点
        *getPoint({ payload, callback }, { call, put }) {
            const response = yield call(getPoiont, payload);
            yield put({
                type: '_getPoint',
                payload: response,
            });
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getPoint(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}