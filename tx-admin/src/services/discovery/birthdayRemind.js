import request from '../../utils/request';
//祝福列表
export async function addBless(params) {
  return request('/restful/blessingsText/findByBlessingsText', {
    method: 'POST',
    body: params,
  })
} 

export async function saveBless(params) {
  return request('/restful/blessingsText/saveChoose', {
    method: 'POST',
    body: params,
  })
} 

export async function modifyBless(params) {
  return request('/restful/blessingsText/modifyChoose', {
    method: 'POST',
    body: params,
  })
} 

export async function deleteBless(params) {
  return request('/restful/blessingsText/deleteChoose', {
    method: 'POST',
    body: params,
  })
} 

export async function findByPersonType(params) {
  return request('/restful/blessingsText/findByPersonType', {
    method: 'POST',
    body: params,
  })
} 