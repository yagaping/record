import request from '../../utils/request';
//每日阅读 故事
export async function storyListAdd(params) {
  return request('/restful/graspDailyArticle/save', {
    method: 'POST',
    body: params,
  });
}

export async function storyListDelete(params) {
  return request('/restful/graspDailyArticle/remove', {
    method: 'POST',
    body: params,
  });
}

export async function storyListUpdate(params) {
  return request('/restful/graspDailyArticle/modify', {
    method: 'POST',
    body: params,
  });
}

export async function storyList(params) {
  return request('/restful/graspDailyArticle/find', {
    method: 'POST',
    body: params,
  });
}

export async function publishStory(params) {
  return request('/restful/graspDailyArticlePublish/publishSave', {
    method: 'POST',
    body: params,
  });
}

//每日阅读  没想到
export async function queryDataApi(params) {
  return request('/restful/graspColdKnowledge/find',{
    method:'POST',
    body:params,
  });
}

export async function queryTypeApi(params) {
  return request('/restful/graspColdKnowledge/findType',{
    method:'POST',
    body:params,
  });
}

export async function addDataApi(params) {
  return request('/restful/graspColdKnowledge/save',{
    method:'POST',
    body:params,
  });
}

export async function modifeDataApi(params) {
  return request('/restful/graspColdKnowledge/modify',{
    method:'POST',
    body:params,
  });
}

export async function deleteApi(params) {
  return request('/restful/graspColdKnowledge/remove',{
    method:'POST',
    body:params,
  });
}

//每日阅读 诗词
export async function poetryListAdd(params) {
  return request('/restful/graspRead/graspPoetryContent/add', {
    method: 'POST',
    body: params,
  });
}

export async function poetryListDelete(params) {
  return request('/restful/graspRead/graspPoetryContent/publishCancel', {
    method: 'POST',
    body: params,
  });
}

export async function poetryListUpdate(params) {
  return request('/restful/graspRead/graspPoetryContent/update', {
    method: 'POST',
    body: params,
  });
}

export async function poetryList(params) {
  return request('/restful/graspRead/graspPoetryContent/list', {
    method: 'POST',
    body: params,
  });
}

export async function publishPoetry(params) {
  return request('/restful/graspRead/graspPoetryContent/publishSave', {
    method: 'POST',
    body: params,
  });
}

//每日阅读 成语
export async function idiomListAdd(params) {
  return request('/restful/graspIdiom/save', {
    method: 'POST',
    body: params,
  });
}

export async function idiomListDelete(params) {
  return request('/restful/graspIdiom/remove', {
    method: 'POST',
    body: params,
  });
}

export async function idiomListUpdate(params) {
  return request('/restful/graspIdiom/modify', {
    method: 'POST',
    body: params,
  });
}

export async function idiomList(params) {
  return request('restful/graspIdiom/find', {
    method: 'POST',
    body: params,
  });
}

export async function publishIdiom(params) {
  return request('/restful/graspIdiom/publishSave', {
    method: 'POST',
    body: params,
  });
}

//每日阅读 每日一笑
export async function happySmileAdd(params) {
  return request('/restful/graspJoke/save', {
    method: 'POST',
    body: params,
  });
}

export async function happySmileDelete(params) {
  return request('/restful/graspJoke/remove', {
    method: 'POST',
    body: params,
  });
}

export async function happySmileUpdate(params) {
  return request('/restful/graspJoke/modify', {
    method: 'POST',
    body: params,
  });
}

export async function happySmile(params) {
  return request('restful/graspJoke/find', {
    method: 'POST',
    body: params,
  });
}

export async function publishHappySmile(params) {
  return request('/restful/graspJoke/publishSave', {
    method: 'POST',
    body: params,
  });
}

//每日阅读 名言
export async function quotesAdd(params) {
  return request('/restful/graspQuotes/save', {
    method: 'POST',
    body: params,
  });
}

export async function quotesDelete(params) {
  return request('/restful/graspQuotes/remove', {
    method: 'POST',
    body: params,
  });
}

export async function quotesUpdate(params) {
  return request('/restful/graspQuotes/modify', {
    method: 'POST',
    body: params,
  });
}

export async function quotes(params) {
  return request('restful/graspQuotes/find', {
    method: 'POST',
    body: params,
  });
}

export async function publishQuotes(params) {
  return request('/restful/graspQuotes/publishSave', {
    method: 'POST',
    body: params,
  });
}

//每日阅读 单词
export async function wordAdd(params) {
  return request('/restful/graspWord/save', {
    method: 'POST',
    body: params,
  });
}

export async function wordDelete(params) {
  return request('/restful/graspWord/remove', {
    method: 'POST',
    body: params,
  });
}

export async function wordUpdate(params) {
  return request('/restful/graspWord/modify', {
    method: 'POST',
    body: params,
  });
}

export async function word(params) {
  return request('restful/graspWord/find', {
    method: 'POST',
    body: params,
  });
}


//上传视频
export async function videoUpload(params) {
  return request('/restful/graspWord/uploadVideo', {
    method: 'POST',
    body: params,
  })
}


//每日阅读  历史今天
export async function queryHistoryList(params) {
  return request('restful/affair/findAffair', {
    method: 'POST',
    body: params
  })
}

export async function modifyHistoryList(params) {
  return request('restful/affair/modifyAffair', {
    method: 'POST',
    body: params
  })
}

export async function addHistoryList(params) {
  return request('restful/affair/save', {
    method: 'POST',
    body: params
  })
}

export async function removeHistoryList(params) {
  return request('restful/affair/remove', {
    method: 'POST',
    body: params
  })
}

export async function peopleExamine(params) {
  return request('restful/affair/examine', {
    method: 'POST',
    body: params
  })
}