import request from '../../utils/request';

//文本识别验证
export async function queryText(params) {
  return request('/restful/checkTest/query', {
    method: 'POST',
    body: params,
  });
}

export async function upadateText(params) {
  return request('/restful/checkTest/update', {
    method: 'POST',
    body: params,
  });
}

export async function saveText(params) {
  return request('/restful/checkTest/save', {
    method: 'POST',
    body: params,
  });
}

export async function deleteText(params) {
  return request('/restful/checkTest/delete', {
    method: 'POST',
    body: params,
  });
}

export async function getText(params) {
  return request('/restful/checkTest/responseTest', {
    method: 'POST',
    body: params,
  });
}

export async function checkText(params) {
  return request('/restful/checkTest/test', {
    method: 'POST',
    body: params,
  });
}

export async function allVerify(params) {
  return request('/restful/checkTest/testAll', {
    method: 'POST',
    body: params,
  })
}


//文本识别记录
export async function recognitionQuery(params) {
  return request('/restful/textAnalysesRecord/query', {
    method: 'POST',
    body: params,
  })
}

export async function handleVerify(params) {
  return request('/restful/textAnalysesRecord/updateByStatus', {
    method: 'POST',
    body: params,
  })
}

//文本记录语音验证
export async function recognitionCheck(params) {
  return request('/restful/textAnalysesRecord/uploadVoiceByText', {
    method: 'POST',
    body: params,
  });
}

//文本记录语音验证发送通知
export async function recognitionSendNotice(params) {
  return request('/restful/textAnalysesRecord/sendNotice', {
    method: 'POST',
    body: params,
  });
}

//文本记录文本验证
export async function update_text(params) {
  return request('/restful/textAnalysesRecord/updateByText', {
    method: 'POST',
    body: params,
  });
}

export async function queryCountApi(params) {
  return request('/restful/textAnalysesRecord/statistics', {
    method: 'POST',
  });
}

export async function modifeErrorApi(params) {
  return request('/restful/textAnalysesRecord/updateResult', {
    method: 'POST',
    body:params,
  });
}

//文本审核
export async function textExamine(params) {
  return request('/restful/textAnalysesRecord/queryByAudit', {
    method: 'POST',
    body: params,
  });
}

//模板数据
export async function templateDataApi(params) {
  return request('/restful/matchWords/query',{
    method:'POST',
    body:params,
  });
}

export async function addTemplateApi(params) {
  return request('/restful/matchWords/save',{
    method:'POST',
    body:params,
  });
}

export async function deleteTempleApi(params) {
  return request('/restful/matchWords/delete',{
    method:'POST',
    body:params,
  });
}

export async function updateDataApi(params) {
  return request('/restful/matchWords/update',{
    method:'POST',
    body:params,
  });
}

//文本匹配
export async function matchText(params) {
  return request('/restful/matchPhrase/perfect?text='+params);
}

//文本匹配列表
export async function matchTextAdd(params) {
  return request('/restful/matchText/add', {
    method: 'POST',
    body: params,
  });
}

export async function matchTextQuery(params) {
  return request('/restful/matchText/query', {
    method: 'POST',
    body: params,
  });
}

//查询文本统计
export async function textCountApi(params) {
  return request('/restful/textRecognition/query', {
    method: 'POST',
    body: params,
  });
}

export async function fileUploadApi(params) {
  return request('/restful/checkTest/batchAdd', {
    method: 'POST',
    body: params,
  });
}

