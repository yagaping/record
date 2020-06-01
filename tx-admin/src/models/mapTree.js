import { getMapTree, addMapTree, updateMapTree, deleteMapTree } from '../services/xiaoCheng/mapTree';
export default {
    
    namespace: 'mapTree',

    state: {
        data: { },
    },

    effects: {
        //事件管理
        *mapTreeGet({ payload, callback }, { call, put }) {
            const response = yield call(getMapTree, payload);
            yield put({
                type: '_mapTreeGet',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *mapTreeAdd({ payload, callback }, { call, put }) {
            const response = yield call(addMapTree, payload);
            if(callback && response) callback(response);
        },
        *mapTreeUpdate({ payload, callback }, { call, put }) {
            const response = yield call(updateMapTree, payload);
            if(callback && response) callback(response);
        },
        *mapTreeDelete({ payload, callback }, { call, put }) {
            const response = yield call(deleteMapTree, payload);
            if(callback && response) callback(response);
        },
        
    },

    reducers: {
        _mapTreeGet(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}