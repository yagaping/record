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

class NewsContentQuestionImageTable extends PureComponent {
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
        width: '20%',
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
        title: '图片宽度',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.imageWidth}</div>
            </div>
          );
        },
      },
      {
        title: '图片高度',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.imageHeight}</div>
            </div>
          );
        },
      },
      {
        title: '图片类型',
        width: '20%',
        render: (key, row) => {
          let imageType = null;
          if (row.imageType === 0) {
            imageType = '小图';
          } else if (row.imageType === 1) {
            imageType = '大图';
          }
          return (
            <div>
              <div>{imageType}</div>
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
          rowKey={newsContentQuestionImage => newsContentQuestionImage.newsContentQuestionImageId}
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

NewsContentQuestionImageTable.STATUS_MAP = STATUS_MAP;
export default NewsContentQuestionImageTable;
