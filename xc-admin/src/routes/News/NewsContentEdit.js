import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Radio, Row, Col, notification, 
  Input, Modal, Form, message, Select } from 'antd';
import ContentEditor from '../../components/ContentEditor/ContentEditor';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PhoneSimulator from '../../components/PhoneSimulator/index';
import moment from 'moment';
import AddHotModal from '../../components/AddHotModal';
import styles from './NewsContentEdit.less';
import SetConcern from '../../components/SetConcern';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
@connect(state => ({
  newsContentEdit: state.newsContentEdit,
  newsContentList: state.newsContentList,
}))
@Form.create()
export default class NewsContentEdit extends Component {
  state = {
    visible:false,
    lastNewsId:'',
    nextNewsId:'',
    noData:false,
    setConcern:{
      visible:false,
      showImg:[],
    },
    newsHot:{
      visible:false,
    },
  }
  componentDidMount() {
    this.queryDetail();
    localStorage.setItem('mark','true');
  }
  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'newsContentEdit/removeData',
    });
  }
  // 查询新闻详情
  queryDetail = (id) => {
    const _this = this;
    const { dispatch, match } = this.props;
    let { newsId } = match.params;
    if(id){
      newsId = id;
    }
    const params = JSON.parse(localStorage.getItem('searchData'));
    dispatch({
      type: 'newsContentEdit/queryNewsContent',
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
    
        if(res.code === 0){
         if(res.result !== null){
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
           _this.setState({
             noData:true,
           })
          message.warning('查无新闻');
         }
        }else{
          message.error(res.message);
        }
      }
    });
  }

  // 内容编辑改变
  handleContentEditorChange = (e) => {
    let html = e;
    if(html.lastIndexOf('audio')!=-1||html.lastIndexOf('vedio')!=-1){
      html += '&nbsp';
    }
    this.props.dispatch({
      type: 'newsContentEdit/changePhoneSimulatorHtml',
      payload: {
        html,
      },
    });
  };

  // 保存操作
  handleSaveClick = () => {
    const { newsContentEdit, dispatch } = this.props;
    const { phoneSimulator, newsContentArticleId, newsId } = newsContentEdit;
    // 标记编辑保存的新闻
    let article = (phoneSimulator.html).replace(/(\<span(\s+?)style=\"display:none\"\>_MC_HAS_FORMAT_\<\/span\>)/g,'');

    article = `<span style="display:none">_MC_HAS_FORMAT_</span>${article}`;
    dispatch({
      type: 'newsContentEdit/updateNewsContentArticle',
      payload: {
        newsId,
        newsContentArticleId,
        article,
        articleType: 0,
      },
    });
  };

  // 发布点击事件
  handleReleaseClick = () => {
    const { newsContentEdit, dispatch } = this.props;
    const { newsId, newsGroup } = newsContentEdit;
    const params = JSON.parse(localStorage.getItem('searchData'));
    const _this = this;
    dispatch({
      type:'newsContentEdit/newsSend',
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
        let path='';
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
    const params = JSON.parse(localStorage.getItem('searchData'));
    const { newsContentEdit, dispatch } = this.props;
    const { phoneSimulator, newsContentArticleId, newsGroup, newsId } = newsContentEdit;
    let _this = this;
    dispatch({
      type:'newsContentEdit/newsSend',
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
    
    const { newsId, newsType, contentType, title, newsAbstract, attention, newsState } = this.props.newsContentEdit;
    if(newsState != 0 && newsState != 4 ){
      this.needSend();
      return;
    }
    this.props.history.push({pathname:'/platformManage/Add-news/'+newsId,state:{newsId, newsType, contentType, title, newsAbstract, attention}});
  }

  // 提示新闻发布
  needSend = () => {
    const { newsContentEdit, dispatch } = this.props;
    const { newsId, newsGroup } = newsContentEdit;
    const params = JSON.parse(localStorage.getItem('searchData'));
    const _this = this;
    confirm({
      title: '未通过审核，是否需要发布',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        dispatch({
          type:'newsContentEdit/newsSend',
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
            _this.queryDetail();
          }
        })
      }
    })
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
    const { phoneSimulator:{title} } =  this.props.newsContentEdit;
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
    const { dispatch, newsContentEdit } = this.props;
    const { newsId } = newsContentEdit;
    const title = this.refs.title.innerHTML;
    dispatch({
      type:'newsContentEdit/modifyTitle',
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

  // 关注 type= 1关注 2专题
  handleConcern = (type) => {
    const { dispatch, newsContentEdit:{newsState} } = this.props;
    const { setConcern } = this.state;
    const _this = this;

    if(newsState != 0 && newsState != 4 ){
      this.needSend();
      return;
    }
    // 查询关注事件分类名
    if(type === 1){
      dispatch({
        type:'newsContentList/concernType',
      });
    }else if(type === 2){ //查询专题分类名
      dispatch({
        type:'newsContentList/specialType',
        payload:{
          status:1, //1上线专题，2下线专题 
        },
      });
    }
    this.setState({
      setConcern:{
        ...setConcern,
        type,
        showImg:[],
        visible:true,
      }
    });
  }
  // 确定关注
  concernOk = (params) => {
    const { dispatch } = this.props;
    const {  title, newsId, newsAbstract, eventTime, createTime, newsType, contentType, accessCount } = this.props.newsContentEdit;
    const { setConcern:{type} } = this.state;
    // 提交关注
    if(type === 1){
      const attrList = [];
      const _this = this;
      const obj = {
        title,
        newsId,
        newsType,
        contentType,
        eventTime:moment(eventTime).format('YYYY-MM-DD HH:mm:ss'),
        createTime:moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
        newsAbstract,
        newsTitle:title,
      };
      if(params.name){ //输入关注栏目
        obj.title = params.name;
        obj.viceTitle = params.viceTitle;
        obj.event_time = moment(params.selectTime).format('YYYY-MM-DD HH:mm');
        obj.imgUrl  = params.showImg;
      }else if(params.type){  //选择关注事件
        obj.attentionId = params.type;
        obj.id = params.type;
        obj.event_time = moment(params.selectTime2).format('YYYY-MM-DD HH:mm');
      }
      attrList.push(obj);
      // 防止多次提交
      if(_this.submitAgain){
        return;
      }
      _this.submitAgain = true;
      dispatch({
        type:'newsContentList/addConcern',
        payload:{
          attrList,
        },
        callback:(res)=>{
        
          setTimeout(()=>{
            _this.submitAgain = false;
          },300);
          if(res.code == 0){
            this.concernNo();
            this.queryDetail();
          }else{
            message.error(res.message);
          }
        }
      });
    }else if(type === 2){ //提交专题
     
      const obj = {
        newsId,
        title,
        newsType,
        contentType,
        newsAbstract,
        accessCount,
      };
      if(params.name){
        obj.title = params.name;
        obj.originalTitle = title;
        obj.viceTitle = params.viceTitle;
        obj.imgUrl = params.showImg;
      }else if(params.type){
        obj.topicId = params.type;
      }
     
      dispatch({
        type:'newsContentList/addSpecial',
        payload:obj,
        callback:(res)=>{
          if(res.code == 0){
            this.concernNo();
            this.queryDetail();
          }else{
            message.error(res.message);
          }
        }
      })
    } 
  }
  // 取消关注
  concernNo = () => {
    const { dispatch } = this.props;
    const { setConcern } = this.state;
    dispatch({
      type:'newsContentList/changeTableLoading',
      payload:{
        loading:false,
      },
    })
    this.setState({
      setConcern:{
        ...setConcern,
        visible:false,
      }
    });
  }
  // 添加简洁新闻
  simpleNews = () =>{
    const { dispatch, newsContentEdit } = this.props;
    const { newsId, newsType, title, contentType } = newsContentEdit;
    const _this = this;
    confirm({
      title: '添加至简洁头条?',
      okText:'确定',
      cancelText:'取消',
      okButtonProps:{
        disabled:true,
      },
      onOk() {
      
        dispatch({
          type:'newsContentEdit/addSimpleNews',
          payload:{
            newsId,
            newsType,
            title,
            contentType,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.queryDetail();
            }else{
              message.error(res.message);
            }
          }
        });
      }
    });
  }
  // 热门新闻弹框
  handleHot = () => {
    const { newsContentEdit, dispatch } = this.props;
    const { newsState } = newsContentEdit;
    if(newsState != 0 && newsState != 4 ){
      this.needSend();
      return;
    } 
    dispatch({
      type:'newsContentEdit/queryHotIcon',
      payload:{},
    });
   this.setState({
    newsHot:{visible:true}    
   });
  }
  
  // 取消添加热门弹框
  handelHotCancel = () => {
    this.setState({
      newsHot:{visible:false}    
    });
  }
  // 确定添加热门新闻
  handelHot = (values) => {
    const { dispatch, newsContentEdit } = this.props;
    const { newsId,contentType,accessCount, newsAbstract } = newsContentEdit;
    const _this = this;
      const { sethotNews, markIcon, hotTitle } = values;
      let params = {
        newsId,
        title:hotTitle,
        newsType:sethotNews,
        contentType,
        accessCount,
        newsAbstract,
      };
      // 选择了标识
      if(markIcon){
        let item = markIcon.split(',');
        params.label = item[0];
        params.image = item[1];
      }
      dispatch({
        type:'newsContentList/addHotNews',
        payload:{
            ...params,
        },
        callback:(res)=>{
          if(res.code == 0){
            message.success('添加热门成功');
            _this.handelHotCancel();
            _this.queryDetail();
          }else{
            message.error(res.message);
          }
        }
      });   
    
  }
  render() {
    const {visible,setConcern, noData, newsHot} = this.state;
    const { newsContentEdit, dispatch, newsContentList } = this.props;
    const { contentEditData, phoneSimulator, loading, attention, newsType, concise, specialTopic,hotIconList, hasHot  } = newsContentEdit;
    const { concernTypeData } = newsContentList;
    const { disabled } = JSON.parse(localStorage.getItem('searchData'));
   
    // 不显示关注的新闻
    let isForeign = false;
    if(newsType == 11 || newsType == 13){
      isForeign = true;
    }
    
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
            <Button type='primary' onClick={this.modifyTitle} disabled={noData}>修改标题</Button>
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
          {/* 添加热门新闻弹框 */}
          <AddHotModal
            newsHot={newsHot}
            hotIconList={hotIconList}
            handelHot={this.handelHot}
            handelHotCancel={this.handelHotCancel}
          />
          {/* 设置关注栏目、专题 */}
          <SetConcern 
            onOk={this.concernOk}
            onCancel={this.concernNo}
            type={concernTypeData}
            state={setConcern}
            loading={newsContentList.loading}
          /> 
          <ContentEditor
            className={styles.contentEditor}
            htmlData={contentEditData}
            dispatch={dispatch}
            title={phoneSimulator.title}
            onChange={this.handleContentEditorChange}
          />
          <PhoneSimulator className={styles.phoneSimulator} {...phoneSimulator}>modal</PhoneSimulator>
          <div className={styles.save}>
            <Row>
              <Col span={24}><Button  type="primary" onClick={this.handleSaveClick} disabled={noData?true:false}>保存</Button></Col>
            </Row>
            <Row>
              <Col>
                <div className={styles.send}>
                  <Button type="primary" style={{display:disabled || noData?'none':'block'}} onClick={this.handleReleaseClick}>发布</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}><Button type="primary" style={{display:disabled || noData?'none':'block'}} onClick={this.handleNopass}>不通过</Button>
              </Col>
            </Row> 
            <Row>
              <Col span={24}><Button type="primary" style={{display:disabled || noData?'none':'block'}} onClick={this.handleSendNews}>推送消息</Button>
              </Col>
            </Row>
            <Row style={{display:isForeign ? 'none' : 'block'}}>
              <Col span={24}><Button type="primary"  disabled={attention||noData?true:false} onClick={this.handleConcern.bind(this,1)}>{attention?'已添加关注':'关注'}</Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}><Button type="primary" disabled={hasHot||noData?true:false} onClick={this.handleHot}>
              {hasHot?'已设热门新闻':'热门新闻'}
              </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}><Button type="primary"  disabled={specialTopic||noData ? true:false} onClick={this.handleConcern.bind(this,2)}>专题新闻</Button>
              </Col>
            </Row>
            {/* <Row>
              <Col span={24}><Button type="primary" disabled={concise?true:false} onClick={this.simpleNews}>{concise?'已添加简洁头条':'简洁头条'}</Button></Col>
            </Row>  */}
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
