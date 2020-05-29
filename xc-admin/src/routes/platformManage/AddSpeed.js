import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import { connect } from 'dva';
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
} from 'antd';
import styles from './AddSpeed.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;


@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
}))
export default class AddSpeed extends Component{
  
  state = {
    dic_title:'添加加速',
    id:0,
    formValue:{
    },
  };

  componentDidMount(){
    const id = this.props.match.params.type||0;
    this.setState({id});
    if(id!='0'){
      this.props.dispatch({
        type:'platformManage/speedDetail',
        payload:{
          id,
        },
        callback:(res)=>{
          const beginTime = res.beginTime?moment(res.beginTime).format('YYYY-MM-DD HH:mm:ss'):null;
          const endTime = res.endTime?moment(res.endTime).format('YYYY-MM-DD HH:mm:ss'):null;
          const formValue = {
            name:res.name,
            line:res.line+'',
            network:res.network+'',
            networkType:res.networkType+'',
            networkConfig:res.networkConfig+'',
            serIp:res.serIp,
            serAgreement:res.serAgreement+'',
            serPort:res.serPort,
            serPwd:res.serPwd,
            serEncrypt:res.serEncrypt,
            serConfusion:res.serConfusion,
            hardwareCpu:res.hardwareCpu,
            hardwareMemory:res.hardwareMemory,
            hardwareDisk:res.hardwareDisk,
            hardwareNetwork:res.hardwareNetwork,
            hardwareType:res.hardwareType+'',
            load:res.load+'',
            grade:res.grade+'',
          }
          
          const dic_title = '编辑加速';
        
          this.setState({
              formValue:{...formValue},
              dic_title,
              beginTime,
              endTime,
          });
        }
      });
    }
  }

  // 校验时间
  checkTime = (rule, value, callback) => {
    if(!value[0]||!value[1]){
      callback('请选择时间');
    }
    callback();
  } 

