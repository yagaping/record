import request from '../../utils/request';

//支付列表
export async function queryPayment(params) {
  return request('/restful/rechargeRecord/findByRecord', {
    method: 'POST',
    body: params,
  });
}