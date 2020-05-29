import request from '../utils/request';
const MODULE_URL = '/work-api';

export async function updateNewsContentArticle(params) {
  return request(`${MODULE_URL}/work/saveOrUpdateNewsArticleContent`, {
    method: 'POST',
    body: params,
  });
}

export async function newsSend(params) {
  return request(`${MODULE_URL}/work/updateNewsStateById`, {
    method: 'POST',
    body: params,
  });
}

export async function titleApi(params) {
  return request(`${MODULE_URL}/work/updateNewByTitle`, {
    method: 'POST',
    body: params,
  });
}

export async function simpleNewsApi(params) {
  return request(`${MODULE_URL}/concise/insert`, {
    method: 'POST',
    body: params,
  });
}

export async function hotIconApi(params) {
  return request(`${MODULE_URL}newsHotLabel`, {
    method: 'PATCH',
    body: params,
  });
}

