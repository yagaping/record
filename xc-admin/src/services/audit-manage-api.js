import { stringify } from 'qs';
import request from '../utils/request';
const MODULE_URL = 'work-api/';

export async function logDataApi(params) {
  return request(`${MODULE_URL}statistics/auditStatistics?${stringify(params)}`, {
    method: 'GET',
  });
}
