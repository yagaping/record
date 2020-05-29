import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

const STATUS_MAP = {
  REMOVE: {
    text: '删除',
    value: 'default',
    status: 'REMOVE',
  },
};

class AdminLoginLogTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { data: { pagination } } = this.props;

    const totalCallNo = pagination.total - selectedRows.length;
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }
  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading, onTableChange } = this.props;

    const columns = [
      {
        key:'name',
        title: '用户名',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <div>{row.username}</div>
              </div>
            </div>
          );
        },
      },
      {
        key:'ip',
        title: 'ip',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.ip}</div>
            </div>
          );
        },
      },
      {
        key:'time',
        title: '时间',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.createTime}</div>
            </div>
          );
        },
      },
      {
        key:'status',
        title: '状态',
        width: '20%',
        render: (key, row) => {
          let statusText = null;
          if (row.status === 0) {
            statusText = '登陆成功';
          } else if (row.status === 1) {
            statusText = '登陆失败';
          } else if (row.status === 2) {
            statusText = '解冻登陆失败用户';
          } else if (row.status === 3) {
            statusText = '登陆成功一次自动解冻之前登陆失败记录';
          }
          return (
            <div>
              <div>{statusText}</div>
            </div>
          );
        },
      },
      // {
      //   title: '操作',
      //   width: '20%',
      //   render: (row) => {
      //     return this.props.operation(row);
      //   },
      // },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={adminUser => adminUser.id}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={onTableChange}
        />
      </div>
    );
  }
}

AdminLoginLogTable.STATUS_MAP = STATUS_MAP;
export default AdminLoginLogTable;
