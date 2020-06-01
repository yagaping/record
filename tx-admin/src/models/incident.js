import { findIncident, addIncident, updateIncident, deleteIncident, pageNameGet } from '../services/systemManage/log';
export default {
    
    namespace: 'incident',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //事件管理
        *getIncidentList({ payload, callback }, { call, put }) {
            const response = yield call(findIncident, payload);
            yield put({
                type: '_getIncidentList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addIncidentList({ payload, callback }, { call, put }) {
            const response = yield call(addIncident, payload);
            if(callback && response) callback(response);
        },
        *updateIncidentList({ payload, callback }, { call, put }) {
            const response = yield call(updateIncident, payload);
            if(callback && response) callback(response);
        },
        *deleteIncidentList({ payload, callback }, { call, put }) {
            const response = yield call(deleteIncident, payload);
            if(callback && response) callback(response);
        },

        *getPageName({ payload, callback }, { call, put }) {
            const response = yield call(pageNameGet, payload);
            if(callback && response) callback(response);
        }
    },

    reducers: {
        _getIncidentList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}