import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import styles from './DoLog.less';
import DogLogTable from '../../components/DoLogTable/DoLogTable';
import { sizeType, sizeChange } from '../../components/SizeSave';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@Form.create()
@connect(state => ({
  adminUserList: state.adminUserList,
}))
export default class DoLog extends PureComponent{
  state = {
    formValues:{},
    searchIndex:0,
    searchSize:10,
    searchUserName:'',
    searchMenuName:'',
    searchType:-1,
    pickerStart:null,
    pickerEnd:null,
  }
  componentDidMount(){
     this.queryDoLogInfo();
  }

  // 查询反馈信息列表
  queryDoLogInfo = () => {
      const { dispatch } = this.props;
      const index = this.state.searchIndex;
      const userName = this.state.searchUserName;
      const menuName = this.state.searchMenuName;
      const type = this.state.searchType;
      const beginDay = this.state.pickerStart;
      const endDay = this.state.pickerEnd;
      // 读缓存每页条数
      let size = sizeType(this.state.searchSize,this.props);
      dispatch({
        type:'adminUserList/queryDoLog',
        payload:{
          index,
          size,
          userName,
          menuName,
          type,
          beginDay,
          endDay,
        },
      })
  }

  // 计算多少天前的日期
  historyDate(day){
    var date1 = new Date(),
    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+day);
    var month = (date2.getMonth()+1) > 9 ?(date2.getMonth()+1):'0'+(date2.getMonth()+1);
    var day = date2.getDate() > 9 ? date2.getDate() :'0' + date2.getDate();
    var time2 = date2.getFullYear()+"-"+month+"-"+day;
    return time2;
  }

  // 搜索
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const rangeValue = fieldsValue['range-picker'];
      const values = {
        ...fieldsValue,
        'range-picker': [rangeValue[0]&&rangeValue[0].format('YYYY-MM-DD'), rangeValue[1]&&rangeValue[1].format('YYYY-MM-DD')],
      }
      const beginDay = values['range-picker'][0];
      const endDay = values['range-picker'][1];
      this.setState({
        pickerStart:beginDay,
        pickerEnd:endDay,
        searchUserName:values.number,
        searchMenuName:values.menuName,
        searchType:values.type,
      });
      const index = this.state.searchIndex;
      const size = this.state.searchSize;
      const type = values.type;
      const userName = values.number;
      const menuName = values.menuName;
      this.props.dispatch({
        type:'adminUserList/queryDoLog',
        payload:{
          index,
          size,
          userName,
          menuName,
          type,
          beginDay,
          endDay,
        },
      })
    });
  }

  // 表格分页
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const index = (current - 1);
    this.state.searchIndex = index;
    this.state.searchSize = pageSize;
    sizeChange(pageSize, this.props);
    this.props.dispatch({
      type:'adminUserList/queryDoLog',
      payload:{
        index,
        size:pageSize,
        userName:this.state.searchUserName,
        menuName:this.state.searchMenuName,
        type:this.state.searchType,
        beginDay:this.state.pickerStart,
        endDay:this.state.pickerEnd,
      },
    })
  }

  // 选择日期，更改状态
  handleSelectDates = (key1,key2,dates) => {
    let value = [];
    if (dates !== null) {
      value[0] = dates[0].format('YYYY-MM-DD');
      value[1] = dates[1].format('YYYY-MM-DD');
    }
    this.setState({
      [key1]: value[0],
      [key2]: value[1],
    });
  }
  renderSimpleForm = () => {
    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <div className={styles.title}>系统日志</div>
          <dl className={styles.searchLayout}>
              <dd style={{width:300}}>
                <FormItem>
                  {getFieldDecorator('menuName', { initialValue: this.state.searchMenuName })(
                    <Input placeholder="查询菜单名" />
                  )}
                </FormItem>
              </dd>
              <dd style={{ width:'260px' }}>
                <FormItem
                >
                  {getFieldDecorator('range-picker', { initialValue: [this.state.pickerStart&&moment(this.state.pickerStart, 'YYYY-MM-DD'),this.state.pickerEnd&&moment(this.state.pickerEnd, 'YYYY-MM-DD')]})(
                    <RangePicker style={{width:'100%'}} onChange={this.handleSelectDates.bind(this, 'pickerStart','pickerEnd')}/>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'180px'}}>
                <FormItem>
                  {getFieldDecorator('number', { initialValue: this.state.searchUserName })(
                    <Input placeholder="查询账号" />
                  )}
                </FormItem>
              </dd>
              <dd>
                <FormItem
                  labelCol={{ span: 2 }}
                   wrapperCol={{ span: 2 }}
                >
                  {getFieldDecorator('type', { initialValue: this.state.searchType })(
                    <Select style={{ width:'100%' }}>
                      <Option value={-1}>全部</Option>
                      <Option value={0}>添加</Option>
                      <Option value={1}>修改</Option>
                      <Option value={2}>删除</Option>
                    </Select>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'64px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </span>
              </dd>
          </dl>
      </Form>
    );
  }
  render(){
    const { logData, loading } = this.props.adminUserList;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <DogLogTable 
              logData={logData}
              loading={loading}
              state={this.state}
              onTableChange={this.handleTableChange}
            />
          </div> 
        </Card>
			</PageHeaderLayout>
    )
  }
}
