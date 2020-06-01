import request from '../../utils/request';

//版本管理
export async function findEdition(params) {
  return request('/restful/edition/findEdition', {
    method: 'POST',
    body: params,
  })
}

export async function addEdition(params) {
  return request('restful/edition/addEdition', {
    method: 'POST',
    body: params,
  })
}

export async function removeEdition(params) {
  return request('restful/edition/removeEdition', {
    method: 'POST',
    body: params,
  })
}

export async function modifyEdition(params) {
  return request('restful/edition/modifyEdition', {
    method: 'POST',
    body: params,
  })
}

export async function queryCustomerApi(params) {
  return request('restful/customers/find', {
    method: 'POST',
    body: params,
  })
}

export async function addCustomerApi(params) {
  return request('restful/customers/save', {
    method: 'POST',
    body: params,
  })
}

export async function updateCustomerApi(params) {
  return request('restful/customers/update', {
    method: 'POST',
    body: params,
  })
}

export async function handlePushApi(params) {
  return request('restful/mcPush/push', {
    method: 'POST',
    body: params,
  })
}



