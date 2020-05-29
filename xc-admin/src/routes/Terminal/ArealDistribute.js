import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Table, DatePicker,Card, Form, Select, Input, Tabs } from 'antd';
import moment from 'moment';
import ChartBar from '../../components/ChartBar'
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker  } = DatePicker;
const FORMAT = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  terminal: state.terminal,
  addUser:state.addUser
}))
export default class ArealDistribute extends PureComponent{
  state = {
      params:{
        beginDay:'',
        endDay:'',
        platform:0,
        version:'',
        type:1,
      },
      timeArr:[null,null],
      timeType:1, //1周 2月
      list:[],
      count:0,
      userSum:0,
      startSum:0,
      activeSum:0,
      areaData:[],
      dateRange:null,
      activeKey:'1',
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
          type:'terminal/queryAreal',
          payload:{
            ...params,
            version,
            platform,
            beginDay,
            endDay,
          },
          callback:(res)=>{
            if(res.code == 0 || res.code == 1){
              let list = []
              if(res.result){
                const { total_user_start, total_user_new, total_user_act, list } = res.result;
                _this.setState({
                  list:list,
                  userSum:total_user_new,
                  startSum:total_user_start,
                  activeSum:total_user_act,
                })
              }else{
                _this.setState({
                  list:[],
                })
              }
              
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
  callback = (activeKey) => {
    const { params } = this.state;
    this.setState({
      activeKey,
      params:{
        ...params,
        type:activeKey
      }
      },()=>{
      this.handleSubmit();
    })
    
  }
  render(){
    const { terminal:{ loading } } = this.props;
    const { list, activeKey, userSum, startSum, activeSum } = this.state;
    let column = [
      {
        title:'区域',
        key:'area',
        dataIndex:'area',
        reder:(key)=>{
          return <span>{key || '--'}</span>
        }
      },{
        title:'新增用户',
        key:'userNewTotal',
        dataIndex:'userNewTotal'
      },{
        title:'新用户占比',
        key:'xyhzb',
        render:(row)=>{
            let val 
              if(!row.userNewTotal|| !userSum){
                val = '0%'
              }else{
                val = parseInt(row.userNewTotal/userSum * 100) + '%'
              }
          return <span>{val}</span>
        }
      },{
        title:'活跃用户',
        key:'userActTotal',
        dataIndex:'userActTotal'
      },{
        title:'活跃用户占比',
        key:'hyyhzb',
        render:(row)=>{
          let val 
          if(!row.userActTotal|| !activeSum){
            val = '0%'
          }else{
            val = parseInt(row.userActTotal/activeSum * 100) + '%'
          }
          return <span>{val}</span>
        }
      },{
        title:'启动次数',
        key:'startCountTotal',
        dataIndex:'startCountTotal'
      },{
        title:'启动次数占比',
        key:'qdcszb',
        render:(row)=>{
          let val 
          if(!row.startCountTotal|| !startSum){
            val = '0%'
          }else{
            val = parseInt(row.startCountTotal/startSum * 100) + '%'
          }
          return <span>{val}</span>
        }
      }
    ];
    let barData = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let obj = {}
      obj.x = item.area || '无'
      if(activeKey == 1){
        obj.y = item.userNew
      }else if(activeKey == 2){
        obj.y = item.userAct
      }else if(activeKey == 3){
        obj.y = item.startCount
      }
      barData.push(obj);
      
    }

    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          { this.searchForm() }
          <div className={styles.tabs}>
          <Tabs activeKey={activeKey} onChange={this.callback}>
            <TabPane tab="新增用户" key="1">
            </TabPane>
            <TabPane tab="活动用户" key="2">
            </TabPane>
            <TabPane tab="启动次数" key="3">
            </TabPane>
          </Tabs>
          </div>
          <div className={styles.chartBar}>
            <ChartBar data={{barData}}/>
          </div>
          <div className={styles.area}>
            <div className={styles.tableTitle}>数据明细</div>
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
