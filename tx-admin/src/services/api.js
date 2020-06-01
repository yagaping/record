///remind-admin
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function articleList( params ) {
  return request('/restful/newsContent/findNews',{
    method:'POST',
    body:params
  });
}

export async function deleteArticle( params ) {
  return request('/restful/newsContent/remove',{
    method:'POST',
    body:params
  });
}

export async function addArticleApi( params ) {
  return request('/restful/newsContent/save',{
    method:'POST',
    body:params
  });
}

export async function modifyArticleApi( params ) {
  return request('/restful/newsContent/modifyAffair',{
    method:'POST',
    body:params
  });
}

export async function queryOnline( params ) {
  return request('/restful/blackMember/findBlackMember',{
    method:'POST',
    body:params
  });
}


export async function addOnlineApi( params ) {
  return request('/restful/blackMember/save',{
    method:'POST',
    body:params
  });
}

export async function modOnlineApi( params ) {
  return request('/restful/blackMember/modifyBlackMember',{
    method:'POST',
    body:params
  });
}

export async function queryUserMessageApi( params ) {
  return request('/restful/BlackUserKey/findBlackUserKey',{
    method:'POST',
    body:params
  });
}

export async function addMessageApi( params ) {
  return request('/restful/BlackUserKey/save',{
    method:'POST',
    body:params
  });
}
export async function modMessageApi( params ) {
  return request('/restful/BlackUserKey/modifyBlackUserKey',{
    method:'POST',
    body:params
  });
}

export async function deleteUserOnlineApi( params ) {
  return request('/restful/blackMember/delete',{
    method:'POST',
    body:params
  });
}

export async function deleteUserMessageApi( params ) {
  return request('/restful/BlackUserKey/delete',{
    method:'POST',
    body:params
  });
}

export async function queryBlackListApi( params ) {
  return request('/restful/massBlacklist/findMassBlacklist',{
    method:'POST',
    body:params
  });
}

export async function deleteBlackApi( params ) {
  return request('/restful/massBlacklist/delete',{
    method:'POST',
    body:params
  });
}

export async function addBlackApi( params ) {
  return request('/restful/massBlacklist/save',{
    method:'POST',
    body:params
  });
}

export async function modBlackApi( params ) {
  return request('/restful/massBlacklist/modifyMassBlacklist',{
    method:'POST',
    body:params
  });
}



