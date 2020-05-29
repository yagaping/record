import { list } from '../services/navigation-icon';

export default {
  namespace: 'navigationIconAdd',

  state: {
    loading: false,
    list: [],
    total: 0,
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
    *query(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(list);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });
      }
    },
  },
};

