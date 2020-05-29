import { poetryList, poetryListDelete, poetryListAdd, poetryListUpdate, publishPoetry } from '../services/discovery/risingKnowledge';

export default {
  namespace: 'poetry',

  state: {
    data: {
      dataList: [],
      total: 0,
    },
  },

  effects: {
    //诗词
    *getPoetryList({ payload, callback }, { call, put }) {
      const response = yield call(poetryList, payload);
      yield put({
        type: '_getPoetryList',
        payload: response,
      });
      if (callback && response) callback(response);
    },
    *deletePoetryList({ payload, callback }, { call, put }) {
      const response = yield call(poetryListDelete, payload);
      if (callback && response) callback(response);
    },
    *addPoetryList({ payload, callback }, { call, put }) {
      const response = yield call(poetryListAdd, payload);
      if (callback && response) callback(response);
    },
    *updatePoetryList({ payload, callback }, { call, put }) {
      const response = yield call(poetryListUpdate, payload);
      if (callback && response) callback(response);
    },
    *publish({ payload, callback }, { call, put }) {
      const response = yield call(publishPoetry, payload);
      if (callback && response) callback(response);
    },
  },

  reducers: {
    _getPoetryList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
