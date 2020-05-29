import { 
  querySoftApi,
  querySoftVersionApi,
  deleteSoftItemApi,
  addSoftItemApi,
  deleteSoftVersionApi,
  updateSoftItemApi,
  uploadFileApi,
  AddSoftVersionItemApi,
  modlSoftVersionItemApi,
  tabMenuApi
} from '../services/softWare/softApi';
export default {
  namespace: 'softWare',

  state: {
      data:{
          dataList:[],
          list:[],
          pageList:{
              total:0,
              dataList:[]
          }
      },
      version:{
        list:[
            {
                key:'-1',
                edition:null,
                name:''
            }
        ],
        pageList:{
            total:0,
            dataList:[]
        }
      },
      editionList:[{
          name:''
      }]
  },

  effects: {
      //项目
    *querySoft({ payload,callback }, { call, put}) {
        const response = yield call(querySoftApi, payload);
        yield put({
            type: 'softSave',
            payload: response,
        });
        callback && callback(response.data);
    },
      //项目版本
      *querySoftVersion({ payload,callback }, { call, put}) {
          const response = yield call(querySoftVersionApi, payload);
          yield put({
              type: 'softVersionSave',
              payload: response.data.data,
          });
          callback && callback(response.data);
      },
        //  删除项目
      *deleteSoftItem({ payload, callback },{ call, put }){
        const response = yield call(deleteSoftItemApi, payload);
        callback && callback(response.data)
      },
     *addSoftItem({payload, callback},{ call, put }){
        const response = yield call(addSoftItemApi, payload);
        callback && callback(response.data)
     },
     *updateSoftItem({payload, callback},{ call, put }){
        const response = yield call(updateSoftItemApi, payload);
        callback && callback(response.data)
     },
    //  删除项目版本
    *deleteSoftVersion({ payload, callback },{ call, put }){
        const response = yield call(deleteSoftVersionApi, payload);
        callback && callback(response.data)
    },
    // 上传文件
    *uploadFile({ payload, callback },{ call, put }){
        const response = yield call(uploadFileApi, payload);
        callback && callback(response);
    },
    // 添加版本
    *AddSoftVersionItem({ payload, callback },{ call, put }){
        const response = yield call(AddSoftVersionItemApi, payload);
        callback && callback(response.data);
    },
    // 修改版本
    *modlSoftVersionItem({ payload, callback },{ call, put }){
        const response = yield call(modlSoftVersionItemApi, payload);
        callback && callback(response.data)
    },
    // 查询分类
    *queryTabMenu({ payload, callback },{ call, put }){
        const response = yield call(tabMenuApi, payload)
        yield put({
            type:'saveEditonList',
            payload:response.data.data
        })
        callback && callback(response);
    }
  },

  reducers: {
    softSave(state, { payload }) {
          return {
              ...state,
              ...payload.data,
          };
      },
      softVersionSave(state, { payload }) {
        return {
            ...state,
            version:{...payload}
        };
    },
    saveEditonList(state,{ payload }){
        return {
            ...state,
            editionList:payload.editionList
        }
    }
  },
};
