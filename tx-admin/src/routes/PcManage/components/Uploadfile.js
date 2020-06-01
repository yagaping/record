import React, { PureComponent } from 'react';
import {
  Form,
  Upload,
  Icon,
  Input, 
  Card,
  Switch,
  Button,
  Row,
  Col,
  Modal,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './Uploadfile.less';
const { TextArea } = Input;
@connect(({ pcmanage, loading }) => ({
  pcmanage,
  loading: loading.models.pcmanage,
}))
@Form.create()
export default class Uploadfile extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    version:'',
    describe:'',
    type:false,
    fileList: [],
  };
  

  handleChange = info => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    if(fileList.length){
      fileList[0].name = fileList[0].originFileObj.name;
    }
    this.checkFile(fileList);
    this.setState({ fileList});
  };

  checkFile = (fileList) => {
    const { form } = this.props;
    if(fileList.length){
      form.setFields({
        fileList: {
          errors: [new Error('')],
        },
      });
    }else{
      form.setFields({
        fileList: {
          errors: [new Error('请选择上传文件！')],
        },
      });
    }
  }
  handleOk = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const { version, describe, type} = fieldsValue;
      const { fileList } = this.state;
      this.checkFile(fileList);
      if( err || !fileList.length || (fileList.length && fileList[0].status === 'error')) return;
      const formData = new FormData();
      formData.append('videoFile',fileList[0].originFileObj);
      formData.append('version',version);
      formData.append('operate',type ? 1 : 0);
      formData.append('details',describe);
      this.props.dispatch({
        type:'pcmanage/addFile',
        payload:formData,
        callback:res => {
          if(res.code == 0){
            this.props.getData();
            this.onCancel();
          }
        }
      })
    });

  }
  onCancel = () => {
    this.setState({
      fileList:[],
    })
    this.props.onCancel();
  }
  
  renderForm(){
    const { getFieldDecorator } = this.props.form;
    return  (<Form>
        <Form.Item label="版本号">
          {getFieldDecorator('version', {
            rules:[{ required: true, message: '请输入版本号!' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="更新记录">
          {getFieldDecorator('describe',{
             rules:[{ required: true, message: '请输入更新内容!' }]
          })(  
          <TextArea
          placeholder="输入更新内容"
          autosize={{ minRows: 3, maxRows: 5 }}
          />
          )}
        </Form.Item>
        <Form.Item label="是否强制更新">
          {getFieldDecorator('type', { valuePropName: 'checked' })(<Switch />)}
        </Form.Item>
        <Form.Item label="文件上传">
        {getFieldDecorator('fileList')(
          <Upload onChange={this.handleChange} fileList={this.state.fileList} directory>
            <Button>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
        )}
        
        </Form.Item>
      </Form>);
  }
  render() {
    const { visible, loading } = this.props;
    return (
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.onCancel}
              destroyOnClose
              confirmLoading={loading}
            >
                { this.renderForm() }
            </Modal>
      );
  }
}
