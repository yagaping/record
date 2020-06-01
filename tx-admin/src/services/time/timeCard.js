import request from '../../utils/request';
//卡片
export async function queryCard(params) {
  return request('/restful/tab/findByAll', {
    method: 'POST',
    body: params,
  });
}

export async function changeCard(params) {
  return request('/restful/tab/reviseType', {
    method: 'POST',
    body: params,
  });
}