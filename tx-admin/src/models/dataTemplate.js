import { 
  templateDataApi,
  addTemplateApi,
  deleteTempleApi,
  updateDataApi,
  textCountApi
 } from '../services/xiaoCheng/textRecognition';

export default {
  namespace: 'dataTemplate',

  state: {
    loading:false,
    data:{
      list:[],
    },
    pagination:{
    },
    loading:false,
    textCount:{
      data:{
        total:0,
        dataList:[]
      },
    }
  },
  reducers: {
    changeData(state,{_}){
      return {
        ...state,
        loading:true,
      }
    },
    queryDataSave(state,{ payload }){
      const { dataList, pageNum, pageSize, total } = payload.data;
      return {
        ...state,
        data:{
          list:dataList,
        },
        pagination:{
          pageSize,
          current:pageNum,
          total,
          showTotal:(total)=>`共 ${total} 条`,
          showQuickJumper:true,
          showSizeChanger:true,
        },
        loading:false,
      }
    },
    saveTextCount( state, { payload }){
      return {
        ...state,
        textCount:payload
      }
    },
  },
  effects: {
    *queryData({ payload ,callback },{ call, put }){
      yield put({
        type:'changeData'
      })
      const response = yield call(templateDataApi, payload )
      yield put({
        type:'queryDataSave',
        payload:response,
      })
      callback && callback(response)

    },
    *addTemplate({ payload, callback },{ call, put }){
       const response = yield call(addTemplateApi, payload)
       callback && callback(response);
    },
    *delete({payload, callback },{ call, put }){
      const response = yield call( deleteTempleApi, payload );
      callback && callback(response);
    },
    *updateData({payload, callback },{ call, put }){
      const response = yield call( updateDataApi, payload)
      callback && callback(response);
    },
    *queryTextCount({ payload, callback },{ call, put }){
      const response = yield call(textCountApi, payload)

      if(response.code == 0 && response.data.dataList.length){
        let data = response.data.dataList;
        for(var i = 0; i < data.length; i++ ){
          response.data.dataList[i].id = i+1
        }
      }
      callback && callback(response);
      yield put({
        type:'saveTextCount',
        payload:response
      })
    },
  },
};
