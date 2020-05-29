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
    const { sourceUrl, contentAbstract, content } = props.newsAnswer;
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
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="内容"
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
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="default" icon="rollback" onClick={handleGoBack}>返回</Button>
        </FormItem>
      </Form>
    </Card>
  );
});



@connect(state => ({
  newsContentList: state.newsContentList,
}))
class NewsContentAnswerEdit extends Component {
  state = {
    editorContentEditorData:'',
  }
  componentWillMount() {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsContentList/queryNewsContentAnswer',
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
        const newsContentAnswerId = this.props.newsContentList.newsAnswer.newsContentAnswerId;
        dispatch({
          type: 'newsContentList/modifyNewsAnswer',
          payload: {
            goBack: this.handleGoBack,
            body: {
              content: this.editorContentEditorData,
              ...values,
              newsContentAnswerId,
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
        pathname: `/news/content-question-list/${this.props.location.query.newsId}`,
        query: this.props.location.query,
      });
    }
  };

  handleContentEditorChange = (html, text, formatText) => {
    this.editorContentEditorData = html;
  };

  render() {
    if (this.props.newsContentList.newsAnswer !== null && this.props.newsContentList.newsAnswer !== undefined) {
      this.editorContentEditorData = this.props.newsContentList.newsAnswer.content;
    }
    return (
      <PageHeaderLayout
        title=""
        content=""
      >
        <CustomizedForm
          {...this.props.newsContentList}
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

export default NewsContentAnswerEdit;
