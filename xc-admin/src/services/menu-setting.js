import request from '../utils/request';
import { stringify } from 'qs';
const MODULE_URL = '/work-api';

export async function menuListApi(params) {
  return request(`${MODULE_URL}/work/functionList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function projectListApi(params) {
  return request(`${MODULE_URL}/work/projectAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addDataApi(params) {
  return request(`${MODULE_URL}/work/saveFunction`,{
    method:'POST',
    body:params,
  });
}

export async function upadteDataApi(params) {
  return request(`${MODULE_URL}/work/updateFunction`,{
    method:'POST',
    body:params,
  });
}

export async function deleteDataApi(params) {
  return request(`${MODULE_URL}/work/deleteFunction?${stringify(params)}`,{
    method:'GET',
  });
}


