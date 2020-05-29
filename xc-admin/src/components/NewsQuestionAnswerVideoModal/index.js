
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class NewsQuestionAnswerVideoModalForm extends PureComponent {
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
            label="封面图片"
          >
            {getFieldDecorator('videoImage', {
              rules: [{ required: true, message: '请输入 封面图片!' }],
            })(
              <Input placeholder="videoImage" />
            )}
          </FormItem>
          <FormItem
            label="视频地址"
          >
            {getFieldDecorator('videoUrl', {
              rules: [{ required: true, message: '请输入 视频地址!' }],
            })(
              <Input placeholder="videoUrl" />
            )}
          </FormItem>
          <FormItem
            label="文件地址"
          >
            {getFieldDecorator('fileUrl', {
              rules: [{ required: true, message: '请输入 文件地址!' }],
            })(
              <Input placeholder="fileUrl" />
            )}
          </FormItem>
          <FormItem
            label="持续时间"
          >
            {getFieldDecorator('durationTime', {
              rules: [{ required: true, message: '请输入 持续时间!' }],
            })(
              <InputNumber placeholder="durationTime" style={{width: '473px'}} />
            )}
          </FormItem>
          <FormItem
            label="图片宽度"
          >
            {getFieldDecorator('videoImageWidth', {
              rules: [{ required: true, message: '请输入 图片宽度!' }],
            })(
              <InputNumber placeholder="videoImageWidth" style={{width: '473px'}} />
            )}
          </FormItem>
          <FormItem
            label="图片高度"
          >
            {getFieldDecorator('videoImageHeight', {
              rules: [{ required: true, message: '请输入 图片宽度!' }],
            })(
              <InputNumber placeholder="videoImageHeight" style={{width: '473px'}} />
            )}
          </FormItem>
          <FormItem
            label="视频格式"
          >
            {getFieldDecorator('videoFormat', {
              rules: [{ required: true, message: '请输入 视频格式!' }],
            })(
              <Select>
                <Option value={0}>MP4</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="视频介绍"
          >
            {getFieldDecorator('videoIntroduce', {
              rules: [{ required: true, message: '视频介绍不能为空!' }],
            })(
              <Input.TextArea placeholder="videoIntroduce" rows={6} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const NewsQuestionAnswerVideoModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { durationTime, fileUrl, newsQuestionAnswerVideoId, videoFormat } = props.newsData;
    const { videoImageHeight, videoImageWidth, videoIntroduce, videoUrl  } = props.newsData;
    const { videoImage } = props.newsData;
    return {
      durationTime: Form.createFormField({
        value: durationTime,
      }),
      fileUrl: Form.createFormField({
        value: fileUrl,
      }),
      newsQuestionAnswerVideoId: Form.createFormField({
        value: newsQuestionAnswerVideoId,
      }),
      videoFormat: Form.createFormField({
        value: videoFormat,
      }),
      videoImage: Form.createFormField({
        value: videoImage,
      }),
      videoImageHeight: Form.createFormField({
        value: videoImageHeight,
      }),
      videoImageWidth: Form.createFormField({
        value: videoImageWidth,
      }),

      videoIntroduce: Form.createFormField({
        value: videoIntroduce,
      }),

      videoUrl: Form.createFormField({
        value: videoUrl,
      }),
    };
  },

})(NewsQuestionAnswerVideoModalForm);
export default NewsQuestionAnswerVideoModal;
