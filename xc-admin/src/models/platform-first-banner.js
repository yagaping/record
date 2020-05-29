import { 
  productApi,
  listApi,
  addItemApi,
  modifyItemApi,
  deleteItemApi,
} from '../services/platform-first-api';

export default {
  namespace: 'firstBanner',
  state:{
    listData:[],
    productData:null,
    pagination:{},
    loading:false,
  },
  reducers:{
    changeLoading(state, { payload }){
      return {
        ...state,
        loading:payload.loading,
      };
    },
    productSave(state, { payload }){
      
      let arr = [];
      let productData = [];
      for(let i=0;i<payload.length;i++){
        arr.push(payload[i].product);
      }
      for(let i=0;i<arr.length;i++){
        if(productData.indexOf(arr[i]) == -1){
          productData.push(arr[i]);
        }
      }
      return {
        ...state,
        productData,
      }
    },
    listSave(state, { payload }){
      const { data, index, size, total } = payload;
      const pagination = {
        showQuickJumper:true,
        showSizeChanger:true,
        total,
        current:index,
        pageSize:size,
      };
      if(data.length){
        for(let i=0; i<data.length;i++)
        {
          data[i]['number'] = i+1;
        }
      }
      
      return {
        ...state,
        listData:data,
        pagination,
        loading:false,
      }
    },
  },
  effects:{
    *queryProduct({ payload }, { call, put }){
      const response = yield call(productApi, payload );
      yield put({
        type:'productSave',
        payload:response.result,
      });
    },
    *queryList({ payload, callback }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:{
          loading:true,
        },
      });
      const  response = yield call(listApi, payload );
      callback && callback(response);
      yield put({
        type:'listSave',
        payload:response.result,
      });
    },
    *addItem({ payload, callback }, { call, put }){
      const response = yield call(addItemApi, payload );
      callback && callback(response);
    },
    *modifyItem({ payload, callback }, { call, put }){
      const response = yield call(modifyItemApi, payload );
      callback && callback(response);
    },
    *deleteItem({ payload, callback }, { call, put }){
      const  response = yield call(deleteItemApi, payload);
      callback && callback(response);
    },
  },
};

