import React, { Component } from 'react';
import { Input, Form, Card, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(state => ({
  hotWordAdd: state.hotWordAdd,
}))
class HotWordAdd extends Component {
  handleAdd = () => {
    const { dispatch } = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'hotWordAdd/add',
          payload: {
            goBack: this.handleGoBack,
            values,
          },
        });
      }
    });
  };

  handleGoBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { loading } = this.props.hotWordAdd;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout
        title="热词-添加"
        content="添加后的热词不会马上发布，需要手动发布。"
      >
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
            <FormItem>
              <Button type="primary" icon="plus" loading={loading} onClick={this.handleAdd}>添加</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="default" icon="rollback" onClick={this.handleGoBack}>返回</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(HotWordAdd);
