import request from '../utils/request';
const APP_URL = '/app-api';
const MODULE_URL = '/work-api';

export async function queryNavList( params ) {
  return request(`${MODULE_URL}/newsTabs/getNewsTabs`, {
    method: 'POST',
    body:params,
  });
}

export async function addNewApi( params ) {
  return request(`${MODULE_URL}/newsTabs/insertNewsTabs`, {
    method: 'POST',
    body:params,
  });
}

export async function navEditApi( params ) {
  return request(`${MODULE_URL}/newsTabs/updateNewsTabs`, {
    method: 'POST',
    body:params,
  });
}

export async function deleteApi( params ) {
  return request(`${MODULE_URL}/newsTabs/deleteNewsTabs`, {
    method: 'POST',
    body:params,
  });
}


