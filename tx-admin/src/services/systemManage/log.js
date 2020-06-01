import request from '../../utils/request';


//统计日志
export async function getLog(params) {
  return request('/restful/bigDataLog/find', {
    method: 'POST',
    body: params
  })
}
//公共日志
export async function getDataLog(params) {
  return request('/restful/bigDataLog/currencyfind', {
    method: 'POST',
    body: params
  })
}

//模块配置
export async function findModule(params) {
  return request('/restful/modular/modularGet', {
    method: 'POST',
    body: params,
  });
}

export async function updateModule(params) {
  return request('/restful/modular/modularUpadte', {
    method: 'POST',
    body: params,
  });
}

export async function deleteModule(params) {
  return request('/restful/modular/modularDelte', {
    method: 'POST',
    body: params,
  });
}

export async function addModule(params) {
  return request('/restful/modular/modularSave', {
    method: 'POST',
    body: params,
  });
}

//事件配置
export async function findIncident(params) {
  return request('/restful/incident/incidentGet', {
    method: 'POST',
    body: params,
  });
}

export async function addIncident(params) {
  return request('/restful/incident/incidentSave', {
    method: 'POST',
    body: params,
  });
}

export async function updateIncident(params) {
  return request('/restful/incident/incidentUpadte', {
    method: 'POST',
    body: params,
  });
}

export async function deleteIncident(params) {
  return request('/restful/incident/incidentDelte', {
    method: 'POST',
    body: params,
  });
}

//页面配置
export async function pageGet(params) {
  return request('/restful/pageTab/pageTabGet', {
    method: 'POST',
    body: params,
  });
}

export async function pageUpdate(params) {
  return request('/restful/pageTab/pageTabUpadte', {
    method: 'POST',
    body: params,
  });
}

export async function pageDelete(params) {
  return request('/restful/pageTab/pageTabDelte', {
    method: 'POST',
    body: params,
  });
}

export async function pageAdd(params) {
  return request('/restful/pageTab/pageTabSave', {
    method: 'POST',
    body: params,
  });
}

export async function pageNameGet(params) {
  return request('/restful/pageTab/pageTabName', {
    method: 'POST',
    body: params,
  });
}

//事件模块管理 - 事件名称
export async function findModuleName(params) {
  return request('/restful/modular/modularName', {
    method: 'POST',
    body: params,
  });
}


