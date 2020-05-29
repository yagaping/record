import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';

export async function specialApi(params) {
  return request(`${MODULE_URL}/specialTopic/selectAllList`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteSpecialApi(params) {
  return request(`${MODULE_URL}/specialTopic/delete`, {
    method: 'POST',
    body: params,
  });
}

export async function detailApi(params) {
  return request(`${MODULE_URL}/specialTopic/selectAllSeriesList`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteDetaiApi(params) {
  return request(`${MODULE_URL}/specialTopic/deleteSeries`, {
    method: 'POST',
    body: params,
  });
}

export async function modifeSpecialApi(params) {
  return request(`${MODULE_URL}/specialTopic/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updateSpecialApi(params) {
  return request(`${MODULE_URL}specialTopic/upDownTopic`, {
    method: 'POST',
    body: params,
  });
}






