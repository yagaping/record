import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = '/work-api';
const MODULE_PAGE_URL = '/app-api';

export async function saveHotWord(params) {
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

export async function searchKeyWord(params) {
  return request(`${MODULE_URL}/filterKeyword/selectById`, {
    method: 'GET',
  });
}

export async function modifyKeyWordSubmit(params) {
  return request(`${MODULE_URL}/filterKeyword/updateById`, {
    method: 'POST',
    body:params,
  });
}

export async function queryCountInfoApi(params) {
  return request(`${MODULE_URL}/work/newsSwitch?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function updateByAllSwitchApi(params) {
  return request(`${MODULE_URL}/work/updateByAllSwitch`, {
    method: 'POST',
    body:params,
  });
}

export async function updateBySensitiveSwitchApi(params) {
  return request(`${MODULE_URL}/work/updateBySensitiveSwitch`, {
    method: 'POST',
    body:params,
  });
}

export async function updateByKeywordSwitchApi(params) {
  return request(`${MODULE_URL}/work/updateByKeywordSwitch`, {
    method: 'POST',
    body:params,
  });
}

export async function updateByWrongSwitchApi(params) {
  return request(`${MODULE_URL}/work/updateByWrongSwitch`, {
    method: 'POST',
    body:params,
  });
}

export async function querytypeNumberApi(params) {
  return request(`${MODULE_URL}/work/newsAuditByData`, {
    method: 'GET',
  });
}

export async function queryChartDataApi(params) {
  return request(`${MODULE_URL}/work/newsAuditByView?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function ContentTypeApi(params) {
  return request(`${MODULE_URL}/work/newsTypeAuditByView?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function pageMoreMenuApi(params) {
  return request(`${MODULE_PAGE_URL}/navigation/list`, {
    method: 'GET',
  });
}

export async function modifyMoreMenuApi(params) {
  return request(`${MODULE_PAGE_URL}/navigation/update`, {
    method: 'POST',
    body:params,
  });
}

export async function querySysListApi(params) {
  return request(`${MODULE_URL}/sysKeywords/findAllList`, {
    method: 'POST',
    body:params,
  });
}

export async function addSysItemApi(params) {
  return request(`${MODULE_URL}/sysKeywords/insertKeywords`, {
    method: 'POST',
    body:params,
  });
}

export async function modSysItemApi(params) {
  return request(`${MODULE_URL}/sysKeywords/updateKeywords`, {
    method: 'POST',
    body:params,
  });
}

export async function deleteDataApi(params) {
  return request(`${MODULE_URL}/sysKeywords/deleteKeywords`, {
    method: 'POST',
    body:params,
  });
}

export async function activeSysItemApi(params) {
  return request(`${MODULE_URL}/sysKeywords/activeation`, {
    method: 'POST',
    body:params,
  });
}



