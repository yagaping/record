import  { getDataLog } from '../services/systemManage/log';

export default {
    namespace: 'commonLog',

    state: {
        data: {
            total: 0,
            list: []
        }
    },

    effects: {
        *getLog({ payload, callback }, { call, put }) {
            const response = yield call(getDataLog, payload);
            yield put({
                type: '_getLog',
                payload: response
            });
            if(callback && response) callback(response);
        }
    },

    reducers: {
        _getLog(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
