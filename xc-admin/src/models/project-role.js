import { notification } from 'antd';
import { 
    projectRoleApi,
    projectSaveApi,
    dpartmentApi,
    departmentSaveApi,
    jobListApi,
    postSaveApi,
    selectJobApi,
    limitSelectApi,
    jobLimitApi,
  } from '../services/user';

export default {
  namespace: 'projectRole',

  state: {
    projectData:[],
    departmentData:[],
    jobData:[],
    selectProject:'',
    selectJobData:[],
    selectTypeData:[],
    topSelect:{
      allRead:false,
      allWrite:false,
    },
    loading:false,
  },

  reducers: {
    changeLoading(state,{ payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    projectRoleSuccess(state,{ payload }){
      
      const projectData = payload;
      if(state.selectProject){
        if(projectData.length>0){
          for(let i=0;i<projectData.length;i++){
            if(projectData[i].id == state.selectProject){
              localStorage.setItem('projectId',projectData[i].id);
              localStorage.setItem('projectName',projectData[i].name);
              break ;
            }
          }
        }
      }else{
        localStorage.setItem('projectId',projectData[0].id);
        localStorage.setItem('projectName',projectData[0].name);
      }
      
      let selectProject = state.selectProject ?  state.selectProject : projectData[0].id;
      return {
        ...state,
        projectData,
        selectProject,
        loading:false,
      }
    },
    dpartmentSuccess(state,{ payload }){
      let departmentData = [];
      if(payload.length>0){
        departmentData = payload;
      }
      return {
        ...state,
        departmentData,
        loading:false,
      };
    },
    modifySelectProject(state,{ payload, callback }){
      const selectProject = payload;
      return {
          ...state,
          selectProject,
        }
    },
    psotDataSuccess( state, { payload }){
      return {
        ...state,
      }
    },
    jobListSuccess( state, { payload }){
  
      const jobData = payload.data;
      return {
        ...state,
        jobData,
      }
    },
    selectJobSuccess( state, { payload }){
      const selectJobData = payload;
      return {
        ...state,
        selectJobData,
        loading:false,
      }
    },
    limitSelectSuccess( state,{ payload }){
      const selectTypeData = payload;
      return {
        ...state,
        selectTypeData,
      };
    },
  },

  effects: {
    *queryProjectRole({ payload, callback },{ call, put }){
        yield put({
          type:'changeLoading',
          payload:{
           loading:true, 
          },
        });
        const response = yield call(projectRoleApi, payload);
        if(response.code === 0){
          callback && callback(response.result);
          yield put({
            type:'projectRoleSuccess',
            payload:response.result,
          });
        }
    },
    *projectSave( { payload, callback } ,{ call, put }){
      const response = yield call(projectSaveApi, payload);
      if( response.code === 0){
        notification.success({
          message: '提示消息',
          description: '操作成功!',
        });
        callback && callback();
      }else{
        notification.error({
          message: '提示消息',
          description: '操作失败!',
        });
      }
    },
    *queryDpartment({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( dpartmentApi, payload );
      if(response.code === 0){
        callback && callback(response);
        yield put({
          type:'dpartmentSuccess',
          payload:response.result,
        });
      }
    },
    *departmentSave({ payload, callback }, { call, put }){
      const response = yield call(departmentSaveApi, payload );
      if(response.code === 0){
        notification.success({
          message: '提示消息',
          description: '操作成功!',
        });
        callback && callback();
      }else{
        notification.error({
          message: '提示消息',
          description: '操作失败!',
        });
      }
    },
    *qyeryPostData({ payload },{ call, put }){
      const response = yield call(dpartmentApi,payload);
      if(response.code === 0){
        yield put({
          type:'psotDataSuccess',
          payload:response.result,
        });
      }
    },
    *queryJobList({ payload },{ call, put }){
      const response = yield call(jobListApi, payload);
      if(response.code === 0){
        yield put({
          type:'jobListSuccess',
          payload:response.result,
        });
      }
    },
    *postSave( { payload, callback }, { call, put }){
      const  response = yield call( postSaveApi, payload );
      if(response.code === 0){
        notification.success({
          message: '提示消息',
          description: '操作成功!',
        });
        callback && callback();
      }else{
        notification.error({
          message: '提示消息',
          description: '操作失败!',
        });
      }
    },
    *selectJob({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(selectJobApi, payload );
      callback && callback(response.result);
      yield put({
        type:'selectJobSuccess',
        payload:response.result,
      });
    },
    *limitSelect({ payload },{ call, put }){
      const response = yield call(limitSelectApi, payload );
      yield put({
        type:'limitSelectSuccess',
        payload:response.result,
      });
    },
    *jobLimitSave({ payload }, { call, put }){
      const response = yield call(jobLimitApi,payload);
      if(response.code === 0){
        notification.success({
          message: '提示消息',
          description: '操作成功!',
        });
      }else{
        notification.error({
          message: '提示消息',
          description: '操作失败!',
        });
      }
    }

  },

  
};
