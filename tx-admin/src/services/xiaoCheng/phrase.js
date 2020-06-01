import request from '../../utils/request';

//词组录入
export async function findPhraseList(params) {
  return request('/restful/word_basis/list', {
    method: 'POST',
    body: params,
  });
}

export async function phraseListAdd(params) {
  return request('/restful/word_basis/save', {
    method: 'POST',
    body: params,
  });
}

export async function phraseListDelete(params) {
  return request('/restful/word_basis/delete', {
    method: 'POST',
    body: params,
  });
}

export async function phraseListUpdate(params) {
  return request('/restful/word_basis/update', {
    method: 'POST',
    body: params,
  });
}

//近义词列表
export async function findWordList(params) {
  return request('/restful/word_basis_near/list', {
    method: 'POST',
    body: params,
  });
}

export async function wordListAdd(params) {
  return request('/restful/word_basis_near/save', {
    method: 'POST',
    body: params,
  });
}

export async function wordListDelete(params) {
  return request('/restful/word_basis_near/delete', {
    method: 'POST',
    body: params,
  });
}

export async function wordListUpdate(params) {
  return request('/restful/word_basis_near/update', {
    method: 'POST',
    body: params,
  });
}