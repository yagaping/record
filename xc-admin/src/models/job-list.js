import { isSuccess, notificationError } from '../utils/common';
import { queryList, resumeJob, pauseJob, runJob, modifyJob, addJob, removeJob } from '../services/job-list-api';
import { debug } from 'util';

export default {
  namespace: 'jobList',

  state: {
    data: {
      index: 0,
      list: [],
      pagination: {},
    },
    loading: true,
  },

  effects: {

    // 获取 job list
    *fetch({ payload }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
      // hide loading
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 重新启动一个 job
    *resume({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request resume
      const resumeResponse = yield call(resumeJob, payload);
      if (!isSuccess(resumeResponse)) {
        notificationError(resumeResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
      // callback
      if (callback) callback();
    },

    // 暂停一个 job
    *pause({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request resume
      const pauseResponse = yield call(pauseJob, payload);
      if (!isSuccess(pauseResponse)) {
        notificationError(pauseResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return;
      }
      // callback
      if (callback) callback();
    },

    // 运行一个 job
    *runJob({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request runJob
      const pauseResponse = yield call(runJob, payload);
      if (!isSuccess(pauseResponse)) {
        notificationError(pauseResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return;
      }
      // callback
      if (callback) callback();
    },

    // 修改
    *modify({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request modifyJob
      const pauseResponse = yield call(modifyJob, payload);
      if (!isSuccess(pauseResponse)) {
        notificationError(pauseResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return;
      }
      // callback
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request addJob
      const pauseResponse = yield call(addJob, payload);
      if (!isSuccess(pauseResponse)) {
        notificationError(pauseResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return;
      }
      // callback
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      // show loading
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // send request removeJob
      const pauseResponse = yield call(removeJob, payload);
      if (!isSuccess(pauseResponse)) {
        notificationError(pauseResponse);
        // hide loading
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return;
      }
      // callback
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      const { total, size, index, data } = action.payload;
      const pagination = {
        current: index+1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        data: {
          index,
          pagination,
          list: data,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
