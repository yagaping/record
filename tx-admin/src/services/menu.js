import request from '../utils/request';

//菜单
export async function getMenu(params) {
  return request('/restful/menu/menuQuery', {
    method: 'POST',
    body: params, 
  })
}