import request from '../../utils/request';

//用户统计
export async function findAll(params) {
  return request('/restful/statisticsUser/findAll', {
    method: 'POST',
    body: params,
  });
}

export async function querySendMessageApi(params) {
  return request('/restful/groupSending/find', {
    method: 'POST',
    body: params,
  });
}

export async function saveMessageApi(params) {
  return request('/restful/groupSending/save', {
    method: 'POST',
    body: params,
  });
}

export async function sendMessageDataApi(params) {
  return request('/restful/groupSending/sendOut', {
    method: 'POST',
    body: params,
  });
}

export async function editorMessageApi(params) {
  return request('/restful/groupSending/modifyGroupSend', {
    method: 'POST',
    body: params,
  });
}

export async function uploadFileApi(params) {
  return request('/restful/groupSending/uploadAudio', {
    method: 'POST',
    body: params,
  });
}

export async function querySendVersionApi(params) {
  return request('/restful/systemNewsSend/find', {
    method: 'POST',
    body: params,
  });
}

export async function saveVersionApi(params) {
  return request('/restful/systemNewsSend/save', {
    method: 'POST',
    body: params,
  });
}

export async function deleteVersionApi(params) {
  return request('/restful/systemNewsSend/remove', {
    method: 'POST',
    body: params,
  });
}

export async function modifyVersionApi(params) {
  return request('/restful/systemNewsSend/modify', {
    method: 'POST',
    body: params,
  });
}

export async function sendVersionItemApi(params) {
  return request('/restful/systemNewsSend/sendOut', {
    method: 'POST',
    body: params,
  });
}

export async function queryFixedVersionApi(params) {
  return request('/restful/systemNewsTrigger/find', {
    method: 'POST',
    body: params,
  });
}

export async function saveFixedVersionApi(params) {
  return request('/restful/systemNewsTrigger/save', {
    method: 'POST',
    body: params,
  });
}

export async function modifyFixedVersionApi(params) {
  return request('/restful/systemNewsTrigger/modify', {
    method: 'POST',
    body: params,
  });
}

export async function deleteFixedVersionApi(params) {
  return request('/restful/systemNewsTrigger/remove', {
    method: 'POST',
    body: params,
  });
}

export async function getCustomerApi(params) {
  return request('/restful/customers/findNickName', {
    method: 'POST',
    body: params,
  });
}

export async function repealApi(params) {
  return request('/restful/groupSending/recall', {
    method: 'POST',
    body: params,
  });
}




