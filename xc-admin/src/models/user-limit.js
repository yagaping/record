import { notification } from 'antd';
import { 
    queryLimtApi,
    jobListApi,
    itemListApi,
    limitSaveApi,
    listByRoleIdApi,
  } from '../services/user';
import { Z_UNKNOWN } from 'zlib';

export default {
  namespace: 'userLimit',

  state: {
    selectJobData:[],
    roleList:[],
    selectTypeData:[],
    chooseData:[],
    cancelData:[],
    topSelect:{
      allRead:false,
      allWrite:false,
    },
    loading:false,
  },

  reducers: {
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    queryLimtSuccess(state,{ payload }){
      const selectJobData = payload;
      return {
        ...state,
        selectJobData,
      }
    },
    queryRoleSuccess(state, { payload }){
      const roleList = payload.data; 
      return {
        ...state,
        roleList,
      }
    },
    itemListSuccess(state, { payload }){
      const selectTypeData = payload;
      let checkRead = true;
      let checkWrite = true;
      if(selectTypeData&&selectTypeData.length>0){
        for(let i=0;i<selectTypeData.length;i++){
          if( selectTypeData[i].isRead == 0 || !checkRead){
            checkRead = false;
            break;
          }
          let child = selectTypeData[i].children;
          if( child && child.length > 0){
            for(let j=0;j<child.length;j++){
              if( child[j].isRead == 0){
                checkRead = false;
                break;
              }
            }
          }
        }
        for(let i=0;i<selectTypeData.length;i++){
          if(selectTypeData[i].isWrite == 0 || !checkWrite){
            checkWrite = false;
            break;
          }
          let child = selectTypeData[i].children;
          if( child && child.length > 0){
            for(let j=0;j<child.length;j++){
              if( child[j].isWrite == 0){
                checkWrite = false;
                break;
              }
            }
          }
        }
      }else{
        checkRead = false;
        checkWrite = false;
      }
      return {
        ...state,
        selectTypeData,
        topSelect:{
          allRead:checkRead,
          allWrite:checkWrite,
        },
        loading:false,
      }
    },
    updataLimitData(state,{ payload }){
      const { selectTypeData, chooseData } = state;
      let socuse = payload || [];
      if(socuse.length>0){
        for(let i=0;i<socuse.length;i++){
          for(let j=0;j<selectTypeData.length;j++){
            if(socuse[i].functionId==selectTypeData[j].id){
              selectTypeData[j].isRead = socuse[i].isRead;
              selectTypeData[j].isWrite = socuse[i].isWrite;
            }
            let child = selectTypeData[j].children;
            if(child && child.length>0){
              for(let k=0;k<child.length;k++){
                if(socuse[i].functionId==child[k].id){
                  child[k].isRead = socuse[i].isRead;
                  child[k].isWrite = socuse[i].isWrite;
                }
              }
            } 
          }
        }
      }
      let checkRead = true;
      let checkWrite = true;
      if(selectTypeData&&selectTypeData.length>0){
        for(let i=0;i<selectTypeData.length;i++){
          if( selectTypeData[i].isRead == 0){
            checkRead = false;
            break;
          }
          
        }
        for(let i=0;i<selectTypeData.length;i++){
          if(selectTypeData[i].isWrite == 0){
            checkWrite = false;
            break;
          }
        }
      }
      return {
        ...state,
        selectTypeData,
        chooseData:socuse,
        topSelect:{
          allRead:checkRead,
          allWrite:checkWrite,
        }
      }
    },
    cancelLimitData(state,{ payload }){
      const { selectTypeData } = state;
      let cancelData = payload;
      if(cancelData.length>0){
        for(let i=0;i<cancelData.length;i++){
          for(let j=0;j<selectTypeData.length;j++){
            if(cancelData[i].functionId == selectTypeData[j].id){
              selectTypeData[j].isRead = 0;
              selectTypeData[j].isWrite = 0;
            }
            let child = selectTypeData[j].children;
            if(child && child.length>0){
              for(let k=0;k<child.length;k++){
                if(cancelData[i].functionId == child[k].id){
                  child[k].isRead = 0;
                  child[k].isWrite = 0;
                }
              }
              
            }
          }
        }
      }
      let checkRead = true;
      let checkWrite = true;
      if(selectTypeData&&selectTypeData.length>0){
        for(let i=0;i<selectTypeData.length;i++){
          if( selectTypeData[i].isRead == 0){
            checkRead = false;
            break;
          }
          
        }
        for(let i=0;i<selectTypeData.length;i++){
          if(selectTypeData[i].isWrite == 0){
            checkWrite = false;
            break;
          }
        }
      }
      return {
        ...state,
        cancelData,
        topSelect:{
          allRead:checkRead,
          allWrite:checkWrite,
        }
      }
    },

  },

  effects: {
    *queryLimt({ payload, callback }, { call, put }){
      const response = yield call(queryLimtApi, payload);
      callback && callback(response.result);
      yield put({
        type:'queryLimtSuccess',
        payload:response.result,
      });
    },
    *queryRole({ payload },{ call, put }){
      const response = yield call(jobListApi, payload);
      yield put({
        type:'queryRoleSuccess',
        payload:response.result,
      });
    },
    *queryItemList({ payload },{ call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        }
      });
      const response = yield call(itemListApi, payload);
      yield put({
        type:'itemListSuccess',
        payload:response.result,
      });
    },
    *limitSave({ payload },{ call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(limitSaveApi, payload);
      if(response.code === 0){
        notification.success({
          message:'提示信息',
          description:'操作成功',
        })
      }else{
        notification.error({
          message: '提示消息',
          description: '操作失败!',
        });
      }
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:false,
        },
      });
    },
    *listByRoleId({ payload, callback }, { call, put }){
      const response = yield call(listByRoleIdApi, payload);
      callback && callback(response.result);
    },  


  },
};
