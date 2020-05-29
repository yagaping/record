import { menuListApi,
  projectListApi,
  addDataApi,
  upadteDataApi,
  deleteDataApi,
} 
from '../services/menu-setting';
export default {
  namespace: 'menuSetting',

  state: {
    menuList:[],
    projectList:[],
    loading:false,
  },

  reducers: {
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    menuListSuccess( state, { payload }){
      const menuList = payload.result;
      return {
        ...state,
        menuList,
        loading:false,
      }
    },
    projectListSuccess( state, { payload }){
      const projectList = payload;
      return {
        ...state,
        projectList,
      }
    }
  },

  effects: {
    *queryProjectList({ payload, callback }, { call, put }){
      const response = yield call( projectListApi, payload );
      callback && callback(response.result);
      yield put({
        type:'projectListSuccess',
        payload:response.result,
      });
    },
    *queryMenuList({ payload }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( menuListApi, payload );
      yield put({
        type:'menuListSuccess',
        payload:response.result,
      });
    },  
    *addData({ payload, callback }, { call, put }){
      const response = yield call(addDataApi,payload);
      callback && callback();
    },
    *upadteData({ payload, callback }, { call, put }){
      const response = yield call(upadteDataApi, payload);
      callback && callback();
    },
    *deleteData({ payload, callback }, { call, put }){
      const response = yield call(deleteDataApi, payload);
      callback && callback();
    },
  },
};

