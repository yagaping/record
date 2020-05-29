import request from '../../utils/request';
//地图
export async function getPoiont(params) {
  return request('/restful/positionRecord/find', {
    method: 'POST',
    body: params
  });
}