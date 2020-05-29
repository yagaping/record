import { 
  dataListApi,
  addReportApi,
  reportMnageApi,
  provinceApi,
  cityDataApi,
  typeDataApi,
  addModItemApi,
  tryGetApi,
  newsListApi,
  detailApi,
  regularApi,
  addOrUpdateApi,
  deleteApi,
 } from '../services/report-api';
import ReportManage from '../routes/Report/ReportManage';

export default {
  namespace: 'report',

  state: {
    list:null,
    manageData:null,
    provinceData:null,
    cityData:null,
    selectCityData:null,
    typeData:null,
    tryGetData:null,
    newsData:null,
    newsDetailData:null,
    regularData:null,
    pagination:{
    },
    contentEditData: '请输入内容...',
    phoneSimulator: {
      viewUrl: 'https://baidu.com/',
      html: '',
      title: '',
      socuse: '',
      time: '',
      newsGroup:'',
    },
    loading:false,
  },

  reducers: {
    loadingData(state, {payload}){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    dataListSuccess(state, { payload }){
      const { data, index, size, total } = payload;
      const list = data||null;
      const pagination = {
        current: index+1,
        pageSize: size,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
      };
      return {
        ...state,
        list,
        pagination,
        loading:false,
      };
    },
    reportDataSave( state, { payload }){
      const { data, index, size, total } = payload;
      const manageData = data||null;
      const pagination = {
        current: index+1,
        pageSize: size,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
      };
      return {
        ...state,
        manageData,
        pagination,
        loading:false,
      }
    },
    provinceSave(state, { payload }){
      const provinceData = payload;
      return {
        ...state,
        provinceData,
      }
    },
    cityDataSave(state, { payload }){
      const cityData = payload;
      return {
        ...state,
        cityData,
      }
    },
    removeCity(state,{ _ }){
      return {
        ...state,
        cityData:null,
      }
    },
    selectCitySave(state, { payload }){
      const selectCityData = payload;
      return {
        ...state,
        selectCityData,
      }
    },
    typeDataSave(state, { payload }){
      const typeData = payload;
      return {
        ...state,
        typeData,
      };
    },
    tryGetSave(state, {payload}){
      const tryGetData = payload;
      return {
        ...state,
        tryGetData,
        loading:false,
      }
    },
    newsListSave(state, { payload }){
      const { data, size, index, total } = payload;
      const newsData = data;
      const pagination = {
        current: index+1,
        pageSize: size,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
      };
      return {
        ...state,
        newsData,
        pagination,
        loading:false,
      };
    },
    detaliSave( state, { payload }){
  
      const newsDetailData = payload;
      state.contentEditData = payload.content;
      state.phoneSimulator.html = payload.content;
      state.phoneSimulator.time = payload.createTime;
      state.phoneSimulator.title = payload.title;
      return {
        ...state,
        newsDetailData,
        loading:false,
      }
    },
    regularSave( state, { payload }){
      const { data, size, index, total } = payload;
      const pagination = {
        current: index+1,
        pageSize: size,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
      };
      return {
        ...state,
        pagination,
        regularData:data,
        loading:false,
      }
    },
  },
  effects: {
    
    *queryDataList({ payload },{ call, put }){
    
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( dataListApi, payload);
      yield put({
        type:'dataListSuccess',
        payload:response.result,
      });
    },
    *addReport({ payload, callback },{ call, put }){
      const response = yield call( addReportApi, payload );
      callback && callback(response);
    },
    *ReportManage({ payload },{ call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( reportMnageApi, payload );
      yield put({
        type:'reportDataSave',
        payload:response.result,
      });
    },
    *queryProvince({payload, callback},{ call, put}){
      const response = yield call(provinceApi, payload);
      callback && callback(response);
      yield put({
        type:'provinceSave',
        payload:response.result,
      });
    },
    *queryCity({ payload }, { call, put }){
      const response = yield call( cityDataApi, payload);
      yield put({
        type:'cityDataSave',
        payload:response.result,
      });
    },
    *queryType({ payload },{ call, put }){
      const response = yield call(typeDataApi, payload );
      yield put({
        type:'typeDataSave',
        payload:response.result,
      });
    },
    *selectCity({ payload }, { call, put }){
      const response = yield call( cityDataApi, payload);
      yield put({
        type:'selectCitySave',
        payload:response.result,
      });
    },
    *addModItem({ payload, callback }, {call, put}){
      const response = yield call(addModItemApi, payload);
      callback && callback(response);
    },
    *queryTryGet({ payload, callback },{ call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
      const response = yield call(tryGetApi, payload);
      callback && callback(response);
      yield put({
        type:'tryGetSave',
        payload:response.result,
      });
    },
    *queryNews({payload},{ call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( newsListApi, payload );
      yield put({
        type:'newsListSave',
        payload:response.result,
      });
    },
    *queryDetail({ payload, callback }, { call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        },
      });
      const response = yield call( detailApi, payload );
      callback && callback(response);
      yield put({
        type:'detaliSave',
        payload:response.result,
      });
    },
    *queryRegular({ payload },{ call, put }){
      yield put({
        type:'loadingData',
        payload:{
          loading:true,
        }
      });      
      const response = yield call(regularApi, payload);
      yield put({
        type:'regularSave',
        payload:response.result,
      });
    },
    *addOrUpdate({ payload, callback }, { call, put }){
      const response = yield call( addOrUpdateApi, payload );
      callback && callback(response);
    },
    *itemDetele({ payload, callback }, { call, put }){
      const response = yield call(deleteApi, payload );
      callback && callback(response);
    },  
  },

};
