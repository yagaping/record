import {getCard, updateIconSort, updateGroupSort, updateCardType} from '../services/discovery/discovery';
export default {
    namespace: 'discoveryCenter',

    state: {
        data: []
    },

    effects: {
        *findCard({ payload, callback }, { call, put }){
            const response = yield call(getCard, payload);
            yield put({
                type: '_findCard',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *updateIcon({ payload, callback }, { call, put }){
            const response = yield call(updateIconSort, payload);
            if(callback && response) callback(response);
        },
        *updateCard({ payload, callback }, { call, put }){
            const response = yield call(updateGroupSort, payload);
            if(callback && response) callback(response);
        },
        *showOrHideCard({ payload, callback }, { call, put }){
            const response = yield call(updateCardType, payload);
            if(callback && response) callback(response);
        }  
    },

    reducers: {
        _findCard(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
} 