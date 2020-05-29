import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AdminUserTable from "../../components/AdminUserTable";
import AdminUserModal from "../../components/AdminUserModal";
import styles from './SystemList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const MODAL_TYPE = {
  ADD: 'add',
  MODIFY: 'modify',
};

@connect(state => ({
  adminUserList: state.adminUserList,
}))
@Form.create()
export default class SystemList extends PureComponent {
  state = {
    modalTitle: '标题',
    modalType: MODAL_TYPE.ADD, // add modify
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    userModifyData: {},
    userAddData: {},
    searchUsername: null,
    searchStatus: -1,
  };

  componentDidMount() {
    // 查询 job list
    this.queryList();
  }

  queryList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminUserList/query',
      payload: {
        username: this.state.searchUsername,
        status: this.state.searchStatus,
      },
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'adminUserList/query',
      payload: {
        username: this.state.searchUsername,
        status: this.state.searchStatus,
      },
    });
  }

  handleResetPassword = (row) => {
    this.props.dispatch({
      type: 'adminUserList/resetPwd',
      payload: {
        body: {
          id: row.id,
        },
      },
      callback: () => {
        // query list
        this.queryList();
      },
    });
  }

  handleModifyStatus = (row, status) => {
    this.props.dispatch({
      type: 'adminUserList/modifyStatus',
      payload: {
        body: {
          id: row.id,
          status,
        },
      },
      callback: () => {
        // query list
        this.queryList();
      },
    });
  }

  handleModifyByLoginStatus = (row) => {
    this.props.dispatch({
      type: 'adminUserList/modifyUserByLoginStatus',
      payload: {
        body: {
          id: row.id,
        },
      },
      callback: () => {
        // query list
        this.queryList();
      },
    });
  }

  handleTableOperation = (row) => {
    let statusItem = null;
    if (row.status === 0) {
      statusItem = (
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModifyStatus.bind(this, row, 1)}
          >
            禁用
          </a>
        </Menu.Item>
      );
    } else if (row.status === 1) {
      statusItem = (
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModifyStatus.bind(this, row, 0)}
          >
            恢复
          </a>
        </Menu.Item>
      );
    }
    const moreMenu = (
      <Menu>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModalModifyShow.bind(this, row)}
          >
            修改
          </a>
        </Menu.Item>
        {statusItem}
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModifyByLoginStatus.bind(this, row)}
          >
            解封冻结
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleResetPassword.bind(this, row)}
          >
            重置密码
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Divider type="vertical" />
        <Dropdown overlay={moreMenu}>
          <a className="ant-dropdown-link">
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }

  // 查询
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

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

      const { username, status } = values;
      this.state.searchUsername = username;
      this.state.searchStatus = status;
      dispatch({
        type: 'adminUserList/query',
        payload: {
          index: 0,
          username: this.state.searchUsername,
          status: this.state.searchStatus,
        },
      });
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { params } = this.props.match;

    dispatch({
      type: 'adminUserList/query',
      payload: {
        index: (current - 1),
        size: pageSize,
        username: this.state.searchUsername,
        status: this.state.searchStatus,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'adminUserList/query',
      payload: {
        index: 0,
      },
    });
  }

  handleModalModifyShow = (row) => {
    this.setState({
      modalTitle: '修改',
      modalVisible: true,
      userModifyData: row,
      modalType: MODAL_TYPE.MODIFY,
    });
  }

  handleModalModify = (newValues, oldValue) => {
    // 修改需要注意：后台有 两属性不一致.
    this.props.dispatch({
      type: 'adminUserList/modify',
      payload: {
        body: {
          ...newValues,
          id: oldValue.id,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  // modal 操作
  handleModalAdd = (newValues) => {
    this.props.dispatch({
      type: 'adminUserList/save',
      payload: {
        body: {
          ...newValues,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleModalAddShow = () => {
    this.setState({
      modalTitle: '添加 用户',
      modalVisible: true,
      modalType: MODAL_TYPE.ADD,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="用户名/昵称/手机号">
              {getFieldDecorator('username')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '-1' })(
                <Select style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="0">正常</Option>
                  <Option value="1">禁用</Option>
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
  handleGoBack = () => {
    this.props.history.goBack();
  };
  render() {
    const { adminUserList } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType } = this.state;
    const { userModifyData, userAddData } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleModalAddShow}>
                新建
              </Button>
            </div>
            <AdminUserTable
              selectedRows={selectedRows}
              loading={adminUserList.loading}
              data={adminUserList.data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              operation={this.handleTableOperation}
              onTableChange={this.handleTableChange}
            />
          </div>
        </Card>

        <AdminUserModal
          title={modalTitle}
          modalVisible={modalVisible}
          handleOK={modalType === MODAL_TYPE.ADD ? this.handleModalAdd : this.handleModalModify}
          handleCancel={() => this.handleModalVisible()}
          userData={modalType === MODAL_TYPE.ADD ? userAddData : userModifyData}
          modalType={modalType}
        />
      </PageHeaderLayout>
    );
  }
}
