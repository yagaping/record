import React, { Component } from 'react';
import { Input, InputNumber, Form, Card, Button, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const { Option } = Select;


const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange) {
      props.onChange(changedFields);
    }
  },
  mapPropsToFields(props) {
    const { newsVideo } = props;
    return {
      authAccess: Form.createFormField({
        value: newsVideo.authAccess,
      }),
      newsId: Form.createFormField({
        value: newsVideo.newsId,
      }),
      newsContentVideoId: Form.createFormField({
        value: newsVideo.newsContentVideoId,
      }),
      videoImage: Form.createFormField({
        value: newsVideo.videoImage,
      }),
      videoUrl: Form.createFormField({
        value: newsVideo.videoUrl,
      }),
      fileUrl: Form.createFormField({
        value: newsVideo.fileUrl,
      }),
      durationTime: Form.createFormField({
        value: newsVideo.durationTime,
      }),
      videoImageWidth: Form.createFormField({
        value: newsVideo.videoImageWidth,
      }),
      videoImageHeight: Form.createFormField({
        value: newsVideo.videoImageHeight,
      }),
      videoIntroduce: Form.createFormField({
        value: newsVideo.videoIntroduce,
      }),
      videoFormat: Form.createFormField({
        value: newsVideo.videoFormat,
      }),
    };
  },
})((props) => {
  const { loading, handleSubmit, handleGoBack } = props;
  const { getFieldDecorator } = props.form;
  return (
    <Card>
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
            <Input placeholder="durationTime" />
          )}
        </FormItem>
        <FormItem
          label="图片宽度"
        >
          {getFieldDecorator('videoImageWidth', {
            rules: [{ required: true, message: '请输入 图片宽度!' }],
          })(
            <Input placeholder="videoImageWidth" />
          )}
        </FormItem>
        <FormItem
          label="图片高度"
        >
          {getFieldDecorator('videoImageHeight', {
            rules: [{ required: true, message: '请输入 图片宽度!' }],
          })(
            <Input placeholder="videoImageHeight" />
          )}
        </FormItem>
        <FormItem
          label="授权访问"
        >
          {getFieldDecorator('authAccess', {
            rules: [{ required: true, message: '请输入 授权访问!' }],
          })(
            <Select>
              <Option value={0}>不用授权</Option>
              <Option value={1}>需要授权</Option>
            </Select>
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
        <FormItem>
          <Button type="primary" icon="edit" loading={loading} onClick={handleSubmit.bind(this, props.form)}>修改</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="default" icon="rollback" onClick={handleGoBack}>返回</Button>
        </FormItem>
      </Form>
    </Card>
  );
});

@connect(state => ({
  newsEdit: state.newsEdit,
}))
class NewsContentVideoEdit extends Component {
  componentWillMount() {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsEdit/queryNewsContentVideoById',
      payload: {
        params,
      },
    });
  }

  handleSubmit = (form) => {
    const { dispatch } = this.props;
    const { params } = this.props.match;

    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        console.log('params', values);
        dispatch({
          type: 'newsEdit/editVideo',
          payload: {
            goBack: this.handleGoBack,
            values: {
              ...values,
              ...params,
            },
          },
        });
      }
    });
  };

  handleFormChange = () => {
  };

  handleGoBack = () => {
    if (this.props.location.query === null || this.props.location.query === undefined) {
      this.props.history.push({
        pathname: '/news/news-list',
      });
    } else {
      this.props.history.push({
        pathname: `/news/content-video-list/${this.props.location.query.newsId}`,
        query: this.props.location.query,
      });
    }

  };

  render() {
    return (
      <PageHeaderLayout
        title=""
        content=""
      >
        <CustomizedForm
          {...this.props.newsEdit}
          onChange={this.handleFormChange}
          handleSubmit={this.handleSubmit}
          handleGoBack={this.handleGoBack}
        />
      </PageHeaderLayout>
    );
  }
}

export default NewsContentVideoEdit;
