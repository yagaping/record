import { pageMoreMenuApi,
  modifyMoreMenuApi,
  } from '../services/content-mgr-api';

export default {
  namespace: 'pageMenu',
  state:{
    moureList:[],
    loading:false,
  },
  reducers:{
    changeLoading(state,{ payload }){
      return {
        ...state,
        loading:payload.loading,
      }
    },
    pageMoreMenuSuccess( state, { payload }){
      let menu = {
        imgUrl:'',
        title:'',
        httpUrl:'',
        cId:'',
      };
      let data = payload.headerInfo;
      let moureList = [];
      for(let i=0;i<data.length;i++){
        menu = {
          imgUrl:data[i].logoUrl,
          title:data[i].name,
          httpUrl:data[i].linkUrl,
          cId:data[i].cId,
        };
        moureList.push(menu);
      }
      return {
        ...state,
        moureList,
        loading:false,
      }
    },
    changeIco(state, { payload }){
      let moureList = state.moureList;
      for(let i=0;i<moureList.length;i++ ){
        if(moureList[i].cId === payload){
          moureList[i].title = 'level';
          break;
        }
      }
      return {
        ...state,
        moureList,
      }
    },
  },
  effects:{
    *quyerPageMoreMenu({ payload, callback },{ call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
        const response = yield call( pageMoreMenuApi, payload );
        if(response.code === 0){
            callback && callback(response.result);
            yield put({
              type:'pageMoreMenuSuccess',
              payload:response.result,
            });
        }
    },
    *modifyMoreMenu({ payload, callback }, { call, put }){
      const response = yield call(modifyMoreMenuApi,payload);
      if(response.code === 0){
        callback&&callback();
      }
    },

  },
};

