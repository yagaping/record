import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Select, DatePicker,Button, 
  Table, message, Modal, Tooltip } from 'antd';
import styles from './SpecialDetail.less';
import { Link } from 'dva/router';
import moment from 'moment';
import { getTypeName } from '../../components/newsTypeName.js';
const { Option } = Select;
const FormItem = Form.Item;
const confirm = Modal.confirm;
message.config({
  duration: 1,
  maxCount: 1,
});
@Form.create()
@connect(state => ({
  specialNews: state.specialNews,
}))
export default class SpecialDetail extends PureComponent{
  
  state = {
    title:'',
    startTime:null,
    endTime:null,
    order:1,
    index:1,
    size:10,
    tabId:'1',
  }
  componentWillMount(){
    const { match:{params} } = this.props;
    const { id } = params;
    this.setState({
      topicid:id,
    });
  }
  componentDidMount(){
    this.queryDetail();
  }

  // 查询子专题新闻
  queryDetail = () => {
    const { dispatch } = this.props;
    const { title, startTime, endTime, order, index, size, topicid } = this.state;
    dispatch({
      type:'specialNews/queryDetail',
      payload:{
        title,
        startTime,
        endTime,
        order,
        index,
        size,
        topicid,
      },
    });
  }
  // 搜索Dom结构
  searchData = () => {
    const { form } = this.props;
    const { title, order, startTime, endTime } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
            <dl className={styles.searchLayout}>
              <dd style={{width:'300px'}}>
                <FormItem 
                label="标题"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('title', { initialValue: title })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'160px'}}>
                <FormItem 
                label="排序"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator('order', { initialValue:order })(
                    <Select>
                      <Option value={0}>浏览</Option>
                      <Option value={1}>时间</Option>
                      <Option value={2}>评论</Option>
                      <Option value={3}>转发</Option>
                    </Select>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem 
                label="开始日期"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator('startTime', { initialValue:startTime })(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem 
                label="结束日期"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator('endTime', { initialValue:endTime})(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'160px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </dd>
              <dd style={{float:'right',textAlign:'right'}}>
                <Button type="primary" onClick={this.handleReturn}>
                  <Link to={{ pathname: `/news/special-news` }}>
                      返回
                  </Link>
                </Button>
              </dd>
          </dl>
        </Form>
    );
  }
    // 按条件查询
    handleSubmit = (e) => {
      if (e) e.preventDefault();
      const { form, dispatch } = this.props;
      form.validateFields((err, values) => {
        const formatTime = 'YYYY-MM-DD';
        const { size, index, topicid } = this.state;
        const { title, order } = values;
        const startTime =values.startTime ? moment(values.startTime).format(formatTime) : null;
        const endTime = values.endTime ? moment(values.endTime).format(formatTime) : null;
        const params = {
          title,
          order,
          startTime,
          endTime,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'specialNews/queryDetail',
          payload:{
            ...params,
            topicid,
            size,
            index,
          },
        });
      })
    }
    // 重置查询
    handleFormReset = () => {
      const { form, dispatch } = this.props;
      form.resetFields();
      const { size, topicid } = this.state;
      const params = {
        title:'',
        order:1,
        startTime:null,
        endTime:null,
        size,
        index:1,
      };
      this.setState({...params});
      dispatch({
        type:'specialNews/queryDetail',
        payload:{
          ...params,
          topicid,
        },
      });
    }
    // 表格分页
    handleTable = (pagination) => {
      const { dispatch } = this.props;
      const { title, startTime, endTime, order, topicid } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
        size:pageSize,
        index:current,
      });
      dispatch({
        type:'specialNews/queryDetail',
        payload:{
          size:pageSize,
          index:current,
          title,
          startTime,
          endTime,
          order,
          topicid,
        },
      });
    }
    // 删除数据
    handleDelete = (row) => {
      const { dispatch } = this.props;
      const _this = this;
      confirm({
        title: '确定删除子专题新闻?',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          dispatch({
            type:'specialNews/deleteDetail',
            payload:{
              id:row.id,
            },
            callback:(res)=>{
              if(res.code == 0){
                message.success('删除成功');
                _this.queryDetail();
              }else{
                message.error(res.message);
              }
            }
          });
        }
      });
    }
  render(){
    const { detailData, pagination, loading } = this.props.specialNews;
    const { tabId } = this.state;
    const columns=[
      {
        title:'标题',
        key:'title',
        dataIndex:'title',
        render:(key,row)=>{
          return (
            <div className={styles.newsTitle}>
              <span>
                <Tooltip placement="top" title={row.title}>{row.title}</Tooltip>
              </span>
              <span style={{marginLeft:8,color:'orange'}}>[{`浏览数：${row.accessCount}`}]</span>
              <span style={{marginLeft:8,color:'orange'}}>[{`评论数${row.commentCount}`}]</span>
              <span style={{marginLeft:8,color:'orange'}}>[{`转发数：${row.shareCount}`}]</span>
            </div>
          );
        }
      },
      {
        title:'新闻日期',
        key:'createTime',
        dataIndex:'createTime',
        render:(key)=>{
          let text = key ? moment(key).format('YYYY-MM-DD') : '--';
          return <div>{text}</div>;
        }
      },
      {
        title:'类型',
        key:'newsType',
        dataIndex:'newsType',
        render:(key) =>{
          return <div>{getTypeName(key)}</div>;
        }
      },
      {
        title:'操作',
        key:'todo',
        width:100,
        render:(row) => {
          return <a href="javascript:void(0)" onClick={this.handleDelete.bind(this,row)}>删除</a>;
        }
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.detail}>
              {this.searchData()}
              <div className={styles.table}>
                <Table
                columns={columns}
                dataSource={detailData}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={this.handleTable}
                />
              </div>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
