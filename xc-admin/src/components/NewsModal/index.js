
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class NewsModalForm extends PureComponent {
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
            label="关键词"
          >
            {getFieldDecorator('keywords', {
              rules: [{ required: true, message: '请输入 关键词!' }],
            })(
              <Input placeholder="keywords" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="状态"
          >
            {getFieldDecorator('newsState', {
              rules: [{ required: true, message: '请输入 类型!' }],
            })(
              <Select>
                <Option value={0}>正常</Option>
                <Option value={1}>删除</Option>
                <Option value={2}>待发布</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="类型"
          >
            {getFieldDecorator('newsType', {
              rules: [{ required: true, message: '请输入 类型!' }],
            })(
              <Select>
                <Option value={0}>头条</Option>
                <Option value={1}>娱乐</Option>
                <Option value={2}>笑话</Option>
                <Option value={3}>国际</Option>
                <Option value={4}>段子</Option>
                <Option value={5}>问答</Option>
                <Option value={20}>视频</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="内容类型"
          >
            {getFieldDecorator('contentType', {
              rules: [{ required: true, message: '请输入 内容类型!' }],
            })(
              <Select>
                <Option value={0}>图文</Option>
                <Option value={1}>大图新闻</Option>
                <Option value={2}>文字</Option>
                <Option value={3}>段子</Option>
                <Option value={20}>视频列表</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="显示类型"
          >
            {getFieldDecorator('displayType', {
              rules: [{ required: true, message: '请输入 显示类型!' }],
            })(
              <Select>
                <Option value={0}>一个小图</Option>
                <Option value={1}>一个大于</Option>
                <Option value={2}>三个小图</Option>
                <Option value={3}>文字</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="评论"
          >
            {getFieldDecorator('banComment', {
              rules: [{ required: true, message: '请输入 评论!' }],
            })(
              <Select>
                <Option value={0}>允许</Option>
                <Option value={1}>禁止</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="地址"
          >
            {getFieldDecorator('newsUrl', {
              rules: [{ required: true, message: '请输入 地址!' }],
            })(
              <Input placeholder="newsUrl" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="来源"
          >
            {getFieldDecorator('newsSource', {
              rules: [{ required: true, message: '请输入 来源!' }],
            })(
              <Input placeholder="newsSource" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="来源地址"
          >
            {getFieldDecorator('newsSourceUrl', {
              rules: [{ required: true, message: '请输入 来源地址!' }],
            })(
              <Input placeholder="newsSourceUrl" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="分享地址"
          >
            {getFieldDecorator('shareUrl', {
              rules: [{ required: true, message: '请输入 分享地址!' }],
            })(
              <Input placeholder="shareUrl" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="摘要"
          >
            {getFieldDecorator('newsAbstract', {
              rules: [{ required: true, message: '摘要不能为空!' }],
            })(
              <Input.TextArea placeholder="newsAbstract" rows={6} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const NewsModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { newsId, title, newsUrl, newsSource, newsSourceUrl, contentType } = props.newsData;
    const { keywords, banComment, newsAbstract, shareUrl, displayType, newsType } = props.newsData;
    const { newsState } = props.newsData;
    return {
      newsId: Form.createFormField({
        value: newsId,
      }),
      title: Form.createFormField({
        value: title,
      }),
      newsUrl: Form.createFormField({
        value: newsUrl,
      }),
      newsSource: Form.createFormField({
        value: newsSource,
      }),
      newsSourceUrl: Form.createFormField({
        value: newsSourceUrl,
      }),
      newsType: Form.createFormField({
        value: newsType,
      }),
      contentType: Form.createFormField({
        value: contentType,
      }),

      keywords: Form.createFormField({
        value: keywords,
      }),

      banComment: Form.createFormField({
        value: banComment,
      }),

      newsAbstract: Form.createFormField({
        value: newsAbstract,
      }),

      shareUrl: Form.createFormField({
        value: shareUrl,
      }),

      displayType: Form.createFormField({
        value: displayType,
      }),

      newsState: Form.createFormField({
        value: newsState,
      }),
    };
  },

})(NewsModalForm);
export default NewsModal;
