import request from "../../utils/request";

//新节日节气
export async function newQueryFestival(params) {
  return request('/restful/festival/find', {
    method: 'POST',
    body: params,
  })
}

export async function newFestivalUpDate(params) {
  return request('/restful/festival/update', {
    method: 'POST',
    body: params,
  })
}

export async function newFestivalUpload(params) {
  return request('/restful/festival/fileUpload', {
    method: 'POST',
    body: params,
  })
}

//旧版节日节气
export async function queryFestival(params) {
  return request('/restful/festival/query', {
    method: 'POST',
    body: params,
  })
}
export async function festivalUpload(params) {
  return request('/restful/festival/festivalUpload', {
    method: 'POST',
    body: params,
  })
}