import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';
const MODULE_XL = 'app-api/';

export async function listApi(params) {
  return request(`${MODULE_URL}screenAdvertising/getAdvertisingList`,{
    method:'POST',
    body:params
  });
}

export async function productApi(params) {
  return request(`${MODULE_URL}screenAdvertising/getAdvertisingProduct?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addItemApi(params) {
  return request(`${MODULE_URL}screenAdvertising/insert`,{
    method:'POST',
    body:params,
  });
}

export async function modifyItemApi(params) {
  return request(`${MODULE_URL}screenAdvertising/update`,{
    method:'POST',
    body:params,
  });
}

export async function deleteItemApi(params) {
  return request(`${MODULE_URL}screenAdvertising/delete`,{
    method:'POST',
    body:params,
  });
}
