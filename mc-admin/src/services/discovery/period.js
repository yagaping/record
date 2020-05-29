import request from '../../utils/request';

//经期小贴士
export async function queryPeriod(params) {
  return request('/restful/physiologyTips/find', {
    method: 'POST',
    body: params,
  })
}
export async function addPeriod(params) {
  return request('/restful/physiologyTips/save', {
    method: 'POST',
    body: params,
  })
}
export async function modifyPeriod(params) {
  return request('/restful/physiologyTips/update', {
    method: 'POST',
    body: params,
  })
}
export async function removePeriod(params) {
  return request('/restful/physiologyTips/delete', {
    method: 'POST',
    body: params,
  })
}