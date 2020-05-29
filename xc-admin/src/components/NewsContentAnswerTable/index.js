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

class NewsContentAnswerTable extends PureComponent {
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
        title: '头像',
        width: '5%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <img src={row.avatarUrl} width={100} height={100} />
              </div>
            </div>
          );
        },
      },
      {
        title: '昵称',
        width: '10%',
        render: (key, row) => {
          let nickName;
          if (row.userDataKey === '' || row.nickName.length <= 0) {
            nickName = '匿名用户';
          } else {
            nickName = row.nickName;
          }
          return (
            <div>
              <div>
                <div>{nickName}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '浏览器用户',
        width: '10%',
        render: (key, row) => {
          let browserUserText;
          if (row.browserUser === 0) {
            browserUserText = <small>不是</small>;
          } else if (row.browserUser === 1) {
            browserUserText = <small>是</small>;
          }
          return (
            <div>
              <div>{browserUserText}</div>
            </div>
          );
        },
      },
      {
        title: '评论',
        width: '5%',
        render: (key, row) => {
          let banCommentText;
          if (row.banComment === 0) {
            banCommentText = <small>允许</small>;
          } else if (row.banComment === 1) {
            banCommentText = <small>禁止</small>;
          }
          return (
            <div>
              <div>{banCommentText}</div>
            </div>
          );
        },
      },
      {
        title: '评论数',
        width: '5%',
        dataIndex: 'commentCount',
        sorter: true,
        render: val => `${val} 次`,
      },
      {
        title: '点赞数',
        width: '5%',
        dataIndex: 'likeCount',
        sorter: true,
        render: val => `${val} 次`,
      },
      {
        title: '图片数',
        width: '5%',
        dataIndex: 'imageCount',
        sorter: true,
        render: val => `${val} 次`,
      },
      {
        title: '视频数',
        width: '5%',
        dataIndex: 'videoCount',
        sorter: true,
        render: val => `${val} 次`,
      },
      {
        title: '热门',
        width: '5%',
        dataIndex: 'hot',
        sorter: true,
        render: val => `${val} 次`,
      },
      {
        title: '原地址',
        width: '10%',
        render: (key, row) => {
          if (row.sourceUrl === undefined) {
            return (
              <div>
                <div>
                  <a href={row.sourceUrl} target='_blank'>{row.sourceUrl}</a>
                </div>
              </div>
            );
          }
          let temp = row.sourceUrl.length<22?row.sourceUrl:row.sourceUrl.substring(0, 22) + '...';
          return (
            <div>
              <div>
                <a href={row.sourceUrl} target='_blank'>{temp}</a>
              </div>
            </div>
          );
        },
      },
      {
        title: '摘要',
        width: '30%',
        render: (key, row) => {
          let temp = row.contentAbstract.length<40?row.contentAbstract:row.contentAbstract.substring(0, 40) + '...';
          return (
            <div>
              <div>
                <div>{temp}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        width: '5%',
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
          rowKey={newsContentAnswer => newsContentAnswer.newsContentAnswerId}
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

NewsContentAnswerTable.STATUS_MAP = STATUS_MAP;
export default NewsContentAnswerTable;
