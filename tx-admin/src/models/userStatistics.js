import { 
    findAll,
    querySendMessageApi,
    saveMessageApi,
    sendMessageDataApi,
    editorMessageApi,
    uploadFileApi,
    querySendVersionApi,
    saveVersionApi,
    deleteVersionApi,
    modifyVersionApi,
    sendVersionItemApi,
    queryFixedVersionApi,
    saveFixedVersionApi,
    modifyFixedVersionApi,
    deleteFixedVersionApi,
    getCustomerApi,
    repealApi
} from '../services/userManage/userStatistics';
export default {
    namespace: 'userStatistics',

    state: {
        data: {
            dataList: [],
            total: 0
        },
        versionData:{
            dataList: [],
            total: 0
        },
        fixedData:{
            dataList: [],
            total: 0
        },
    },

    effects: {
         //用户统计
         *findAll({ payload, callback }, {call, put}) {
            const response = yield call(findAll, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *querySendMessage({ payload, callback }, { call, put }){
            const response = yield call(querySendMessageApi, payload);
            yield put({
                type:'save',
                payload:response,
            }) 
        },
        *querySendVersion({ payload, callback }, { call, put }){
            const response = yield call(querySendVersionApi, payload);
            yield put({
                type:'saveVersionData',
                payload:response,
            }) 

        },
        *saveMessage({ payload, callback}, { call, put }){
            const response = yield call(saveMessageApi, payload);
            callback && callback(response);
        },
        *sendMessageData({ payload, callback }, { call, put }){
            const response = yield call(sendMessageDataApi, payload);
            callback && callback(response);
        },
        *repeal({ payload, callback }, { call, put }){
            const response = yield call(repealApi, payload);
            callback && callback(response);
        },
        *editorMessage({ payload, callback },{ call, put }){
            const response = yield call(editorMessageApi, payload);
            callback && callback(response);
        },
        *uploadFile({ payload, callback }, { call, put }){
            const response = yield call(uploadFileApi, payload);
            callback && callback( response );
        },
        *saveVersion({ payload, callback}, { call, put }){
            const response = yield call(saveVersionApi, payload);
            callback && callback(response);
        },
        *modifyVersion({ payload, callback}, { call, put }){
            const response = yield call(modifyVersionApi, payload);
            callback && callback(response);
        },
        *deleteVersion({ payload, callback}, { call, put }){
            const response = yield call(deleteVersionApi, payload);
            callback && callback(response);
        },
        *sendVersionItem({ payload, callback}, { call, put }){
            const response = yield call(sendVersionItemApi, payload);
            callback && callback(response);
        },
        // 固定版本号
        *queryFixedVersion({ payload, callback}, { call, put }){
            const response = yield call(queryFixedVersionApi, payload);
            callback && callback(response);
            yield put({
                type:'saveFixedData',
                payload:response
            })
        },
        *saveFixedVersion({ payload, callback}, { call, put }){
            const response = yield call(saveFixedVersionApi, payload);
            callback && callback(response);
        },
        *modifyFixedVersion({ payload, callback}, { call, put }){
            const response = yield call(modifyFixedVersionApi, payload);
            callback && callback(response);
        },
        *deleteFixedVersion({ payload, callback}, { call, put }){
            const response = yield call(deleteFixedVersionApi, payload);
            callback && callback(response);
        },
        // 获取客服列表
        *getCustomer({ payload, callback}, { call, put }){
            const response = yield call(getCustomerApi, payload);
            callback && callback(response);
        },
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
               ...payload,
            };
        },
        saveVersionData(state, { payload }) {
            return {
                ...state,
                versionData:{
                    ...payload.data,
                }
               
            };
        },
        saveFixedData(state, { payload }) {
            return {
                ...state,
                fixedData:{
                    ...payload.data,
                }
               
            };
        },
    },
};
