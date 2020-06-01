import request from '../../utils/request';

//智能菜单
export async function addOptionMenu(params) {
  return request('/restful/intelligence/intelligenceSave', {
    method: 'POST',
    body: params,
  });
}

export async function deleteOptionMenu(params) {
  return request('/restful/intelligence/intelligenceDelete', {
    method: 'POST',
    body: params,
  });
}

export async function updateOptionMenu(params) {
  return request('/restful/intelligence/intelligenceUpdate', {
    method: 'POST',
    body: params,
  });
}

export async function getOptionMenu(params) {
  return request('/restful/intelligence/intelligenceQuery', {
    method: 'POST',
    body: params,
  });
}
export async function dragApi(params) {
  return request('/restful/intelligence/drag', {
    method: 'POST',
    body: params,
  });
}
export async function subsetFind(params) {
  return request('/restful/intelligence/findSubset', {
    method: 'POST',
    body: params,
  });
}