import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';
const MODULE_XL = 'app-api/';

export async function queryApi(params) {
  return request(`${MODULE_URL}work/feedbackByList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function promotionApi(params) {
  return request(`${MODULE_URL}work/promotionsList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function promotionSubmitApi(params) {
  return request(`${MODULE_URL}work/saveOrUpdatePromotion`,{
    method:'POST',
    body:params,
  });
}

export async function itemDataApi(params) {
  return request(`${MODULE_URL}work/promotionById?${stringify(params)}`,{
    method:'GET',
  });
}

export async function switchSpeedApi(params) {
  return request(`${MODULE_URL}work/switchById`,{
    method:'GET',
  });
}

export async function updateSwitchApi(params) {
  return request(`${MODULE_URL}work/updateByNetworkSpeedSwitch`,{
    method:'POST',
    body:params,
  });
}

export async function submitFormApi(params) {
  return request(`${MODULE_URL}work/networkSpeedList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function saveOrUpdateNetworkSpeed(params) {
  return request(`${MODULE_URL}work/saveOrUpdateNetworkSpeed`,{
    method:'POST',
    body:params,
  });
}

export async function speedDetailApi(params) {
  return request(`${MODULE_URL}work/networkSpeedById?${stringify(params)}`,{
    method:'GET',
  });
}

export async function newsSend(params) {
  return request(`${MODULE_XL}push/broadcastDevice`,{
    method:'POST',
    body:params,
  });
}

export async function newsSendApi(params) {
  return request(`${MODULE_XL}push/getPushList`,{
    method:'POST',
    body:params,
  });
}

export async function deleteRowApi(params) {
  return request(`${MODULE_URL}work/deleteFeedbackById?${stringify(params)}`,{
    method:'GET',
  });
}

export async function defaultPushApi(params) {
  return request(`${MODULE_XL}push/invalidStatus`,{
    method:'POST',
    body:params,
  });
}

export async function attendtionApi(params) {
  return request(`${MODULE_URL}attention/eventPush`,{
    method:'POST',
    body:params,
  });
}

export async function errorDataApi(params) {
  return request(`${MODULE_URL}correnction/queryAllList`,{
    method:'POST',
    body:params,
  });
}

export async function deleteErrorApi(params) {
  return request(`${MODULE_URL}correnction/delete`,{
    method:'POST',
    body:params,
  });
}






