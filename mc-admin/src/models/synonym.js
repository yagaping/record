import { 
    findWordList,
    wordListAdd, 
    wordListDelete, 
    wordListUpdate
} from '../services/xiaoCheng/phrase';
export default {
    namespace: 'synonym',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //用户管理
        *wordList({ payload, callback }, {call, put}) {
            const response = yield call(findWordList, payload);
            yield put({
                type: '_wordList',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *addWordList({ payload, callback }, {call, put}) {
            const response = yield call(wordListAdd, payload);
            if( callback ) callback(response);
        },
        *deleteWordList({ payload, callback }, {call, put}) {
            const response = yield call(wordListDelete, payload);
            if( callback ) callback(response);
        },
        *updateWordList({ payload, callback }, {call, put}) {
            const response = yield call(wordListUpdate, payload);
            if( callback ) callback(response);
        },
    },

    reducers: {
        _wordList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
