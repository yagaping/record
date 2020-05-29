import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = '/work-api';

export async function list(params) {
  return request(`${MODULE_URL}/work/navigation_icon/0/list?${stringify(params)}`);
}
