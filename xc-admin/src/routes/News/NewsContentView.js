import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Radio, Row, Col, notification, Input, Modal, message } from 'antd';
import ContentEditor from '../../components/ContentEditor/ContentEditor';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PhoneVideoView from '../../components/PhoneVideoView/index';
import moment from 'moment';
import EditSend from '../../components/EditSend';
import styles from './NewsContentEdit.less';
import SetConcern from '../../components/SetConcern';
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(state => ({
  newsContentView: state.newsContentView,
  newsContentList: state.newsContentList,
}))
export default class newsContentView extends Component {
  state = {
    visible:false,
    lastNewsId:'',
    nextNewsId:'',
    setConcern:{
      visible:false,
    },
  }
  componentDidMount() {
    this.queryDetail();
    localStorage.setItem('mark','true');
  }

  // 视频详情
  queryDetail = (id) => {
    const _this = this;
    const { dispatch, match } = this.props;
    let { newsId } = match.params;
    if(id){
      newsId = id;
    }
    const params = JSON.parse(localStorage.getItem('searchData'));
    dispatch({
      type: 'newsContentView/queryNewsContent',
      payload: {
        newsId,
        searchTitle:params.searchTitle,
        searchNewsState:params.searchNewsState,
        searchNewsSource:params.searchSocuce,
        searchNewsGroup:params.searchNewsGroup,
        searchContentType:params.contentType,
        searchBeginDay:params.searchBeginDay,
        searchEndDay:params.searchEndDay,
        searchOrderBy:params.searchRanking,
      },
      callback:(res)=>{
        
        if(res.code == 0){
         
          const { afterNewsId, beforeNewsId } = res.result;
          _this.setState({
            lastNewsId:afterNewsId,
            nextNewsId:beforeNewsId,
          });
          
          if(id){
            const { newsId } = res.result;
            let path='';
            if (res.result.newsType != 5 && (res.result.contentType === 0 || res.result.contentType === 2 || res.result.contentType === 3)) {
              path = `/news/news-content-edit/${newsId}`;
            } else {
              path = `/news/news-content-view/${newsId}`;
            }
            _this.props.history.push(path);
          }
        }else{
          message.error(res.message);
        }
      }
    });
  }

  // 内容编辑改变
  handleContentEditorChange = (e) => {
    const html = e;
    this.props.dispatch({
      type: 'newsContentView/changePhoneSimulatorHtml',
      payload: {
        html,
      },
    });
  };

  // 保存操作
  handleSaveClick = () => {
    const { newsContentView, dispatch } = this.props;
    const { phoneSimulator, newsContentArticleId, newsId } = newsContentView;
    dispatch({
      type: 'newsContentView/updateNewsContentArticle',
      payload: {
        newsId,
        newsContentArticleId,
        article: phoneSimulator.html,
        articleType: 0,
      },
    });
  };

  // 发布点击事件
  handleReleaseClick = () => {
    const { newsContentView, dispatch } = this.props;
    const { newsId, newsGroup } = newsContentView;
    const params = JSON.parse(localStorage.getItem('searchData'));
    const _this = this;
    dispatch({
      type:'newsContentView/newsSend',
      payload:{
        newsId,
        newsGroup: newsGroup,
        newsState: 0,
        searchTitle:params.searchTitle,
        searchNewsState:params.searchNewsState,
        searchNewsSource:params.searchSocuce,
        searchNewsGroup:params.searchNewsGroup,
        searchContentType:params.contentType,
        searchBeginDay:params.searchBeginDay,
        searchEndDay:params.searchEndDay,
        searchOrderBy:params.searchRanking,
      },
      callback: (res) => {
        if(res===null){
          notification.success({
            message: '提示消息',
            duration:1,
            placement:'bottomRight',
            description: '已经是最后一条了!',
          });
          return;
        }
        const newsId = res.newsId;
        let path;
        if (res.newsType != 5 && (res.contentType === 0 || res.contentType === 2 || res.contentType === 3)) {
            path = `/news/news-content-edit/${newsId}`;
        } else {
          path = `/news/news-content-view/${newsId}`;
        }
        _this.props.history.push(path);
      }
    })
  }

