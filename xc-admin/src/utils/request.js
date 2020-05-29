import fetch from 'dva/fetch';
import { notification } from 'antd';
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
});
const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.warning({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const systemContext = '{"accessToken":"token_001","channel":"BING","contextAccessToken":{"accountId":"test_c76e15dbcf494949a3b2d11fc0b3e543","expirationTime":"2017-12-28T12:35:16.453Z","startTime":"2017-12-27T12:35:16.451Z","system":0,"token":"token_001"},"contextAccount":{"authId":"8d4aaf76860745de8173688129b67cc8","email":"test@test.com","id":"test_c76e15dbcf494949a3b2d11fc0b3e543","mobile":"18881513201","openid":"ed6a08943d71462181dd45b062c9a090","state":0},"language":"CH","network":1,"sdk":"IOS 1.12.3","terminal":1,"udid":"udid8087a6f2b18e49ae886e0d9046f08f97","version":1}';
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'System-Context': systemContext,
    ...newOptions.headers,
  };

  if (newOptions.method === 'POST'
    || newOptions.method === 'PUT'
    || newOptions.method === 'PATCH') {
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      // if (newOptions.method === 'DELETE' || response.status === 204) {
      //   return response.text();
      // }
      if (response.status === 204) {
        return response.text();
      }
      return response.json();
    });
}
