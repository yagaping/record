import {
  queryNewsById, updateNews, queryNewsContentVideoById
  , updateNewsVideo, saveOrupdateNewsArticle,
} from '../services/news-list';

export default {
  namespace: 'newsEdit',

  state: {
    loading: false,
    news: {
      newsId: null,
      dataKey: null,
      title: null,
      newsHot: null,
      newsUrl: null,
      newsSource: null,
      newsSourceUrl: null,
      newsType: null,
      contentType: null,
      keywords: null,
      banComment: null,
      commentCount: null,
      newsAbstract: null,
      displayTime: null,
      videoCount: null,
      playCount: null,
      shareUrl: null,
      shareCount: null,
      collectCount: null,
      imageCount: null,
      qaCount: null,
      likeCount: null,
      displayType: null,
      newsState: null,
      createTime: null,
      addTime: null,
      recommendAnswerId: null,
      newsContentArticleId: null,
      article: null,
      articleType: null,
    },
    newsVideo: {
      newsContentVideoId: null,
      newsId: null,
      videoUrl: null,
      fileUrl: null,
      durationTime: null,
      videoFormat: null,
      videoIntroduce: null,
      videoImage: null,
      videoImageWidth: null,
      videoImageHeight: null,
      authAccess: null,
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        news: payload.news,
      };
    },
    queryVideoSuccess(state, { payload }) {
      return {
        ...state,
        newsVideo: payload.newsVideo,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
  },

  effects: {
    *queryNewsById({ payload }, { call, put }) {
      const response = yield call(queryNewsById, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            news: response.result,
          },
        });
      }
    },
    *edit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNews, payload.values);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        payload.goBack();
      }
    },
    /**
     * 保存/修改新闻图文内容
     * @param payload
     * @param call
     * @param put
     */
    *saveOrUpdateNewsArticleContent({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(saveOrupdateNewsArticle, payload.values);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        payload.goBack();
      }
    },
    *queryNewsContentVideoById({ payload }, { call, put }) {
      const response = yield call(queryNewsContentVideoById, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'queryVideoSuccess',
          payload: {
            newsVideo: response.result,
          },
        });
      }
    },
    *editVideo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsVideo, payload.values);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        payload.goBack();
      }
    },
  },
};

