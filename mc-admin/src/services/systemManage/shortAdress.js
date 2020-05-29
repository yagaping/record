import request from '../../utils/request';

//短地址管理
export async function queryShortUrl(params) {
  return request('/restful/shortUrl/queryShortUrl', {
    method: 'POST',
    body: params,
  });
}

export async function deleteShortUrl(params) {
  return request('/restful/shortUrl/deleteShortUrl', {
    method: 'POST',
    body: params,
  });
}

export async function addShortUrl(params) {
  return request('/restful/shortUrl/addShortUrl', {
    method: 'POST',
    body: params,
  });
}

export async function updateShortUrl(params) {
  return request('/restful/shortUrl/updateShortUrl', {
    method: 'POST',
    body: params,
  });
}


//短地址分组
export async function queryShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/queryShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function addShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/addShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function deleteShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/deleteShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function updateShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/updateShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

//查询所有分组
export async function queryGroup(params) {
  return request('/restful/shortUrlGroup/queryGroup', {
    method: 'POST',
    body: params,
  });
}

