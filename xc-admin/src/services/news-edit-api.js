import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = 'work-api/';
const APP_API = 'app-api/';

export async function sendNewsApi(params) {
  return request(`${MODULE_URL}work/saveUpdateDraftNews`,{
    method:'POST',
    body:params,
  });
}

export async function sendNewsListApi(params) {
  return request(`${MODULE_URL}work/listDraftNews?${stringify(params)}`,{
    method:'GET',
  });
}

export async function someNewsApi(params) {
  return request(`${MODULE_URL}/work/draftNews?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function deleteNewsApi(params) {
  return request(`${MODULE_URL}work/deleteDraftNews?${stringify(params)}`, {
    method: 'GET',
  });
}

