import request from '../../utils/request';

export async function queryTesterDataApi(params) {
  return request('/restful/testUser/list',{
    method:'POST',
    body:params,
  });
}

export async function addTesterApi(params) {
  return request('/restful/testUser/insert',{
    method:'POST',
    body:params,
  });
}

export async function updateTesterApi(params) {
  return request('/restful/testUser/update',{
    method:'POST',
    body:params,
  });
}

export async function deleteTesterApi(params) {
  return request('/restful/testUser/delete',{
    method:'POST',
    body:params,
  });
}