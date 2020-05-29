import React, { PureComponent } from 'react';
import { 
  Modal,
  Row,
  Col,
  Input,
  Button,
  Form,
} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};
import styles from './index.less';
@Form.create()
class Attention extends PureComponent {
  // 提交关注推送
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, attentionOk } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      attentionOk(values);
    })
  }
  // 取消关注推送
  handleCancel = () => {
    this.props.goBack();
  }
  render() {
    const { state, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit}>
         <FormItem
            {...formItemLayout}
            label="标题"
            >
            {getFieldDecorator('title', {
              initialValue:state.title,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="摘要"
            >
            {getFieldDecorator('newsAbstract', {
              initialValue:state.newsAbstract,
            })(
              <TextArea  rows={4} />
            )}
          </FormItem>
          <Row>
            <Col span={7} offset={3} className={styles.btn}>
              <Button type="primary" htmlType='submit' size='large'>提交</Button>
              <Button onClick={this.handleCancel} size='large'>取消</Button>
            </Col>
          </Row>
      </Form>
    );
  }
}

export default Attention;
