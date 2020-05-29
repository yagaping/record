import React, { Component } from 'react';
import { Input, InputNumber, Form, Card, Button, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const SelectOption = Select.Option;


const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange) {
      props.onChange(changedFields);
    }
  },
  mapPropsToFields(props) {
    const { news } = props;
    return {
      newsId: Form.createFormField({
        value: news.newsId,
      }),
      title: Form.createFormField({
        value: news.title,
      }),
      newsUrl: Form.createFormField({
        value: news.newsUrl,
      }),
      newsSource: Form.createFormField({
        value: news.newsSource,
      }),
      newsSourceUrl: Form.createFormField({
        value: news.newsSourceUrl,
      }),
      newsType: Form.createFormField({
        value: news.newsType,
      }),
      contentType: Form.createFormField({
        value: news.contentType,
      }),

      keywords: Form.createFormField({
        value: news.keywords,
      }),

      banComment: Form.createFormField({
        value: news.banComment,
      }),

      newsAbstract: Form.createFormField({
        value: news.newsAbstract,
      }),

      shareUrl: Form.createFormField({
        value: news.shareUrl,
      }),

      displayType: Form.createFormField({
        value: news.displayType,
      }),

      newsState: Form.createFormField({
        value: news.newsState,
      }),
    };
  },
})((props) => {
  const { loading, handleSubmit, handleGoBack } = props;
  const { getFieldDecorator } = props.form;
  const { news } = props;

  /**
   * 内容为图文类型且新闻类型不为答案
   * @type {null}
   */
  let appendNode = null;
  // if (news.newsType !== 5 && (news.contentType === 0 || news.contentType === 2 || news.contentType === 3)) {
  //   appendNode = (
  //     <FormItem label="内容">
  //       {getFieldDecorator('article', {
  //         rules: [{ required: true, message: '内容不能为空!' }],
  //       })(
  //         <Input.TextArea placeholder="article" rows={6} />
  //       )}
  //     </FormItem>
  //   );
  // }

  return (
    <Card>
      <Form>
        <FormItem
          label="标题"
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入 标题!' }],
          })(
            <Input placeholder="title" />
          )}
        </FormItem>
        <FormItem
          label="关键词"
        >
          {getFieldDecorator('keywords', {
            rules: [{ required: true, message: '请输入 关键词!' }],
          })(
            <Input placeholder="keywords" />
          )}
        </FormItem>
        <FormItem
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
          label="地址"
        >
          {getFieldDecorator('newsUrl', {
            rules: [{ required: true, message: '请输入 地址!' }],
          })(
            <Input placeholder="newsUrl" />
          )}
        </FormItem>
        <FormItem
          label="来源"
        >
          {getFieldDecorator('newsSource', {
            rules: [{ required: true, message: '请输入 来源!' }],
          })(
            <Input placeholder="newsSource" />
          )}
        </FormItem>
        <FormItem
          label="来源地址"
        >
          {getFieldDecorator('newsSourceUrl', {
            rules: [{ required: true, message: '请输入 来源地址!' }],
          })(
            <Input placeholder="newsSourceUrl" />
          )}
        </FormItem>
        <FormItem
          label="分享地址"
        >
          {getFieldDecorator('shareUrl', {
            rules: [{ required: true, message: '请输入 分享地址!' }],
          })(
            <Input placeholder="shareUrl" />
          )}
        </FormItem>
        <FormItem
          label="摘要"
        >
          {getFieldDecorator('newsAbstract', {
            rules: [{ required: true, message: '摘要不能为空!' }],
          })(
            <Input.TextArea placeholder="newsAbstract" rows={6} />
          )}
        </FormItem>
        {appendNode}
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
class NewsEdit extends Component {
  componentWillMount() {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsEdit/queryNewsById',
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
        dispatch({
          type: 'newsEdit/edit',
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
        pathname: '/news/news-list',
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

export default NewsEdit;
