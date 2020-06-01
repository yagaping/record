import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  message,
  Input, 
  Modal,
  Select,
} from 'antd';
import styles from '../../SystemManagement/TableList.less';
const { TextArea } = Input;
const { Option } = Select;
@Form.create()
export default class SelectModal extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    phoneValue:''
  };
   validatemobile(mobile){
          if(!mobile) return;
          let phoneArr = mobile.replace(/[ \f\n\r\t\v]/ig,'').replace(/,|，/ig,',').split(',').filter(item=> item && item);
          for(let i=0;i<phoneArr.length;i++){
            if(phoneArr[i].length!=11)
            {
                message.error('请输入有效的手机号码！');
                return false;
            }
            
            let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if(!myreg.test(phoneArr[i]))
            {
               message.error('请输入有效的手机号码！');
               return false;
            }
          }
          return phoneArr;
      } 
  handleOk = () =>{
    const { form, allSend } = this.props;
    form.validateFields((err, values) => {
      if(!allSend){
        if(err) return;
      }
      
      const { phone } = values;
     
      if(!allSend){
        if( !this.validatemobile(phone)) return;
      }
      this.setState({phoneValue:''})
      form.resetFields();
      this.props.sendSpecifyOk(this.validatemobile(phone),values);
    })
   
  }
  onCancel = () =>{
    this.setState({phoneValue:''})
    this.props.sendSpecifyNo()
  }
  phoneItem = (elm) => {
    const { form:{ getFieldValue, setFieldsValue }} = this.props;
    let text = elm.target.innerHTML.trim();
    let phone = getFieldValue('phone');
    
    if( phone.indexOf(text) == -1 ){
      phone = phone ?  (phone + ',' + text) : text;
      this.setState({
        phoneValue:phone
      },()=> setFieldsValue({phone}));
     }
  }
  renderForm(){
    const { customerList = [], form, allSend } = this.props;
    const { getFieldDecorator } = form;
    const { phoneValue } = this.state;
    let historyPhone = localStorage.getItem('historyPhone');
    historyPhone = historyPhone ? JSON.parse(historyPhone) : [];
    return  (<Form>
      {
        customerList.length ? (
          <Form.Item label="客服列表">
            {getFieldDecorator('customer',{
              initialValue: customerList.length ? customerList[0].userId : null
            })(  
              <Select>
                {
                  customerList.map(item=>{
                    return (
                    <Option key={item.userId} value={item.userId}>{item.nickName}</Option> 
                    )
                  })
                }
                
              </Select>
            )}
          </Form.Item>
        ) : null
      }
      {
        (!allSend || allSend == 'one') && (<Fragment>
        <Form.Item label="手机号码">
          {getFieldDecorator('phone',{
             initialValue:phoneValue,
             rules:[{ required: true, message: '请输入手机号码!' }]
          })(  
          <TextArea
          placeholder="输入手机号码，多个逗号隔开"
          autosize={{ minRows: 3, maxRows: 5 }}
          />
          )}
        </Form.Item>
        {
          historyPhone.length ? (
          <div>
            {
              historyPhone.map(item => <span key={item} className={styles.historyPhone} onClick={this.phoneItem}>{item}</span>)
            }
          </div>
          ) : null
        }
        </Fragment>
        )
      }
      </Form>);
  }
  render() {
    const { visible, loading } = this.props;
    return (
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.onCancel}
              confirmLoading={loading}
              destroyOnClose
            >
                { this.renderForm() }
            </Modal>
      );
  }
}
