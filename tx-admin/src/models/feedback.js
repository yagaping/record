import { queryFeedbackList,
    uploadFileApi } from '../services/operateManage/feedback';
export default {
    namespace: 'feedback',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
    //反馈列表
        *queryFeedbackList({ payload, callback }, { call, put }) {
            const response = yield call(queryFeedbackList, payload);
            yield put({
                type: '_queryFeedbackList',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *queryUploadFile({ payload, callback },{ call, put }){
            const response = yield call( uploadFileApi, payload )
            callback && callback(response);
        }
    },

    reducers: {
        _queryFeedbackList(state, { payload }) {
            for(let i=0;i<payload.data.dataList.length;i++){
                payload.data.dataList[i].key = i+1;
            }
            return {
                ...state,
                ...payload,
            };
        },
    },
};
