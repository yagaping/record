import { 
    queryApi,
    addFileApi 
} from '../services/pcmanage/pcapi';
export default {
    namespace: 'pcmanage',

    state: {
        data:{
            dataList:[],
        },
    },

    effects: {
        //头条推送中查询
        *query({ payload,callback }, { call, put}) {
            const response = yield call(queryApi, payload);
            yield put({
                type: 'listSave',
                payload: response,
            });
            if (callback && response) callback(response);
        },
        *addFile({ payload, callback }, { call, put }){
            const response = yield call( addFileApi, payload );
            callback && callback( response );
        },
    },

    reducers: {
        listSave(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
