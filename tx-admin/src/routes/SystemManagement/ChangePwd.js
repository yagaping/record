import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Col,
  Button,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
@connect(({ changePwd, loading }) => ({
  changePwd,
  loading: loading.models.changePwd,
}))
@Form.create()
export default class ChangePwd extends PureComponent {
  state = {
    uploading: false,
  };

  _changePwd = () => {
    this.setState({ uploading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {this.setState({ uploading: false }); return;}
      dispatch({
        type: 'changePwd/ChangePwd',
        payload: {
          oldPwd: fieldsValue.oldPwd ? fieldsValue.oldPwd : "",
          passWord: fieldsValue.password ? fieldsValue.password : "",
          userName: localStorage.getItem('antd-pro-authority'),
        },
        callback: (res) => {
          if(res) {
            if (res.code == '0') {
              this.setState({ uploading: false });
              message.success('修改成功');
              this.clear();
            } else {
              this.setState({ uploading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
  }
  //清空
  clear = () => {
    this.props.form.resetFields();
  }
  //验证 
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    return (
      <PageHeaderLayout title="修改密码">
        <Form
          // onSubmit={this.changePwd}
        >
          <Col span={12} offset={6} align="middle">
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原密码">
              {this.props.form.getFieldDecorator('oldPwd', {
                rules: [{ 
                  required: true, message: '请输入原密码' 
                },{
                  validator: this.validateToNextPassword,
                }],
              })(<Input placeholder="请输入原密码" type="password"/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
              {this.props.form.getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入新密码' }],
              })(<Input placeholder="请输入新密码" type="password"/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
              {this.props.form.getFieldDecorator('passwordAgain', {
                rules: [{
                   required: true, message: '请再次输入新密码' 
                  }, {
                  validator: this.compareToFirstPassword,
                }],
              })(<Input placeholder="请再次输入新密码" type="password"/>)}
            </FormItem>
            <div align="middle" style={{marginTop:50}}>
              <Button type="primary" onClick={() => this._changePwd()} loading={this.state.uploading}>修改</Button>
              <Button type="primary" onClick={this.clear} style={{marginLeft:10}}>重置</Button>
            </div>
          </Col>
        </Form>
      </PageHeaderLayout>
    );
  }
}
