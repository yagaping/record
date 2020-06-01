import { 
    queryUserList,
    editCustomerState, 
    deleteCuster, 
} from '../services/userManage/userList';
export default {
    namespace: 'userList',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //用户管理
        *queryUserList({ payload, callback }, {call, put}) {
            const response = yield call(queryUserList, payload);
            yield put({
                type: '_queryUserList',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *editCustomerState({ payload, callback }, {call, put}) {
            const response = yield call(editCustomerState, payload);
            if( callback ) callback(response);
        },
        *deleteCuster({ payload, callback }, {call, put}) {
            const response = yield call(deleteCuster, payload);
            if( callback ) callback(response);
        },
    },

    reducers: {
        _queryUserList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
