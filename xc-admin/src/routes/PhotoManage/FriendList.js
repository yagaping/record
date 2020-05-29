import React, { PureComponent,createClass} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Table, DatePicker,Card, Form, Select, Input } from 'antd';
import moment from 'moment';
import styles from './PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select; 
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const _TYPE = [
  {
    type:-1,
    name:'所有',
  },
  {
    type:0,
    name:'全部',
  },
  {
    type:1,
    name:'特定照片',
  },
  {
    type:2,
    name:'人像',
  },
  {
    type:3,
    name:'影集',
  }
]
@Form.create()
@connect(state => ({
  friendList: state.friendList,
}))
export default class FriendList extends PureComponent{

  state = {
    type:-1,
    index:0,
    size:20,
    userId:-1,
    shareType:-1,
    relativeAccount:'',
    time:[null,null],
  };
  componentDidMount(){
    this.handleSubmit();
  }
  searchForm = () => {
    const { form } = this.props;
      const { shareType,relativeAccount,time } = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="来源"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('shareType', { initialValue: shareType })(
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
                <dd style={{width:'360px'}}>
                  <FormItem 
                  label="亲友账号"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('relativeAccount', { initialValue:relativeAccount })(
                      <Input placeholder="请输入亲友账号" />
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
        const { shareType,relativeAccount, time } = values;
        const beginDay = time[0]?moment(time[0]).format('YYYY-MM-DD'):null;
        const endDay = time[1]?moment(time[1]).format('YYYY-MM-DD'):null
        const { index, size, userId } = this.state;
        const params = {
          shareType,
          relativeAccount,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'friendList/queryFriendList',
          payload:{
            index,
            size,
            shareType,
            relativeAccount,
            userId,
            beginDay,
            endDay,
          },
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
      shareType:-1,
      relativeAccount:'',
      userId:-1,
      time:[null,null]
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
  render(){
    const { list, pagination, loading } = this.props.friendList;
    const columns = [
      {
        title:'用户ID',
        key:'userId',
        dataIndex:'userId'
      },
      {
        title:'被共享人ID',
        key:'shareUserId',
        dataIndex:'shareUserId',
        render:(key)=>{
          return <span>{key||'--'}</span>
        }
      },
      {
        title:'共享类型',
        key:'shareType',
        dataIndex:'shareType',
        render:(key)=>{
          let text;
          for(let k in _TYPE){
            if(_TYPE[k].type == key){
              text = _TYPE[k].name;
              break;
            }
          }
          return <div>{text}</div>
        }
      },
      {
        title:'亲友账号',
        key:'relativeAccount',
        dataIndex:'relativeAccount',
      },
      {
        title:'亲友姓名',
        key:'relativeName',
        dataIndex:'relativeName',
      },{
        title:'创建时间',
        key:'createdAt',
        dataIndex:'createdAt',
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'更新时间',
        key:'updatedAt',
        dataIndex:'updatedAt',
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
    ];
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
              /> 
            </div> 
        </Card>
			</PageHeaderLayout>
    )
  }
}
