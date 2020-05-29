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
    const { hotWord } = props;
    return {
      word: Form.createFormField({
        ...hotWord.word,
        value: hotWord.word,
      }),
      linkUrl: Form.createFormField({
        ...hotWord.linkUrl,
        value: hotWord.linkUrl,
      }),
      type: Form.createFormField({
        ...hotWord.type,
        value: hotWord.type,
      }),
      sort: Form.createFormField({
        ...hotWord.sort,
        value: hotWord.sort,
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
          label="热词"
        >
          {getFieldDecorator('word', {
            rules: [{ required: true, message: '请输入热词.' }],
          })(
            <Input placeholder="请输入热词" />
          )}
        </FormItem>
        <FormItem
          label="链接地址"
        >
          {getFieldDecorator('linkUrl', {
            rules: [{ required: true, message: '请输入链接地址.' }],
          })(
            <Input.TextArea placeholder="请输入热词链接地址" />
          )}
        </FormItem>
        <FormItem
          label="排序(越大越靠前)"
        >
          {getFieldDecorator('sort', {
            rules: [{ required: true, message: '请输入排序.' }],
          })(
            <InputNumber min={1} max={100} placeholder="请输入排序" />
          )}
        </FormItem>
        <FormItem
          label="热词类型"
        >
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入热词.' }],
          })(
            <Select>
              <SelectOption value={1}>正常</SelectOption>
              <SelectOption value={0}>Hot</SelectOption>
            </Select>
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
  hotWordEdit: state.hotWordEdit,
}))
class HotWordEdit extends Component {
  componentWillMount() {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'hotWordEdit/query',
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
          type: 'hotWordEdit/edit',
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
    this.props.history.goBack();
  };

  render() {
    return (
      <PageHeaderLayout
        title="热词-修改"
        content="发布后的【热词】修改会立即更新。"
      >
        <CustomizedForm
          {...this.props.hotWordEdit}
          onChange={this.handleFormChange}
          handleSubmit={this.handleSubmit}
          handleGoBack={this.handleGoBack}
        />
      </PageHeaderLayout>
    );
  }
}

export default HotWordEdit;
