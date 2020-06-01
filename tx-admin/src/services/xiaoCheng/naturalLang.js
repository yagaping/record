import request from '../../utils/request';

//自然语言文本识别
export async function queryNaturalDataApi(params) {
  return request('/restful/tagData/list',{
    method:'POST',
    body:params,
  });
}

export async function addDiscernApi(params) {
  return request('/restful/tagData/save',{
    method:'POST',
    body:params,
  });
}

export async function updateDuscernApi(params) {
  return request('/restful/tagData/update',{
    method:'POST',
    body:params,
  });
}

export async function deleteDiscernApi(params) {
  return request('/restful/tagData/delete',{
    method:'POST',
    body:params,
  });
}

export async function checkApi(params) {
  return request('/restful/tagData/check',{
    method:'POST',
    body:params,
  });
}

//自然语言分类
export async function queryNaturalFlDataApi(params) {
  return request('/restful/tagMatch/list',{
    method:'POST',
    body:params,
  });
}

export async function addFlItemApi(params) {
  return request('/restful/tagMatch/save',{
    method:'POST',
    body:params,
  });
}

export async function updateFlApi(params) {
  return request('/restful/tagMatch/update',{
    method:'POST',
    body:params,
  });
}

export async function deleteFlApi(params) {
  return request('/restful/tagMatch/delete',{
    method:'POST',
    body:params,
  });
}

export async function checkFlApi(params) {
  return request('/restful/tagMatch/check',{
    method:'POST',
    body:params,
  });
}