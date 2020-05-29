import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, Icon  } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span:4
  },
  wrapperCol: {
    span:17
  },
};
@Form.create()
export default class RegularItem extends Component {
  
  // 确认添加、编辑
  handleSubmit = (e) =>{
    e.preventDefault();
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) { 
        onOk(values);
      }
    });

  }
  // 添加、修改过滤
  item = () => {
    const { form, data } = this.props;
    const { id, regex, replacement }  = data;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="id"
          {...formItemLayout}
          className={id ? styles.show : styles.hide }
        >
          {getFieldDecorator('id', {
            initialValue:id,
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          label="正则"
          {...formItemLayout}
        >
          {getFieldDecorator('regex', {
            initialValue:regex,
            rules: [{ required: true, message: '请输入正则!' }],
          })(
            <TextArea rows={4}  />
          )}
        </FormItem>
        <FormItem
          label="替换字符"
          {...formItemLayout}
        >
          {getFieldDecorator('replacement', {
            initialValue:replacement,
          })(
            <TextArea  rows={4} />
          )}
        </FormItem>
      </Form>
    );
  }
  
    render(){
       const { data:{title, visible}, onOk, onCancel } = this.props;
        return (
          <Modal 
          title={title}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={onCancel}
          maskClosable={false}
          destroyOnClose={true}
          width={600}
        >
          { this.item() }
        </Modal>
        )
    }
};
