import React, { Component } from 'react';
import { Input, InputNumber, Form, Card, Button, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ContentEditor from "../../components/ContentEditor/ContentEditor";
import styles from './NewsContentArticleEdit.less';

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
    if (news !== null) {
      return {
        newsId: Form.createFormField({
          value: news.newsId,
        }),
        newsContentArticleId: Form.createFormField({
          value: news.newsContentArticleId,
        }),
        title: Form.createFormField({
          value: news.title,
        }),

        articleType: Form.createFormField({
          value: news.articleType,
        }),

        article: Form.createFormField({
          value: news.article,
        }),
      };
    }
  },
})((props) => {
  const { loading, handleSubmit, handleGoBack, handleContentEditorChange } = props;
  const { editorContentEditorData } = props;
  const { getFieldDecorator } = props.form;
  return (
    <Card>
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
          label="类型"
        >
          {getFieldDecorator('articleType', {
            rules: [{ required: true, message: '请输入 类型!' }],
          })(
            <Select>
              <Option value={0}>html</Option>
            </Select>
          )}
        </FormItem>
        {/*<FormItem*/}
          {/*labelCol={{ span: 5 }}*/}
          {/*wrapperCol={{ span: 15 }}*/}
          {/*label="描述"*/}
        {/*>*/}
          {/*{getFieldDecorator('article', {*/}
            {/*rules: [{ required: true, message: '描述不能为空!' }],*/}
          {/*})(*/}
            {/*<Input.TextArea placeholder="article" rows={12} />*/}
          {/*)}*/}
        {/*</FormItem>*/}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
        >
          <ContentEditor className={styles.contentEditorContainer}
                         data={editorContentEditorData}
                         onChange={handleContentEditorChange}
          />
        </FormItem>
        <FormItem
          wrapperCol={{ span: 15, align: 'center' }}
        >
          <Button type="primary" icon="edit" loading={loading} onClick={handleSubmit.bind(this, props.form)}>修改</Button>
          {/*<Button type="primary" icon="edit" loading={loading}>修改</Button>*/}
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
class NewsContentArticleEdit extends Component {
  componentWillMount() {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsEdit/queryNewsById',
      payload: {
        params,
      },
    });
  }

  state = {
    editorContentEditorData: "",
  };


  handleSubmit = (form) => {
    const { dispatch } = this.props;
    const { params } = this.props.match;

    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        const newsContentArticleId = this.props.newsEdit.news.newsContentArticleId;
        dispatch({
          type: 'newsEdit/saveOrUpdateNewsArticleContent',
          payload: {
            goBack: this.handleGoBack,
            values: {
              ...values,
              ...params,
              article: this.editorContentEditorData,
              newsContentArticleId,
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

  handleContentEditorChange = (html, text, formatText) => {
    // this.setState({editorContentEditorData: html});
    this.editorContentEditorData = html;
  };

  render() {
    if (this.props.newsEdit.news !== null && this.props.newsEdit.news !== undefined) {
      this.editorContentEditorData = this.props.newsEdit.news.article;
    }
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
          handleContentEditorChange={this.handleContentEditorChange}
          editorContentEditorData={this.editorContentEditorData}
        />
      </PageHeaderLayout>
    );
  }
}

export default NewsContentArticleEdit;
