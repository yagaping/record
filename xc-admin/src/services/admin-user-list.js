import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = 'work-api/';
export async function query(params) {
  return request(`${MODULE_URL}work/userList?${stringify(params)}`);
}

export async function saveUser({ body }) {
  return request(`${MODULE_URL}work/saveUser`, {
    method: 'POST',
    body,
  });
}

export async function updateUser({ body }) {
  return request(`${MODULE_URL}work/updateUser`, {
    method: 'POST',
    body,
  });
}

export async function updateUserByStatus(body) {

  return request(`${MODULE_URL}work/updateUserByStatus`, {
    method: 'POST',
    body,
  });
}

export async function resetPassword( body ) {
  return request(`${MODULE_URL}work/resetPassword`, {
    method: 'POST',
    body,
  });
}

export async function updateUserByPassword({ body }) {
  return request(`${MODULE_URL}work/updateUserByPassword`, {
    method: 'POST',
    body,
  });
}

export async function updateUserByLoginStatus( body ) {
  return request(`${MODULE_URL}work/updateUserByLoginStatus`, {
    method: 'POST',
    body,
  });
}

export async function queryLogList(params) {
  return request(`${MODULE_URL}work/loginLogList?${stringify(params)}`);
}

export async function queryDoLogApi(params) {
  return request(`${MODULE_URL}work/adminOperationLogList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function queryDepartmentApi(params) {
  return request(`${MODULE_URL}work/departmentAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function queryLevelApi(params) {
  return request(`${MODULE_URL}work/departmentLevelList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addUserApi( params ) {
  return request(`${MODULE_URL}work/saveUser`,{
    method:'POST',
    body:params,
  });
}

export async function updateUserInfoApi( params ) {
  return request(`${MODULE_URL}work/updateUser`,{
    method:'POST',
    body:params,
  });
}

export async function projectInfoApi( params ) {
  return request(`${MODULE_URL}apk/listApk`,{
    method:'POST',
    body:params,
  });
}
