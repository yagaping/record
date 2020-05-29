
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class AdminUserModalForm extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    userData: PropTypes.object,
  }

  static defaultProps = {
    userData: {},
  };

  // 处理 ok 事件
  onOk = () => {
    const self = this;
    const { userData } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.props.handleOK(values, userData);
      }
    });
  }

  render() {
    const { title, modalVisible, handleCancel, modalType } = this.props;
    const { getFieldDecorator } = this.props.form;

    // let passwordItem = null;
    // if (modalType === 'add') {
    //   passwordItem = (
    //     <FormItem
    //       labelCol={{ span: 5 }}
    //       wrapperCol={{ span: 15 }}
    //       label="密码"
    //     >
    //       {getFieldDecorator('password', {
    //         rules: [{ required: true, message: '请输入 密码!' }],
    //       })(
    //         <Input placeholder="password" />
    //       )}
    //     </FormItem>
    //   );
    // }

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
            label="用户名"
          >
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入 用户名!' }],
            })(
              <Input placeholder="username" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="昵称"
          >
            {getFieldDecorator('realName', {
              rules: [{ required: true, message: '请输入 昵称!' }],
            })(
              <Input placeholder="realName" style={{width: '295px'}} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="手机号"
          >
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入 手机号!' }],
            })(
              <Input placeholder="phone" style={{width: '295px'}} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="状态"
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请输入 状态!' }],
            })(
              <Select>
                <Option value={0}>正常</Option>
                <Option value={1}>禁用</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const AdminUserModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { username, phone, realName, status } = props.userData;
    return {
      username: Form.createFormField({
        value: username,
      }),
      phone: Form.createFormField({
        value: phone,
      }),
      realName: Form.createFormField({
        value: realName,
      }),
      status: Form.createFormField({
        value: status,
      }),
    };
  },

})(AdminUserModalForm);
export default AdminUserModal;
