import request from '../../utils/request';
//速记管理
export async function findShortList(params) {
  return request('/restful/ShorthandAutotext/findByShorthand', {
    method: 'POST',
    body: params,
  });
}