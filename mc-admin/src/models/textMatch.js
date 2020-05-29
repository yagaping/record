import { matchText } from '../services/xiaoCheng/textRecognition';
export default {
    namespace: 'textMatch',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //文本匹配
        *textMatch({ payload,callback }, { call, put}) {
            const response = yield call(matchText, payload);
            yield put({
                type: '_textMatch',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _textMatch(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
