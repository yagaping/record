import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Table, DatePicker,Card, Form, Select, Input } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker  } = DatePicker;
const FORMAT = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  addUser: state.addUser,
}))
export default class ActionKeep extends PureComponent{
  state = {
      params:{
        beginDay:'',
        endDay:'',
        platform:0,
        version:'',
        type:2,
      },
      timeArr:[null,null],
      timeType:1, //1周 2月
      list:[],
      count:0,
      areaData:[],
      dateRange:null,
  }
  componentDidMount(){
    this.getVersion();
    this.handleSubmit();
  }

  // 查询版本号
  getVersion = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'addUser/getVersion',
      payload:{},
    })
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
        const { version, platform, timeArr } = values;
        let beginDay = timeArr[0]?timeArr[0].format('YYYYMMDD'):'';
        let endDay = timeArr[1]?timeArr[1].format('YYYYMMDD'):'';
        this.setState({
            params:{
              ...params,
              version,
              platform,
              beginDay,
              endDay,
            },
            timeArr,
        });
        dispatch({
          type:'addUser/retentionData',
          payload:{
            ...params,
            version,
            platform,
            beginDay,
            endDay,
          },
          callback:(res)=>{
            if(res.code == 0 || res.code == 1){
              const { result } = res;
              _this.setState({
                list:result,
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
    const { form, addUser:{versionArr} } = this.props;
    const { getFieldDecorator } = form;
    const { timeArr, params:{platform,version}} = this.state;
   
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
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="平台"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('platform', { initialValue: platform })(
                      <Select>
                        <Option value={0}>全部平台</Option>
                        <Option value={2}>iOS</Option>
                        <Option value={1}>Android </Option>
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="版本"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('version', { initialValue: version })(
                      <Select>
                        <Option key="-1" value={''}>全部版本</Option>
                        {
                          versionArr.map(item => {
                            return <Option key={item.id} value={item.appVersion}>{item.appVersion}</Option>
                          })
                        }
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

  render(){
    const { addUser:{ loading }} = this.props;
    const { list } = this.state;
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
        title:'新增用户',
        key:'userNewTotal',
        dataIndex:'userNewTotal',
      },{
        title:'用下即走（%）',
        key:'yxjz',
        render:(row)=>{
          let val
          if(row.userOnceTotal ==0 || row.userNewTotal == 0){
            val = '0%'
          }else{
            val = parseInt(row.userOnceTotal/row.userNewTotal*100) + '%'
          }
          return <span>{row.userOnceTotal+` ( ${val} )`}</span>
        }
      },{
        title:'偶尔使用（%）',
        key:'oesy',
        render:(row)=>{
          let val
          if(row.userOccasionallyTotal ==0 || row.userNewTotal == 0){
            val = '0%'
          }else{
            val = parseInt(row.userOccasionallyTotal/row.userNewTotal*100) + '%'
          }
          return <span>{row.userOccasionallyTotal +` ( ${val} )`}</span>
        }
      },{
        title:'持续使用（%）',
        key:'cxsy',
        render:(row)=>{
          let val
          if(row.userPersistentTotal ==0 || row.userNewTotal == 0){
            val = '0%'
          }else{
            val = parseInt(row.userPersistentTotal/row.userNewTotal*100) + '%'
          }
          return <span>{row.userPersistentTotal +` ( ${val} )`}</span>
        }
      }
    ];

    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          { this.searchForm() }
          <div className={styles.area}>
            <Table 
              dataSource={list}
              columns={column}
              rowKey="id"
              pagination={false}
              loading={loading}
            />
          </div>
        </Card>
        
			</PageHeaderLayout>
    )
  }
}
