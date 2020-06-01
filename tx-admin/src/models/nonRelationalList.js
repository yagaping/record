import { mapList, addMapTree, updateMapTree, deleteMapTree } from '../services/xiaoCheng/mapTree';
export default {
    
    namespace: 'nonRelationalList',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
        //模块管理
        *getMapList({ payload, callback }, { call, put }) {
            const response = yield call(mapList, payload);
            yield put({
                type: '_getMapList',
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
        _getMapList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}