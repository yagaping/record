import request from '../../utils/request';

//地图数据树
export async function getMapTree(params) {
  return request('restful/rbsMapTree/list', {
    method: 'POST',
    body: params
  })
}

export async function addMapTree(params) {
  return request('restful/rbsMapTree/save', {
    method: 'POST',
    body: params
  })
}

export async function updateMapTree(params) {
  return request('restful/rbsMapTree/update', {
    method: 'POST',
    body: params
  })
}

export async function deleteMapTree(params) {
  return request('restful/rbsMapTree/delete', {
    method: 'POST',
    body: params
  })
}

//非关系地图列表
export async function mapList(params) {
  return request('restful/rbsMapTree/listByAll', {
    method: 'POST',
    body: params
  })
}