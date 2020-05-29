import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker, Table, Badge, message } from 'antd';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './NewsSend.less';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const PLATFORM = {
  '1':'Android',
  '2':'IOS',
};
const NETWORK = {
  '1':'2G',
  '2':'3G',
  '3':'4G',
  '4':'WIFI',
};

@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
}))
export default class NewsSend extends PureComponent{

  state = {
    nowPage:0,
    pageSize:20,
    title:'',
    text:'',
    platForm:'-1',
    messageType:'-1',
  }
  componentDidMount(){
    this.newsSendList();
  }
  // 内容列表
  newsSendList = () =>{
    const { dispatch } = this.props;
    const {nowPage, pageSize, title, text, platForm, messageType} = this.state;
    const params = {
      nowPage,
      title,
      text,
      messageType:null,
    };
    if(platForm == '-1'){
      params.platForm = '1,2';
    }
    // 读缓存每页条数
    params.pageSize = sizeType(pageSize,this.props);
    dispatch({
      type:'platformManage/newsSendList',
      payload:{...params},
    });
  }

 // 提交表单=>筛选
 handleSearch = (e) => {
  if (e) {
    e.preventDefault();
  }
  const { dispatch, form } = this.props;
  const { nowPage, pageSize } = this.state;
  form.validateFields((err, fieldsValue) => {
    if (err) return;
    let platForm = fieldsValue.platForm;
    let messageType = fieldsValue.messageType;
    if(platForm == '-1'){
      platForm = '1,2';
    }
    if(messageType == '-1'){
      messageType = null;
    }
    const params = {
      nowPage,
      pageSize,
      title:fieldsValue.title,
      text:fieldsValue.text,
      platForm,
      messageType,
    };
    this.setState(params);
    dispatch({
      type:'platformManage/newsSendList',
      payload:{...params},
    });
  })
}
  
  // 表单Dom
  formDom = () => {
    const { getFieldDecorator } = this.props.form;
    const { title, text } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    let platForm = this.state.platForm;
    let messageType = this.state.messageType;
    if(platForm.split(',').length = 2){
      platForm = '-1';
    }
    if(messageType){
      if(messageType.split(',').length = 2){
        messageType = '-1';
      }
    }else{
      messageType = '-1';
    }
    
    return (
      <Form onSubmit={this.handleSearch}>
      <dl className={styles.search}>
        <dd style={{width:300}}>
          <FormItem
            label="标题"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            >
            {getFieldDecorator('title', {initialValue:title,})(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
        </dd>
        <dd style={{width:300}}>
          <FormItem
            label="内容"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            >
            {getFieldDecorator('text', {initialValue:text,})(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
            label="类型"
            {...formItemLayout}
            >
            {getFieldDecorator('messageType', {initialValue:messageType,})(
              <Select >
                <Option value="-1">全部</Option>
                <Option value="2">内站</Option>
                <Option value="1">外站</Option>
              </Select>
            )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
              label="平台"
              {...formItemLayout}
              >
              {getFieldDecorator('platForm', {initialValue:platForm,})(
                <Select >
                  <Option value="-1">全部</Option>
                  <Option value="1">Android</Option>
                  <Option value="2">IOS</Option>
                </Select>
              )}
          </FormItem>
        </dd>
        
        <dd style={{width:300,marginBottom:30}}>
            <Button type="primary" htmlType='submit'>查询</Button>
            <Button onClick={this.reset.bind(this)}>重置</Button>
            <Button type="primary" onClick={this.AddItem}>添加</Button>
        </dd>
      </dl>
  </Form>
    );
  }
   // 重置
   reset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
      nowPage:0,
      pageSize:20,
      title:'',
      text:'',
      platForm:'1,2',
      messageType:null,
    };
    dispatch({
      type:'platformManage/newsSendList',
      payload:{...params},
    });
    this.setState(params);
  }
  // 添加
  AddItem = () => {
    this.props.history.push({
      pathname: '/platformManage/add-news/0',
    });
  }
  // 转换数据显示
  changeText = (type,str) => {
    const arr = str.replace(/,|，/g,'-').split('-').sort();
    let obj = {};
    if(type == 'platform'){
      obj = {...PLATFORM };
    }else if(type == 'network'){
      obj = { ...NETWORK };
    }
    const text = arr.map(function(index){
      return obj[index];
    })
    return text.join('，');
  }
  // 分页
  handlePage = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { title, text  } = this.state;
    let platForm = this.state.platForm;
    let messageType = this.state.messageType;
    sizeChange(pageSize, this.props);
    if(platForm == '-1'){
      platForm = '1,2';
    }
    if(messageType == '-1'){
      messageType = null;
    }
    const params = {
      title,
      text,
      platForm,
      messageType,
    };
    dispatch({
      type:'platformManage/newsSendList',
      payload:{
        ...params,
        nowPage:current-1,
        pageSize:pageSize,
      },
    })
  }
 
  // 使定时器推送新闻失效
  handleDefault = (row) => {
    const { dispatch } = this.props;
    const { pushId } = row;
    dispatch({
      type:'platformManage/defaultPush',
      payload:{
        pushId,
      },
      callback:(res)=>{
        if(res.code == 0){
          message.success('操作成功！');
          this.newsSendList();
        }else{
          message.error(res.message);
        }
      }
    })
  }

  render(){
    const { newsData, loading, pagination } = this.props.platformManage;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns=[
      {
        key:'title',
        title:'标题',
        dataIndex:'title',
      },{
        key:'content',
        title:'内容',
        render:(key,row)=>{
          const text = row.text || '--';
          return <div>{text}</div>
        },
      },{
        key:'pushTime',
        title:'推送时间',
        dataIndex:'pushTime',
        width:150,
        render:(key)=>{
          let text;
          if(key){
            text = moment(key).format('YYYY-MM-DD HH:mm');
          }else{
            text = '实时推送';
          }
          return <div>{text}</div>
        },
      }, {
        key:'status',
        title:'状态',
        dataIndex:'status',
        width:100,
        render:(key)=>{
          let text;
          if(key == 0){
            text = <Badge status="success" text="已推送" />;
          }else if(key == 1){
            text = <Badge status="processing" text="待推送" />;
          }else if(key == 2){
            text = <Badge status="default" text="已失效" />;
          }
          return <div>{text}</div>
        },
      },{
        key:'platform',
        title:'平台',
        width:130,
        render:(key,row)=>{
          return <div>{this.changeText('platform',row.platForm)}</div>
        },
      },{
        key:'network',
        title:'网路',
        width:160,
        render:(key,row)=>{
          return <div>{this.changeText('network',row.netWork)}</div>
        },
      },{
        key:'type',
        title:'类型',
        width:100,
        render:(key,row)=>{
          let text = '';
          if(row.messageType == 0 || !row.messageType ){
            text = '系统消息';
          }else if(row.messageType == 1){
            text = '新闻消息';
          }else if(row.messageType == 2){
            text = '站外消息';
          }else{
            text = '未知类型';
          }
          return <div>{text}</div>
        },
      },{
        key:'todo',
        title:'操作',
        width:120,
        render:(key,row)=>{
          let text;
          if(key.status == 1){
            text = <Button onClick={this.handleDefault.bind(this,row)} type='primary'>使失效</Button>;
          }else{
            text = '--';
          }
          return <div>{text}</div>
        },
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.formDom}>
            {this.formDom()}
          </div>
          <div className={styles.table}>
            <Table 
              dataSource={newsData}
              rowKey="pushId"
              columns={columns}
              loading={loading}
              scroll={{x:1300}}
              pagination={paginationProps}
              onChange={this.handlePage}
            />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
