import { queryPayment } from '../services/operateManage/payList';
export default {
    namespace: 'payment',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //头条推送中查询
        *getPaymentList({ payload,callback }, { call, put}) {
            const response = yield call(queryPayment, payload);
            yield put({
                type: '_getPaymentList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _getPaymentList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
