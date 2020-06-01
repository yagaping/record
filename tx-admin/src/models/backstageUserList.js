import { queryRule, removeRule, addRule } from '../services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // const response = yield call(queryRule, payload);
      const response = {
        list: [
          {
            avatar:"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
            callNo: 0,
            createdAt: "2018-05-08T03:00:31.702Z",
            description:"管理员",
            href:"https://ant.design",
            key: 8637,
            userName:"admin",
            realName:"曲丽丽",
            progress:6,
            status:0,
            title:"一个任务名称 8637",
            updatedAt:"2018-05-08T03:00:31.702Z"
          },
          {
            avatar:"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
            callNo: 0,
            createdAt: "2018-05-08T03:00:31.702Z",
            description:"超级管理员",
            href:"https://ant.design",
            key: 0,
            userName:"superAdmin",
            realName:"曲丽丽1",
            progress:6,
            status:0,
            title:"一个任务名称 0",
            updatedAt:"2018-05-08T03:00:31.702Z"
          },
          {
            avatar:"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
            callNo: 0,
            createdAt: "2018-05-08T03:00:31.702Z",
            description:"客人",
            href:"https://ant.design",
            key: 1,
            userName:"guest",
            realName:"曲丽丽2",
            progress:6,
            status:0,
            title:"一个任务名称 1",
            updatedAt:"2018-05-08T03:00:31.702Z"
          },
          {
            avatar:"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
            callNo: 0,
            createdAt: "2018-05-08T03:00:31.702Z",
            description:"用户",
            href:"https://ant.design",
            key: 2,
            userName:"user",
            realName:"曲丽丽3",
            progress:6,
            status:0,
            title:"一个任务名称 2",
            updatedAt:"2018-05-08T03:00:31.702Z"
          },
        ],
        pagination: {total: 15, pageSize: 10, current: 1}
      };
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback && response) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback && response) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
