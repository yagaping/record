///remind-admin
import { stringify } from 'qs';
import request from '../../utils/request';

export async function querySoftApi(params) {
  return request('/restful/appProject/find', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function querySoftVersionApi(params) {
  return request('/restful/appProjectVersion/find', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteSoftItemApi(params) {
  return request('/restful/appProject/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addSoftItemApi(params) {
  return request('/restful/appProject/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateSoftItemApi(params) {
  return request('/restful/appProject/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteSoftVersionApi(params) {
  return request('/restful/appProjectVersion/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function uploadFileApi(params) {
  return request('/restful/appProjectVersion/uploadPackage', {
    method: 'POST',
    body: params,
  });
}

export async function AddSoftVersionItemApi(params) {
  return request('/restful/appProjectVersion/save', {
    method: 'POST',
    body: { ...params },
  });
}

export async function modlSoftVersionItemApi(params) {
  return request('/restful/appProjectVersion/update', {
    method: 'POST',
    body: { ...params },
  });
}

export async function tabMenuApi(params) {
  return request('/restful/appProjectVersion/find', {
    method: 'POST',
    body: { ...params },
  });
}
