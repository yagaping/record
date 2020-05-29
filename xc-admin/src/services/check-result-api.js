import { stringify } from 'qs';
import request from '../utils/request';

const MODULE_URL = 'work-api/';
const APP_API = 'app-api/';

export async function resultApi(params) {
  return request(`${MODULE_URL}work/getReviewResult?${stringify(params)}`,{
    method:'GET',
  });
}
