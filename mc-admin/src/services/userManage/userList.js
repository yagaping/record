import request from '../../utils/request';

//用户管理
export async function queryUserList(params) {
  return request('/restful/customer/customerQuery', {
    method: 'POST',
    body: params,
  });
}

export async function editCustomerState(params) {
  return request('/restful/customer/customerProhibit', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCuster(params) {
  return request('/restful/customer/customerRemove', {
    method: 'POST',
    body: params,
  });
}

//用户编辑

//验证码
export async function sendCheckcode(params) {
  return request('/restful/customer/sendCheckcode', {
    method: 'POST',
    body: params,
  });
}
//绑定手机
export async function bindMobile(params) {
  return request('/restful/customer/customerBindMobile', {
    method: 'POST',
    body: params,
  });
}

export async function unBindMobile(params) {
  return request('/restful/customer/customerUnbindMobile', {
    method: 'POST',
    body: params,
  });
}

export async function unBindThirdLogin(params) {
  return request('/restful/customer/customerUnbindThirdLogin', {
    method: 'POST',
    body: params,
  });
}