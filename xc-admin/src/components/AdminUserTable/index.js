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

class AdminUserTable extends PureComponent {
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
        title: '昵称',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.realName}</div>
            </div>
          );
        },
      },
      {
        title: '手机',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.phone}</div>
            </div>
          );
        },
      },
      {
        title: '状态',
        width: '20%',
        render: (key, row) => {
          let statusText = null;
          if (row.status === 0) {
            statusText = '正常';
          } else if (row.status === 1) {
            statusText = '禁用';
          }
          return (
            <div>
              <div>{statusText}</div>
            </div>
          );
        },
      },
      {
        title: '操作',
        width: '20%',
        render: (row) => {
          return this.props.operation(row);
        },
      },
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
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={onTableChange}
        />
      </div>
    );
  }
}

AdminUserTable.STATUS_MAP = STATUS_MAP;
export default AdminUserTable;
