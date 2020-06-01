import { findEdition, addEdition, removeEdition, modifyEdition,
    queryCustomerApi,
    addCustomerApi,
    updateCustomerApi,
    handlePushApi 
} from '../services/operateManage/editionList';
export default {
    
    namespace: 'editionList',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //事件列表
        *getEditionList({ payload, callback }, { call, put }) {
            const response = yield call(findEdition, payload);
            yield put({
                type: '_editionList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addEditionList({ payload, callback }, { call, put }) {
            const response = yield call(addEdition, payload);
            if(callback && response) callback(response);
        },
        *removeEditionList({ payload, callback }, { call, put }) {
            const response = yield call(removeEdition, payload);
            if(callback && response) callback(response);
        },
        *modifyEditionList({ payload, callback }, { call, put }) {
            const response = yield call(modifyEdition, payload);
            if(callback && response) callback(response);
        },
        // 客服
        *queryCustomer({ payload, callback }, { call, put }){
            const response = yield call(queryCustomerApi, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addCustomer({ payload, callback }, { call, put }){
            const response = yield call(addCustomerApi, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *updateCustomer({ payload, callback }, { call, put }){
            const response = yield call(updateCustomerApi, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *handlePush({ payload, callback },{ call, put }){
            const response = yield call(handlePushApi, payload);
            callback && callback(response);
        },
    },

    reducers: {
        _editionList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        save(state, { payload }){
            return {
                ...state,
                ...payload,
            }
        },
    },
}