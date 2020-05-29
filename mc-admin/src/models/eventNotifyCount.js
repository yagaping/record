import { eventNotifyCount, } from '../services/discovery/eventRemind';
export default {
    namespace: 'eventNotifyCount',

    state: {
        data: {
            dataList: [[],[]],
            total: 0
        },
    },

    effects: {
         //用户统计
         *findAll({ payload, callback }, {call, put}) {
            const response = yield call(eventNotifyCount, payload);
            yield put({
                type: '_eventNotifyCount',
                payload: response,
            });
            if( callback ) callback(response);
        },
    },

    reducers: {
        _eventNotifyCount(state, { payload }) {
            return {
                ...state,
               ...payload,
            };
        },
    },
};
