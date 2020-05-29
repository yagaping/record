import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Input, Select, Button, Table, DatePicker, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ConcernDetailList.less';
import { sizeType, sizeChange } from '../../components/SizeSave';
import AlertTips from '../../components/AlertTips';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  concernList: state.concernList,
}))
@Form.create()
export default class ConcernDetailList extends Component {
  state = {
    title:'',
    id:'',
    eventTime:null,
    createTime:null,
    index:1,
    size:10,
    alertTips:{
      title:'删除关注',
      visible:false,
      html:'',
    },
  };
  componentWillMount(){
    const { match } = this.props;
    const { params:{ id } } = match;
    const searchData = JSON.parse(localStorage.getItem('searchData'));
    const mark = localStorage.getItem('mark');
    this.setState({
      id,
    });
    if(searchData && mark){
      this.setState({
        ...searchData
      });
      localStorage.removeItem('mark');
      localStorage.removeItem('searchData');
    }
  }
  componentDidMount() {
    localStorage.setItem('newsUrl',this.props.match.url);
    this.queryConcernDetail();
  }

  // 查询关注数据列表
  queryConcernDetail = () =>{
    const { dispatch, match} = this.props;
    const { title, eventTime, createTime, index, size, id } = this.state;
    dispatch({
      type:'concernList/queryConcernDetail',
      payload:{
        id,
        title,
        eventTime,
        createTime,
        index,
        size,
      },
    });
  }
  // 搜索Dom结构
  searchData = () => {
    const { form } = this.props;
    const { title, eventTime, createTime } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
            <dl className={styles.searchLayout}>
              <dd style={{width:'300px'}}>
                <FormItem 
                label="标题"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('title', { initialValue: title })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem label="新闻日期">
                  {getFieldDecorator('eventTime', { initialValue:eventTime })(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem label="创建日期">
                  {getFieldDecorator('createTime', { initialValue:createTime})(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'150px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </dd>
              <dd style={{float:'right',textAlign:'right'}}>
                <Button type="primary" onClick={this.handleReturn}>
                  <Link to={{ pathname: `/news/concern-list` }}>
                      返回
                  </Link>
                </Button>
              </dd>
          </dl>
        </Form>
    );
  }

  // 查询列表
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { index, size, id } = this.state; 
    form.validateFields((err, values) => {
        if (err) {
          return ;
        } 
        const { title, eventTime, createTime } = values;
        const params = {
          title,
          eventTime:eventTime?moment(eventTime).format('YYYY-MM-DD'):null,
          createTime:createTime?moment(createTime).format('YYYY-MM-DD'):null,
        };
        this.setState({
          ...params,
        });
        dispatch({
          type:'concernList/queryConcernDetail',
          payload:{
            ...params,
            id,
            index,
            size,
          },
        });
      })
  }

  // 重置查询
  handleFormReset = () => {

    const { size, id } = this.state;
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
      title:'',
      eventTime:null,
      createTime:null,
      index:1,
    };
    this.setState({
      ...params,
    });
    dispatch({
      type:'concernList/queryConcernDetail',
      payload:{
        ...params,
        id,
        size,
      },
    });
  }
  // 表格分页
  changePage = (page)=>{
    const { dispatch, match } = this.props;
    const { title, eventTime, createTime, id } = this.state;
    const { current, pageSize, total } = page;
    this.setState({
      index:current,
      size:pageSize
    });
    dispatch({
      type:'concernList/queryConcernDetail',
      payload:{
        id,
        title,
        eventTime,
        createTime,
        index:current,
        size:pageSize,
      },
    });
  }

  // 点击删除按钮
  onDelete = (row) => {
    this.setState({
      alertTips:{
        title:'删除关注',
        visible:true,
        html:`确定删除 [${row.title}] 栏目?`,
        attentionId:row.id,
      },
    });
  }

  // 确认删除
  handleDelete = () => {
    const{ dispatch } = this.props;
    const { alertTips:{attentionId}} = this.state;
    dispatch({
      type:'concernList/delete',
      payload:{
        attentionId,
      },
      callback:(res)=>{
        if(res.code == 0){
          this.queryConcernDetail();
          this.cancelDelete();
        }else{
          message.error(res.message);
        }
      }
    });
  }
  // 取消删除
  cancelDelete = () => {
    const { alertTips } = this.state;
    this.setState({
      alertTips:{
        ...alertTips,
        visible:false,
      }
    });
  }

  // 进入新闻详情
  newsDetail = (row) =>{
    const path = `/news/news-content-edit/${row.newsId}`;
    localStorage.setItem('searchData',JSON.stringify(this.state));
    this.props.history.push(path);
  }

  // 推送消息
  handleSendNews = (row) => {
    const { newsId, newsType, contentType, title, newsAbstract } = row;
    const attention = 1;
    this.props.history.push({pathname:'/platformManage/Add-news/'+newsId,state:{newsId, newsType, contentType, title, newsAbstract, attention}});
  }
  render() {
    const { concernDetailList, pagination, loading } = this.props.concernList;
    const { alertTips } = this.state;
    const columns = [{
      title:'标题',
      key:'title',
      dataIndex:'title',
      render:(key,row)=>{
        return (
        <div>
          <a href='javascript:void(0)' onClick={this.newsDetail.bind(this,row)}>{key}</a>
          <span style={{marginLeft:8,color:'orange'}}>[{`浏览数：${row.accessCount}`}]</span>
        </div>
        )
      }
    },{
      title:'新闻日期',
      key:'eventTime',
      dataIndex:'eventTime',
      render:(key)=>{
        return <div>{key?moment(key).format('YYYY-MM-DD'):'--'}</div>;
      }
    },{
      title:'创建日期',
      key:'createTime',
      dataIndex:'createTime',
      render:(key)=>{
        return <div>{key?moment(key).format('YYYY-MM-DD'):'--'}</div>;
      }
    },{
      title:'关注人数',
      key:'count',
      dataIndex:'count',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'操作',
      key:'todo',
      render:(row)=>{
        return  (
          <div>
            <a href='javascript:void(0)' onClick={this.onDelete.bind(this,row)}>删除</a>
            <a style={{marginLeft:10}} href='javascript:void(0)' onClick={this.handleSendNews.bind(this,row)}>推送</a>
          </div>
          );
      }
    }];
    return (  
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.concern}>
            <div className={styles.tableListForm}>
              {this.searchData()}
            </div>
            <Table 
              columns={columns}
              dataSource={concernDetailList}
              pagination={pagination}
              onChange={this.changePage}
              loading={loading}
              rowKey='id'
            />
            <AlertTips 
              alertTips={alertTips}
              onOk={this.handleDelete}
              onCancel={this.cancelDelete}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