  // 提交表单数据
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { id, time } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err) return;
      let beginTime = null;
      let endTime = null;
      if(fieldsValue.time.length&&(fieldsValue.time[0]&&fieldsValue.time[1])){
        beginTime = fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss');
      }
      const params = {
        name:fieldsValue.name,
        line:fieldsValue.line,
        network:fieldsValue.network,
        networkType:fieldsValue.networkType,
        networkConfig:fieldsValue.networkConfig,
        serIp:fieldsValue.serIp,
        serAgreement:fieldsValue.serAgreement,
        serPort:fieldsValue.serPort,
        serPwd:fieldsValue.serPwd,
        serEncrypt:fieldsValue.serEncrypt,
        serConfusion:fieldsValue.serConfusion,
        hardwareCpu:fieldsValue.hardwareCpu,
        hardwareMemory:fieldsValue.hardwareMemory,
        hardwareDisk:fieldsValue.hardwareDisk,
        hardwareNetwork:fieldsValue.hardwareNetwork,
        hardwareType:fieldsValue.hardwareType,
        load:fieldsValue.load,
        grade:fieldsValue.grade,
        beginTime,
        endTime,
      };
    
       // 判断信息填完整才能提交
       for(let i in params){
        if(!params[i]){
          message.info('请完善信息再提交！');
          return;
        }
      }
      dispatch({
        type:'platformManage/saveOrUpdateNetworkSpeed',
        payload:{
          ...params,
          id,
        },
        callback:(res) => {
          if(res.code === 0){
            message.success('提交成功！');
            this.props.history.push({
              pathname: '/platformManage/speed-manage'
            });
          }else{
            message.error('提交失败！');
          }
          
        }
      });
    })
  }
  // 取消
  handleCancel = () => {
    this.props.history.push({
      pathname: '/platformManage/speed-manage',
    });
  }


  // 表单内容Dom
  renderAddForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { 
      formValue:{ 
        name,
        line,
        network,
        networkType,
        networkConfig,
        serIp,
        serAgreement,
        serPort,
        serPwd,
        serEncrypt,
        serConfusion,
        hardwareCpu,
        hardwareMemory,
        hardwareDisk,
        hardwareNetwork,
        hardwareType,
        load,
        grade,},
        beginTime,
        endTime,
       } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 },
    };
    
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let time1 = beginTime ? moment(beginTime,dateFormat):null;
    let time2 = endTime ? moment(endTime,dateFormat):null;
  
    return (  
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="名称"
          >
          {getFieldDecorator('name', {
            initialValue:name,
            rules: [{
              required: true,
              message: '请输入名称！',
            }],
          })(
            <Input placeholder="输入名称"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="线路"
        >
          {getFieldDecorator('line', {
            initialValue:line,
            rules: [{
              required: true,
              message: '请选择线路',
            }],
          })(
            <Select>
              <Option value='0'>HK-HKT</Option>
              <Option value='1'>HK-PCCW</Option>
              <Option value='2'>HK-HKBN</Option>
              <Option value='3'>HK-WTT</Option>
              <Option value='4'>HK-CN2</Option>
              <Option value='5'>MO-CTM</Option>
              <Option value='6'>USA-CN2 GIA</Option>
              <Option value='7'>USA-CN2 GT</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="网络"
        >
          {getFieldDecorator('network', {
            initialValue:network,
            rules: [{
              required: true,
              message: '请选择网络',
            }],
          })(
            <Select >
              <Option value="0">2/3/4G</Option>
              <Option value="1">宽带</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="网络类型"
        >
          {getFieldDecorator('networkType', {
            initialValue:networkType,
            rules: [{
              required: true,
              message: '请选择网络类型',
            }],
          })(
            <Select >
              <Option value="0">联通</Option>
              <Option value="1">电信</Option>
              <Option value="2">移动</Option>
              <Option value="3">其他</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="配置"
        >
          {getFieldDecorator('networkConfig', {
            initialValue:networkConfig,
            rules: [{
              required: true,
              message: '请选择配置',
            }],
          })(
            <Select >
              <Option value="0">全部</Option>
              <Option value="1">电信/电信</Option>
              <Option value="2">电信/联通</Option>
              <Option value="3">电信/移动</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Ser配置"
        >
          {getFieldDecorator('serIp', {
            initialValue:serIp,
            rules: [{
              required: true,
              message: '请输入Ser配置',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="协议"
        >
          {getFieldDecorator('serAgreement', {
            initialValue:serAgreement,
            rules: [{
              required: true,
              message: '请选择协议',
            }],
          })(
            <Select >
              <Option value="0">SS</Option>
              <Option value="1">SSR</Option>
              <Option value="2">私有</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="端口"
          >
          {getFieldDecorator('serPort', {
            initialValue:serPort,
            rules: [{
              required: true,
              message: '请输入端口',
            }],
          })(
            <Input placeholder="端口"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          >
          {getFieldDecorator('serPwd', {
            initialValue:serPwd,
            rules: [{
              required: true,
              message: '请输入密码',
            }],
          })(
            <Input type="password" placeholder="密码"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="加密"
          >
          {getFieldDecorator('serEncrypt', {
            initialValue:serEncrypt,
            rules: [{
              required: true,
              message: '请输入加密',
            }],
          })(
            <Input placeholder="加密"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="混淆"
          >
          {getFieldDecorator('serConfusion', {
            initialValue:serConfusion,
            rules: [{
              required: true,
              message: '请输入混淆',
            }],
          })(
            <Input placeholder="混淆"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="硬件CPU"
          >
          {getFieldDecorator('hardwareCpu', {
            initialValue:hardwareCpu,
            rules: [{
              required: true,
              message: '请输入硬件CPU',
            }],
          })(
            <Input placeholder="CPU"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="硬件RAM"
          >
          {getFieldDecorator('hardwareMemory', {
            initialValue:hardwareMemory,
            rules: [{
              required: true,
              message: '请输入硬件RAM',
            }],
          })(
            <Input placeholder="内存"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="硬盘"
          >
          {getFieldDecorator('hardwareDisk', {
            initialValue:hardwareDisk,
            rules: [{
              required: true,
              message: '请输入硬盘信息',
            }],
          })(
            <Input placeholder="硬件"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="硬件网络"
          >
          {getFieldDecorator('hardwareNetwork', {
            initialValue:hardwareNetwork,
            rules: [{
              required: true,
              message: '请输入网络信息',
            }],
          })(
            <Input placeholder="网络"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="硬件类型"
          >
          {getFieldDecorator('hardwareType', {
            initialValue:hardwareType,
            rules: [{
              required: true,
              message: '请输入硬件类型',
            }],
          })(
            <Select >
              <Option value="0">kvm</Option>
              <Option value="1">OVZ</Option>
              <Option value="2">独服</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="负载"
          >
          {getFieldDecorator('load', {
            initialValue:load,
            rules: [{
              required: true,
              message: '请输入负载信息',
            }],
          })(
            <Select >
              <Option value="0">推荐负载</Option>
              <Option value="1">负载</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="等级"
          >
          {getFieldDecorator('grade', {
            initialValue:grade,
            rules: [{
              required: true,
              message: '请选择等级',
            }],
          })(
            <Select >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="时间"
          >
          {getFieldDecorator('time', {
            initialValue:[time1, time2],
            rules: [{validator: this.checkTime}],
          })(
            <RangePicker 
              style={{width:'100%'}}
              format="YYYY-MM-DD HH:mm:ss" 
              showTime
              placeholder={['开始时间', '结束时间']}
            />
          )}
        </FormItem>
        <Row>
          <Col span={5} offset={3} className={styles.btn}>
            <Button type="primary" htmlType='submit' size='large'>提交</Button>
            <Button onClick={this.handleCancel} size='large'>取消</Button>
          </Col>
        </Row>
      </Form>
      )
  }

  render(){
    const { dic_title } = this.state;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.titleDic}>{dic_title}</div>
          <div className={styles.form}>
            {this.renderAddForm()}
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
