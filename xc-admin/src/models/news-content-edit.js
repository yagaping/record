import { notification } from 'antd';
import { newsDetail } from '../services/hot-word';
import { convertHtmlToText } from '../components/FormatText';
import { 
  updateNewsContentArticle, 
  newsSend, 
  titleApi,
  simpleNewsApi, 
  hotIconApi,
} from '../services/news-content-edit-api';


export default {
  namespace: 'newsContentEdit',
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
    },
    hotIconList:[],
    newsContentArticleId: '',
    newsId: '',
    newsType: -1,
    contentType:'',
    title:'',
    newsAbstract:'',
    eventTime:'',
    createTime:'',
    attention:'',
    concise:0,
    specialTopic:0,
    accessCount:0,
    hasHot:'',
    newsState:null,
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
      let article;
      if(payload.result !== null ){
          const { newsSource, addTime, createTime, title, newsType, contentType,
                  newsId, newsContentArticleId, newsGroup,newsAbstract, 
                  attention,concise,specialTopic,accessCount, hasHot, newsState } = payload.result;
          // 是否为标记新闻
          if(payload.result.article.indexOf('_MC_HAS_FORMAT_') >= 0){
            article = payload.result.article;
          }else{
            article = convertHtmlToText(payload.result.article);
          }

          state.contentEditData = article;
          state.phoneSimulator.html = article||'';
          state.phoneSimulator.socuse = newsSource;
          state.phoneSimulator.time = addTime;
          state.phoneSimulator.title = title;
          state.newsId = newsId;
          state.phoneSimulator.newsGroup = newsGroup;
          state.newsContentArticleId = newsContentArticleId;
          state.newsGroup = newsGroup;
          state.newsType = newsType;
          state.title = title;
          state.newsAbstract = newsAbstract;
          state.eventTime = addTime;
          state.createTime = createTime;
          state.attention = attention;
          state.contentType = contentType;
          state.concise = concise;
          state.specialTopic = specialTopic;
          state.accessCount = accessCount;
          state.newsState = newsState;
          state.hasHot = hasHot;
      }
      return {
        ...state,
      };
    },
    // 移除数据
    removeData( state, _){
      state.contentEditData = '';
      state.phoneSimulator.html = '';
      state.phoneSimulator.socuse = '';
      state.phoneSimulator.title = '';
      return {
        ...state,
      }
    },
    saveHotIcon( state, { payload }){
      return {
        ...state,
        hotIconList:payload,
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
        callback && callback(response);
      }

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
    // 添加简洁新闻
    *addSimpleNews({ payload, callback }, { call, put }){
      const response = yield call(simpleNewsApi, payload);
      callback && callback(response);
    },
    // 查询热门标识
    *queryHotIcon({ payload, callback }, { call, put }){
      const response = yield call( hotIconApi, payload );
      yield put({
        type:'saveHotIcon',
        payload:response.result,
      });
    },
  },
};

