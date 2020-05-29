import {
  query, removeNews, queryNewsContentArticleByNewsId, saveNews, queryNewsContentVideoList,
  updateNewsState,
  newsTopListApi,
  newsTopApi,
  newsCancelTopApi,
  getTabMenuApi,
  saveWaitAttention,
  hotNewsListApi,
  deleteHotApi,
  saveIconApi,
  iconListApi,
  deleteIconApi,
} from '../services/news-list';

export default {
  namespace: 'newsList',

  state: {
    data: {
      index: 0,
      list: [],
      pagination: {},
    },
    newsTopData:{
      index:0,
      list:[],
      pagination:{},
    },
    iconList:[],
    tabMenu:[],
    hotData:[],
    pagination: {},
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
    },
    newsTopSuccess(state, { payload }){
      
      const {data, index, size, total} = payload.result;
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        newsTopData:{
          index,
          list:data,
          pagination,
        },
        loading:false,
      }
    },
    saveTabMenu(state, { payload }){
     
      return {
        ...state,
        tabMenu:payload,
      };
    },
    saveHotNews(state, { payload }){
      const { data, index, size, total } = payload;
      const pagination = {
        current: index,
        pageSize: size,
        total,
        showQuickJumper:true,
        showSizeChanger:true,
      };
      return {
        ...state,
        hotData:data,
        pagination,
        loading:false,
      };
    },
    saveIconList( state, { payload }){
      let iconList = [];
      for(let i=0;i<payload.length;i++)
      {
        payload[i].number = i+1;
        iconList.push(payload[i])
      }
      return {
        ...state,
        iconList,
        loading:false,
      };
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
    *queryNewsContentArticleByNewsId({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsContentArticleByNewsId, payload);
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
      const response = yield call(saveNews, payload);
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeNews, payload.newsId);
      if (response.code === 0) {
        // yield put({
        //   type: 'query',
        // });
        // callback
        if (callback) callback();
      }
    },
    *queryContentVideoList({ payload }, { call, put }) {
      const response = yield call(queryNewsContentVideoList, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    *modifyNewsState({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsState, payload);
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
      callback && callback(response);
    },
    *newsTopList({ payload}, {call, put}){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(newsTopListApi, payload);

      yield put({
        type:'newsTopSuccess',
        payload:response,
      });
    },
    *newsTop({ payload, callback }, {call, put}){
      const response = yield call(newsTopApi, payload);
      callback && callback(response);
    },
    *newsCancelTop({ payload, callback }, {call, put}){
      const response = yield call(newsCancelTopApi, payload);
      callback && callback(response);
    },
    *getTabMenu({ payload, callback },{ call, put }){
      const response = yield call(getTabMenuApi, payload);
      callback && callback(response);
      yield put({
        type:'saveTabMenu',
        payload:response.result,
      });
    },
    *addStayAttention({ payload, callback },{ call, put }){
      const response = yield call(saveWaitAttention, payload);
      callback && callback(response);
    },
    *queryHotNews({ payload }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call(hotNewsListApi, payload);
      yield put({
        type:'saveHotNews',
        payload:response.result,
      });
    },
    *deleteHot({ payload, callback },{ call, put }){
      const response = yield call(deleteHotApi, payload );
      callback && callback(response);
    },
    *iconList({ payload, callback }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const  response = yield call(iconListApi, payload);
      yield put({
        type:'saveIconList',
        payload:response.result,
      });
    },
    *saveIcon({ payload, callback },{ call, put }){
      const response = yield call( saveIconApi, payload );
      callback && callback(response);
    },
    *deleteIcon({ payload, callback },{ call, put }){
      const response = yield call( deleteIconApi, payload );
      callback && callback(response);
    },
  },
};

