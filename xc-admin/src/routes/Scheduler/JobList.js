import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Divider, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import JobTable from '../../components/JobTable';
import JobModal from '../../components/JobModal';

import styles from './JobList.less';

const JOB_RUN_TYPE = {
  JOB_DETAIL: {
    value: 0,
  },
  BEAN_MANAGER: {
    value: 1,
  },
};

const SELECTED_OPERATION = {
  JB: 'jobDetail',
  BM: 'beanManager',
  RESUME: 'resume',
  PAUSE: 'pause',
};

const MODAL_TYPE = {
  ADD: 'add',
  MODIFY: 'modify',
};
const FormItem = Form.Item;
const { STATUS_MAP } = JobTable;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { confirm } = Modal;

@connect(state => ({
  jobList: state.jobList,
}))
@Form.create()
export default class JobList extends PureComponent {
  state = {
    modalTitle: '标题',
    modalType: MODAL_TYPE.ADD, // add modify
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    jobModifyData: {},
    jobAddData: {},
  };

  componentDidMount() {
    // 查询 job list
    this.queryJobList();
  }

  queryJobList() {
    const { dispatch, jobList } = this.props;
    const { data:{index} } = jobList;
    dispatch({
      type: 'jobList/fetch',
      payload: {
        index,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
   
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      index: pagination.current-1,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'jobList/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'jobList/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    confirm({
      title: '暂不支持次操作！',
      content: `找管理员写代码. ${e.key}`,
      onOk() {},
      onCancel() {},
    });

    // switch (e.key) {
    //   case SELECTED_OPERATION.BM:
    //     break;
    //   case SELECTED_OPERATION.JB:
    //     break;
    //   case SELECTED_OPERATION.PAUSE:
    //     break;
    //   case SELECTED_OPERATION.RESUME:
    //     break;
    // }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  // 查询
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'jobList/fetch',
        payload: {
          index: 0,
          body: {
            ...values,
          },
        },
      });
    });
  }

  // modal 操作
  handleModalAdd = (newValues) => {
    this.props.dispatch({
      type: 'jobList/add',
      payload: {
        body: {
          ...newValues,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryJobList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  handleModalModify = (newValues, oldValue) => {
    // 修改需要注意：后台有 两属性不一致.
    this.props.dispatch({
      type: 'jobList/modify',
      payload: {
        body: {
          ...newValues,
          schedulerId: oldValue.id,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryJobList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  handleModalModifyShow = (row) => {
    this.setState({
      modalTitle: `修改 ${row.jobName}`,
      modalVisible: true,
      jobModifyData: row,
      modalType: MODAL_TYPE.MODIFY,
    });
  }

  handleModalAddShow = () => {
    this.setState({
      modalTitle: '添加 job',
      modalVisible: true,
      modalType: MODAL_TYPE.ADD,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  // JobTable 操作内容
  handleResumeJob = (row) => {
    this.props.dispatch({
      type: 'jobList/resume',
      payload: {
        ...row,
      },
      callback: () => {
        // 查询 job list
        this.queryJobList();
      },
    });
  };

  handlePauseJob = (row) => {
    this.props.dispatch({
      type: 'jobList/pause',
      payload: {
        ...row,
      },
      callback: () => {
        // 查询 job list
        this.queryJobList();
      },
    });
  };

  handleJobRun = (row, runType) => {
    this.props.dispatch({
      type: 'jobList/runJob',
      payload: {
        ...row,
        body: {
          runType,
          jobGroup: row.jobGroup,
        },
      },
      callback: () => {
        // 查询 job list
        this.queryJobList();
      },
    });
  };

  handleJobRemove = (row) => {
    this.props.dispatch({
      type: 'jobList/remove',
      payload: {
        jobName: row.jobName,
        jobGroup: row.jobGroup,
      },
      callback: () => {
        console.log('callback remove', this);
        // 查询 job list
        this.queryJobList();
      },
    });
  }

  handleTableOperation = (row) => {
    const moreMenu = (
      <Menu>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleJobRun.bind(this, row, JOB_RUN_TYPE.JOB_DETAIL.value)}
          >
            执行(JD)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleJobRun.bind(this, row, JOB_RUN_TYPE.BEAN_MANAGER.value)}
          >
            执行(BM)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModalModifyShow.bind(this, row)}
          >
            修改
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleJobRemove.bind(this, row)}
          >
            删除
          </a>
        </Menu.Item>
      </Menu>
    );

    const ResumeJob = <a onClick={this.handleResumeJob.bind(this, row)}>重启</a>;
    const PauseJob = <a onClick={this.handlePauseJob.bind(this, row)}>暂停</a>;
    return (
      <div>
        {row.status !== STATUS_MAP.ACQUIRED.status ? ResumeJob : PauseJob}
        <Divider type="vertical" />
        <Dropdown overlay={moreMenu}>
          <a className="ant-dropdown-link">
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务名">
              {getFieldDecorator('jobName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运行状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="ACQUIRED">运行中</Option>
                  <Option value="PAUSED">暂停</Option>
                  <Option value="RUN_FAIL">异常</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { jobList: { loading: jobListLoading, data } } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType, jobModifyData, jobAddData } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key={SELECTED_OPERATION.PAUSE}>全部暂停</Menu.Item>
        <Menu.Item key={SELECTED_OPERATION.RESUME}>全部启动</Menu.Item>
        <Menu.Item key={SELECTED_OPERATION.BM}>全部执行(BM)</Menu.Item>
        <Menu.Item key={SELECTED_OPERATION.JB}>全部执行(JD)</Menu.Item>
      </Menu>
    );

    const content = (
      <div>
        <p>
          用于对定时任务管理 <strong>开发人员使用</strong>。
        </p>
        <p>
          <code>BeanManager</code> 执行和 <code>Job</code> 执行的差别，
          <code>BeanManager</code> 执行会是已 <code>ApplicationContent</code> 执行（检查: BM），
          <code>JobDetail</code> 执行时已定时器调度执行（触发器形式调用）（简称: JD）。
        </p>
      </div>
    );

    return (
      <PageHeaderLayout title="定时任务" content={content}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleModalAddShow}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <JobTable
              selectedRows={selectedRows}
              loading={jobListLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              operation={this.handleTableOperation}
            />
          </div>
        </Card>

        <JobModal
          title={modalTitle}
          modalVisible={modalVisible}
          handleOK={modalType === MODAL_TYPE.ADD ? this.handleModalAdd : this.handleModalModify}
          handleCancel={() => this.handleModalVisible()}
          jobData={modalType === MODAL_TYPE.ADD ? jobAddData : jobModifyData}
        />
      </PageHeaderLayout>
    );
  }
}
