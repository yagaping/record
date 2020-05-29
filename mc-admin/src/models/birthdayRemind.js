import { addBless, saveBless, modifyBless, deleteBless, findByPersonType } from '../services/discovery/birthdayRemind';
export default {
    namespace: 'birthdayRemind',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //祝福管理
        *findByBlessingsText({ payload, callback }, {call, put}) {
            const response = yield call(addBless, payload);
            yield put({
                type: '_blessingList',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *saveChoose({ payload, callback }, {call, put}) {
            const response = yield call(saveBless, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *modifyChoose({ payload, callback }, {call, put}) {
            const response = yield call(modifyBless, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *deleteChoose({ payload, callback }, {call, put}) {
            const response = yield call(deleteBless, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *findByPersonType({ payload, callback }, {call, put}) {
            const response = yield call(findByPersonType, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
    },

    reducers: {
        _blessingList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
