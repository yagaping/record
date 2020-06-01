import { pageGet, pageUpdate, pageDelete, pageAdd } from '../services/systemManage/log';
export default {
    
    namespace: 'pageManage',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //页面管理
        *getPageList({ payload, callback }, { call, put }) {
            const response = yield call(pageGet, payload);
            yield put({
                type: '_getPageList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addPage({ payload, callback }, { call, put }) {
            const response = yield call(pageAdd, payload);
            if(callback && response) callback(response);
        },
        *updatePage({ payload, callback }, { call, put }) {
            const response = yield call(pageUpdate, payload);
            if(callback && response) callback(response);
        },
        *deletePage({ payload, callback }, { call, put }) {
            const response = yield call(pageDelete, payload);
            if(callback && response) callback(response);
        },
    },

    reducers: {
        _getPageList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}