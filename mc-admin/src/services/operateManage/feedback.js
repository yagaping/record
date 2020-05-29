import request from '../../utils/request';

//反馈管理
export async function queryFeedbackList(params) {
  return request('/restful/feedback/queryFeedback', {
    method: 'POST',
    body: params,
  });
}

//上传文件
export async function uploadFileApi(params) {
  return request('/restful/feedback/queryFeedbackFile', {
    method: 'POST',
    body: params,
  });
}
