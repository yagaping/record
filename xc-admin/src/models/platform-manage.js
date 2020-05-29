import { 
  promotionApi, 
  promotionSubmitApi,
  itemDataApi,
  switchSpeedApi,
  updateSwitchApi,
  submitFormApi,
  saveOrUpdateNetworkSpeed,
  speedDetailApi,
  newsSend,
  newsSendApi,
  defaultPushApi,
  attendtionApi,
} from '../services/platform-api';

export default {
  namespace: 'platformManage',
  state:{
    promotionData:[],
    promotionForm:{},
    speedData:[],
    newsData:[],
    index:0,
    pagination:{},
    switch:false,
    loading:false,
    loadingSpin:false,
  },
  reducers:{
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    changeSpin(state, { payload }){
      return {
        ...state,
        loadingSpin:payload,
      }
    },
    promotionSave(state, { payload }){
      const { data, total, index, size } = payload;
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        promotionData:data,
        pagination,
        index,
        loading:false,
      };
    },
    submitFormSave(state, { payload }){
      const { data, total, index, size } = payload;
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        speedData:data,
        pagination,
        index,
        loading:false,
      };
    },
    newsListSave(state, { payload }){
      const { data, total, index, size } = payload;
    
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        newsData:data,
        pagination,
        index,
        loading:false,
      };
    },
  },
  effects:{
    *queryPromotion({ payload },{ call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(promotionApi, payload);
      yield put({
        type:'promotionSave',
        payload:response.result,
      });
    },
    *promotionSubmit({ payload, callback }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(promotionSubmitApi, payload);
      callback && callback(response);
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:false,
        },
      });
    },
    *itemData({ payload, callback }, { call, put }){
      const response = yield call(itemDataApi, payload);
      callback && callback(response.result);
    },
    *switchSpeed({ payload, callback }, { call, put }){

      const response = yield call(switchSpeedApi, payload );
      callback && callback(response.result);
    },
    *updateSwitch({ payload, callback },{ call, put }){
      yield put({
        type:'changeSpin',
        payload:true,
      });
      const response = yield call( updateSwitchApi, payload); 
      callback && callback(response.result);
      yield put({
        type:'changeSpin',
        payload:false,
      });
    },
    *submitForm({ payload, callback},{ call, put}){
      yield put({
        type:'changeTableLoading',
        payload:{loading:true},
      });
      const response = yield call( submitFormApi, payload );
      yield put({
        type:'submitFormSave',
        payload:response.result,
      });
    },
    *saveOrUpdateNetworkSpeed({payload, callback},{call,put}){
      const response = yield call( saveOrUpdateNetworkSpeed , payload);
      callback && callback(response);
    },
    *speedDetail({payload, callback},{call, put}){
      const response = yield call(speedDetailApi, payload);
      if(response.code === 0){
        yield put({
          type:'speedDetailSave',
          payload:response.result,
        });
        callback && callback(response.result);
      }
    },
    *newsSendQuery({payload, callback }, { call, put }){
        yield put({
          type:'changeTableLoading',
          payload:{
            loading:true,
          },
        });
        const response = yield call(newsSend, payload );
        callback && callback(response);
        yield put({
          type:'changeTableLoading',
          payload:{
            loading:false,
          },
        })
    },
    *newsSendList({ payload }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{loading:true},
      });
      const response = yield call(newsSendApi, payload );
      if(response.code === 0){
        yield put({
          type:'newsListSave',
          payload:response.result,
        });
      }
    },
    *defaultPush({ payload, callback }, { call, put }){
      const response = yield call(defaultPushApi, payload);
      callback && callback(response);
    },
    *attentionSend({ payload, callback },{ call, put }){
      const response = yield call(attendtionApi, payload );
      callback && callback(response);
    },
  },
};

