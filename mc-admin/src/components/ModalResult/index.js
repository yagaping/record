import 'rc-drawer-menu/assets/index.css';
import React,{PureComponent} from 'react';
import styles from './index.less';
import { Modal, Form, Select, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;
@Form.create()
export default class ModalResult extends PureComponent {
  state = {
    matchType:'REMIND',
    content:'',
    dataBool:false,
  }
  componentDidUpdate(){
    const { data } = this.props;
    const { matchType } = this.state;
    let content = data.result;
    let isResult = [];
    let obj;
    if(data && data.result && Object.keys(data.result).length>0){
      isResult = Object.keys(JSON.parse(data.result));
    }
    if(isResult.length!=0){
      obj = JSON.parse(data.result);
      let dataBool = false;
      if(isResult.indexOf('data')!=-1){
        dataBool = true;
      }
      if(isResult.length==1){
        content = JSON.parse(content);
        content.matchType = matchType;
        content.errorMsg = '';
        content = JSON.stringify(content);
      }
      this.setState({
        matchType:obj.matchType||'REMIND',
        content,
        dataBool,
      });
    }
  }
 
  // 确定修改
  handleOk = () => {
    const { hideModal, data:{id}, form, dispatch } = this.props;
    const { dataBool } = this.state;
    const { validateFields } = form;
    validateFields((error,value)=>{
      const { data, matchType } = value;
      const params = {
        id,
        matchType,
      }
      if(dataBool){
        params.data = data;
      }else{
        params.errorMsg = data;
      }
      dispatch({
        type:'textExamine/modifeResult',
        payload:{
          ...params
        },
        callback:(res)=>{
          if(res.code == 0){
            message.success('修改成功')
          }else{
            message.error(res.message)
          }
          hideModal();
        }
      })
     
      // 
    })
    
  }
  // 取消修改
  handleCancel = () => {
    const { hideModal } = this.props;
    hideModal();
  }
  render(){
    const { isShow } = this.props;
    const { matchType, content } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
    <Modal
      title='修改结果'
      visible={isShow}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      maskClosable={false}
      width={520}
      >
      <Form>
        <Form.Item
          label="类型"
        >
          {getFieldDecorator('matchType', {
              initialValue:matchType,
            })(
              <Select>
                <Option value='REMIND'>提醒</Option>
                <Option value='BIRTHDAY'>提醒（生日）</Option>
                <Option value='MARK_DAY'>提醒（纪念日）</Option>
                <Option value='BOOKKEEPING'>记账</Option>
              </Select>
            )}
        </Form.Item>
        <Form.Item
          label="结果"
        >
          {getFieldDecorator('data', {
              initialValue:content,
            })(
              <TextArea rows={4} />
            )}
        </Form.Item>
      </Form>
      </Modal>
      )
  }
}