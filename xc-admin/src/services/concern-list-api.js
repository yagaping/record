import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = 'work-api/';
const APP_API = 'app-api/';

export async function concernListApi(params) {
  return request(`${MODULE_URL}attention/getAllList`,{
    method:'POST',
    body:params,
  });
}

export async function deleteApi(params) {
  return request(`${MODULE_URL}attention/delete`,{
    method:'POST',
    body:params,
  });
}

export async function concernDetailApi(params) {
  return request(`${MODULE_URL}attention/getDetailsList`,{
    method:'POST',
    body:params,
  });
}

export async function stayConcernApi(params) {
  return request(`${MODULE_URL}attention/getConcernedList`,{
    method:'POST',
    body:params,
  });
}

export async function deleteStayApi(params) {
  return request(`${MODULE_URL}attention/deleteConcerned`,{
    method:'POST',
    body:params,
  });
}

export async function concernTypeApi(params) {
  return request(`${MODULE_URL}attention/getEventList?${stringify(params)}`, {
    method:'GET',
  });
}


export async function addConcernApi(params) {
  return request(`${MODULE_URL}attention/insert`, {
    method:'POST',
    body:params,
  });
}

export async function modifeApi(params) {
  return request(`${MODULE_URL}attention/update`, {
    method:'POST',
    body:params,
  });
}
