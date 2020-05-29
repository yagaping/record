  import { stringify } from "qs";
import request from "../utils/request";

const MODULE_URL = "work-api/";
const APP_API = "app-api/";

export async function query(params) {
    return request(`${MODULE_URL}work/news?${stringify(params)}`);
}

export async function queryNewsById(params) {
    return request(`${MODULE_URL}work/news_info?${stringify(params)}`);
}

export async function saveNews({ body }) {
    return request(`${MODULE_URL}work/saveNews`, {
        method: "POST",
        body
    });
}

export async function updateNews(params) {
    return request(`${MODULE_URL}work/updateNewById`, {
        method: "POST",
        body: params
    });
}

export async function saveOrupdateNewsArticle(params) {
    return request(`${MODULE_URL}work/saveOrUpdateNewsArticleContent`, {
        method: "POST",
        body: params
    });
}

export async function saveOrupdateNewsPicture(params) {
    return request(`${MODULE_URL}work/saveOrUpdateNewsPictureContent`, {
        method: "POST",
        body: params
    });
}

export async function removeNews(id) {
    return request(`${MODULE_URL}work/news_delete?id=${id}`);
}

export async function queryNewsContentList(params) {
    return request(`${MODULE_URL}work/news_content?${stringify(params)}`);
}

export async function queryNewsContentVideoById(params) {
    return request(`${MODULE_URL}work/news_content_video_info?${stringify(params)}`);
}

export async function updateNewsVideo(body) {
    return request(`${MODULE_URL}work/updateNewsContentVideoById`, {
        method: "POST",
        body
    });
}

export async function addNewsVideo({ body }) {
    return request(`${MODULE_URL}work/saveNewsContentVideo`, {
        method: "POST",
        body
    });
}

export async function queryQuestionImageList(params) {
    return request(`${MODULE_URL}work/newsContentQuestionImageList?${stringify(params)}`);
}

export async function queryNewsContentAnswerList(params) {
    return request(`${MODULE_URL}work/newsContentAnswerList?${stringify(params)}`);
}

export async function updateNewsAnswer({ body }) {
    return request(`${MODULE_URL}work/updateNewsContentAnswerById`, {
        method: "POST",
        body
    });
}

export async function deleteNewsAnswer(params) {
    return request(`${MODULE_URL}work/deleteNewsContentAnswerById?${stringify(params)}`);
}

export async function updateNewsQuestion({ body }) {
    return request(`${MODULE_URL}work/updateNewsContentQuestionById`, {
        method: "POST",
        body
    });
}

export async function addNewsQuestion({ body }) {
    return request(`${MODULE_URL}work/saveNewsContentQuestion`, {
        method: "POST",
        body
    });
}

export async function addNewsQuestionImage({ body }) {
    return request(`${MODULE_URL}work/saveNewsContentQuestionImage`, {
        method: "POST",
        body
    });
}

export async function updateNewsQuestionImage({ body }) {
    return request(`${MODULE_URL}work/updateNewsContentQuestionImageById`, {
        method: "POST",
        body
    });
}

export async function deleteNewsQuestionImage(params) {
    return request(`${MODULE_URL}work/deleteNewsContentQuestionImageById?${stringify(params)}`);
}

export async function queryNewsQuestionAnswerImageList(params) {
    return request(`${MODULE_URL}work/newsQuestionAnswerImageList?${stringify(params)}`);
}

export async function addNewsQuestionAnswerImage({ body }) {
    return request(`${MODULE_URL}work/saveNewsQuestionAnswerImage`, {
        method: "POST",
        body
    });
}

export async function updateNewsQuestionAnswerImage({ body }) {
    return request(`${MODULE_URL}work/updateNewsQuestionAnswerImageById`, {
        method: "POST",
        body
    });
}

export async function queryNewsQuestionAnswerVideoList(params) {
    return request(`${MODULE_URL}work/newsQuestionAnswerVideoList?${stringify(params)}`);
}

export async function addNewsQuestionAnswerVideo({ body }) {
    return request(`${MODULE_URL}work/saveNewsQuestionAnswerVideo`, {
        method: "POST",
        body
    });
}

export async function updateNewsQuestionAnswerVideo({ body }) {
    return request(`${MODULE_URL}work/updateNewsQuestionAnswerVideoById`, {
        method: "POST",
        body
    });
}

export async function queryNewsImageList(params) {
    return request(`${MODULE_URL}work/newsImageList?${stringify(params)}`);
}

export async function addNewsImage({ body }) {
    return request(`${MODULE_URL}work/saveNewsImage`, {
        method: "POST",
        body
    });
}

export async function updateNewsImage({ body }) {
    return request(`${MODULE_URL}work/updateNewsImageById`, {
        method: "POST",
        body
    });
}

export async function updateNewsState(params) {
    return request(`${MODULE_URL}work/updateNewsStateById`, {
        method: "POST",
        body: params
    });
}

export async function queryNewsContentAnswerById(params) {
    return request(`${MODULE_URL}work/news_content_answer_info?${stringify(params)}`);
}


export async function newsTopListApi(params) {
    return request(`${APP_API}listNewsTop`, {
        method: "POST",
        body: params
    });
}

export async function newsTopApi(params) {
    return request(`${APP_API}pushNewsTop`, {
        method: "POST",
        body: params
    });
}

export async function newsCancelTopApi(params) {
    return request(`${APP_API}deleteNewsTop`, {
        method: "POST",
        body: params
    });
}

export async function getTabMenuApi(params) {
    return request(`${MODULE_URL}newsTabs/getNewsTabsByType`, {
        method: "POST",
        body: params
    });
}


export async function concernTypeApi(params) {
    return request(`${MODULE_URL}attention/getEventList?${stringify(params)}`, {
        method: "GET"
    });
}

export async function addConcernApi(params) {
    return request(`${MODULE_URL}attention/insert`, {
        method: "POST",
        body: params
    });
}

export async function saveWaitAttention(params) {
    return request(`${MODULE_URL}attention/insertConcerned`, {
        method: "POST",
        body: params
    });
}

export async function specialTypeApi(params) {
    return request(`${MODULE_URL}specialTopic/selectAllSpecialTopic?${stringify(params)}`, {
        method: "GET"
    });
}

export async function addSpecialApi(params) {
    return request(`${MODULE_URL}specialTopic/insert`, {
        method: "POST",
        body: params
    });
}

export async function hotNewsApi(params) {
    return request(`${MODULE_URL}newsHot/insert`, {
        method: "POST",
        body: params
    });
}

export async function hotNewsListApi(params) {
    return request(`${MODULE_URL}newsHot/selectAllList`, {
        method: "POST",
        body: {
          ...params,
          hotNewsType: params.newsType,
        },
    });
}

export async function deleteHotApi({ id }) {
    return request(`${MODULE_URL}newsHot/${id}/delete`, {
        method: "DELETE",
    });
}

export async function iconListApi(params) {
    return request(`${MODULE_URL}newsHotLabel`, {
        method: "PATCH",
        body: params
    });
}

export async function saveIconApi(params) {
    return request(`${MODULE_URL}newsHotLabel`, {
        method: "POST",
        body: params
    });
}

export async function deleteIconApi(params) {
    return request(`${MODULE_URL}newsHotLabel/${params.id}`, {
        method: "DELETE",
    });
}





