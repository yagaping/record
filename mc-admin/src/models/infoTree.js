import { getTree, addTreeList, updateTreeList, deleteTreeList } from '../services/xiaoCheng/infoTree';
export default {
    
    namespace: 'infoTree',

    state: {
        data: { },
    },

    effects: {
        //事件管理
        *treeList({ payload, callback }, { call, put }) {
            const response = yield call(getTree, payload);
            yield put({
                type: '_treeList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *addTree({ payload, callback }, { call, put }) {
            const response = yield call(addTreeList, payload);
            if(callback && response) callback(response);
        },
        *updateTree({ payload, callback }, { call, put }) {
            const response = yield call(updateTreeList, payload);
            if(callback && response) callback(response);
        },
        *deleteTree({ payload, callback }, { call, put }) {
            const response = yield call(deleteTreeList, payload);
            if(callback && response) callback(response);
        },
        
    },

    reducers: {
        _treeList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}