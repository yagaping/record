import { 
    addShortUrlGroup,
    deleteShortUrlGroup, 
    updateShortUrlGroup, 
    queryShortUrlGroup, 
} from '../services/systemManage/shortAdress';

export default {
    
    namespace: 'shortAddressGroup',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //短地址分组
        *queryShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(queryShortUrlGroup, payload);
            yield put({
                type: '_shortUrlGroup',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(addShortUrlGroup, payload);
            if (callback && response) callback(response);
        },
        *deleteShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(deleteShortUrlGroup, payload);
            if (callback && response) callback(response);
        },
        *updateShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(updateShortUrlGroup, payload);
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _shortUrlGroup(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
