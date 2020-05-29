import { getEventList, getEventStatus } from '../services/discovery/eventRemind';
export default {
    
    namespace: 'eventList',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //事件列表
        *getEventList({ payload, callback }, { call, put }) {
            const response = yield call(getEventList, payload);
            yield put({
                type: '_eventList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *eventStatus({ payload, callback }, { call, put }) {
            const response = yield call(getEventStatus, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _eventList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}