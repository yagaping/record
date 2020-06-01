import request from '../../utils/request';

//信息分类树
export async function getTree(params) {
  return request('restful/rbsCategoryTree/list', {
    method: 'POST',
    body: params
  })
}

export async function addTreeList(params) {
  return request('restful/rbsCategoryTree/save', {
    method: 'POST',
    body: params
  })
}

export async function updateTreeList(params) {
  return request('restful/rbsCategoryTree/update', {
    method: 'POST',
    body: params
  })
}

export async function deleteTreeList(params) {
  return request('restful/rbsCategoryTree/delete', {
    method: 'POST',
    body: params
  })
}