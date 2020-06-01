import { 
    addShortUrl, 
    deleteShortUrl, 
    updateShortUrl, 
    queryShortUrl,
} from '../services/systemManage/shortAdress';

export default {
    
    namespace: 'shortAddress',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //短地址管理
        *queryShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(queryShortUrl, payload);
            yield put({
                type: '_shortUrl',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *deleteShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(deleteShortUrl, payload);
            if (callback && response) callback(response);
        },
        
        *addShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(addShortUrl, payload);
            if (callback && response) callback(response);
        },
        *updateShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(updateShortUrl, payload);
            if (callback && response) callback(response);
        },
        *queryGroup({ payload,callback }, { call, put}) {
            const response = yield call(queryGroup, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _shortUrl(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
