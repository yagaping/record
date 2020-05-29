import { 
  sendNewsApi,
} from '../services/news-edit-api';
import { convertHtmlToText } from '../components/FormatText';

export default {
  namespace: 'sendNews',

  state: {
    title:'',
    editData:'',
    viewNewsData:{
      title:'',
      newsAbstract:'',
      newsSource:'',
      newsType:'',
      imageUrl:[],
    },
    phoneSimulator:{
      viewUrl: 'https://baidu.com/',
      socuse:'', 
      time:'', 
      title:'', 
      html:'',
    },
    viewImageData:{
      title:'',
      newsAbstract:'',
      newsSource:'',
      imageUrlMore:[],
      imageUrl:[],
      newsType:'',
    },
    phoneSimulatorImg:{
      viewUrl: 'https://baidu.com/',
      socuse:'', 
      time:'', 
      title:'', 
      html:'',
    }
  },

  effects: {
   *addSendNews({ payload, callback },{ call, put }){
     const response = yield call(sendNewsApi, payload )
     callback && callback(response);
   },
  },
  reducers: {
  //富文本编辑修改 
   changeText(state,{ payload }){
    return {
      ...state,
      editData:payload.text,
    };
   },
  //  格式化
  formatText( state, { payload }){
     const {contentText, titleText, autorText } = payload;
     let text = contentText.replace(/(\<span(\s+?)style=\"display:none\"\>_MC_HAS_FORMAT_\<\/span\>)/g,'');  
      text = convertHtmlToText(text);
      state.phoneSimulator.socuse = autorText;
      state.phoneSimulator.title = titleText;
      state.phoneSimulator.html = text;
      state.editData = text;
      return {
        ...state,
      };
  },
  // 预览展示
  updateView(state, { payload }){
      const {contentText, titleText, asbstractText, autorText } = payload;
      state.phoneSimulator.socuse = autorText;
      state.phoneSimulator.title = titleText;
      state.phoneSimulator.html = contentText;
      const viewNewsData = {
        title:'',
        newsAbstract:'',
        newsSource:'',
        newsType:'',
        imageUrl:[],
      };
      return {
        ...state,
        viewNewsData,
      };
    },
  // 重置新闻数据
  resetNews(state, { payload }){
    state.editData = '';
    state.phoneSimulator.socuse = '';
    state.phoneSimulator.title = '';
    state.phoneSimulator.html = '';
    const viewNewsData = {
      title:'',
      newsAbstract:'',
      newsSource:'',
      newsType:'',
      imageUrl:[],
    };
    return {
      ...state,
      viewNewsData
    };
  },
  // 重置多图数据
  resetWriteNews(state, { payload }){
    state.phoneSimulatorImg.socuse = '';
    state.phoneSimulatorImg.title = '';
    state.phoneSimulatorImg.html = '';
    const viewImageData = {
      title:'',
      newsAbstract:'',
      newsSource:'',
      imageUrlMore:[],
      imageUrl:[],
      newsType:'',
    };
    return {
      ...state,
      viewImageData,
    };
  },
  updateViewImage(state, { payload }){
    const { titleText, imgTextArr, autorText } = payload;
    let html = '';
    state.phoneSimulatorImg.socuse = autorText;
    state.phoneSimulatorImg.title = titleText;
    for(let i=0;i<imgTextArr.length;i++){
      html += `
      <img src="${imgTextArr[i].imageUrl}" />
      <p>${imgTextArr[i].describe}</p>
      `;
    }
    state.phoneSimulatorImg.html = html;
    return {
      ...state
    };
  },
  initialize(state, { payload }){
      const { contentType, article, title,newsAbstract,
      newsSource,imageUrl,newsType,imageUrlMore } = payload;
      if(contentType == 0){
         state.editData = article;
         state.viewNewsData.title = title;
         state.viewNewsData.newsAbstract = newsAbstract;
         state.viewNewsData.newsSource = newsSource;
         state.viewNewsData.newsType = newsType;
         state.viewNewsData.imageUrl = imageUrl;
      }else if( contentType == 1){
        state.viewImageData.title = title;
        state.viewImageData.newsAbstract = newsAbstract;
        state.viewImageData.newsSource = newsSource;
        state.viewImageData.newsType = newsType;
        state.viewImageData.imageUrlMore = imageUrlMore;
        state.viewImageData.imageUrl = imageUrl;
      }
      return {
        ...state,
      };
    },
  },
};
