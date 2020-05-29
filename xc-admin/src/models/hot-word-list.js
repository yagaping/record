import { query, removeHotWord, releaseHotWord, notReleaseHotWord } from '../services/hot-word';


export default {
  namespace: 'hotWordList',

  state: {
    list: [],
    total: 0,
    loading: false,
    saveModalVisible: false,
  },

  reducers: {
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    querySuccess(state, { payload }) {
      return {
        ...state,
        list: payload.result.data,
        total: payload.result.total,
        loading: false,
      };
    },
  },

  effects: {
    *query(_, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(query);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(removeHotWord, payload.id);
      if (response.code === 0) {
        yield put({
          type: 'query',
        });
      }
    },
    *release({ payload }, { call, put }) {
      const response = yield call(releaseHotWord, payload.id);
      if (response.code === 0) {
        yield put({
          type: 'query',
        });
      }
    },
    *notRelease({ payload }, { call, put }) {
      const response = yield call(notReleaseHotWord, payload.id);
      if (response.code === 0) {
        yield put({
          type: 'query',
        });
      }
    },
  },
};

