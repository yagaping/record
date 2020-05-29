import request from '../../utils/request';

//美听
export async function listenAudioAdd(params) {
    return request('/restful/listenAudio/save', {
      method: 'POST',
      body: params,
    });
  }
  
export async function listenAudioDelete(params) {
    return request('/restful/listenAudio/remove', {
        method: 'POST',
        body: params,
    });
}

export async function listenAudioUpdate(params) {
    return request('/restful/listenAudio/modify', {
        method: 'POST',
        body: params,
    });
}

export async function listenAudio(params) {
    return request('restful/listenAudio/find', {
        method: 'POST',
        body: params,
    });
}

export async function listenAudioUpload(params) {
    return request('restful/listenAudio/uploadAudio', {
        method: 'POST',
        body: params,
    });
}

export async function audioPublish(params) {
    return request('restful/listenAudio/publish', {
        method: 'POST',
        body: params,
    });
}

export async function audioUnPublish(params) {
    return request('restful/listenAudio/lowerShelf', {
        method: 'POST',
        body: params,
    });
}

export async function getOneMonthDataApi(params) {
    return request('restful/listenAudio/getNum', {
        method: 'POST',
        body: params,
    });
}

export async function checkItemApi(params) {
    return request('restful/listenAudio/audit', {
        method: 'POST',
        body: params,
    });
}

export async function queryOneDayApi(params) {
    return request('restful/listenAudio/findByPublishTime', {
        method: 'POST',
        body: params,
    });
}

export async function getRecomendDataApi(params) {
    return request('restful/audio/getRecommendNum', {
        method: 'POST',
        body: params,
    });
}

export async function recommendApi(params) {
    return request('restful/audio/recommend', {
        method: 'POST',
        body: params,
    });
}

export async function unRecommendApi(params) {
    return request('restful/audio/unRecommend', {
        method: 'POST',
        body: params,
    });
}

export async function rankApi(params) {
    return request('restful/listenAudio/dailySort', {
        method: 'POST',
        body: params,
    });
}


