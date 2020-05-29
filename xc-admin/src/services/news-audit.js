import request from '../utils/request';
import { stringify } from 'qs';
const MODULE_URL = '/work-api';
export async function query(params) {
 
  return request(`${MODULE_URL}/work/newsGroupByCount`,{
  });
 
}

export async function byDateQuery(params) {
  return request(`${MODULE_URL}/work/newsGroupByCustomCount?${stringify(params)}`,{
    method:'GET',
  });
}
