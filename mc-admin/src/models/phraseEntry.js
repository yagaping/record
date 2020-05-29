import { findPhraseList, phraseListAdd, phraseListDelete, phraseListUpdate } from '../services/xiaoCheng/phrase';
export default {
    namespace: 'phraseEntry',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //词组录入
        *getPhraseList({ payload,callback }, { call, put}) {
            const response = yield call(findPhraseList, payload);
            yield put({
                type: '_getPhraseList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addPhraseList({ payload,callback }, { call, put}) {
            const response = yield call(phraseListAdd, payload);
            if (callback && response) callback(response);
        },
        *deletePhraseList({ payload,callback }, { call, put}) {
            const response = yield call(phraseListDelete, payload);
            if (callback && response) callback(response);
        },
        *updatePhraseList({ payload,callback }, { call, put}) {
            const response = yield call(phraseListUpdate, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _getPhraseList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
