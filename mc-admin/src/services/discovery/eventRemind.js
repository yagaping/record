import request from '../../utils/request';
//事件列表
export async function getEventList(params) {
  return request('/restful/event/listInfo', {
    method: 'POST',
    body: params,
  })
}

export async function getEventStatus(params) {
  return request('/restful/notification/findAllByEventIdAndStatusc', {
    method: 'POST',
    body: params,
  })
}

//事件通知
export async function eventNotify(params) {
  return request('/restful/notice/findByNotice', {
    method: 'POST',
    body: params,
  });
}

//事件通知统计
export async function eventNotifyCount(params) {
  return request('/restful/notice/countNoticeType', {
    method: 'POST',
    body: params,
  });
}

//事件名称
export async function findByChoose(params) {
  return request('/restful/chooseText/findByChoose', {
    method: 'POST',
    body: params,
  })
}

export async function saveChoose(params) {
  return request('/restful/chooseText/saveChoose', {
    method: 'POST',
    body: params,
  })
}

export async function modifyChoose(params) {
  return request('/restful/chooseText/modifyChoose', {
    method: 'POST',
    body: params,
  })
}

export async function deleteChoose(params) {
  return request('/restful/chooseText/deleteChoose', {
    method: 'POST',
    body: params,
  })
}