import {
  addNewsVideo, queryNewsContentList, queryQuestionImageList, queryNewsContentAnswerList, updateNewsAnswer,
  deleteNewsAnswer, updateNewsQuestion, addNewsQuestion, addNewsQuestionImage, updateNewsQuestionImage,
  deleteNewsQuestionImage, queryNewsQuestionAnswerImageList, addNewsQuestionAnswerImage, updateNewsQuestionAnswerImage,
  queryNewsQuestionAnswerVideoList, addNewsQuestionAnswerVideo, updateNewsQuestionAnswerVideo, saveOrupdateNewsPicture,
  queryNewsImageList, addNewsImage, updateNewsImage, queryNewsContentAnswerById,
  concernTypeApi,
  addConcernApi,
  specialTypeApi,
  addSpecialApi,
  hotNewsApi,
} from '../services/news-list';

export default {
  namespace: 'newsContentList',

  state: {
    data: {
      index: 0,
      list: [],
      pagination: {},
    },
    answerData: {
      index: 0,
      list: [],
      pagination: {},
    },
    loading: false,
    saveModalVisible: false,
    newsAnswer: {
      newsContentAnswerId: null,
      newsId: null,
      userId: null,
      dataKey: null,
      sourceUrl: null,
      browserUser: null,
      contentAbstract: null,
      content: null,
    },
    concernTypeData:[],
  },

  reducers: {
    changeTableLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
    querySuccess(state, { payload }) {
      const { data, total, index, size } = payload.result;
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
    queryAnswerContentSuccess(state, { payload }) {
      return {
        ...state,
        newsAnswer: payload.newsAnswer,
      };
    },
    queryAnswerSuccess(state, { payload }) {
      const { data, total, index, size } = payload.result;
      const pagination = {
        current: index + 1,
        pageSize: size,
        total,
      };
      return {
        ...state,
        answerData: {
          index,
          list: data,
          pagination,
        },
        loading: false,
      };
    },
    saveConcernType(state,{ payload }){
      return {
        ...state,
        concernTypeData:Object.keys(payload).length?payload:[],
      }
    },
    saveSpecialType(state, { payload }){
     
      return {
        ...state,
        concernTypeData:payload && Object.keys(payload).length?payload:[],
      }
    },
  },

  effects: {
    /**
     * 新闻内容列表
     * @param payload
     * @param call
     * @param put
     */
    *query({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsContentList, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 添加视频新闻内容视频
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addVideo({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsVideo, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 查询问答新闻问题图片列表
     * @param payload
     * @param call
     * @param put
     */
    *queryQuestionImage({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryQuestionImageList, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 编辑问答新闻问题
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsQuestion({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsQuestion, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 添加问答新闻问题
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addQuestion({ payload, callback }, { call, put }) {
      console.log('payload', payload);
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsQuestion, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 编辑问答新闻答案
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsAnswer({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsAnswer, payload);
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
     * 删除/恢复问答新闻答案
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *deleteNewsAnswer({ payload, callback }, { call, put }) {
      const response = yield call(deleteNewsAnswer, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 查询问答新闻答案列表
     * @param payload
     * @param call
     * @param put
     */
    *queryAnswerList({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsContentAnswerList, payload);
      if (response.code === 0) {
        yield put({
          type: 'queryAnswerSuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 添加问答新闻问题图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addQuestionImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsQuestionImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 修改问答新闻问题图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsQuestionImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsQuestionImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 删除问答新闻问题图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *deleteNewsQuestionImage({ payload, callback }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(deleteNewsQuestionImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 查询问答新闻答案图片列表
     * @param payload
     * @param call
     * @param put
     */
    *queryQuestionAnswerImageList({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsQuestionAnswerImageList, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 添加问答新闻问题图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addQuestionAnswerImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsQuestionAnswerImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 修改问答新闻问题图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsQuestionAnswerImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsQuestionAnswerImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 查询问答新闻答案视频列表
     * @param payload
     * @param call
     * @param put
     */
    *queryQuestionAnswerVideoList({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsQuestionAnswerVideoList, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 添加问答新闻问题视频
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addQuestionAnswerVideo({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsQuestionAnswerVideo, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 修改问答新闻问题视频
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsQuestionAnswerVideo({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsQuestionAnswerVideo, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 保存/修改新闻图片内容
     * @param payload
     * @param call
     * @param put
     */
    *saveOrUpdateNewsArticlePicture({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(saveOrupdateNewsPicture, payload.values);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 查询新闻图片列表
     * @param payload
     * @param call
     * @param put
     */
    *queryByNewsImageList({ payload }, { call, put }) {
      yield put({
        type: 'changeTableLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryNewsImageList, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: {
            result: response.result,
          },
        });
      }
    },
    /**
     * 添加新闻图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *addImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(addNewsImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    /**
     * 修改新闻图片
     * @param payload
     * @param callback
     * @param call
     * @param put
     */
    *modifyNewsImage({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(updateNewsImage, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoading',
          payload: {
            loading: false,
          },
        });

        if (callback) callback();
      }
    },
    *queryNewsContentAnswer({ payload }, { call, put }) {
      const response = yield call(queryNewsContentAnswerById, payload.params);
      if (response.code === 0) {
        yield put({
          type: 'queryAnswerContentSuccess',
          payload: {
            newsAnswer: response.result,
          },
        });
      }
    },
    *concernType({ payload },{ call, put }){
      const response = yield call(concernTypeApi, payload);
      yield put({
        type:'saveConcernType',
        payload:response.result,
      });
    },
    *specialType({ payload },{ call, put }){
      const response = yield call(specialTypeApi, payload);
      yield put({
        type:'saveSpecialType',
        payload:response.result,
      });
    },
    *addConcern({ payload, callback },{ call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( addConcernApi, payload );
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:false,
        },
      });
      callback && callback(response);
    },
    *addSpecial({ payload, callback }, { call, put }){
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:true,
        },
      });
      const response = yield call( addSpecialApi, payload );
      yield put({
        type:'changeTableLoading',
        payload:{
          loading:false,
        },
      });
      callback && callback(response);
    },
    *addHotNews({ payload, callback}, { call, put }){
      console.log(payload);
      const response = yield call(hotNewsApi, payload );
      callback && callback(response);
    },
  },
};

