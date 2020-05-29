import React, { PureComponent } from 'react';
import { Select, Modal, Input, DatePicker, Form } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './index.less'
const { RangePicker  } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
const FormItem = Form.Item;
@Form.create()
class NoticeModal extends PureComponent {
  state = {
    dateRange:null,
    timeRules:false,
  }
  // 选择时间
  changeTime = (date) =>{
    if(date.length == 1){
        this.setState({
          dateRange:date[0]
        })
      }
  }
  // 禁止选择现在的日期
  disabledDate = (current) => {
    const { dateRange } = this.state;
    // Can not select days before today and today
    return current && (current < moment(dateRange).add(0,'days'));
  }
  // 确定选择
  selectOk = (date) => {
    this.setState({
      dateRange:null,
      timeRules:false,
    })
  }
    // 关闭、打开日期
    closeOrOpenRange = (bool) => {
      const { time } = this.props.form.getFieldsValue(['time']);
      if(!bool && time[0]){
        this.setState({
          dateRange:null,
          timeRules:false,
        })
      }
    }
  // 表单dom
  formDom = () => {
    const { form, data:{ params }, changeSystem } = this.props;
    const { timeRules } = this.state;
    const { 
      title,
      content,
      btnName,
      btnUrl,
      style,
      system,
      userStatus,
      time,
      status,
      version,
      versionList
    } = params;
    const { getFieldDecorator } = form;
    let timeRulesText = {};
    if(timeRules){
      timeRulesText={
        validateStatus:"error",
        help:"请选择有效时间"
      }
    }
    return (
      <Form>
        <dl className={styles.searchLayout}>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="公告标题"
            >
              {getFieldDecorator('title', { 
                initialValue: title,
                rules: [{ required: true, message: '请输入公告标题' }] 
              })(
                <Input placeholder='请输入公告标题' maxLength={15}/>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="公告内容"
            >
              {getFieldDecorator('content', { 
                initialValue: content,
                rules: [{ required: true, message: '请输入公告内容' }] 
              })(
                <TextArea rows={4} placeholder='请输入公告内容'/>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="按钮名称"
            >
              {getFieldDecorator('btnName', { 
                initialValue: btnName,
                rules: [{ required: true, message: '请输入按钮名称' }] 
              })(
                <Input placeholder='请输入按钮名称' maxLength={6} />
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="按钮URL"
            >
              {getFieldDecorator('btnUrl', { 
                initialValue: btnUrl,
                rules: [{ required: true, message: '请输入按钮URL' }]  
              })(
                <Input placeholder='请输入按钮URL' />
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="公告方式"
            >
              {getFieldDecorator('style', { initialValue: style })(
                <Select placeholder="请选择">
                  <Option value={''}>全部</Option>
                  <Option value={1}>一次性</Option>
                  <Option value={2}>结果结束</Option>
                </Select>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="推送系统"
            >
              {getFieldDecorator('system', { initialValue: system })(
                <Select placeholder="请选择" onChange={changeSystem}>
                  <Option value={0}>全部</Option>
                  <Option value={1}>Android</Option>
                  <Option value={2}>iOS</Option>
                </Select>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="用户状态"
            >
              {getFieldDecorator('userStatus', { initialValue: userStatus })(
                <Select placeholder="请选择">
                  <Option value={''}>全部</Option>
                  <Option value={1}>登录</Option>
                  <Option value={0}>未登录</Option>
                </Select>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="有效期"
            {...timeRulesText}
            >
              {getFieldDecorator('time', { 
                initialValue: [time[0]?moment(time[0]):'',time[1]?moment(time[1]):''],
                // rules: [{ type: 'object', required: true, message: '请选择有效时间' }]   
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  style={{width:'100%'}}
                  disabledDate={this.disabledDate}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  onOk={this.selectOk}
                  onCalendarChange={this.changeTime}
                  onOpenChange={this.closeOrOpenRange}
                />
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="状态"
            >
              {getFieldDecorator('status', { initialValue: status })(
                <Select placeholder="请选择">
                  <Option value={0}>过期</Option>
                  <Option value={1}>有效</Option>
                </Select>
              )}
            </FormItem>
          </dd>
          <dd>
            <FormItem 
            { ...formItemLayout }
            label="应用版本"
            >
              {getFieldDecorator('version', { initialValue: version })(
                <Select placeholder="请选择">
                  <Option value={''} key={-1}>全部</Option>
                  {
                    versionList.map( item => {
                      return <Option key={item.id} value={item.appVersion}>{item.appVersion}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </dd>
        </dl>
      </Form>
    )
  }

  // 提交表单
  handleSubmit = ( e ) => {
    if (e) e.preventDefault();
    const { form, handleOk } = this.props;
    form.validateFields((err, values)=>{
      const { time } = values;
      if(err || !time[0]){
        if(!time[0]){
          this.setState({
            timeRules:true,
          })
        }
        return;
      } 
      handleOk(values)
    })
  }
  // 取消添加、编辑
  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({
      timeRules:false,
    })
    handleCancel();
  }
  render() {
    const { data:{ visibleModal, titleModal} } = this.props;
    return (
      <Modal
        width={860}
        destroyOnClose={true}
        visible={visibleModal}
        title={titleModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        maskClosable={false}
      > 
       { this.formDom() }
      </Modal>
    );
  }
}

export default NoticeModal;
