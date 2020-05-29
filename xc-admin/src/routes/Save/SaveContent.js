import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Spin, Tabs, Cascader, DatePicker,Card, Form, Select, Input, Tag } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { RangePicker  } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
@Form.create()
@connect(state => ({
  addUser: state.addUser,
  list:state.list
}))
export default class SaveContent extends PureComponent{
  state = {
    params:{
      beginDay:'',
      endDay:'',
      version:'',
      range:['1-1000','1-200'],
      phoneOrId:'',
      platform:'',
    },
    timeArr:[null,null],
    list:[],
    activeKey:'1',
    dateRange:null
}
componentDidMount(){
  this.getVersion();
  this.handleSubmit();
}
 // 查询版本号
 getVersion = () => {
  const { dispatch } = this.props;
  dispatch({
    type:'addUser/versionTagsApi',
    payload:{},
  })
}
// 获取范围选择数据
getSource = (pStep,cStep) => {
    let n = 5000;
    let obj = [];
    let index = 0;
    for (let i = 1; i <= Math.ceil(n / pStep); i++) {
      let value = 1;
      if (i * pStep / pStep > 1) {
        value = i * pStep - pStep + 1;
      }
      obj.push({
        value: value + '-' + i * pStep,
        label: value + '-' + i * pStep,
      })
      if (i * pStep / cStep >= 0) {
        obj[index].children = [];
        for (let j = i*pStep - pStep+cStep; j <= i*pStep; j++) {
          if ((j % cStep == 0 && j != 0)||j==n) {
            let value = j - cStep + 1;
           
            obj[index].children.push({
              value: value + '-' + j,
              label: value + '-' + j,
            })
          }
          if (j > n) {
            break;
          }
        }
        index++;
      }
    }
    return obj;
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
    const { params, activeKey } = this.state;
    const _this = this;
    form.validateFields((err, values) => {
      const { version, platform, phoneOrId, range, timeArr } = values;
      let beginDay = timeArr[0]?timeArr[0].format('YYYYMMDD'):null;
      let endDay = timeArr[1]?timeArr[1].format('YYYYMMDD'):null;
      this.setState({
          params:{
            ...params,
            version,
            platform,
            phoneOrId,
            range,
            beginDay,
            endDay,
          },
          timeArr,
      });
      var numArr = range.length ? range[1].split('-') : null;
      let numFirst = numArr ? parseInt(numArr[0]) : numArr;
      let numEnd = numArr ? parseInt(numArr[1]) : numArr;
      let url = 'addUser/queryTags';
      if(activeKey == '2'){
        url = 'addUser/queryTags2'
      }
      dispatch({
        type:url,
        payload:{
          user:phoneOrId,
          mblVersion:version,
          mblSystem:platform,
          start:beginDay,
          end:endDay,
          first:numFirst,
          last:numEnd,
        },
        callback:(res)=>{
          if(res.code == 0 || res.code == 1 ){
            const { result } = res;
            _this.setState({
              list: (typeof result) == 'string'? [] : result
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
  const { timeArr, params : { platform, version, range, phoneOrId }, source } = this.state;
  let timeValue = [moment().subtract(7,'days'),moment()];
  if(timeArr[0]||timeArr[1]){
    timeValue = timeArr;
  }
    return (
      <Form onSubmit={this.handleSubmit}>
            <dl className={styles.searchLayout}>
              <dd style={{width:'320px'}}>
                <FormItem 
                label="时间"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('timeArr', { initialValue: timeValue })(
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
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('platform', { initialValue: platform })(
                      <Select>
                        <Option value={''}>全部平台</Option>
                        <Option value={2}>iOS</Option>
                        <Option value={1}>Android </Option>
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="版本"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 17 }}
                  >
                    {getFieldDecorator('version', { initialValue: version })(
                      <Select>
                        <Option key="-1" value={''}>全部版本</Option>
                        {
                          versionArr.map((item, index) => {
                            return <Option key={index} value={item}>{item}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'280px'}}>
                  <FormItem 
                  label="范围"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('range', { initialValue: range })(
                      <Cascader options={this.getSource(1000,200)} placeholder="默认前200条" />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'280px'}}>
                  <FormItem 
                  label="手机/ID"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('phoneOrId', { initialValue: phoneOrId })(
                      <Input placeholder="请输入手机/ID" />
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
// 切换tab
callback = ( key ) => {
  const { form } = this.props;
  form.resetFields();
  this.setState({
    activeKey:key,
    params:{
      beginDay:'',
      endDay:'',
      version:'',
      range:['1-1000','1-200'],
      phoneOrId:'',
      platform:'',
    },
    timeArr:[null,null],
    dateRange:null
  },()=>{
    this.handleSubmit()
  })
}

  render(){
    const { addUser:{ loading }} = this.props;
    const { list, activeKey } = this.state;
    let data = [];
    let arrData =  Object.keys(list);
    if(arrData.length){
      for(let item in list){
        data.push(
          <Tag style={{marginBottom:15}} key={item}>{list[item]}</Tag>
        )
      }
    }
    return (
      <PageHeaderLayout>
          <Card bordered={false}>
            { this.searchForm() }
            <div className={styles.tabs}>
              <Tabs activeKey={activeKey} animated={false} onChange={this.callback}>
                <TabPane tab="事件" key="1">
                  <Spin spinning={loading}>{data.length ? data : '暂无数据'}</Spin>
                </TabPane>
                <TabPane tab="父类" key="2">
                  <Spin spinning={loading}>{data.length ? data : '暂无数据'}</Spin>
                </TabPane>
              </Tabs>
            </div>
          </Card>
			</PageHeaderLayout>
    )
  }
}
