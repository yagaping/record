import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Badge, DatePicker,Card, Form, Select, Input, Table } from 'antd';
import moment from 'moment';
import NoticeModal from '../../components/NoticeModal';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { RangePicker  } = DatePicker;
const { Option } = Select;
@Form.create()
@connect(state => ({
  notice: state.notice,
}))
export default class Notice extends PureComponent{
  state = {
    dateRange:null,
    timeArr:[null,null],
    index:0,
    size:20,
    status:'',
    visibleModal:false,
    titleModal:'',
    params:{
      id:null,
      title:'',
      content:'',
      btnName:'',
      btnUrl:'',
      style:'',
      system:0,
      userStatus:'',
      time:[null,null],
      status:1,
      version:'',
      versionList:[],
    }
  }
componentDidMount(){
  this.handleSubmit();
  this.queryAppVersion();
}

// 查询应用版本
queryAppVersion = () => {
  const { dispatch } = this.props;
  dispatch({
    type:'notice/queryAppVersion',
    payload:{}
  })
}

// 查询
 handleSubmit = (e) =>{
  if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    const { index, size } = this.state;
    form.validateFields((err, values) => {
      const { timeArr, status } = values;
      let start = timeArr[0] ? timeArr[0].format('YYYY-MM-DD HH:mm:ss') : null;
      let end = timeArr[1] ? timeArr[1].format('YYYY-MM-DD HH:mm:ss') : null;
      this.setState({
          timeArr,
          status
      });
      let params = {
        size,
        index,
        status,
      }
      if(start || end){
        params.start = start;
        params.end = end;
      }
      dispatch({
        type:'notice/queryNotice',
        payload:{
          ...params
        },
      });
    })
}
// 禁止选择大于30天的时间
disabledDate = (current) => {
  const { dateRange } = this.state;
  // Can not select days before today and today
  return current && (current > moment(dateRange).add(30,'days')||current<moment(dateRange).subtract(30,'days'));
}
// 选择时间
changeTime = (date) => {
  if(date.length == 1){
    this.setState({
      dateRange:date[0]
    })
  }
}
// 查询表单dom
searchForm = () => {
  const { form } = this.props;
  const { getFieldDecorator } = form;
  const { timeArr, status } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
            <dl className={styles.searchLayout}>
              <dd style={{width:'360px'}}>
                <FormItem 
                label="时间"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('timeArr', { initialValue: timeArr })(
                    <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      style={{width:'100%'}}
                      disabledDate={this.disabledDate}
                      format="YYYY-MM-DD HH:mm"
                      mode={['date','date']}
                      placeholder={['开始时间', '结束时间']}
                      onCalendarChange={this.changeTime}
                    />
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
                        <Option value={''}>全部</Option>
                        <Option value={0}>过期</Option>
                        <Option value={1}>有效</Option>
                      </Select>
                    )}
                  </FormItem>
                </dd>
              <dd style={{width:'160px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </span>
              </dd>
          </dl>
        </Form>
    );
}

// 新增、编辑
handleClick = (type) => {
  const { params } = this.state;
  let row = {}
  if(type){
    let item = JSON.parse(type.detail)
      row={
        id:type.id,
        title:item.title,
        content:item.content,
        btnName:item.btnName,
        btnUrl:item.btnUrl,
        style:item.style,
        system:type.system,
        userStatus:item.userStatus,
        time:[type.start,type.end],
        status:type.status,
        version:item.version,
      }
    }else{
      row={
        id:null,
        title:'',
        content:'',
        btnName:'',
        btnUrl:'',
        style:'',
        system:0,
        userStatus:'',
        time:[null,null],
        status:1,
        version:'',
        versionList:[],
      }
    }
  this.setState({
    visibleModal:true,
    titleModal:type ? '编辑' : '新增',
    params:{
      ...params,
      ...row
    }
  })
}
// 确定新增、编辑
handleOk = ( values ) => {
  const { dispatch } = this.props;
  const { params:{id} } = this.state;
  const { title, userStatus, version, btnName, btnUrl, content, status, style, system, time} = values;
  let start = time[0] ? moment(time[0]).format('YYYY-MM-DD HH:mm') : null;
  let end = time[1] ? moment(time[1]).format('YYYY-MM-DD HH:mm') : null;
  let args = {
    system,
    status,
    start,
    end,
    detail:JSON.stringify({
      title,
      content,
      btnName,
      btnUrl,
      style,
      userStatus,
      version
    })
  }
  if(id){
    args.id = id;
  }
  dispatch({
    type:'notice/addNotice',
    payload:{
      ...args
    },
    callback:(res)=>{
      if(res.code ==0 || res.code == 1){
        this.handleSubmit();
        this.handleCancel();
      }
    }
  })
}
// 取消
handleCancel = (type) => {
  this.setState({
    visibleModal:false,
  })
}
// 选择推送系统
changeSystem = ( val ) => {
  const { notice:{ appVersion }} = this.props;
  const { params } = this.state;
  let versionList = [];
  switch(val){
    case 1 :
      versionList = appVersion.filter( item => {
        return item.osType == 1;
      })
      break;
    case 2 :
      versionList = appVersion.filter( item => {
        return item.osType == 2;
      })
      break;
  }
  this.setState({
    params:{
      ...params,
      versionList
    }
  })
}
// 表格分页
changeTable = (pagination) => {
  const { current, pageSize } = pagination;
  this.setState({
    index:current-1,
    size:pageSize
  },()=>{
    this.handleSubmit()
  })
}
  render(){
    const { notice:{ loading, list, appVersion, pagination }} = this.props;
    const { visibleModal, titleModal, params } = this.state;
    const events = {
      handleOk:this.handleOk,
      handleCancel:this.handleCancel,
      changeSystem:this.changeSystem
    }
    const column = [
      {
      title:'有效期',
      key:'yxq',
      width:180,
      render:( row )=>{
        return (
          <Row>
            <Col>{moment(row.start).format('YYYY-MM-DD HH:mm')}</Col>
            <Col>{moment(row.end).format('YYYY-MM-DD HH:mm')}</Col>
          </Row>
        )
      }
     },{
       title:'标题',
       key:'title',
       render:(row)=>{
        let item = JSON.parse(row.detail)
        return <span>{Object.keys(item.title).length>1 ? item.title:'--'}</span>
       }
     },{
       title:'内容',
       key:'content',
       render:(row)=>{
        let item = JSON.parse(row.detail)
        return <span>{Object.keys(item.content).length>1 ? item.content:'--'}</span>
       }
     },{
       title:'按钮',
       key:'btn',
       render:(row)=>{
        let item = JSON.parse(row.detail)
        return <span>{Object.keys(item.btnName).length>1 ? item.btnName:'--'}</span>
       }
     },{
       title:'URL',
       key:'url',
       render:(row)=>{
        let item = JSON.parse(row.detail)
        return <span>{Object.keys(item.btnUrl).length>1 ? item.btnUrl:'--'}</span>
       }
     },{
       title:'状态',
       key:'status',
       width:100,
       render:(row)=>{
        let text = ''
        if(row.status == 0){
          text = <Badge status="default" text="过期"/>
        }else if(row.status == 1){
          text = <Badge status="success" text="有效"/>
        }
        return <span>{text || '--'}</span>
       }
     },{
       title:'操作',
       key:'todo',
       width:100,
       render:(row)=>{
        return <Button type="primary" onClick={this.handleClick.bind(this,row)}>编辑</Button>
       }
     }
    ];
    return (
      <PageHeaderLayout>
          <Card bordered={false}>
            { this.searchForm() }
            <div style={{marginBottom:20}}><Button type="primary" icon='plus' onClick={this.handleClick.bind(this,0)}>新增</Button></div>
            <div className={styles.table}>
              <Table
                dataSource={list}
                columns={column}
                onChange={this.changeTable}
                pagination={pagination}
                rowKey="id"
                loading={loading}
              />
            </div>
            <NoticeModal data={{visibleModal,titleModal, params, appVersion}} {...events}/>
          </Card>
			</PageHeaderLayout>
    )
  }
}
