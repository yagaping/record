import request from '../../utils/request';

//广告管理
export async function queryAdList(params) {
  return request('/restful/advert/findByAdvert', {
    method: 'POST',
    body: params,
  });
}

export async function addAdvert(params) {
  return request('/restful/advert/advertAdd', {
    method: 'POST',
    body: params,
  });
}

export async function modifyState(params) {
  return request('/restful/advert/modifyState', {
    method: 'POST',
    body: params,
  });
}

export async function removeAdvert(params) {
  return request('/restful/advert/removeAdvert', {
    method: 'POST',
    body: params,
  });
}

export async function modifyAdvert(params) {
  return request('/restful/advert/modifyAdvert', {
    method: 'POST',
    body: params,
  });
}