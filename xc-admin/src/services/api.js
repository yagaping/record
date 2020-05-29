import { stringify } from 'qs';
import request from '../utils/request';
const WORK_API = '/work-api';
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

export async function fakeAccountLogin(params) {
  return request('/work-api/sign_in', {
    method: 'POST',
    body: params,
  });
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

export async function userLogin(params) {
  return request('work-api/work/login', {
    method: 'POST',
    body: params,
  });
}

export async function userLogout() {
  return request('work-api/work/logout');
}


export async function menuListApi() {
  return request('work-api/work/functionsList');
}

export async function logOutApi() {
  return request('work-api/work/logout');
}


export async function payListApi( params ) {
  return request( WORK_API+`/work/order/list?${stringify(params)}`,{
    method:'GET',
  });
}

export async function friendListApi( params ) {
  return request( WORK_API+`/work/relativeShared_list?${stringify(params)}`,{
    method:'GET',
  });
}

export async function userfeedbackListApi( params ) {
  return request( WORK_API+`/work/feedbackByList?${stringify(params)}`,{
    method:'GET',
  });
}

export async function deleteApi( params ) {
  return request( WORK_API+`/work/deleteFeedbackById?${stringify(params)}`,{
    method:'GET',
  });
}

export async function detailApi( params ) {
  return request( WORK_API+`/work/feedbackById?${stringify(params)}`,{
    method:'GET',
  });
}

export async function memorySpaceListApi( params ) {
  return request( WORK_API+`/work/storage_list?${stringify(params)}`,{
    method:'GET',
  });
}

export async function tagListApi( params ) {
  return request( WORK_API+`/work/listMediaTag?${stringify(params)}`,{
    method:'GET',
  });
}

export async function deleteTagApi( params ) {
  return request( WORK_API+`/work/deleteMediaTag?${stringify(params)}`,{
    method:'GET',
  });
}

export async function parentTagListApi( params ) {
  return request( WORK_API+`/work/parentMediaTag?${stringify(params)}`,{
    method:'GET',
  });
}

export async function addTagApi( params ) {
  return request( WORK_API+`/work/saveMediaTag`,{
    method:'POST',
    body:params
  });
}


export async function updateTagApi( params ) {
  return request( WORK_API+`/work/updateMediaTag`,{
    method:'POST',
    body:params
  });
}

export async function queryUserApi( params ) {
  return request( WORK_API+`/v1/statistic/query?${stringify(params)}`,{
    method:'POST',
  });
}


export async function versionApi( params ) {
  return request( WORK_API+`/selOsVersion?${stringify(params)}`,{
    method:'POST',
  });
}

export async function retentionApi( params ) {
  return request( WORK_API+`/user/userSum?${stringify(params)}`,{
    method:'POST',
  });
}

export async function realDataApi( params ) {
  return request( WORK_API+`/realData?${stringify(params)}`,{
    method:'POST',
  });
}

export async function devideApi( params ) {
  return request( WORK_API+`/terminal/deviceInfo?${stringify(params)}`,{
    method:'POST',
  });
}

export async function networkApi( params ) {
  return request( WORK_API+`/terminal/networkInfo?${stringify(params)}`,{
    method:'POST',
  });
}

export async function arealApi( params ) {
  return request( WORK_API+`/terminal/distribution?${stringify(params)}`,{
    method:'POST',
  });
}

export async function payStateApi( params ) {
  return request( WORK_API+`/payDescription?${stringify(params)}`,{
    method:'POST',
  });
}

export async function saveStateApi( params ) {
  return request( WORK_API+`/storageDescription?${stringify(params)}`,{
    method:'POST',
  });
}

export async function appVersionApi( params ) {
  return request( WORK_API+`/selOsVersion`,{
    method:'POST',
    body:params,
  });
}

export async function addNoticeApi( params ) {
  return request( WORK_API+`/work/notice/publish`,{
    method:'POST',
    body:params,
  });
}

export async function queryNoticeApi( params ) {
  return request( WORK_API+`/work/notice/list?${stringify(params)}`,{
    method:'GET',
  });
}

export async function shiwuDataApi( params ) {
  return request( WORK_API+`/work/listMediaTag?${stringify(params)}`,{
    method:'GET',
  });
}

export async function parentItemApi( params ) {
  return request( WORK_API+`/work/saveMediaTag`,{
    method:'POST',
    body:params
  });
}

export async function updatefuziApi( params ) {
  return request( WORK_API+`/work/updateMediaTag`,{
    method:'POST',
    body:params
  });
}

export async function versionTagsApi( params ) {
  return request( WORK_API+`/work/tags/versions `,{
    method:'GET',
  });
}

export async function queryTagsApi( params ) {
  return request( WORK_API+`/work/tags/statistic/1?${stringify(params)}`,{
    method:'GET',
  });
}

export async function queryTagsApi2( params ) {
  return request( WORK_API+`/work/tags/statistic/15?${stringify(params)}`,{
    method:'GET',
  });
}

export async function userSaveApi( params ) {
  return request( WORK_API+`/selUserStoragePhoto?${stringify(params)}`,{
    method:'POST',
  });
}

export async function userTerminalApi( params ) {
  return request( WORK_API+`/storageContent?${stringify(params)}`,{
    method:'POST',
  });
}