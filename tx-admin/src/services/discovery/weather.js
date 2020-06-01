import request from '../../utils/request';
//天气管理
export async function queryWeather(params) {
  return request('/restful/Weather/query', {
    method: 'POST',
    body: params,
  });
}

export async function uploadWeather(params) {
  return request('/restful/Weather/WeatherUpload', {
    method: 'POST',
    body: params,
  });
}

//天气预警
export async function weatherFind(params) {
  return request('/restful/weatherAlarm/get', {
    method: 'POST',
    body: params,
  })
}
export async function weatherType(params) {
  return request('/restful/weatherAlarm/getType', {
    method: 'POST',
    body: params,
  })
}