  //点击不通过事件 
  handleNopass = () => {
    const { newsContentView, dispatch } = this.props;
    const { phoneSimulator, newsContentArticleId, newsGroup, newsId } = newsContentView;
    const params = JSON.parse(localStorage.getItem('searchData'));
    let _this = this;
    dispatch({
      type:'newsContentView/newsSend',
      payload:{
        newsId,
        newsGroup: newsGroup,
        newsState: 3,
        searchTitle:params.searchTitle,
        searchNewsState:params.searchNewsState,
        searchNewsSource:params.searchSocuce,
        searchNewsGroup:params.searchNewsGroup,
        searchContentType:params.contentType,
        searchBeginDay:params.searchBeginDay,
        searchEndDay:params.searchEndDay,
        searchOrderBy:params.searchRanking,
      },
      callback: (res) => {
          if(res===null){
            notification.success({
              message: '提示消息',
              duration:1,
              placement:'bottomRight',
              description: '已经是最后一条了!',
            });
            return;
          }
          const newsId = res.newsId;
          let path;
          if (res.newsType != 5 && (res.contentType === 0 || res.contentType === 2 || res.contentType === 3)) {
              path = `/news/news-content-edit/${newsId}`;
          } else {
            path = `/news/news-content-view/${newsId}`;
          }
          _this.props.history.push(path);
      }
    })
  }
  // 推送消息
  handleSendNews = () => {
    const { newsId, newsType, contentType, title, attention } = this.props.newsContentView;
    this.props.history.push({pathname:'/platformManage/Add-news/'+newsId,state:{newsId, newsType, contentType, title, attention}});
  }

 // 上一条新闻
 handleLastNews = () => {
   
  const { lastNewsId } = this.state;
  if(lastNewsId != '0'){
    this.queryDetail(lastNewsId);
  }else{
    message.info('已经是第一条了！');
  }
  
}
// 下一条新闻
handleNextNews = () => {
  const { nextNewsId } = this.state;
  if(nextNewsId != '0'){
    this.queryDetail(nextNewsId);
  }else{
    message.info('已经是最后一条了！');
  }
}

  // 点击返回按钮事件
  handleGoBack = () => {
    const path = localStorage.getItem('newsUrl');
    this.props.history.push(path);
    // history.back();
  };

    // 修改标题弹框内容
    titleDom = () => {
      const { phoneSimulator:{title} } =  this.props.newsContentView;
      return (
        <div className={styles.textArea+' ant-input'} ref='title' contenteditable='true'>
          {title}
        </div>
      );
    }
  
