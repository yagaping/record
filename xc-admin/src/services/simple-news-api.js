import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';

export async function simpleNewsApi(params) {
  return request(`${MODULE_URL}/concise/selectAllList`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteNewsApi(params) {
  return request(`${MODULE_URL}/concise/delete`, {
    method: 'POST',
    body: params,
  });
}