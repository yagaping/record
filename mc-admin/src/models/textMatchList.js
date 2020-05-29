import { matchTextAdd, matchTextQuery } from '../services/xiaoCheng/textRecognition';
export default {
    namespace: 'textMatchList',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //文本匹配列表
        *queryTextMatch({ payload,callback }, { call, put}) {
            const response = yield call(matchTextQuery, payload);
            yield put({
                type: '_queryTextMatch',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addTextMatch({ payload,callback }, { call, put}) {
            const response = yield call(matchTextAdd, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _queryTextMatch(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
