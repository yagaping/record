
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class JobModalForm extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    jobData: PropTypes.object,
  }

  static defaultProps = {
    jobData: {},
  };

  // 处理 ok 事件
  onOk = () => {
    const self = this;
    const { jobData } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        self.props.handleOK(values, jobData);
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
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="job 名称"
          >
            {getFieldDecorator('jobName', {
              rules: [{ required: true, message: '请输入 job name!' }],
            })(
              <Input placeholder="jobName" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="job 分组"
          >
            {getFieldDecorator('jobGroup', {
              rules: [{ required: true, message: '请输入 job group!' }],
            })(
              <Input placeholder="jobGroup" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="触发器类型"
          >
            {getFieldDecorator('triggerType', {
              rules: [{ required: true, message: '请输入 trigger name!' }],
            })(
              <Select>
                <Option value="Cron">Cron</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="触发器名称"
          >
            {getFieldDecorator('triggerName', {
              rules: [{ required: true, message: '请输入 trigger name!' }],
            })(
              <Input placeholder="triggerName" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="触发器分组"
          >
            {getFieldDecorator('triggerGroup', {
              rules: [{ required: true, message: '请输入 trigger group!' }],
            })(
              <Input placeholder="triggerGroup" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="表达式(Cron)"
          >
            {getFieldDecorator('triggerValue', {
              rules: [{ required: true, message: '请输入 cron 表达式!' }],
            })(
              <Input placeholder="triggerExpression" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '描述不能为空!' }],
            })(
              <Input.TextArea placeholder="description" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const JobModal = Form.create({
  mapPropsToFields(props) {
    // 绑定 form 数据
    const { jobName, jobGroup, triggerType,
      triggerName, triggerGroup, triggerValue, description } = props.jobData;
    return {
      jobName: Form.createFormField({
        value: jobName,
      }),
      jobGroup: Form.createFormField({
        value: jobGroup,
      }),
      triggerType: Form.createFormField({
        value: triggerType,
      }),
      triggerName: Form.createFormField({
        value: triggerName,
      }),
      triggerGroup: Form.createFormField({
        value: triggerGroup,
      }),
      triggerValue: Form.createFormField({
        value: triggerValue,
      }),
      description: Form.createFormField({
        value: description,
      }),
    };
  },

})(JobModalForm);
export default JobModal;
