import { findShortList } from '../services/discovery/shortHand';
export default {
  namespace: 'shortHand',

  state: {
    data: {
      dataList: [],
      total: 0,
    },
  },

  effects: {
    //用户统计
    *findAll({ payload, callback }, { call, put }) {
      const response = yield call(findShortList, payload);
      yield put({
        type: '_getShortHand',
        payload: response,
      });
      if (callback && response) callback(response);
    },
  },

  reducers: {
    _getShortHand(state, { payload }) {
      for(let i=0;i<payload.data.dataList.length;i++){
        payload.data.dataList[i].key = i+1;
      }
      return {
        ...state,
        ...payload,
      };
    },
  },
};
