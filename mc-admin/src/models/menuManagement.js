import { addParentMenu, addChildMenu, deleteParentMenu, deleteChildMenu, updateParentMenu, updateChildMenu } from '../services/systemManage/bkAccout';
export default {
    
    namespace: 'menuManagement',

    state: {
        data: {
            // dataList: [],
            // total: 0
        },
    },

    effects: {
        //菜单管理
        *parentMenuAdd({ payload, callback }, { call, put }) {
            const response = yield call(addParentMenu, payload);
            // yield put({
            //     type: '_getIncidentList',
            //     payload: response,
            // });
            if(callback && response) callback(response);
        },
        *childMenuAdd({ payload, callback }, { call, put }) {
            const response = yield call(addChildMenu, payload);
            if(callback && response) callback(response);
        },
        *parentMenuDelete({ payload, callback }, { call, put }) {
            const response = yield call(deleteParentMenu, payload);
            if(callback && response) callback(response);
        },
        *childMenuDelete({ payload, callback }, { call, put }) {
            const response = yield call(deleteChildMenu, payload);
            if(callback && response) callback(response);
        },
        *parentMenuUpdate({ payload, callback }, { call, put }) {
            const response = yield call(updateParentMenu, payload);
            if(callback && response) callback(response);
        },
        *childMenuUpdate({ payload, callback }, { call, put }) {
            const response = yield call(updateChildMenu, payload);
            if(callback && response) callback(response);
        },
        
    },

    reducers: {
        _getIncidentList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}