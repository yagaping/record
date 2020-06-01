///remind-admin
import { stringify } from 'qs';
import request from '../../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function queryApi(params) {
  return request('/restful/pcVersion/find', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addFileApi(params) {
  return request('/restful/pcVersion/uploadVideo', {
    method: 'POST',
    body: params,
  });
}
