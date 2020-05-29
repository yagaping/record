import {
  ContentTypeApi,
} from '../services/content-mgr-api';
import {notificationError} from "../utils/common";
import {routerRedux} from "dva/router";

const _TYPE={
  'head':'头条',
  'video':'视频',
  'inter':'娱乐',
  'ask':'问答',
  'talk':'段子',
  'other':'其他',
};

export default {
  namespace: 'formalContent',
  state: {
      data:{},
  },

  reducers: {
    ContentTypeSuccess( state, { payload }){
      const people = payload.personSuccessCount; //人工审核
      const machine = payload.machineSuccessCount; //机器审核
      const formalData = people + machine;  //正式内容
      const group={
        head:{sum:0,people:0,machine:0},
        video:{sum:0,people:0,machine:0},
        inter:{sum:0,people:0,machine:0},
        ask:{sum:0,people:0,machine:0},
        talk:{sum:0,people:0,machine:0},
        other:{sum:0,people:0,machine:0},
        }; 
      const sumArr = payload.newsGroupData;
      const peopleArr = [].concat(payload.errorData, payload.successData
      );
      const machineArr = payload.data;
      for(let i=0;i<sumArr.length;i++){
        switch(sumArr[i].newsGroup){
          case 0:
            group['head'].sum = sumArr[i].count;
            break;
          case 20:
            group['video'].sum = sumArr[i].count;
            break;
          case 1:
            group['inter'].sum = sumArr[i].count;
            break;
          case 5:
            group['ask'].sum = sumArr[i].count;
            break;
          case 4:
            group['talk'].sum = sumArr[i].count;
            break;
          default:
            group['other'].sum += sumArr[i].count;
            break;
        }
      }
      for(let i=0;i<peopleArr.length;i++){
        switch(peopleArr[i].newsGroup){
          case 0:
            group['head'].people += peopleArr[i].count;
            break;
          case 20:
            group['video'].people += peopleArr[i].count;
            break;
          case 1:
            group['inter'].people += peopleArr[i].count;
            break;
          case 5:
            group['ask'].people += peopleArr[i].count;
            break;
          case 4:
            group['talk'].people += peopleArr[i].count;
            break;
          default:
            group['other'].people += peopleArr[i].count;
            break;
        }
      }
      for(let i=0;i<machineArr.length;i++){
        switch(machineArr[i].newsType){
          case 0:
            group['head'].machine = machineArr[i].successCount+machineArr[i].errorCount;
            break;
          case 20:
            group['video'].machine = machineArr[i].successCount+machineArr[i].errorCount;
            break;
          case 1:
            group['inter'].machine = machineArr[i].successCount+machineArr[i].errorCount;
            break;
          case 5:
            group['ask'].machine = machineArr[i].successCount+machineArr[i].errorCount;
            break;
          case 4:
            group['talk'].machine = machineArr[i].successCount+machineArr[i].errorCount;
            break;
          default:
            group['other'].machine += machineArr[i].successCount+machineArr[i].errorCount;
            break;
        }
      }
      let selectAll = [];
      let selectPeople = [];
      let selectMachine = []
      for(let item in group){
        group[item]['peoplePct'] = (group[item].people/formalData*100).toFixed(2)+'%';
        group[item]['machinePct'] = (group[item].machine/formalData*100).toFixed(2)+'%';
        selectAll.push({
          item:_TYPE[item],
          count:group[item].people+group[item].machine,
        });
        selectPeople.push({
          item:_TYPE[item],
          count:group[item].people,
        });
        selectMachine.push({
          item:_TYPE[item],
          count:group[item].machine,
        });
      }
      return {
        ...state,
        data:{
          ...group,
          formalData,
          people,
          machine,
          selectAll,
          selectPeople,
          selectMachine,
        },
      }
    },
  },

  effects: {
    *queryContentType( { payload }, { call, put }){
      const response = yield call(ContentTypeApi,payload);
      if(response.code === 0){
        yield put({
          type:'ContentTypeSuccess',
          payload:response.result,
        });
      }
    },
  },
};

