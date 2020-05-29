import React, { PureComponent,createClass} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Badge, Table, DatePicker,Card, Form, Select } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select; 
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const _PHONE = [
  {
    type:-1,
    name:'所有'
  },{
    type:0,
    name:'全部'
  },{
    type:1,
    name:'特定照片'
  },{
    type:2,
    name:'人像'
  },{
    type:3,
    name:'影集'
  },
];
const _TYPE = [
  {
    type:-1,
    name:'全部'
  },{
    type:0,
    name:'免费赠送'
  },{
    type:1,
    name:'1TB:160RMB/年'
  },{
    type:2,
    name:'2TB:320RMB/年'
  },{
    type:4,
    name:'4TB:640RMB/年'
  },
];
const _STATUS = [
  {
    type:-1,
    name:'全部'
  },{
    type:0,
    name:'使用中'
  },{
    type:1,
    name:'暂停'
  }
];
const _PAYMETHOD = [
  {
    type:-1,
    name:'全部'
  },{
    type:1,
    name:'Android'
  },{
    type:2,
    name:'IOS'
  }
];
const _MOBILEPLATFORM = [
  {
    type:-1,
    name:'全部'
  },{
    type:1,
    name:'Android'
  },{
    type:2,
    name:'IOS'
  }
];
@Form.create()
@connect(state => ({
  memorySpace: state.memorySpace,
}))
export default class MemorySpace extends PureComponent{

  state = {
    index:0,
    size:20,
    userId:-1,
    phone:-1,
    type:-1,
    status:-1,
    payMethod:-1,
    mobilePlatform:-1,
    time:[null,null],
  };
  componentDidMount(){
    this.handleSubmit();
  }
  searchForm = () => {
    const { form } = this.props;
      const { phone, type, status, payMethod, mobilePlatform, time } = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
              <dd style={{width:'180px'}}>
                  <FormItem 
                  label="手机"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('phone', { initialValue: phone })(
                      <Select>
                      {
                        _PHONE.map(item=>{
                          return <Option value={item.type} key={item.type}>{item.name}</Option>
                        })
                      }
                    </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="套餐类型"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
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
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="状态"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('status', { initialValue: status })(
                      <Select>
                        {
                          _STATUS.map(item=>{
                            return <Option value={item.type} key={item.type}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="付款方式"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  >
                    {getFieldDecorator('payMethod', { initialValue: payMethod })(
                      <Select>
                        {
                          _PAYMETHOD.map(item=>{
                            return <Option value={item.type} key={item.type}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="手机平台"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  >
                    {getFieldDecorator('mobilePlatform', { initialValue: mobilePlatform })(
                      <Select>
                        {
                          _MOBILEPLATFORM.map(item=>{
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
        const { phone, type, status, payMethod, mobilePlatform, time } = values;
        const beginDay = time[0] ? moment(time[0]).format(dateFormat) : null;
        const endDay = time[1] ? moment(time[1]).format(dateFormat) : null
        const { index, size, userId } = this.state;
        const params = {
          phone,
          status,
          payMethod,
          mobilePlatform,
          time,
          type,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'memorySpace/queryMemorySpaceList',
          payload:{
            index,
            size,
            userId, 
            phone,
            status,
            payMethod,
            mobilePlatform,
            type,
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
      userId:-1,
      phone:-1,
      type:-1,
      status:-1,
      payMethod:-1,
      mobilePlatform:-1,
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
  render(){
    const { list, pagination, loading } = this.props.memorySpace;
    const columns = [
      {
        title:'用户ID',
        key:'userId',
        dataIndex:'userId'
      },
      {
        title:'手机',
        key:'phone',
        dataIndex:'phone',
        render:(key)=>{
          return <span>{key||'--'}</span>
        }
      },
      {
        title:'套餐开始时间',
        key:'startTime',
        dataIndex:'startTime'
      },
      {
        title:'套餐结束时间',
        key:'endTime',
        dataIndex:'endTime'
      },
      {
        title:'套餐类型',
        key:'type',
        dataIndex:'type',
        render:(key)=>{
          let text;
          for(let k in _TYPE){
            if(_TYPE[k].type == key){
              text = _TYPE[k].name;
              break;
            }
          }
          return <span>{text||'--'}</span>
        }
      },
      {
        title:'状态',
        key:'status',
        dataIndex:'status',
        render:(key)=>{
          let text;
          for(let k in _STATUS){
            if(_STATUS[k].type == key){
              if(key == 0){
                text =  <Badge status="success" text={ _STATUS[k].name}/>;
              }else if(key == 1){
                text =  <Badge status="default" text={ _STATUS[k].name}/>;
              }
              break;
            }
          }
          return <span>{text||'--'}</span>
        }
      },{
        title:'付款方式',
        key:'payMethod',
        dataIndex:'payMethod',
        render:(key)=>{
          let text;
          for(let k in _PAYMETHOD){
            if(_PAYMETHOD[k].type == key){
              text = _PAYMETHOD[k].name;
              break;
            }
          }
          return <span>{text||'其他'}</span>
        }
      },{
        title:'手机平台',
        key:'mobilePlatform',
        dataIndex:'mobilePlatform',
        render:(key)=>{
          let text;
          for(let k in _MOBILEPLATFORM){
            if(_MOBILEPLATFORM[k].type == key){
              text = _MOBILEPLATFORM[k].name;
              break;
            }
          }
          return <span>{text||'其他'}</span>
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
