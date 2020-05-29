import { notification } from 'antd';
import {
  query, queryLogList, resetPassword, saveUser, updateUser, updateUserByLoginStatus, updateUserByPassword,
  updateUserByStatus,
  queryDoLogApi,
  queryDepartmentApi,
  queryLevelApi,
  addUserApi,
  updateUserInfoApi,
  projectInfoApi,
} from '../services/admin-user-list';
import {notificationError} from "../utils/common";
import {routerRedux} from "dva/router";

export default {
  namespace: 'adminUserList',

  state: {
    data: {
      index: 0,
      list: [],
      pagination: {},
    },
    logData:{
      index:0,
      list:[],
      pagination:{},
    },
    projectInfo:{
    },
    department:[],
    level:[],
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
      const { data, total, index, size, newsId } = payload.result;
      if (newsId !== undefined) {
        return {
          ...state,
          data: {
            data: payload.result,
          },
          loading: false,
        };
      } else {
        const pagination = {
          current: index + 1,
          pageSize: size,
          total,
        };
        return {
          ...state,
          data: {
            index,
            list: data,
            pagination,
          },
          loading: false,
        };
      }
    },
    queryDoLogSuccess(state, { payload }){
      
      const { data, size, total, index } = payload.result;
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        logData:{
          index,
          list:data,
          pagination,
        },
        loading:false,
      };
    },
    queryDepartmentSuccess(state,{ payload }){
      const department = payload.result;
      return {
        ...state,
        department,
      }
    },
    queryLevelSuccess(state,{ payload }){
      const level = payload.result.data;
      return {
        ...state,
        level,
      }
    },
    projectInfoSuccess( state, { payload }){
      const { addTime, fileUrl, version } = payload.result; 
      const projectInfo = {
        name:'米橙相册',
        version,
        apk:fileUrl,
        time:addTime,
      };
      return {
        ...state,
        loading:false,
        projectInfo,
      }
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(query, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    *save({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(saveUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        // callback
        if (callback) callback();
      }
    },
    *modify({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        // callback
        if (callback) callback();
      }
    },
    /**
     * 禁用/恢复后台用户
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyStatus({ payload, callback }, { call, put }) {
      
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateUserByStatus, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });
      }
        // callback
        callback && callback(response);
        
    },
    /**
     * 后台用户重置密码
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *resetPwd({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(resetPassword, payload);
      callback && callback(response);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });
        
      }
    },
    /**
     * 后台用户修改密码
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyPassword({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateUserByPassword, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        yield put(routerRedux.push('/user/login'));
      } else {
        notificationError(response);
      }
    },
    *modifyUserByLoginStatus({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateUserByLoginStatus, payload);
      callback && callback(response);
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
      
    },
    *queryLoginLog({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryLogList, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    *queryDoLog({ payload },{ call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(queryDoLogApi,payload);
      if( response.code === 0 ){
        yield put({
          type:'queryDoLogSuccess',
          payload:{
            result:response.result,
          },
        });
      }
    },
    *queryDepartment({ payload },{ call, put }){
      const response = yield call(queryDepartmentApi,payload);
      if(response.code === 0){
        yield put({
          type:'queryDepartmentSuccess',
          payload:{
            result:response.result,
          },
        })
      }
    },
    *queryLevel({ payload },{ call, put }){
      const response = yield call(queryLevelApi,payload);
      if(response.code === 0){
        yield put({
          type:'queryLevelSuccess',
          payload:{
            result:response.result,
          },
        });
      }
    },
    *addUser({ payload, callback },{ call, put }){
      const response = yield call(addUserApi,payload);
      if(response.code === 0){
          if(response.result.code === 0){
            callback && callback(response);
          }else{
            notificationError(response);
          }
      }
    },
    *updateUserInfo({ payload, callback },{ call, put }){
      const response = yield call(updateUserInfoApi,payload);
      if(response.code === 0){
        if(response.result.code === 0){
          callback && callback(response);
        }else{
          notificationError(response);
        }
      }
    },
    *projectInfo({ _, callback }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(projectInfoApi, _);
      yield put({
        type:'projectInfoSuccess',
        payload:response,
      });
    },
  },
};

