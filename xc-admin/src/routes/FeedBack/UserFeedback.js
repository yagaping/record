import React, { PureComponent,createClass} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Popconfirm, Divider, Table, DatePicker,Card, Form, Select, Input, message } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select; 
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const _TYPE = [{
  type:-1,
  name:'全部'
},{
  type:1,
  name:'Android'
},{
  type:2,
  name:'Ios',
}];
@Form.create()
@connect(state => ({
  userFeedback: state.userFeedback,
}))
export default class UserFeedback extends PureComponent{

  state = {
    index:0,
    size:20,
    content:'',
    phonePlatform:-1,
    time:[null,null],
    ids:[],
    btnVisible:true,
  };
  componentDidMount(){
    this.handleSubmit();
  }
  searchForm = () => {
    const { form } = this.props;
      const { content, phonePlatform, time } = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
              <dd style={{width:'280px'}}>
                  <FormItem 
                  label="内容"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('content', { initialValue: content })(
                      <Input placeholder="请输入内容" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="平台"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('phonePlatform', { initialValue: phonePlatform })(
                      <Select>
                        {
                          _TYPE.map(item=>{
                            return <Option value={item.type} key={item.type}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
             
                <dd style={{width:'360px'}}>
                  <FormItem 
                  label="创建日期"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('time', { initialValue:time })(
                      <RangePicker
                        format={dateFormat}
                      />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'160px'}}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </dd>
            </dl>
          </Form>
      );
  }
  // 查询
  handleSubmit = (e) =>{
    if (e) e.preventDefault();
      const { form, dispatch } = this.props;
      form.validateFields((err, values) => {
        const { content, phonePlatform, time } = values;
        const beginDay = time[0] ? moment(time[0]).format(dateFormat) : null;
        const endDay = time[1] ? moment(time[1]).format(dateFormat) : null
        const { index, size } = this.state;
        const params = {
          content,
          phonePlatform,
          time,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'userFeedback/queryUserFeedbackList',
          payload:{
            index,
            size,
            content,
            phonePlatform,
            beginDay,
            endDay,
          },
          callback:(res)=>{
            if(res.code != 0 || !res.result.data.length){
              this.setState({
                btnVisible:false,
              })
            }
          }
        });
      })
  }
  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
        index:0,
        size:20,
        content:'',
        phonePlatform:-1,
        time:[null,null],
    }
    this.setState({
      ...params
    },()=>{  this.handleSubmit(); })
  }
  // 表格分页
  handleTable = ( pagination ) =>{
      const { current, pageSize } = pagination;
      this.setState({
        index:current-1,
        size:pageSize,
      },()=>{ this.handleSubmit() });

  }
  // 删除
  delete = (key) => {
    const { dispatch } = this.props;
    const { id } = key;
    const _this = this;
    dispatch({
      type:'userFeedback/delete',
      payload:{
        ids:id,
      },
      callback:(res)=>{
        if(res.code == 0){
          message.success('删除成功')
          _this.handleSubmit();
        }else{
          message.error(res.message)
        }
      }
    })
  }
  // 表格选择
  onSelectChange = (e) => {
    this.setState({
      ids:e
    })
  }
  // 确定删除选中
  deleteSelect = () => {
    const { dispatch } = this.props;
    const { ids } = this.state;
    const _this = this;
    let id = ids.join(',');
    dispatch({
      type:'userFeedback/delete',
      payload:{
        ids:id,
      },
      callback:(res)=>{
        if(res.code == 0){
          message.success('删除成功')
          _this.handleSubmit();
        }else{
          message.error(res.message)
        }
      }
    })
  }
  render(){
    const { list, pagination, loading } = this.props.userFeedback;
    const { ids, btnVisible } = this.state;
    let deletDom = ids.length ? (
    <Popconfirm title="确定删除选中记录?" onConfirm={this.deleteSelect} okText="确定" cancelText="取消"> 
      <Button type="primary">删除</Button>
    </Popconfirm>
    ):(
      <Button type="primary" disabled={true}>删除</Button>
    )

    const columns = [
      {
        title:'用户ID',
        key:'userId',
        dataIndex:'userId',
        width:80,
      },
      {
        title:'联系方式',
        key:'contactMethod',
        dataIndex:'contactMethod',
        width:120,
        render:(key)=>{
          let text;
          switch( parseInt(key) ){
              case 1:
                text = '微信';
                break;
              case 2:
                text = '手机';
                break;
              case 3:
                text = '邮箱';
                break;
          }
          return <span>{ text || '--' }</span>
        }
      },
      {
        title:'联系账号',
        key:'contactAccount',
        dataIndex:'contactAccount',
        width:160,
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'内容',
        key:'content',
        dataIndex:'content',
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'平台',
        key:'phonePlatform',
        dataIndex:'phonePlatform',
        width:120,
        render:(key)=>{
          let text
          for(let k in _TYPE){
            if(_TYPE[k].type == key){
              text = _TYPE[k].name;
              break;
            }
          }
          return <div>{text||'--'}</div>
        }
      },
      {
        title:'创建时间',
        key:'createAt',
        dataIndex:'createAt',
        width:180,
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'更新时间',
        key:'updateAt',
        dataIndex:'updateAt',
        width:180,
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'操作',
        key:'todo',
        width:120,
        render:(key)=>{
          return (
            <div>
               <Popconfirm title="确定删除此条记录?" onConfirm={this.delete.bind(this,key)} okText="确定" cancelText="取消"> 
                <a href="javascript:void(0)">删除</a>
                </Popconfirm>
              <Divider type="vertical" />
              <Link to={`/feedBack/feedback-details/${key.id}`}>详情</Link>
            </div>
        )
        }
      },
    ];
    const rowSelection = {
      onChange:this.onSelectChange,
    }
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            {this.searchForm()}
            <div className={styles.table}>
              <Table 
                columns={columns}
                dataSource={list}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={this.handleTable}
                rowSelection={rowSelection}
              /> 
              <div className={styles.deleteSelect} style={{display:btnVisible ? 'display' : 'none'}}>
                {deletDom}
              </div>
            </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
