
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';
import ContentEditor from "../../components/ContentEditor/ContentEditor";
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

class NewsContentAnswerModalForm extends PureComponent {
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
    const { newsData, handleContentEditorChange } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.handleOK(values, newsData, newsData.content);
      }
    });
  }

  render() {
    const { title, modalVisible, handleCancel, handleContentEditorChange } = this.props;
    const { getFieldDecorator } = this.props.form;

    console.log('this.props', this.props);

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
            label="原地址"
          >
            {getFieldDecorator('sourceUrl', {
              rules: [{ required: true, message: '请输入 原地址!' }],
            })(
              <Input placeholder="sourceUrl" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="摘要"
          >
            {getFieldDecorator('contentAbstract', {
              rules: [{ required: true, message: '摘要不能为空!' }],
            })(
              <Input.TextArea placeholder="contentAbstract" rows={6} />
            )}
          </FormItem>
          {/*<FormItem*/}
            {/*labelCol={{ span: 5 }}*/}
            {/*wrapperCol={{ span: 15 }}*/}
            {/*label="内容"*/}
          {/*>*/}
            {/*{getFieldDecorator('content', {*/}
              {/*rules: [{ required: true, message: '内容不能为空!' }],*/}
            {/*})(*/}
              {/*<Input.TextArea placeholder="content" rows={6} />*/}
            {/*)}*/}
          {/*</FormItem>*/}
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="内容"
          >
            <ContentEditor className={styles.contentEditorContainer}
                           data={this.props.newsData.content}
                           onChange={handleContentEditorChange}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const NewsContentAnswerModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { sourceUrl, contentAbstract, content } = props.newsData;
    return {
      sourceUrl: Form.createFormField({
        value: sourceUrl,
      }),
      contentAbstract: Form.createFormField({
        value: contentAbstract,
      }),
      content: Form.createFormField({
        value: content,
      }),
    };
  },

})(NewsContentAnswerModalForm);
export default NewsContentAnswerModal;
