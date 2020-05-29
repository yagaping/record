
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class NewsContentQuestionModalForm extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    newsData: PropTypes.object,
  }

  static defaultProps = {
    newsData: {},
  };

  // 处理 ok 事件
  onOk = () => {
    const self = this;
    const { newsData } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.handleOK(values, newsData);
      }
    });
  }

  render() {
    const { title, modalVisible, handleCancel } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={this.onOk}
        onCancel={handleCancel}
      >
        <Form>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="标题"
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入 标题!' }],
            })(
              <Input placeholder="title" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            {getFieldDecorator('text', {
              rules: [{ message: '描述不能为空!' }],
            })(
              <Input.TextArea placeholder="text" rows={6} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const NewsContentQuestionModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { title, text } = props.newsData;
    return {
      title: Form.createFormField({
        value: title,
      }),
      text: Form.createFormField({
        value: text,
      }),
    };
  },

})(NewsContentQuestionModalForm);
export default NewsContentQuestionModal;
