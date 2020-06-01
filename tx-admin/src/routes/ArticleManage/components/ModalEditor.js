import React, { PureComponent } from 'react';
import { Form, Input, Modal,Row, Col } from 'antd';
import styles from '../index.less';
const FormItem = Form.Item;
const { TextArea } = Input;
// import WangEditor from '../../../components/WangEditor';
import Ueditor from '../../../components/Ueditor';
import UploadFile from '../../../components/UploadFile';
@Form.create()
export default class ModalEditor extends PureComponent {
 

  state = {
    
  };
  // 确定
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.props.okHandle(values,form);
  });
  }
  // 取消
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  }
  render() {
    const { form, modalVisible,fileList,getImgUrl, setFileList,  richText, content, modifyTitle, modifyNote, modifLabel, btn } = this.props;
    return (
      <Modal 
            visible={modalVisible} 
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            title={btn == "add" ? "添加" : "编辑"}
            width={1050}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="标题">
                {form.getFieldDecorator('modifyTitle', {
                    rules: [{ required: true, message: '请输入标题' }],
                    initialValue: modifyTitle,
                })(<Input placeholder='请输入标题'/>)}
            </FormItem>
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="图片">
              <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
            </FormItem>
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="标签">
                {form.getFieldDecorator('modifLabel', {
                    initialValue: modifLabel,
                })(<Input placeholder='请输标签,以逗号隔开'/>)}
            </FormItem>
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="描述">
              {form.getFieldDecorator('modifyNote', {
                      initialValue:modifyNote,
                  })(<TextArea placeholder="请输描述" rows={4}/>)}
            </FormItem>
            <Row>
              <Col span={3} className="ant-form-item-label"><label>内容</label></Col>
              <Col span={19}><Ueditor id="uediotr_1" richText={richText} content={content} modalVisible={modalVisible} height={420} draft={true} /></Col>
            </Row>
            {/* <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="内容">
              <WangEditor richText={richText} content={content} modalVisible={modalVisible} type="news"/>
            </FormItem>
                 */}
        </Modal>
    );
  }
}



