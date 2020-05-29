import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { History  } from 'react-router';
import moment from 'moment';
import { connect } from 'dva';
import Textarea from '../../components/Textarea';
import { 
  Card, 
  Form, 
  Input, 
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  Table,
  Icon,
  Upload,
  Modal,
  message,
  Radio,
  Checkbox,
  Spin,
  Tabs,
} from 'antd';
import styles from './AddNews.less';
import Attention from '../../components/Attention';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const { TabPane  } = Tabs;

const PT = ['Android','IOS'];
const V_PT={
  'Android':'1',
  'IOS':'2'
}
const WL = ['2G','3G','4G','WIFI'];
const V_WL={
  '2G':'1',
  '3G':'2',
  '4G':'3',
  'WIFI':'4',
}
const FW = ['已登录','未登录'];
const V_FW={
  '已登录':'1',
  '未登录':'2',
}
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
  newsContentEdit:state.newsContentEdit,
}))
export default class AddNews extends Component{
  
  state = {
    tabKye:null,
    id:0,
    formValue:{
      title:'',
      rich_text:'',
      url:'',
      device:'0',  //0多设备， 1单设备
      token:'',
      taskTime:null,
    },
    messageType:'',
    plateform:[],
    indeterminate_pt:true,
    checkAll_pt:false,
    network:[],
    indeterminate_wl:true,
    checkAll_wl:false,
    range:[],
    indeterminate_fw:true,
    checkAll_fw:false,
  };
  componentWillMount(){
    
      const { state } = this.props.location;
      if(state){
        sessionStorage.setItem('newsParams',JSON.stringify(state));
      }
    }
  
