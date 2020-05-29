import { saveHotWord } from '../services/hot-word';

export default {
  namespace: 'hotWordAdd',

  state: {
    loading: false,
  },

  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
  },

  effects: {
    *add({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(saveHotWord, payload.values);
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

