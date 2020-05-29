import React, { PureComponent } from 'react';
import { Table, Alert, Badge } from 'antd';
import styles from './index.less';

const STATUS_MAP = {
  ACQUIRED: {
    text: '运行中',
    value: 'processing',
    status: 'ACQUIRED',
  },
  PAUSED: {
    text: '暂停',
    value: 'default',
    status: 'PAUSED',
  },
  RUN_FAIL: {
    text: '异常',
    value: 'error',
    status: 'RUN_FAIL',
  },
  REMOVE: {
    text: '删除',
    value: 'default',
    status: 'REMOVE',
  },
};

class JobTable extends PureComponent {
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

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['未启动', '运行中', '异常'];

    const columns = [
      {
        title: '任务名',
        render: (key, row) => {
          return (
            <div>
              <div>
                <small>任务名: {row.jobName}</small>
              </div>
              <div>
                <small>任务分组: {row.jobGroup}</small>
              </div>
            </div>
          );
        },
      },
      {
        title: '触发器',
        render: (key, row) => {
          return (
            <div>
              <div>
                <small>类型：{row.triggerType}</small>
              </div>
              <div>
                <small>表达式：{row.triggerValue}</small>
              </div>
            </div>
          );
        },
      },
      {
        title: '执行次数',
        dataIndex: 'executeNumber',
        sorter: true,
        align: 'right',
        render: val => `${val} 次`,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 'PAUSED',
          },
          {
            text: status[1],
            value: 'ACQUIRED',
          },
          {
            text: status[3],
            value: 'RUN_FAIL',
          },
        ],
        render(val) {
          return <Badge status={STATUS_MAP[val].value} text={STATUS_MAP[val].text} />;
        },
      },
      {
        title: '执行耗时',
        dataIndex: 'consumingTime',
        sorter: true,
        render: val => <span>{val / 1000} 秒</span>,
      },
      {
        title: '备注',
        dataIndex:'description',
        render: (key) => {
          return <div>{key||'--'}</div>;
        },
      },
      {
        title: '操作',
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
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                任务总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 项
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={job => job.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

JobTable.STATUS_MAP = STATUS_MAP;
export default JobTable;
