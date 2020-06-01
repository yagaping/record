import { 
    listenAudioAdd,
    listenAudioDelete,
    listenAudioUpdate,
    listenAudio, 
    listenAudioUpload,
    audioUnPublish,
    audioPublish,
    getOneMonthDataApi,
    checkItemApi,
    queryOneDayApi,
    getRecomendDataApi,
    recommendApi,
    unRecommendApi,
    rankApi 
} from '../services/discovery/beautifulListening';
export default {
    
    namespace: 'beautifulListening',

    state: {
        data: {
            data: {
                pageRet: {
                    dataList: [],
                    total: 0
                },
                typeNameList: []
            }
        },
        data2: {
            data: {
                pageRet: {
                    dataList: [],
                    total: 0
                },
                typeNameList: []
            }
        },
        dateData:{},
        recomendData:{},
    },

    effects: {
        //模块管理
        *findListenAudio({ payload, callback }, { call, put }) {
            const response = yield call(listenAudio, payload);
            yield put({
                type: '_findListenAudio',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *queryOneDay({ payload, callback },{ call, put }){
            const response = yield call(queryOneDayApi, payload);
            yield put({
                type: 'setOneDay',
                payload: response,
            });
            callback &&  callback(response);
        },
        *queryOneDay2({ payload, callback },{ call, put }){
            const response = yield call(queryOneDayApi, payload);
            yield put({
                type: 'setOneDay2',
                payload: response,
            });
            callback &&  callback(response);
        },
        *audioAdd({ payload, callback }, { call, put }) {
            const response = yield call(listenAudioAdd, payload);
            if(callback && response) callback(response);
        },
        *audioUpdate({ payload, callback }, { call, put }) {
            const response = yield call(listenAudioUpdate, payload);
            if(callback && response) callback(response);
        },
        *audioDelete({ payload, callback }, { call, put }) {
            const response = yield call(listenAudioDelete, payload);
            if(callback && response) callback(response);
        },
        *uploadAudio({ payload, callback }, { call, put }) {
            const response = yield call(listenAudioUpload, payload);
            if(callback && response) callback(response);
        },
        *publishAudio({ payload, callback }, { call, put }) {
            const response = yield call(audioPublish, payload);
            if(callback && response) callback(response);
        },
        *unPublishAudio({ payload, callback }, { call, put }) {
            const response = yield call(audioUnPublish, payload);
            if(callback && response) callback(response);
        },
        *getOneMonthData({ payload, callback }, { call, put }){
            const response = yield call( getOneMonthDataApi, payload )
            yield put({
                type:'setOneMonthData',
                payload:{
                    typeNumList:response.data ? response.data.typeNumList : []
                }
            })
        },
        *getOneMonthData2({ payload, callback }, { call, put }){
            const response = yield call( getRecomendDataApi, payload )
            yield put({
                type:'setOneMonthData2',
                payload:{
                    recommendNumList:response.data 
                    ? response.data.recommendNumList 
                    : []
                }
            })
        },
        *checkItem({ payload, callback },{ call, put }){
            const response = yield call( checkItemApi, payload );
            callback && callback( response );
        },
        *recommend({ payload, callback },{ call, put }){
            const response = yield call(recommendApi, payload);
            callback && callback( response );
        },
        *unRecommend( { payload, callback }, { call, put }){
            const response = yield call( unRecommendApi, payload );
            callback && callback( response );
        },
        *rankSave({ payload, callback }, { call, put }){
            const response = yield call(rankApi, payload);
            callback && callback( response );
        },
    },

    reducers: {
        _findListenAudio(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        setOneDay(state, { payload }){
            const { data } = state;
            const { data:{data:{ dataList, pageNum, pageSize, total  }} } = payload;
            data.data.pageRet.dataList = dataList;
            data.data.pageRet.pageNum = pageNum;
            data.data.pageRet.pageSize = pageSize;
            data.data.pageRet.total = total;
            return {
                ...state,
                data,
            }
        },
        setOneDay2(state, { payload }){
            const { data2 } = state;
            const { data:{data:{ dataList, pageNum, pageSize, total  }} } = payload;
            data2.data.pageRet.dataList = dataList;
            data2.data.pageRet.pageNum = pageNum;
            data2.data.pageRet.pageSize = pageSize;
            data2.data.pageRet.total = total;
            return {
                ...state,
                data2,
            }
        },
        setOneMonthData( state, { payload }){
            return {
                ...state,
                dateData:payload.typeNumList||{}
            }
        },
        setOneMonthData2( state, { payload }){
            return {
                ...state,
                recomendData:payload||{}
            }
        },
    },
}