import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, DatePicker, Modal, Select, Table, message } from 'antd';
import moment from 'moment';
import NewsType from '../../components/NewsType'; 
import AlertTips from '../../components/AlertTips';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './ErrorBack.less';
import { newsTypeName } from '../../components/newsTypeName.js';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option } = Select;
const NEWSTYPENAME = newsTypeName;
const NEWSTYPE = {
  0:'头条',
  1:'娱乐',
  20:'视频',
  7:'科技',
  8:'体育',
  9:'军事',
  10:'财经',
};
@Form.create()
@connect(state => ({
  platform: state.platform,
}))
export default class ErrorBack extends Component{
  state = {
    title:'',
    startTime:null,
    endTime:null,
    newsType:'',
    errorType:'',
    index:1,
    size:10,
    alertTips:{
      title:'删除',
      visible:false,
      html:'',
    },
  }
  componentWillMount(){
    const searchData = JSON.parse(localStorage.getItem('searchData'));
    const mark = localStorage.getItem('mark');
    if(searchData && mark){
      this.setState({
        ...searchData
      });
      localStorage.removeItem('mark');
      localStorage.removeItem('searchData');
    }
  }
  componentDidMount(){
    localStorage.setItem('newsUrl',this.props.match.url);
    this.queryErrorList();
  }
  // 查询纠错列表
  queryErrorList = () =>{
    const { title,startTime,endTime,newsType,errorType,
      index,size } = this.state;
      this.props.dispatch({
        type:'platform/errorList',
        payload:{
          title,
          startTime,
          endTime,
          newsType,
          type:errorType,
          index,
          size,
        },
      })
  }

  getNewsType = (value) => {
   
    for(let i=0;i<NEWSTYPENAME.length;i++){
      if(NEWSTYPENAME[i].newsType == value){
        return NEWSTYPENAME[i].newsName;
      }
    }
  }

  // 点击搜错
  handleSearch = (e) =>{
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { index, size } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      const { title, newsType, errorType, date } = values;
      let startTime = null;
      let endTime = null;
      if(date.length&&date[0]){
        startTime = moment(date[0]).format('YYYY-MM-DD');
        endTime = moment(date[1]).format('YYYY-MM-DD');
      }
      const params = {
        title,
        newsType:newsType==-1?'':newsType,
        type:errorType,
        startTime,
        endTime,
      };
      this.setState({
       ...params,
      });
      dispatch({
        type:'platform/errorList',
        payload:{
          ...params,
          index,
          size,
        },
      });
    })
  }

  // 选择查询日期
  changeDate = (e) => {
    console.log(e);
  }

  // 选择分组
  handleChange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({'newsType':e})

  }

  // 搜索结构
  searchDom = () => {
    const { title, startTime, endTime, newsType, errorType } = this.state;
    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <dl className={styles.searchLayout}>
              <dd style={{ width:'300px' }}>
                <FormItem
                  label="标题"
                >
                  {getFieldDecorator('title', { initialValue: title})(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </dd>
              <dd style={{ width:'300px' }}>
                <FormItem
                  label="日期"
                >
                  {getFieldDecorator('date', { initialValue: [startTime, endTime]})(
                    <RangePicker width="100%" onChange={this.changeDate}/>
                  )}
                </FormItem>
              </dd>
              <dd>
                <FormItem
                  label="新闻类型"
                >
                  {getFieldDecorator('newsType', { initialValue:newsType==''?-1:newsType})(
                    <NewsType onChange={this.handleChange}/>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:230}}>
                <FormItem
                  label="举报类型"
                >
                  {getFieldDecorator('errorType', { initialValue:errorType})(
                    <Select>
                      <Option value={''}>全部</Option>
                      <Option value={0}>内容重复</Option>
                      <Option value={1}>新闻不完整</Option>
                      <Option value={2}>涉及政治</Option>
                      <Option value={3}>无法播放</Option>
                      <Option value={4}>图片显示错误</Option>
                      <Option value={5}>版权问题</Option>
                      <Option value={6}>错别字</Option>
                      <Option value={7}>页面格式错误</Option>
                    </Select>
                  )}
                </FormItem>
              </dd>
              <dd>
                <Button type="primary" htmlType="submit" style={{marginTop:3}}>查询</Button>
              </dd>
          </dl>
      </Form>
    );
  }

    // 表格分页
    handleTableChange = (pagination, filters, sorter) => {
      const { current, pageSize } = pagination;
      const { title, newsType, errorType, startTime, endTime } = this.state;
      const index = current;
      this.setState({
        index,
        size:pageSize,
      });
      this.props.dispatch({
        type:'platform/errorList',
        payload:{
          index,
          size:pageSize,
          title,
          newsType,
          type:errorType,
          startTime,
          endTime,
        },
      })
    }
    // 进入新闻详情
    newsDetail = (row) =>{
      const { newsType, contentType } = row;
      let path;
      if (newsType != 5 && (contentType === 0 || contentType === 2 || contentType === 3)) {
        path = `/news/news-content-edit/${row.newsId}`;
     } else {
       path = `/news/news-content-view/${row.newsId}`;
     }
      localStorage.setItem('searchData',JSON.stringify(this.state));
      this.props.history.push(path);
    }
    // 删除数据
    deleteError = (row) => {
      const { alertTips } = this.state;
      this.setState({
        alertTips:{
          ...alertTips,
          html:'确定要删除该条纠错反馈？',
          visible:true,
        },
        errorId:row.id,
      });
    }
    // 确定删除
    handleOk = () =>  {
      const { errorId } = this.state;
      this.props.dispatch({
        type:'platform/deleteError',
        payload:{
          id:errorId,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.queryErrorList();
            this.handleCancel();
          }else{
            message.error(res.message);
          }
        }
      });
    }
    // 取消删除
    handleCancel = () => {
      const { alertTips } = this.state;
      this.setState({
        alertTips:{
          ...alertTips,
          visible:false,
        }
      });
    }
  render(){
    const { alertTips } = this.state;
    const { errorData, userBack, loading } = this.props.platform;
    const columns  = [{
      title:'标题',
      dataIndex:'title',
      key:'title',
      render:(key,row)=>{
        return <a href="javascript:void(0)" onClick={this.newsDetail.bind(this,row)}>{key}</a>;
      }
    },{
      title:'日期',
      dataIndex:'createTime',
      key:'createTime',
      width:180,
      render:(key)=>{
        return <div>{moment(key).format('YYYY-MM-DD HH:mm:ss')||'--'}</div>;
      }
    },{
      title:'新闻类型',
      dataIndex:'newsType',
      key:'newsType',
      width:180,
      render:(key)=>{
        return <div>{this.getNewsType(key)||'--'}</div>;
      }
    },{
      title:'举报类型',
      dataIndex:'type',
      key:'errorType',
      width:150,
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'留言',
      dataIndex:'description',
      key:'description',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'操作',
      key:'todo',
      width:80,
      render:(row)=>{
        return <a href="javascript:void(0)" onClick={this.deleteError.bind(this,row)}>删除</a>;
      }
    }];

    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.errorBack}>
            <div className={styles.tableListForm}>
              {this.searchDom()}
            </div>
            <div className={styles.table}>
              <Table 
                columns={columns}
                dataSource={errorData.list}
                rowKey="id"
                loading={loading}
                onChange={this.handleTableChange}
                pagination={errorData.pagination}
              />
            </div>
            <AlertTips 
              alertTips={alertTips}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
