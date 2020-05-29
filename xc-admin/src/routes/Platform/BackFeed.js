import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, DatePicker, Modal } from 'antd';
import moment from 'moment';
import BackTable from '../../components/BackTable';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './BackFeed.less';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  platform: state.platform,
}))
export default class BackFeed extends Component{
  
  state = {
    visible:false,
    formValues:{},
    searchIndex:0,
    searchSize:10,
    searchContent:'',
    projectTyle:'',
    versions:'',
    pickerStart:null,
    pickerEnd:null,
    adoptedStatus:'-1',
  }
  componentDidMount(){
     this.queryBackFeedList();
  }

  // 查询反馈信息列表
  queryBackFeedList = () => {
      const { dispatch } = this.props;
      const index = this.state.searchIndex;
      const feedbackContent = this.state.searchContent;
      const beginDay = this.state.pickerStart;
      const endDay = this.state.pickerEnd;
      const adoptedStatus = this.state.adoptedStatus;
      // 读缓存每页条数
      const size = sizeType(this.state.searchSize,this.props);
      dispatch({
        type:'platform/query',
        payload:{
          index,
          size,
          feedbackContent,
          beginDay,
          endDay,
          adoptedStatus,
        },
      })
  }
  // 几天前的日期
  handleAgoDay = (type) => {
    const date = moment().subtract(type,'days').format('YYYY-MM-DD');
    this.handleSearch('',date);
  }
  // 搜索
  handleSearch = (e,date) => {
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
      let beginDay = null;
      let endDay = null;
      if(typeof date === 'string'){
        beginDay = date;
        endDay = moment().subtract(0,'days').format('YYYY-MM-DD');;
      }else{
        beginDay = values['range-picker'][0];
        endDay = values['range-picker'][1];
      }
      this.setState({
        pickerStart:beginDay,
        pickerEnd:endDay,
        searchContent:values.content,
      });
      const index = this.state.searchIndex;
      const size = this.state.searchSize;
      const feedbackContent = values.content;
      const adoptedStatus = this.state.adoptedStatus;
      this.props.dispatch({
        type:'platform/query',
        payload:{
          index,
          size,
          feedbackContent,
          beginDay,
          endDay,
          adoptedStatus,
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
      type:'platform/query',
      payload:{
        index,
        size:pageSize,
        feedbackContent:this.state.searchContent,
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
          <dl className={styles.searchLayout}>
              <dd style={{ width:'300px' }}>
                <FormItem
                  label="日期"
                >
                  {getFieldDecorator('range-picker', { initialValue: [this.state.pickerStart&&moment(this.state.pickerStart, 'YYYY-MM-DD'),this.state.pickerEnd&&moment(this.state.pickerEnd, 'YYYY-MM-DD')]})(
                    <RangePicker style={{width:'100%'}} onChange={this.handleSelectDates.bind(this, 'pickerStart','pickerEnd')}/>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'64px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </span>
              </dd>
              <dd className={styles.ago}>
                <a href="javascript:void(0)" onClick={this.handleAgoDay.bind(this,0)}>今天</a>
                <a href="javascript:void(0)" onClick={this.handleAgoDay.bind(this,7)}>7天</a>
                <a href="javascript:void(0)" onClick={this.handleAgoDay.bind(this,14)}>14天</a>
                <a href="javascript:void(0)" onClick={this.handleAgoDay.bind(this,30)}>30天</a>
              </dd>
              <dd style={{width:'240px',float:'right',paddingRight:'0'}}>
                <FormItem>
                  {getFieldDecorator('content', { initialValue: this.state.searchContent })(
                    <Input placeholder="标签搜索" />
                  )}
                </FormItem>
              </dd>
              
          </dl>
      </Form>
    );
  }
  // 删除信息
  deleteRow = (row) => {
    this.setState({
      visible:true,
      deletRow:row,
    });
  };
  handleOk = () =>{
    
    const { deletRow } = this.state;
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type:'platform/deleteRow',
      payload:{
          id:deletRow.feedbackId
      },
      callback:(res)=>{
        if(res.code == 0){
          _this.queryBackFeedList();
        }
        _this.setState({
          visible:false,
        });
      }
    });
  }
  handleCancel = () => {
    this.setState({
      visible:false,
    });
  }
  render(){
    const { errorData, userBack, loading } = this.props.platform;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <BackTable 
              data={userBack}
              loading={loading}
              state={this.state}
              destroyOnClose={true}
              deleteRow={this.deleteRow}
              onTableChange={this.handleTableChange}
            />
             <Modal
              title="提示"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>是否删除本条记录？</p>
            </Modal>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
