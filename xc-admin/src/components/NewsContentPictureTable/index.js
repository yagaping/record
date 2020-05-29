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

class NewsContentPictureTable extends PureComponent {
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
        title: '图片',
        width: '10%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <img src={row.imageUrl} width={100} height={100} />
              </div>
            </div>
          );
        },
      },
      {
        title: '图片大小',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.imageWidth}*{row.imageHeight}</div>
            </div>
          );
        },
      },
      {
        title: '排序',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.order}</div>
            </div>
          );
        },
      },
      {
        title: '描述',
        width: '40%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <small>{row.describe}</small>
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        width: '10%',
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
          rowKey={newsContentPicture => newsContentPicture.newsContentPictureId}
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

NewsContentPictureTable.STATUS_MAP = STATUS_MAP;
export default NewsContentPictureTable;
