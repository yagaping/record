import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Select, DatePicker,
  Button, Table, message, Modal, Tooltip } from 'antd';
import styles from './NewsRecommend.less';
import NewsType from '../../components/NewsType';
import { Link } from 'dva/router';
import moment from 'moment';
import { getTypeName } from '../../components/newsTypeName.js';
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
message.config({
  duration: 1,
  maxCount: 1,
});
@Form.create()
@connect(state => ({
  newsList: state.newsList,
}))
export default class NewsRecommend extends PureComponent{
  
  state = {
    title:'',
    newsId:'',
    newsGroup:-1,
    beginDay:null,
    endDay:null,
    orderBy:'',
    newsSource:'',
    newsType:-1,
    contentType:-1,
    newsState:0,
    index:0,
    size:10,
    newsTop:{
      title:'',
      visible:false,
      newsId:'',
      newsHot:'',
      startTime:'',
      endTime:'',
      bool:false,
    },
  }

  componentDidMount() {
    // 查询新闻数据
    this.queryNewsList();
    // 缓存地址路径
    localStorage.setItem('newsUrl',this.props.match.url);
    
  }
  componentWillMount(){
   
    const searchData = JSON.parse(localStorage.getItem('searchData'));
    const mark = localStorage.getItem('mark');
    const { newsGroup } =  this.props.match.params;
   
    if(searchData && mark){
      this.setState({
        ...searchData
      });
      localStorage.removeItem('mark');
      localStorage.removeItem('searchData');
    }
  }
  // 查询列表
  queryNewsList = () => {
    const { dispatch } = this.props;
    const { title,newsId,newsGroup, beginDay, endDay, orderBy, newsSource, newsType,
      contentType,
      newsState,
      index,
      size } = this.state;
      dispatch({
        type:'newsList/query',
        payload:{
          index,
          title,
          newsId,
          newsType,
          newsState,
          size,
          beginDay,
          endDay,
          newsSource,
          orderBy,
          newsGroup,
          contentType,
        },
      });
  }
  // 选择分组
  handleChange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({'newsGroup':e})

  }
    // 查询dom
    renderForm() {
      const { getFieldDecorator } = this.props.form;
      const { title,newsId,newsGroup, beginDay, endDay } = this.state;
      
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
            <dl className={styles.searchLayout}>
                <dd style={{width:'300px'}}>
                  <FormItem label="标题">
                    {getFieldDecorator('title', { initialValue: title })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'260px'}}>
                  <FormItem label="新闻ID">
                    {getFieldDecorator('newsId', { initialValue: newsId })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'210px'}}>
                  <FormItem
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 2 }}
                    label="新闻分组"
                  >
                    {getFieldDecorator('newsGroup', { initialValue: newsGroup })(
                      <NewsType onChange={this.handleChange}/>
                    )}
                    </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem label="开始日期">
                    {getFieldDecorator('beginDay', { initialValue:beginDay && moment(this.state.searchBeginDay, 'YYYY-MM-DD') })(
                      <DatePicker className="left-padding" style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem label="结束日期">
                    {getFieldDecorator('endDay', { initialValue: endDay && moment(endDay, 'YYYY-MM-DD') })(
                      <DatePicker className="left-padding" style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'150px'}}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </dd>
            </dl>
        </Form>
      );
    }

  //查询
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
   
    form.validateFields((err, values) => {
     
      const { size, newsType, orderBy, newsSource, contentType, newsState } = this.state;
      const { title, newsId, newsGroup } = values;
      const index = 0;
      const beginDay = values.beginDay ? moment(values.beginDay).format('YYYY-MM-DD') : null;
      const endDay = values.endDay ? moment(values.endDay).format('YYYY-MM-DD') : null;
      this.setState({
        title,
        newsId,
        index,
        newsGroup,
      });
      dispatch({
        type: 'newsList/query',
        payload: {
          index,
          title,
          newsId,
          newsType,
          newsState,
          size,
          beginDay,
          endDay,
          newsSource,
          orderBy,
          newsGroup,
          contentType,
        },
      });
    });
  } 
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const params = {
      title:'',
      newsId:'',
      newsGroup:-1,
      beginDay:null,
      endDay:null,
      orderBy:'',
      newsSource:'',
      newsType:-1,
      contentType:-1,
      newsState:0,
      index:0,
      size:10,
    };
    this.setState({...params});
    dispatch({
      type: 'newsList/query',
      payload: {
        ...params,
      },
    });
  }
  // 表格翻页
  onTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { newsType, orderBy, newsSource, contentType, newsState,
      title, newsId, newsGroup, beginDay, endDay
    } = this.state;
    const index = (current - 1);
    const size = pageSize;
    this.setState({
      index,
      size,
    });
   
    dispatch({
      type: 'newsList/query',
      payload: {
          index,
          title,
          newsId,
          newsType,
          newsState,
          size,
          beginDay,
          endDay,
          newsSource,
          orderBy,
          newsGroup,
          contentType,
      },
    });
  }
  // 源链接
  handleRowClick = (row) => {
    return (
    <a href="javascript:void(0)" onClick={this.goToEdit.bind(this,row)}>
      <Tooltip placement="top" title={row.title}>{row.title}</Tooltip>
    </a>);
  }
  goToEdit = (row) => {
    let path = '';
    let href = null;
    const { newsType, contentType} = row;
    if (newsType != 5 && (contentType === 0 || contentType === 2 || contentType === 3)) {
       path = `/news/news-content-edit/${row.newsId}`;
    } else {
      path = `/news/news-content-view/${row.newsId}`;
    }
    localStorage.setItem('searchData',JSON.stringify(this.state));
    this.props.history.push(path);
  }
   // 新闻置顶、取消置顶
   handleNewsTop = (row) => {
    const {newsTop} = this.state;
    const { newsId, newsHot } = row;
    newsTop.startTime = null;
    newsTop.endTime = null;
    let title;
    this.props.form.resetFields(['setTopTime']);
    if(newsHot>0){
      title = '取消置顶';
    }else{
      title = '置顶';
    }
    this.setState({
      newsTop:{
        ...newsTop,
        newsId,
        newsHot,
        title,
        visible:true,
      },
      
    }); 
  }
   // 设置置顶时间，弹框内容
   newsToptips = () => {
    const { getFieldDecorator } = this.props.form;
    const  {newsTop:{newsHot}} = this.state;
    const setTopTime = null;
    const newsTopType = 0;
    if( newsHot > 0 ){
      return <p>是否取消置顶？</p>
    }else{
      return (
        <div className={styles.set_time}>
        <Form onSubmit={this.handleOk}>
            <FormItem
            label="置顶时间"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('setTopTime', { 
                initialValue: setTopTime, 
                rules: [{ type: 'array', required: true, message: '请选择置顶时间' }],
              })(
                <RangePicker format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
              )}
            </FormItem>
          
            <FormItem
              label='新闻类型'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 6 }}
            >
              {getFieldDecorator('newsTopType', { 
                initialValue: newsTopType, 
              })(
                <NewsType onChange={this.handleTopType} type='1'/>
              )}
            </FormItem>
        </Form>
        </div>
      )
    }
  }
   // 选择置顶分组
   handleTopType = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({'newsTopType':e})
  }
 
    // 确定、取消置顶
    handleOk = () => {
      const { dispatch,form:{validateFields} } = this.props;
    const { newsTop} = this.state;
    const { newsId, newsHot } = newsTop;
    const _this = this;
    validateFields((err, values) => {

        if (err && newsHot==0) return;
        const { setTopTime, newsTopType } = values;
     
        const formatTime = 'YYYY-MM-DD HH:mm:ss';
        if(newsHot>0){
          dispatch({
            type:'newsList/newsCancelTop',
            payload:{
              newsId,
              versionType:0,
            },
            callback:(res)=>{
              if(res.code == 0){
                _this.handleHide();
                _this.queryNewsList();
              }else{
                message.error(res.message);
              }
            }
          })
        }else{
          dispatch({
            type:'newsList/newsTop',
            payload:{
              newsId,
              startTime:moment(setTopTime[0]).format(formatTime),
              endTime:moment(setTopTime[1]).format(formatTime),
              newsType:newsTopType,
              versionType:0,
            },
            callback:(res)=>{
              if(res.code == 0){
                _this.handleHide();
                _this.queryNewsList();
              }
            }
          })
        }  
      }) 
    }
     // 取消弹框
    handleHide = () => {
      const {newsTop} = this.state;
      this.setState({
        newsTop:{
          ...newsTop,
          visible:false,
        }
      });
    }
     // 推送
  handlePush = (row) => {
    const { newsId, newsType, contentType, title, newsAbstract } = row;
   
    this.props.history.push({pathname:'/platformManage/Add-news/'+newsId,state:{newsId, newsType, contentType, title, newsAbstract, attention:0}});
  }
  render(){
    const { newsList } = this.props;
    const { loading, data:{list,pagination} } = newsList;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      { 
        title: '标题',
        key:'title',
        render: (key, row) => {
          let source = <a href={row.newsSourceUrl} target='_blank'>源链接</a>; 
          let read = row.accessCount >= 0 ?   <span style={{color:'orange'}}>[ 浏览数：{row.accessCount} ]</span> : null;
          return (
            <div className={styles.newsTitle}>
              {this.handleRowClick(row)} ({source}) {read}
            </div>
          );
        },
      },
      {
        title: '类型',
        render: (key, row) => {
          let newsTypeText = getTypeName(row.newsType);
          return (
            <div>
              <div>{newsTypeText}</div>
            </div>
          );
        },
      },
      {
        title: '内容类型',
        render: (key, row) => {
          let contentTypeText;
          if (row.contentType === 0) {
            contentTypeText = <small>图文</small>;
          } else if (row.contentType === 1) {
            contentTypeText = <small>大图新闻</small>;
          } else if (row.contentType === 2) {
            contentTypeText = <small>文字</small>;
          } else if (row.contentType === 20) {
            contentTypeText = <small>视频列表</small>;
          }
          return (
            <div>
              <div>{contentTypeText}</div>
            </div>
          );
        },
      },
      {
        title:'操作',
        key:'todo',
        width:150,
        render:(row)=>{
          return (
            <div>
              <a href="javascript:void(0)" onClick={this.handleNewsTop.bind(this,row)} style={{marginRight:15,float:'left'}}>{row.newsHot > 0 ? '取消置顶' : '置顶'}</a>
              <a href="javascript:void(0)" onClick={this.handlePush.bind(this,row)} style={{float:'right'}}>推送</a>
            </div>
          );
        }
      }
    ];
   
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                {this.renderForm()}
                <div className={styles.table}>
                  <Table
                    loading={loading}
                    rowKey="newsId"
                    dataSource={list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.onTableChange}
                  />
                </div>
            </div>
          </div>
          <Modal
            title={this.state.newsTop.title}
            visible={this.state.newsTop.visible}
            destroyOnClose={true}
            maskClosable={false}
            onOk={this.handleOk}
            onCancel={this.handleHide}
            className={styles.hightData}
          >
          {this.newsToptips()||null}
          </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
