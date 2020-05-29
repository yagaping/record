import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

const STATUS_MAP = {
  REMOVE: {
    text: '删除',
    value: 'default',
    status: 'REMOVE',
  },
};

class NewsContentQuestionTable extends PureComponent {
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
    const query = {
      index: this.props.query.searchIndex,
      contentAbstract: this.props.query.searchContentAbstract,
      status: this.props.query.searchStatus,
      size: this.props.query.searchSize,
      newsId: this.props.query.searchNewsId,
      newsListQuery: this.props.newsListQuery,
    };

    const columns = [
      {
        title: '标题',
        width: '30%',
        render: (key, row) => {
          const titleLink = (
            <Link to={{ pathname: `/news/content-question-image-list/${row.newsContentQuestionId}`, query }}>
              {row.title}
            </Link>
          );
          return (
            <div>
              <div>
                {titleLink}
              </div>
            </div>
          );
        },
      },
      {
        title: '文本',
        width: '60%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.text}</div>
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
          rowKey={newsContentQuestion => newsContentQuestion.newsContentQuestionId}
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

NewsContentQuestionTable.STATUS_MAP = STATUS_MAP;
export default NewsContentQuestionTable;
