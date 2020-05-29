import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = '/work-api';
export async function query() {
  return request(`${MODULE_URL}/work/hot_word`);
}

export async function queryById(params) {
  return request(`${MODULE_URL}/work/hot_work/${params.id}`);
}

export async function saveHotWord(params) {
  return request(`${MODULE_URL}/work/hot_word`, {
    method: 'POST',
    body: params,
  });
}

export async function updateHotWord(params) {
  return request(`${MODULE_URL}/work/hot_word`, {
    method: 'PUT',
    body: params,
  });
}

export async function removeHotWord(id) {
  return request(`${MODULE_URL}/work/hot_word/${id}`, {
    method: 'DELETE',
  });
}

export async function releaseHotWord(id) {
  return request(`${MODULE_URL}/work/hot_word/${id}/release`, {
    method: 'PUT',
  });
}

export async function notReleaseHotWord(id) {
  return request(`${MODULE_URL}/work/hot_word/${id}/not_release`, {
    method: 'PUT',
  });
}


export async function newsDetail(params) {
  return request(`${MODULE_URL}/work/news_info?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function newsSend(params) {
  return request(`${MODULE_URL}/work/updateNewsStateById?newsId`, {
    method: 'POST',
    body:params
  });
}
