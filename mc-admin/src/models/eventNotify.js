import { eventNotify,} from '../services/discovery/eventRemind';
export default {
    namespace: 'eventNotify',

    state: {
        data: {
            dataList: [],
            total: 0
        },
    },

    effects: {
         //用户统计
         *findAll({ payload, callback }, {call, put}) {
            const response = yield call(eventNotify, payload);
            yield put({
                type: '_eventNotify',
                payload: response,
            });
            if( callback ) callback(response);
        },
    },

    reducers: {
        _eventNotify(state, { payload }) {
            for(let i = 0;i < payload.data.dataList.length; i++ ){
                payload.data.dataList[i].key = i+1;
            }
            return {
                ...state,
               ...payload,
            };
        },
    },
};
