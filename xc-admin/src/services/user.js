import request from '../utils/request';
import { stringify } from 'qs';
const MODULE_URL = '/work-api';

export async function query(params) {
  return request('/api/users');
}



export async function departmentListApi(params) {
  return request(`${MODULE_URL}/work/departmentAllList`,{
    method:'GET',
  });
}

export async function userListApi(params) {
  return request(`${MODULE_URL}/work/userAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function roleListApi(params) {
  return request(`${MODULE_URL}/work/roleAllList`,{
    method:'GET',
  });
}

export async function projectRoleApi(params) {
  return request(`${MODULE_URL}/work/projectAllList`,{
    method:'GET',
  });
}

export async function projectSaveApi(params) {
  return request(`${MODULE_URL}/work/saveOrUpdateProject`,{
    method:'POST',
    body:params,
  });
}

export async function dpartmentApi(params) {
  return request(`${MODULE_URL}/work/departmentAllList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function departmentSaveApi(params) {
  return request(`${MODULE_URL}/work/saveOrUpdateDepartment`,{
    method:'POST',
    body:params,
  });
}


export async function jobListApi(params) {
  return request(`${MODULE_URL}/work/departmentLevelList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function postSaveApi(params) {
  return request(`${MODULE_URL}/work/saveOrUpdateDepartmentLevel`,{
    method:'POST',
    body:params,
  });
}

export async function selectJobApi(params) {
  return request(`${MODULE_URL}/work/departmentLevelFunctionSelect?${stringify(params)}`,{
    method:'GET',
  });
}

export async function limitSelectApi(params) {
  return request(`${MODULE_URL}/work/roleFunctionList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function jobLimitApi(params) {
  return request(`${MODULE_URL}/work/saveRoleFunction`,{
    method:'POST',
    body:params,
  });
}

export async function queryLimtApi(params) {
  return request(`${MODULE_URL}/work/userFunctionSelects?${stringify(params)}`,{
    method:'GET',
  });
}

export async function itemListApi(params) {
  return request(`${MODULE_URL}/work/userFunctionList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function limitSaveApi(params) {
  return request(`${MODULE_URL}/work/saveUserFunction`,{
    method:'POST',
    body:params,
  });
}

export async function listByRoleIdApi(params) {
  return request(`${MODULE_URL}/work/listByRoleId`,{
    method:'POST',
    body:params,
  });
}

