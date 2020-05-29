import { 
    sendCheckcode, 
    bindMobile,
    unBindMobile,
    unBindThirdLogin,
} from '../services/userManage/userList';
export default {
    namespace: 'userEdit',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //获取验证码
        *sendCheckcode({ payload, callback }, {call, put}) {
            const response = yield call(sendCheckcode, payload);
            yield put({
                type: '_userEdit',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *bindMobile({ payload, callback }, {call, put}) {
            const response = yield call(bindMobile, payload);
            yield put({
                type: '_userEdit',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *unBindMobile({ payload, callback }, {call, put}) {
            const response = yield call(unBindMobile, payload);
            yield put({
                type: '_userEdit',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *unBindThirdLogin({ payload, callback }, {call, put}) {
            const response = yield call(unBindThirdLogin, payload);
            yield put({
                type: '_userEdit',
                payload: response,
            });
            if( callback ) callback(response);
        },
    },

    reducers: {
        _userEdit(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
