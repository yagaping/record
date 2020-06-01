import { 
    queryGroup,  
} from '../services/systemManage/shortAdress';

export default {
    
    namespace: 'shortGroup',

    state: {
        data: [],
    },

    effects: {
        //短地址所有分组
        *queryGroup({ payload,callback }, { call, put}) {
            const response = yield call(queryGroup, payload);
            yield put({
                type: '_queryGroup',
                payload: response,
            });
            if (callback && response) callback(response);
        },
    },

    reducers: {
        _queryGroup(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
