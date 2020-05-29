import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Divider, DatePicker,Card, Form, Select, Input, Table } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
import ChartPie from '../../components/ChartPie'
const FormItem = Form.Item;
const { RangePicker  } = DatePicker;
const { Option } = Select;
const FORMAT = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  addUser: state.addUser,
}))
export default class SaveState extends PureComponent{
  state = {
    params:{
      beginDay:'',
      endDay:'',
      version:'',
      platform:0,
    },
    timeArr:[null,null],
    list:[],
    dateRange:null,
    photo:0,
    video:0,
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
        type:'addUser/querySaveState',
        payload:{
          ...params,
          version,
          platform,
          beginDay,
          endDay,
        },
        callback:(res)=>{
          if(res.code == 0 || res.code == 1 ){
            const { result } = res;
            let photo = 0;
            let video = 0;
            for(let i=0;i<result.length;i++){
              let item = result[i]
              photo += item.typeCountTotal
              video += item.vidoeCountTotal
            }
            _this.setState({
              list:result,
              photo,
              video,
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
  const { timeArr,params:{platform,version} } = this.state;
  
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
    const { list, photo, video } = this.state;
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
        title:'新增使用 GB',
        key:'dayTotal',
        dataIndex:'dayTotal',
        render:(key)=>{
          let val = key ? Math.floor(key/1024/1024/1024*100)/100+'GB' : '--'
          return <span>{val}</span>
        }
      },{
        title:'新增照片 /张',
        key:'typeCountTotal',
        dataIndex:'typeCountTotal'
      },{
        title:'新增视频',
        key:'vidoeCountTotal',
        dataIndex:'vidoeCountTotal'
      },{
        title:'累计使用空间 TB',
        key:'storageTotal',
        dataIndex:'storageTotal',
        render:(key)=>{
          let val = key ? Math.floor(key/1024/1024/1024*100)/100+'GB' : '--'
          return <span>{val}</span>
        }
      }
    ];
    const data = [
      {
        item: "视频",
        count: video
      },
      {
        item: "照片",
        count: photo
      }
    ];
    let sum=0;
    for(let i=0;i<data.length;i++){
      sum += data[i].count;
    }
    console.log(list)
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
            {
              list.length ? 
                (<div className={styles.chartPie}>
                  <div className={styles.pieTitle}>累计 照片 视频 占比</div>
                  <ChartPie chartPie={{data,sum,title:'总数量'}}/>
                </div>)
              : ''
          }
          </Card>
			</PageHeaderLayout>
    )
  }
}
