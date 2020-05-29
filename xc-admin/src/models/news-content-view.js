import { notification } from 'antd';
import { newsDetail } from '../services/hot-word';
import { updateNewsContentArticle, newsSend, titleApi } from '../services/news-content-edit-api';


export default {
  namespace: 'newsContentView',
  state: {
    loading: false,
    contentEditData: '请输入内容...',
    readio: '',
    phoneSimulator: {
      viewUrl: 'https://baidu.com/',
      html: '',
      title: '',
      socuse: '',
      time: '',
      newsGroup:'',
      authAccess:'',
      videoUrl:'',
      code:'',
    },
    newsContentArticleId: '',
    newsId: '',
    newsType: -1,
    title:'',
    newsAbstract:'',
    eventTime:'',
    attention:'',
    contentType:'',
    loading: false,
  },

  reducers: {

    // 更改加载状态
    changeLoading(state, { payload }) {
      const { loading } = payload;
      return {
        ...state,
        loading, 
      };
    },

    // 更改 手机模拟器 html 内容
    changePhoneSimulatorHtml(state, { payload }) {
      const { html } = payload;
      state.contentEditData = html;
      state.phoneSimulator.html = html;
      return {
        ...state,
      };
    },

    // 查询新闻内容成功
    queryNewsContentSuccess(state, { payload }) {
      const { newsSource, addTime, title, newsType,contentType,
        newsId, newsContentArticleId, newsGroup, authAccess, authFileUrl, code,
        newsAbstract, createTime, attention } = payload.result;
      let article = payload.result.article || payload.result.authFileUrl || payload.result.data;
    
      state.contentEditData = article;
      state.phoneSimulator.html = article;
      state.phoneSimulator.socuse = newsSource;
      state.phoneSimulator.time = addTime;
      state.phoneSimulator.title = title;
      state.newsId = newsId;
      state.phoneSimulator.newsGroup = newsGroup;
      state.newsContentArticleId = newsContentArticleId;
      state.newsGroup = newsGroup;
      state.phoneSimulator.authAccess = authAccess;
      state.phoneSimulator.code = code;
      state.phoneSimulator.videoUrl = authFileUrl;
      state.newsType = newsType;
      state.newsAbstract = newsAbstract;
      state.eventTime = createTime;
      state.attention = attention;
      state.title = title;
      state.contentType = contentType;
      return {
        ...state,
      };
    },
    modifyTitle(state,{ payload }){
      
      let phoneSimulator = state.phoneSimulator;
      phoneSimulator.title = payload.title;
      return {
        ...state,
        phoneSimulator,
      }
    },
  },

  effects: {
    /**
     * 查询新闻内容
     */
    *queryNewsContent({ payload, callback }, { call, put }) {

      // 打开加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });

      // 发送请求
      const response = yield call(newsDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'queryNewsContentSuccess',
          payload: {
            result: response.result,
          },
        });
      }
      callback && callback(response);
      // 关闭加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
    },
   
    *newsSend({ payload, callback },{ call, put }){

      // 打开加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });

      const response = yield call(newsSend, payload);
        // 判断请求
      if (response.code === 0) {
        notification.success({
          message: '提示消息',
          duration:1,
          placement:'bottomRight',
          description: '操作成功!',
        });
        callback && callback(response.result);
      } else {
        notification.error({
          message: '提示消息',
          duration:1,
          placement:'bottomRight',
          description: '操作失败!',
        });
      }

      // 关闭加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
    },
    /**
     * 更新内容文章
     */
    *updateNewsContentArticle({ payload }, { call, put }) {

      // 打开加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });

      // 发送请求
      const response = yield call(updateNewsContentArticle, payload);

      // 判断请求
      if (response.code === 0) {
        notification.success({
          message: '提示消息',
          duration:1,
          placement:'bottomRight',
          description: '保存成功!',
        });
      } else {
        notification.error({
          message: '提示消息',
          duration:1,
          placement:'bottomRight',
          description: '操作失败!',
        });
      }

      // 关闭加载状态
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *modifyTitle({ payload, callback },{ call, put }){
      const response = yield call( titleApi, payload );
      callback && callback(response);
    },
  },
};

