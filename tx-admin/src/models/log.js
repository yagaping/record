import  { getLog } from '../services/systemManage/log';

export default {
    namespace: 'log',

    state: {
        data: {
            total: 0,
            list: []
        }
    },

    effects: {
        *getLogList({ payload, callback }, { call, put }) {
            const response = yield call(getLog, payload);
            yield put({
                type: '_getLogList',
                payload: response
            });
            if(callback && response) callback(response);
        }
    },

    reducers: {
        _getLogList(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}