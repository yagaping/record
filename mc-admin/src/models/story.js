import { storyList, storyListDelete, storyListAdd, storyListUpdate, publishStory } from '../services/discovery/risingKnowledge';
export default {
    
    namespace: 'story',

    state: {
        data: {
            data: {
                dataList: [],
                total: 0
            }
        },
    },

    effects: {
        //故事
        *getStoryList({ payload, callback }, { call, put }) {
            const response = yield call(storyList, payload);
            yield put({
                type: '_getStoryList',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *deleteStoryList({ payload, callback }, { call, put }) {
            const response = yield call(storyListDelete, payload);
            if(callback && response) callback(response);
        },
        *addStoryList({ payload, callback }, { call, put }) {
            const response = yield call(storyListAdd, payload);
            if(callback && response) callback(response);
        },
        *updateStoryList({ payload, callback }, { call, put }) {
            const response = yield call(storyListUpdate, payload);
            if(callback && response) callback(response);
        },
        *publish({ payload, callback }, { call, put }) {
            const response = yield call(publishStory, payload);
            if(callback && response) callback(response);
        },
        
    },

    reducers: {
        _getStoryList(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}