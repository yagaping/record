import { parse } from 'qs';
import { 
  searchKeyWord, 
  modifyKeyWordSubmit, 
  queryCountInfoApi, 
  updateByAllSwitchApi, 
  updateBySensitiveSwitchApi, 
  updateByKeywordSwitchApi, 
  updateByWrongSwitchApi,
  querytypeNumberApi,
  queryChartDataApi,
  querySysListApi,
  addSysItemApi,
  modSysItemApi,
  deleteDataApi,
  activeSysItemApi,
   } from '../services/content-mgr-api';
import {message} from 'antd';
export default {
  namespace: 'contentMgr',

  state: {
    data:[],
    fields:[],
    typeNum:{
      successCount:'',
      allHub:'',
      imgVideo:'',
      keywordSuccessCount:'',
      wrongSuccessCount:'',

    },
    sysFilterData:{
      list:[],
      pagination: {},
    },
    dateType:0,
    beginDay:null,
    endDay:null,
    loading: false,
    allSwitch:true,
    sensitiveSwitch:true,
    keywordSwitch:true,
    wrongSwitch:true,
  },

  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    loadingClose(state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    queryCountInfoSuccess( state , { payload }){
      let { allSwitch, sensitiveSwitch, keywordSwitch, wrongSwitch } = payload;
      allSwitch = !allSwitch ? true : false;
      sensitiveSwitch = !sensitiveSwitch ? true : false;
      keywordSwitch = !keywordSwitch ? true :false;
      wrongSwitch = !wrongSwitch ? true : false;
      return {
        ...state,
        allSwitch,
        sensitiveSwitch,
        keywordSwitch,
        wrongSwitch,
      }
    },
    querytypeNumberSuccess( state, { payload }){
      if(payload){
        const typeNum = {
            successCount:payload.successCount,
            allHub:payload.videoSuccessCount+payload.imageSuccessCount,
            imgVideo:payload.terrorismSuccessCount+payload.pornSuccessCount,
            keywordSuccessCount:payload.keywordSuccessCount,
            wrongSuccessCount:payload.wrongSuccessCount,
          }
          return {
            ...state,
            typeNum,
          }
      }else{
        return {
          ...state,
        }
      }
      
      
    },
    updateByAllSwitchSuccess( state , { payload }){
      let allSwitch = state.allSwitch ? false : true;
      return {
        ...state,
        allSwitch
      }
    },
    updateBySensitiveSwitchSuccess( state , { payload } ){
      let sensitiveSwitch = state.sensitiveSwitch ? false : true;
      return {
        ...state,
        sensitiveSwitch,
      }
    },
    updateByKeywordSwitchSuccess( state , { payload } ){
      let keywordSwitch = state.keywordSwitch ? false : true;
      return {
        ...state,
        keywordSwitch,
      }
    },
    updateByWrongSwitchSuccess( state , { payload } ){
      let wrongSwitch = state.wrongSwitch ? false : true;
      return {
        ...state,
        wrongSwitch,
      }
    },
    queryChartDataSuccess( state , { payload }){
      let data = payload.data || [];
      const dateType = payload.dateType;
      const fields = [];
      if(data.length>0){
        for(let o in data[0]){
          if(o != 'name'){
            fields.push(o);
          }
        }
      }
      return {
        ...state,
        data,
        fields,
        dateType,
      }
    },
    querySysListSave( state, { payload }){
      const { data, size, total, index } = payload;
      const pagination = {
        current: index ,
        pageSize: size,
        total,
      };
      return {
        ...state,
        sysFilterData:{
          list:data,
          pagination,
        },
        loading:false,
      }
    },
  },

  effects: {
    *queryKeyWord({ payload,callback }, { call, put }){
  
     yield put({
       type:'changeLoading',
       payload:{
         loading:true,
       },
     });
      const response = yield call(searchKeyWord, payload);
      yield put({
        type:'loadingClose',
        payload:{
          loading:false,
        },
      });
      if( response.code === 0 ){
         callback && callback(response.result);
      }
    },
    *modifyKeyWord({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(modifyKeyWordSubmit,payload);
      yield put({
        type:'loadingClose',
        payload:{
          loading:false,
        },
      });
      if(response.code === 0){
        message.success('操作成功');
        callback && callback(response.result);
      }else{
        message.error('操作失败');
      }
    },
    *queryCountInfo({ payload }, { call, put }){
        const response = yield call(queryCountInfoApi,payload);
        if(response.code === 0){
            yield put({
              type:'queryCountInfoSuccess',
              payload:response.result,
            })
        }
    },
    *querytypeNumber({ payload }, { call, put }){
      const response = yield call(querytypeNumberApi,payload);
      if(response.code === 0){
        yield put({
          type:'querytypeNumberSuccess',
          payload:response.result,
        });
      }
    },
    *updateByAllSwitch({ payload },{ call, put }){
      const response = yield call( updateByAllSwitchApi, payload );
      if( response.code === 0 ){
        yield put({
          type:'updateByAllSwitchSuccess',
          paylaod:response.result,
        })
      }
    },
    *updateBySensitiveSwitch({ payload },{ call, put }){
      const response = yield call( updateBySensitiveSwitchApi, payload );
      if( response.code === 0 ){
        yield put({
          type:'updateBySensitiveSwitchSuccess',
          paylaod:response.result,
        })
      }
    },
    *updateByKeywordSwitch({ payload },{ call, put }){
      const response = yield call( updateByKeywordSwitchApi, payload );
      if( response.code === 0 ){
        yield put({
          type:'updateByKeywordSwitchSuccess',
          paylaod:response.result,
        })
      }
    },
    *updateByWrongSwitch({ payload },{ call, put }){
      const response = yield call( updateByWrongSwitchApi, payload );
      if( response.code === 0 ){
        yield put({
          type:'updateByWrongSwitchSuccess',
          paylaod:response.result,
        })
      }
    },
    *queryChartData({ payload },{ call, put }){
     
      const response = yield call( queryChartDataApi, payload );
      if( response.code === 0 ){
        yield put({
          type:'queryChartDataSuccess',
          payload:{ 
            data:response.result.data,
            dateType:payload.dateType, 
          },
        })
      }
    },
    *querySysList({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        }
      });
      const response = yield call(querySysListApi, payload);
      yield put({
        type:'querySysListSave',
        payload:response.result,
      });
    },
    *addSysItem({ payload, callback }, { call, put }){
      const response = yield call(addSysItemApi, payload);
      callback && callback(response);
    },
    *modSysItem({ payload, callback }, { call, put }){
      const response = yield call(modSysItemApi, payload );
      callback && callback(response);
    },
    *deleteData({ payload, callback }, { call, put }){
      const response = yield call(deleteDataApi, payload );
      callback && callback(response);
    },
    *activeSysItem({ payload, callback }, { call, put }){
      const response = yield call(activeSysItemApi, payload );
      callback && callback(response);
    },
  },
};
