import { wordAdd, wordDelete, wordUpdate, word } from '../services/discovery/risingKnowledge';
export default {
    
    namespace: 'word',

    state: {
        data: {
            data: {
                dataList: [],
                total: 0
            }
        }
    },

    effects: {
        //事件管理
        *getWord({ payload, callback }, { call, put }) {
            const response = yield call(word, payload);
            yield put({
                type: '_getWord',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addWord({ payload, callback }, { call, put }) {
            const response = yield call(wordAdd, payload);
            if(callback && response) callback(response);
        },
        *updateWord({ payload, callback }, { call, put }) {
            const response = yield call(wordUpdate, payload);
            if(callback && response) callback(response);
        },
        *deleteWord({ payload, callback }, { call, put }) {
            const response = yield call(wordDelete, payload);
            if(callback && response) callback(response);
        },
        
    },

    reducers: {
        _getWord(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}