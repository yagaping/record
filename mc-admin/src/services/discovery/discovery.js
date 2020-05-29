import request from '../../utils/request';
//发现中心
export async function getCard(params) {
  return request('/restful/discoverTab/find', {
    method: 'POST',
    body: params,
  })
}

export async function updateIconSort(params) {
  return request('/restful/discoverTab/update', {
    method: 'POST',
    body: params,
  })
}

export async function updateGroupSort(params) {
  return request('/restful/discoverTab/updateGroupSort', {
    method: 'POST',
    body: params,
  })
}

export async function updateCardType(params) {
  return request('/restful/discoverTab/updateType', {
    method: 'POST',
    body: params
  })
}