    //修改标题
    modifyTitle = () => {
      this.setState({
        visible:true,
      });
    }  
    // 确定修改标题
    handelOk = () => {
      const { dispatch, newsContentView } = this.props;
      const { newsId } = newsContentView;
      const title = this.refs.title.innerHTML;
      dispatch({
        type:'newsContentView/modifyTitle',
        payload:{
          title,
          newsId,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.queryDetail();
            this.handelCancel();
          }else{
            message.error('修改标题失败');
          }
        }
      });
      
    }
    // 取消修改标题弹框
    handelCancel = () => {
      this.setState({
        visible:false,
      });
    }

    
  // 关注
  handleConcern = () => {
    const { dispatch } = this.props;
    const { setConcern } = this.state;
    // 查询关注事件分类名
   dispatch({
     type:'newsContentList/concernType',
   });
    
    this.setState({
      setConcern:{
        ...setConcern,
        visible:true,
      }
    });
  }
  // 确定关注
  concernOk = (params) => {
    const { dispatch } = this.props;
    const {  title, newsId, newsAbstract, createTime } = this.props.newsContentEdit;
    const obj = {
      title,
      newsId,
      createTime:moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
      newsAbstract,
    };
    if(params.name){ //输入关注栏目
      obj.title = params.name;
    }else if(params.type){  //选择关注事件
      obj.id = params.type;
    }
    dispatch({
      type:'newsContentList/addConcern',
      payload:{
        ...obj,
      },
      callback:(res)=>{
        if(res.code == 0){
          this.concernNo();
          this.queryDetail();
        }else{
          message.error(res.message);
        }
      }
    });
  }
  // 取消关注
  concernNo = () => {
    const { setConcern } = this.state;
    this.setState({
      setConcern:{
        ...setConcern,
        visible:false,
      }
    });
  }

  render() {
   
    const { newsContentView, newsContentList } = this.props;
    const { visible, setConcern } = this.state;
    const { disabled } = JSON.parse(localStorage.getItem('searchData'));
    const { contentEditData, phoneSimulator, loading, attention } = newsContentView;
    const { concernTypeData } = newsContentList;

    // 不是从新闻列表跳来的详情，不显示上下条
    let isNewsList = true;
    const parentUrl = localStorage.getItem('newsUrl');
    if(parentUrl.indexOf('concern-detail-list')!=-1||parentUrl.indexOf('error-back')!=-1){
      isNewsList = false;
    }

    return (
      <PageHeaderLayout>
        <Spin tip="请稍后..." size="large" spinning={loading}>
        <div className={styles.editTitle}>
            <div className={styles.title}>
              <TextArea rows={3} value={phoneSimulator.title} disabled/>
            </div>
            <div className={styles.show}>
            <Button type='primary' onClick={this.modifyTitle}>修改标题</Button>
            </div>
          </div>
          <Modal
            visible={visible}
            title='修改标题'
            onOk={this.handelOk}
            onCancel={this.handelCancel}
            maskClosable={false}
            destroyOnClose={true}
          >
            {this.titleDom()}
          </Modal> 
          {/* 设置关注栏目 */}
          {/* <SetConcern 
            state={setConcern}
            onOk={this.concernOk}
            onCancel={this.concernNo}
            type={concernTypeData}
            loading={newsContentList.loading}
          />  */}
          {/* <ContentEditor
            className={styles.contentEditor}
            htmlData={contentEditData}
            onChange={this.handleContentEditorChange}
          /> */}
          <div className={styles.default}></div>
          <PhoneVideoView className={styles.phoneSimulator} {...phoneSimulator}></PhoneVideoView>
          <div className={styles.save}>
            <Row>
              <Col span={24}><Button  type="primary" onClick={this.handleSaveClick}>保存</Button></Col>
            </Row>
            <Row>
              <Col>
                <div className={styles.send}>
                  <Button type="primary" style={{display:disabled?'none':'block'}} onClick={this.handleReleaseClick}>发布</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}><Button type="primary" style={{display:disabled?'none':'block'}} onClick={this.handleNopass}>不通过</Button>
              </Col>
            </Row> 
            <Row>
              <Col span={24}><Button type="primary" style={{display:disabled?'none':'block'}} onClick={this.handleSendNews}>推送消息</Button>
              </Col>
            </Row>
            <Row style={{display:isNewsList?'block':'none'}}>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Button style={{width:'100%'}} type="primary" style={{display:disabled?'none':'block',width:'100%'}} onClick={this.handleLastNews}>上一条</Button>
                  </Col>
                  <Col span={11} offset={2}>
                    <Button type="primary" style={{width:'100%'}} style={{display:disabled?'none':'block',width:'100%'}} onClick={this.handleNextNews}>下一条</Button>
                  </Col>
                </Row>
              </Col>
            </Row>  
            <Row>
              <Col span={24}><Button className={styles.btnBack} onClick={this.handleGoBack}>返回</Button>
              </Col>
            </Row> 
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