  componentWillUnmount(){
    sessionStorage.removeItem('newsParams');
  }
  componentDidMount(){
    
    const { match:{ params } } = this.props;
    let tabKye;
    // 添加推送
    if(params.type == '0'){
      this.setState({
        write:true,
        messageType:'2',
      });
      tabKye = 1;
    }else{
      const state  = JSON.parse(sessionStorage.getItem('newsParams'));
      const { newsId,newsType,contentType,title, newsAbstract, attention } = state;
      const { formValue } = this.state;
      this.setState({
        write:false,
        messageType:'1',
        newsId,
        newsType,
        contentType,
        formValue:{
          ...formValue,
          title,
        }
      });
      // 判断是否为关注推送
      if(attention){
        tabKye = 2;
      }else{
        tabKye = 1;
      }
     
    }
    this.setState({
      tabKye,
    });
  }
  // 提交表单数据
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { plateform, network, range, contentEditData, 
      newsId, newsType, contentType, messageType } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err) return;
      const { title, url, rich_text, device, token, taskTime } = fieldsValue;
      let params = {
        platForm:'',
        netWork:'',
        logIn:'',
        title,
        messageType,
      };
      // 多选平台值
      params.platForm = plateform.map(index => V_PT[index]).join(','); 
      // 多选网络值
      params.netWork = network.map(index => V_WL[index]).join(','); 
      // 多选范围值
      params.logIn = range.map(index => V_FW[index]).join(','); 
    
      if(device == 1){
        params.deviceToken = token;
      }
      
      // 判断是否有设置推送时间
      if(taskTime){
        params.taskTime = moment(taskTime).format('YYYY-MM-DD HH:mm');
      }
      
      // 判读是否信息填完整
      for(let item in params){
        if(!params[item]){
          message.info('请将信息填完整！');
          return;
        }
      }
      if(messageType == 1){
        params['messageValue'] = {
          newsId,
          newsType,
          contentType,
        }
        params['text'] = rich_text;
      }else if(messageType == 2){
        params['text'] = rich_text;
        params['messageValue'] = url;
      }
      if(params['text']&&!params['messageValue']){
        params['messageType'] = '';
      }
      if(!params['messageType']||params['messageType']==2){
          if(!params['text']){
            message.info('请将信息填完整！');
          }
      }
      // 提交推送信息
      dispatch({  
        type:'platformManage/newsSendQuery',
        payload:{ ...params },
        callback:(res)=>{
          const _this = this;
          if(res.code == 0){
            message.success('提交成功！');
            setTimeout(function(){
              _this.props.history.push({
                pathname: '/platformManage/news-send'
              });
            },1000)
           
          }else{
            message.error(res.message);
          }
         
        }
      })
    })
    
  }
  // 取消
  handleCancel = () => {
    // this.props.history.push('/platformManage/news-send');
    history.back();
  }
  //选择多设备
  handleDevice = (e) => { 
    const { formValue } = this.state;
    this.setState({
      formValue:{
        ...formValue,
        device:e,
      }
    })
  } 

  // 禁止选择过去时间
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  // 禁止选择秒
  disabledDateTime = () => {
    return {
      disabledSeconds: () => range(1, 60),
    };
  }
  // 表单内容Dom
  renderAddForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props.platformManage;
    const { 
      formValue:{
        title,
        rich_text,
        url,
        device,
        token,
      },
        plateform,
        network,
        range,
        startTime,
        endTime,
        contentEditData,
        taskTime,
       } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };
    const { write } = this.state;
    let show = 'block';
    if(!write){
      show = 'none';
    }
    
    const textarea = (
            <Row style={{display:show,marginBottom:24}}>
              <Col span={3} style={{textAlign:'right'}}>摘要：</Col>
              <Col span={10}>
              <Textarea 
              className={styles.contentEditor}
              editStyle={{height:570}}
              htmlData={contentEditData}
              onChange={this.handleContentEditorChange}
              />
              </Col>
          </Row>
        );
    return (  
      <Spin spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
        <FormItem
            {...formItemLayout}
            label="推送设备"
            >
            {getFieldDecorator('device', {
              initialValue:device,
            })(
              <Select onChange={this.handleDevice}>
                <Option value='0'>多设备</Option>
                <Option value='1'>单设备</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题"
            >
            {getFieldDecorator('title', {
              initialValue:title,
            })(
              <Input placeholder="输入标题"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="摘要"
            >
            {getFieldDecorator('rich_text', {
              initialValue:rich_text,
            })(
              <TextArea  rows={4} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="推送时间"
            >
            {getFieldDecorator('taskTime', {
              initialValue:taskTime,
            })(
              <DatePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
              />
            )}
          </FormItem>
          <div style={{display:device==0?'none':'block'}}>
            <FormItem
              {...formItemLayout}
              label="用户token"
              >
              {getFieldDecorator('token', {
                initialValue:token,
              })(
                <Input placeholder='输入用户token' />
              )}
            </FormItem>
          </div>
          <Row style={{display:show}}>
            <Col span={24} className={styles.tips}>
              <FormItem
              {...formItemLayout}
              label="URL"
            >
              {getFieldDecorator('url', {
                initialValue:url,
              })(
                <Input maxLength='128' placeholder="存在URL，URL会优先被执行" />
              )}
            </FormItem>
            <span className={styles.tips_s}>提示：不填为站内推送，否则为站外推送</span>
            </Col>
          </Row>
          
          <Row style={{marginBottom:24}}>
            <Col span={3} className={styles.tabTitle}>平台：</Col>
            <Col span={7}>
                <Row style={{paddingTop:10}}>
                  <Col>
                    <Checkbox
                      indeterminate={this.state.indeterminate_pt}
                      onChange={this.onCheckAllChange_pt}
                      checked={this.state.checkAll_pt}
                    >
                      全部
                    </Checkbox>
                  </Col>
                  <Col>
                    <CheckboxGroup options={PT} value={this.state.plateform} onChange={this.handlePlateform} />
                  </Col>
                
                </Row>
            </Col>
          </Row>
          <Row style={{marginBottom:24}}>
            <Col span={3} className={styles.tabTitle}>网络：</Col>
            <Col span={7}>
                <Row style={{paddingTop:10}}>
                  <Col>
                    <Checkbox
                      indeterminate={this.state.indeterminate_wl}
                      onChange={this.onCheckAllChange_wl}
                      checked={this.state.checkAll_wl}
                    >
                      全部
                    </Checkbox>
                  </Col>
                  <Col>
                    <CheckboxGroup options={WL} value={this.state.network} onChange={this.handleNetwork} />
                  </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginBottom:24}}>
            <Col span={3} className={styles.tabTitle}>范围：</Col>
            <Col span={7}>
                <Row style={{paddingTop:10}}>
                  <Col>
                    <Checkbox
                      indeterminate={this.state.indeterminate_fw}
                      onChange={this.onCheckAllChange_fw}
                      checked={this.state.checkAll_fw}
                    >
                      全部
                    </Checkbox>
                  </Col>
                  <Col>
                    <CheckboxGroup options={FW} value={this.state.range} onChange={this.handleRange} />
                  </Col>
                </Row>
            </Col>
          </Row>
          <Row>
            <Col span={7} offset={3} className={styles.btn}>
              <Button type="primary" htmlType='submit' size='large'>提交</Button>
              <Button onClick={this.handleCancel} size='large'>取消</Button>
            </Col>
          </Row>
        </Form>
      </Spin>
      )
  }

  handleContentEditorChange = (e) =>{
    this.setState({
      contentEditData:e,
    })
  }
  // 平台多选
  handlePlateform = (checkedList) => {
    this.setState({
      plateform:checkedList,
      indeterminate_pt: !!checkedList.length && (checkedList.length < PT.length),
      checkAll_pt: checkedList.length === PT.length,
    });
  }
  onCheckAllChange_pt = (e) =>{
    this.setState({
      plateform: e.target.checked ? PT : [],
      indeterminate_pt: false,
      checkAll_pt: e.target.checked,
    });
  }
  // 网络多选
  handleNetwork = (checkedList) => {
    this.setState({
      network:checkedList,
      indeterminate_wl: !!checkedList.length && (checkedList.length < WL.length),
      checkAll_wl: checkedList.length === WL.length,
    });
  }
  onCheckAllChange_wl = (e) =>{
    this.setState({
      network: e.target.checked ? WL : [],
      indeterminate_wl: false,
      checkAll_wl: e.target.checked,
    });
  }
  // 范围多选
  handleRange = (checkedList) => {
    this.setState({
      range:checkedList,
      indeterminate_fw: !!checkedList.length && (checkedList.length < FW.length),
      checkAll_fw: checkedList.length === FW.length,
    });
  }
  onCheckAllChange_fw = (e) =>{
    this.setState({
      range: e.target.checked ? FW : [],
      indeterminate_fw: false,
      checkAll_fw: e.target.checked,
    });
  }
  // 改变tab页
  changeTab = (e)=>{
    this.setState({
      tabKye:e,
    })
  }
  // 提交关注消息推送
  attentionOk = (values) => {
    const { dispatch } = this.props;
    const state =  JSON.parse(sessionStorage.getItem('newsParams'));
    const { title, newsAbstract } = values;
    const _this = this;
    // 防止多次提交
    if(_this.submitAgain){
      return;
    }
    _this.submitAgain = true;
 
    dispatch({
      type:'platformManage/attentionSend',
      payload:{
        newsId:state.newsId,
        contentType:state.contentType,
        newsType:state.newsType,
        newsAbstract,
        title,
      },
      callback:(res)=>{
        setTimeout(()=>{
          _this.submitAgain = false;
        },300);
        if(res.code == 0){  
          message.success('推送成功');
          setTimeout(function(){
            _this.handleCancel();
          },1000);
        }else{
          message.error(res.message);
        }
      }
    });
  }
  render(){
    
    const { tabKye } = this.state;
    const state  = JSON.parse(sessionStorage.getItem('newsParams'));
    let hasAttention = true;
    if( state && state.attention){
      hasAttention = false;
    }
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
        <Tabs animated={false} activeKey={ tabKye+'' } onChange={this.changeTab}>
          <TabPane tab='新闻推送' key={1}>
              <div className={styles.form}>
                {this.renderAddForm()}
              </div>
            </TabPane>
            <TabPane tab='关注推送' key={2} disabled={ hasAttention ? true : false }>
              <div className={styles.form}>
                  <Attention 
                    state={state}
                    goBack={this.handleCancel}
                    attentionOk={this.attentionOk}
                  />
              </div>
            </TabPane>
          </Tabs>
        </Card>
			</PageHeaderLayout>
    )
  }
}
