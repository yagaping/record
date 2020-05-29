
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class NewsContentPictureModalForm extends PureComponent {
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
            label="图片地址"
          >
            {getFieldDecorator('imageUrl', {
              rules: [{ required: true, message: '请输入 图片地址!' }],
            })(
              <Input placeholder="imageUrl" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="宽度"
          >
            {getFieldDecorator('imageWidth', {
              rules: [{ required: true, message: '请输入 宽度!' }],
            })(
              <InputNumber placeholder="imageWidth" style={{width: '295px'}} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="高度"
          >
            {getFieldDecorator('imageHeight', {
              rules: [{ required: true, message: '请输入 高度!' }],
            })(
              <InputNumber placeholder="imageHeight" style={{width: '295px'}} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="排序"
          >
            {getFieldDecorator('order', {
              rules: [{ required: true, message: '请输入 排序!' }],
            })(
              <InputNumber placeholder="order" style={{width: '295px'}} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述信息"
          >
            {getFieldDecorator('describe', {
              rules: [{ required: true, message: '描述信息不能为空!' }],
            })(
              <Input.TextArea placeholder="describe" rows={6} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const NewsContentPictureModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { imageUrl, imageWidth, imageHeight, order, describe } = props.newsData;
    return {
      imageUrl: Form.createFormField({
        value: imageUrl,
      }),
      order: Form.createFormField({
        value: order,
      }),
      imageWidth: Form.createFormField({
        value: imageWidth,
      }),
      imageHeight: Form.createFormField({
        value: imageHeight,
      }),
      describe: Form.createFormField({
        value: describe,
      }),
    };
  },

})(NewsContentPictureModalForm);
export default NewsContentPictureModal;
