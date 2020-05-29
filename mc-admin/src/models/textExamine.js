import { textExamine,modifeErrorApi } from '../services/xiaoCheng/textRecognition';
export default {
    namespace: 'textExamine',

    state: {
        data: {
            result: {},
            textJson: {}
        }
    },

    effects: {
        //文本匹配
        *examineText({ payload,callback }, { call, put}) {
            const response = yield call(textExamine, payload);
            yield put({
                type: '_examineText',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *modifeResult({ payload, callback },{ call, put }){
            const response = yield call(modifeErrorApi, payload);
            yield put({
                type:'modifeData',
                payload,
            })
            callback && callback(response);
        },
        *updataTips({ payload, callback },{ call, put }){
            const response = yield call(modifeErrorApi, payload );
            callback && callback(response);
        },
    },

    reducers: {
        _examineText(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        modifeData(state,{ payload }){
            let  data  =  state.data;
            let content = JSON.parse(payload.data||payload.errorMsg);
            content.matchType = payload.matchType;
            data.result = JSON.stringify(content);
            data.textJson = 1;
            data.matchType = payload.matchType;
            data.modife = true;
            return {
                ...state,
                data,
            }
        },
    },
};
