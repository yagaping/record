import { getOptionMenu, addOptionMenu, updateOptionMenu, deleteOptionMenu, dragApi, subsetFind } from '../services/xiaoCheng/intelligenceList';
export default {
    
    namespace: 'intelligenceList',

    state: {
        data: {},
    },

    effects: {
        //事件管理
        *menuOptionGet({ payload, callback }, { call, put }) {
            const response = yield call(getOptionMenu, payload);
            yield put({
                type: 'menuList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *menuOptionAdd({ payload, callback }, { call, put }) {
            const response = yield call(addOptionMenu, payload);
            if(callback && response) callback(response);
        },
        *menuOptionUpdate({ payload, callback }, { call, put }) {
            const response = yield call(updateOptionMenu, payload);
            if(callback && response) callback(response);
        },
        *menuOptionDelete({ payload, callback }, { call, put }) {
            const response = yield call(deleteOptionMenu, payload);
            if(callback && response) callback(response);
        },
        *drag({ payload, callback }, { call, put }) {
            const response = yield call(dragApi, payload);
            if(callback && response) callback(response);
        },
        *findSubset({ payload, callback }, { call, put }) {
            const response = yield call(subsetFind, payload);
            if(callback && response) callback(response);
        }
    },

    reducers: {
        menuList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}