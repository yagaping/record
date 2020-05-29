import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Divider, DatePicker,Card, Form, Select, Table } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
import ChartPie from '../../components/ChartPie'
const FormItem = Form.Item;
const { RangePicker  } = DatePicker;
const FORMAT = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  addUser: state.addUser,
}))
export default class PayState extends PureComponent{
  state = {
    params:{
      beginDay:'',
      endDay:'',
    },
    timeArr:[null,null],
    list:[],
    pay_zfb:0,
    pay_wx:0,
    pay_ios:0,
    pay_zfb_h5:0,
    pay_wx_h5:0,
    dateRange:null
}
componentDidMount(){
  this.handleSubmit();
}

// 获取星期
weekDate = (date) => {
  let weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
  let week = weekArray[new Date(date).getDay()];
  return `周`+ week;
}

// 查询
 handleSubmit = (e) =>{
  if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    const { params } = this.state;
    const _this = this;
    form.validateFields((err, values) => {
      const { timeArr } = values;
      let beginDay = timeArr[0]?timeArr[0].format('YYYYMMDD'):'';
      let endDay = timeArr[1]?timeArr[1].format('YYYYMMDD'):'';
      this.setState({
          params:{
            ...params,
            beginDay,
            endDay,
          },
          timeArr,
      });
    
      dispatch({
        type:'addUser/queryPayState',
        payload:{
          ...params,
          beginDay,
          endDay,
        },
        callback:(res)=>{
          if((res.code == 0 || res.code == 1) && res.result){
            const { result } = res;
            let pay_zfb = 0;
            let pay_wx = 0;
            let pay_ios = 0;
            let pay_zfb_h5 = 0;
            let pay_wx_h5 = 0;
            for(let i=0;i<result.length;i++){
              let item = result[i];
              switch(item.payType){
                case '1':
                  pay_zfb += item.payAmount;
                  break;
                case '2':
                  pay_wx += item.payAmount;
                  break;
                case '3':
                  pay_ios += item.payAmount;
                  break;
                case '4':
                  pay_zfb_h5 += item.payAmount;
                  break;
                case '5':
                  pay_wx_h5 += item.payAmount;
                  break;
              }
            }
            this.setState({
              list:result,
              pay_zfb,
              pay_wx,
              pay_ios,
              pay_zfb_h5,
              pay_wx_h5
            })
          }
        }
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
// 查询表单
searchForm = () => {
  const { form } = this.props;
  const { getFieldDecorator } = form;
  const { timeArr } = this.state;
  
    return (
      <Form onSubmit={this.handleSubmit}>
            <dl className={styles.searchLayout}>
              <dd style={{width:'300px'}}>
                <FormItem 
                label="时间"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('timeArr', { initialValue: timeArr })(
                    <RangePicker 
                      disabledDate={this.disabledDate}
                      format="YYYY-MM-DD"
                      mode={['date','date']}
                      onCalendarChange={this.changeTime}
                    />
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


  render(){
    const { addUser:{ loading }} = this.props;
    const { 
      list,
      pay_zfb,
      pay_wx,
      pay_ios,
      pay_zfb_h5,
      pay_wx_h5 
    } = this.state;
    const column = [
      {
        title:'日期',
        key:'dateTime',
        dataIndex:'dateTime',
        render:(key)=>{
          let val = moment(key,FORMAT).format(FORMAT);
          return <span>{val +' '+ this.weekDate(val)}</span>;
        }
      },{
        title:'付费金额 ¥',
        key:'payAmount',
        dataIndex:'payAmount'
      },{
        title:'新增付费/人数',
        key:'userNew',
        dataIndex:'userNew'
      },{
        title:'新增付费转化',
        key:'xzffzf',
        render:(row)=>{
          let val
          if(!row.userNew || !row.userNewTotal){
            val = '0%'
          }else{
            val = parseInt(row.userNew/row.userNewTotal*100) + '%'
          }
          return <span>{val}</span>
        }
      },{
        title:'累计付费人数',
        key:'userAll',
        dataIndex:'userAll'
      }
    ];
    const data = [
      {
        item: "支付宝",
        count: pay_zfb
      },
      {
        item: "微信",
        count: pay_wx
      },
      {
        item: "APP Store",
        count: pay_ios
      },
      {
        item: "支付宝h5支付",
        count: pay_zfb_h5
      },
      {
        item: "微信h5支付",
        count: pay_wx_h5
      }
    ];
    let sum=0;
    for(let i=0;i<data.length;i++){
      sum += data[i].count;
    }
    
    return (
      <PageHeaderLayout>
          <Card bordered={false}>
            { this.searchForm() }
            <div className={styles.table}>
              <Table
                dataSource={list}
                columns={column}
                rowKey="id"
                pagination={false}
                loading={loading}
              />
            </div>
            <div className={styles.chartPie}>
              <div className={styles.pieTitle}>支付渠道占比</div>
              <ChartPie chartPie={{data,sum,title:'总数量',top:-80}}/>
            </div>
          </Card>
			</PageHeaderLayout>
    )
  }
}
