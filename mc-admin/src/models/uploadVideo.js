import { videoUpload } from '../services/discovery/risingKnowledge';
export default {
    namespace: 'uploadVideo',

    state: {
        message: '',
    },

    effects: {
        //文本识别验证
        *upload({ payload,callback }, { call, put}) {
            const response = yield call(videoUpload, payload);
            yield put({
                type: '_upload',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _upload(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
