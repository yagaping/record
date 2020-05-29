import { queryById, updateHotWord } from '../services/hot-word';

export default {
  namespace: 'hotWordEdit',

  state: {
    loading: false,
    hotWord: {
      id: null,
      word: null,
      linkUrl: null,
      state: null,
      sort: null,
      type: null,
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        hotWord: payload.hotWord,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(queryById, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            hotWord: response.result,
          },
        });
      }
    },
    *edit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateHotWord, payload.values);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        payload.goBack();
      }
    },
  },
};

