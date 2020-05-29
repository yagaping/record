import { 
    recognitionQuery,
    handleVerify,
    recognitionCheck, 
    recognitionSendNotice, 
    update_text,
    queryCountApi, 
    modifeErrorApi,
} from '../services/xiaoCheng/textRecognition';
export default {
    namespace: 'textRecognition',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //文本识别验证
        *textQuery({ payload,callback }, { call, put}) {
            const response = yield call(recognitionQuery, payload);
            yield put({
                type: '_textQuery',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *verify({ payload,callback }, { call, put}) {
            const response = yield call(handleVerify, payload);
            if (callback && response) callback(response);
        },
        *textByCheck({ payload,callback }, { call, put}) {
            try {
                const response = yield call(recognitionCheck, payload);
                if (callback && response) callback(response);
            } catch(e) {
                
            }
        },
        *sendNotice({ payload,callback }, { call, put}) {
            const response = yield call(recognitionSendNotice, payload);
            if (callback && response) callback(response);
        },
        *updateByText({ payload,callback }, { call, put}) {
            const response = yield call(update_text, payload);
            if (callback && response) callback(response);
        },
        *queryCount({ payload, callback },{ call, put }){
            const response = yield call(queryCountApi, payload )
            callback && callback(response);
        },
        *modifeError({ payload, callback },{ call, put }){
            const response = yield call(modifeErrorApi, payload);
            callback && callback(response)
        },
    },

    reducers: {
        _textQuery(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
