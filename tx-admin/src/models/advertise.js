import { queryAdList, addAdvert, modifyState, removeAdvert, modifyAdvert } from '../services/operateManage/advertise';
export default {
    namespace: 'advertise',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //广告管理
        *queryAdList({ payload, callback }, {call, put}) {
            const response = yield call(queryAdList, payload);
            yield put({
                type: '_queryAdList',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *addAdvert({ payload, callback }, {call, put}) {
            const response = yield call(addAdvert, payload);
            if( callback ) callback(response);
        },
        *modifyState({ payload, callback }, {call, put}) {
            const response = yield call(modifyState, payload);
            if( callback ) callback(response);
        },
        *removeAdvert({ payload, callback }, {call, put}) {
            const response = yield call(removeAdvert, payload);
            if( callback ) callback(response);
        },
        *modifyAdvert({ payload, callback }, {call, put}) {
            const response = yield call(modifyAdvert, payload);
            if( callback ) callback(response);
        },
    },

    reducers: {
        _queryAdList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
