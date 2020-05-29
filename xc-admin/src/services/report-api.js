import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';

export async function dataListApi(params) {
  return request(`${MODULE_URL}work/paperTypeList`,{
    method:'POST',
    body:params,
  });
}

export async function addReportApi(params) {
  return request(`${MODULE_URL}work/saveOrUpdatePaperType`,{
    method:'POST',
    body:params,
  });
}

export async function reportMnageApi(params) {
  return request(`${MODULE_URL}work/paperList`,{
    method:'POST',
    body:params,
  });
}

export async function provinceApi(params) {
  return request(`${MODULE_URL}work/provinceAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function cityDataApi(params) {
  return request(`${MODULE_URL}work/cityAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function typeDataApi(params) {
  return request(`${MODULE_URL}work/paperTypeAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addModItemApi(params) {
  return request(`${MODULE_URL}work/saveOrUpdatePaper`,{
    method:'POST',
    body:params,
  });
}

export async function tryGetApi(params) {
  return request(`${MODULE_URL}work/testGrabPaperNews?${stringify(params)}`,{
    method:'GET',
  });
}

export async function newsListApi(params) {
  return request(`${MODULE_URL}work/paperNewsList`,{
    method:'POST',
    body:params,
  });
}

export async function detailApi(params) {
  return request(`${MODULE_URL}work/paperNewsInfo`,{
    method:'POST',
    body:params,
  });
}

export async function regularApi(params) {
  return request(`${MODULE_URL}work/paperFilterRegexList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addOrUpdateApi(params) {
  return request(`${MODULE_URL}work/saveOrUpdatePaperFilterRegex`,{
    method:'POST',
    body:params
  });
}

export async function deleteApi(params) {
  return request(`${MODULE_URL}work/deletePaperFilterRegexById?ids=${params.join('&ids=')}`,{
    method:'GET',
  });
}




