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
const _TYPE = [{
  type:-1,
  name:'全部'
},{
  type:1,
  name:'支付宝'
},{
  type:2,
  name:'微信',
},{
  type:3,
  name:'苹果支付',
},{
  type:4,
  name:'支付宝h5支付',
},{
  type:5,
  name:'微信h5支付',
}];
@Form.create()
@connect(state => ({
  payList: state.payList,
}))
export default class PayList extends PureComponent{

  state = {
    type:-1,
    index:0,
    size:20,
    userId:'',
    orderTradeNo:'',
    phone:'',
    orderStatus:-1,
    time:[null,null],
  };
  componentDidMount(){
    this.handleSubmit();
  }
  searchForm = () => {
    const { form } = this.props;
      const { type, time, userId, orderTradeNo, phone, orderStatus } = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
              <dd style={{width:'260px'}}>
                  <FormItem 
                  label="用户ID"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('userId', { initialValue: userId })(
                      <Input placeholder="请输入用户ID" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'250px'}}>
                  <FormItem 
                  label="手机"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  >
                    {getFieldDecorator('phone', { initialValue: phone })(
                      <Input placeholder="请输入手机号" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'280px'}}>
                  <FormItem 
                  label="订单编号"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  >
                    {getFieldDecorator('orderTradeNo', { initialValue: orderTradeNo })(
                      <Input placeholder="请输入订单编号" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="订单状态"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  >
                    {getFieldDecorator('orderStatus', { initialValue: orderStatus })(
                      <Select>
                        <Option value={-1}>全部</Option>
                        <Option value={0}>未支付</Option>
                        <Option value={1}>支付成功</Option>
                        <Option value={3}>支付失败</Option>
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="支付方式"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  >
                    {getFieldDecorator('type', { initialValue: type })(
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
                <dd style={{width:'320px'}}>
                  <FormItem 
                  label="支付日期"
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
        const { type, time, userId, orderTradeNo, phone, orderStatus } = values;
        const beginDay = time[0] ? moment(time[0]).format(dateFormat) : null;
        const endDay = time[1] ? moment(time[1]).format(dateFormat) : null
        const { index, size } = this.state;
        const params = {
          userId,
          orderTradeNo,
          time,
          phone,
          type,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'payList/queryPayList',
          payload:{
            index,
            size,
            userId:userId||-1,
            orderStatus,
            phone,
            beginDay,
            endDay,
            payType:type,
            orderTradeNo,
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
        userId:'',
        orderTradeNo:'',
        phone:'',
        orderStatus:-1,
        time:[null,null],
        type:-1,
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
    const { list, pagination, loading } = this.props.payList;
    const columns = [
      {
        title:'用户ID',
        key:'userId',
        dataIndex:'userId'
      },
      {
        title:'手机号',
        key:'phone',
        dataIndex:'phone'
      },
      {
        title:'订单编号',
        key:'orderTradeNo',
        dataIndex:'orderTradeNo'
      },
      {
        title:'订单金额',
        key:'orderAmount',
        dataIndex:'orderAmount'
      },
      {
        title:'支付金额',
        key:'payAmount',
        dataIndex:'payAmount'
      },
      {
        title:'支付方式',
        key:'payType',
        dataIndex:'payType',
        render:(key)=>{
          let name = _TYPE.filter(item=>{
            return item.type == key;
          })
          return <div>{name.length?name[0].name:'未知'}</div>
        }
      },
      {
        title:'订单状态',
        key:'orderStatus',
        dataIndex:'orderStatus',
        render:(key)=>{
          let val
          if(key == 0){
            val = '未支付'
          }else if(key == 1 || key == 2){
            val = '已支付'
          }else if(key == 3){
            val = '支付失败'
          }
          return <div>{val}</div>
        }
      },
      {
        title:'支付时间',
        key:'payTime',
        dataIndex:'payTime',
        render:(key)=>{
          let val = key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : '--'
          return <span>{val}</span>
        }
      },
      {
        title:'创建时间',
        key:'createdAt',
        dataIndex:'createdAt',
        render:(key)=>{
          let val = key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : '--'
          return <span>{val}</span>
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
