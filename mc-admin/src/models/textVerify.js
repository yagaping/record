import { queryText, upadateText, saveText, deleteText, getText, checkText, allVerify,
    fileUploadApi } from '../services/xiaoCheng/textRecognition';
export default {
    namespace: 'textVerify',

    state: {
        data: {
            dataList: [],
            total: 0,
        },
    },

    effects: {
        //文本识别验证
        *textQuery({ payload,callback }, { call, put}) {
            const response = yield call(queryText, payload);
            yield put({
                type: '_queryTextMatch',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *textSave({ payload,callback }, { call, put}) {
            const response = yield call(saveText, payload);
            if (callback && response) callback(response);
        },
        *textUpdate({ payload,callback }, { call, put}) {
            const response = yield call(upadateText, payload);
            if (callback && response) callback(response);
        },
        *textDelete({ payload,callback }, { call, put}) {
            const response = yield call(deleteText, payload);
            if (callback && response) callback(response);
        },
        *textGet({ payload,callback }, { call, put}) {
            const response = yield call(getText, payload);
            if (callback && response) callback(response);
        },
        *textCheck({ payload,callback }, { call, put}) {
            const response = yield call(checkText, payload);
            if (callback && response) callback(response);
        },
        *verifyAll({ payload,callback }, { call, put}) {
            const response = yield call(allVerify, payload);
            if (callback && response) callback(response);
        },
        *fileUpload({ payload, callback },{ call, put }){
            const response = yield call(fileUploadApi, payload);
            callback && callback(response)
        }
    },

    reducers: {
        _queryTextMatch(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
