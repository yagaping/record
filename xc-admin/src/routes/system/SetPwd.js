import React, { Component } from 'react';
import { Input, Form, Card, Button, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {notificationError} from "../../utils/common";
import {notification} from "antd/lib/index";

const FormItem = Form.Item;
const SelectOption = Select.Option;


const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange) {
      props.onChange(changedFields);
    }
  },
  mapPropsToFields() {
  },
})((props) => {
  const { loading, handleSubmit } = props;
  const { getFieldDecorator } = props.form;

  return (
    <Card>
      <Form>
        <FormItem
          label="原密码"
        >
          {getFieldDecorator('beforePassword', {
            rules: [{ required: true, message: '请输入 原密码!' }],
          })(
            <Input placeholder="原密码" type="password" style={{width: '295px'}} />
          )}
        </FormItem>
        <FormItem
          label="新密码"
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入 新密码!' }],
          })(
            <Input placeholder="新密码" type="password" style={{width: '295px'}} />
          )}
        </FormItem>
        <FormItem
          label="重复新密码"
        >
          {getFieldDecorator('rePassword', {
            rules: [{ required: true, message: '请输入 重复新密码!' }],
          })(
            <Input placeholder="重复新密码" type="password" style={{width: '295px'}} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="edit" loading={loading} onClick={handleSubmit.bind(this, props.form)}>修改</Button>
        </FormItem>
      </Form>
    </Card>
  );
});

@connect(state => ({
  adminUserList: state.adminUserList,
}))
class SetPwd extends Component {
  componentWillMount() {
  }

  handleSubmit = (form) => {
    const { dispatch } = this.props;

    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (values.beforePassword.length < 6) {
        form.setFields({
          beforePassword: {
            value: values.beforePassword,
            errors: [new Error('长度不能小于6位')],
          },
        });
        return error;
      }
      if (values.password.length < 6) {
        form.setFields({
          password: {
            value: values.password,
            errors: [new Error('长度不能小于6位')],
          },
        });
        return error;
      }
      if (values.password === values.beforePassword) {
        form.setFields({
          password: {
            value: values.password,
            errors: [new Error('不能与原始密码一致')],
          },
        });
        return error;
      }
      if (values.rePassword.length < 6) {
        form.setFields({
          rePassword: {
            value: values.rePassword,
            errors: [new Error('长度不能小于6位')],
          },
        });
        return error;
      }
      if (values.rePassword !== values.password) {
        form.setFields({
          rePassword: {
            value: values.rePassword,
            errors: [new Error('与新密码输入不一致')],
          },
        });
        return error;
      }
      if (!error) {
        // submit the values
        dispatch({
          type: 'adminUserList/modifyPassword',
          payload: {
            body: {
              beforePassword: values.beforePassword,
              password: values.password,
            },
          },
          callback: () => {
            // query list
            this.queryList();
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
        title=""
        content=""
      >
        <CustomizedForm
          onChange={this.handleFormChange}
          handleSubmit={this.handleSubmit}
          handleGoBack={this.handleGoBack}
        />
      </PageHeaderLayout>
    );
  }
}

export default SetPwd;
