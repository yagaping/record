import React, { PureComponent } from 'react';
import { Table, Alert, Badge } from 'antd';
import styles from './index.less';

const STATUS_MAP = {
  REMOVE: {
    text: '删除',
    value: 'default',
    status: 'REMOVE',
  },
};

class NewsTable extends PureComponent {
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

  // handleTableChange = (pagination, filters, sorter) => {
  //   // this.props.onChange(pagination, filters, sorter);
  //   alert(pagination);
  //   const { dispatch } = this.props;
  //
  //   dispatch({
  //     type: 'newsList/query',
  //     payload: {
  //       index: 0,
  //       body: {
  //       },
  //     },
  //   });
  // }


  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading, onTableChange } = this.props;

    const columns = [
      {
        title: '封面图片',
        width: '10%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <img src={row.videoImage} width={100} height={100} />
              </div>
            </div>
          );
        },
      },
      {
        title: '视频地址',
        width: '10%',
        render: (key, row) => {
          if (row.videoUrl === undefined) {
            return (
              <div>
                <div><a href={row.videoUrl} target="_blank">{row.videoUrl}</a></div>
              </div>
            );
          }
          let temp = row.videoUrl.length<20?row.videoUrl:row.videoUrl.substring(0, 20) + '...';
          return (
            <div>
              <div><a href={row.videoUrl} target="_blank">{temp}</a></div>
            </div>
          );
        },
      },
      {
        title: '文件地址',
        width: '10%',
        render: (key, row) => {
          if (row.fileUrl === undefined) {
            return (
              <div>
                <div><a href={row.fileUrl} target="_blank">{row.fileUrl}</a></div>
              </div>
            );
          }
          let temp = row.fileUrl.length<20?row.fileUrl:row.fileUrl.substring(0, 20) + '...';
          return (
            <div>
              <div><a href={row.fileUrl} target="_blank">{temp}</a></div>
            </div>
          );
        },
      },
      {
        title: '持续时间',
        width: '10%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.durationTime}</div>
            </div>
          );
        },
      },
      {
        title: '图片大小',
        width: '10%',
        render: (key, row) => {
          return (
            <div>
              <div>{row.videoImageWidth}*{row.videoImageHeight}</div>
            </div>
          );
        },
      },
      {
        title: '授权访问',
        width: '10%',
        render: (key, row) => {
          let authAccessText = null;
          if (row.authAccess === 0) {
            authAccessText = '不用授权';
          } else if (row.authAccess === 1) {
            authAccessText = '需要授权';
          }
          return (
            <div>
              <div>{authAccessText}</div>
            </div>
          );
        },
      },
      {
        title: '视频格式',
        width: '10%',
        render: (key, row) => {
          let formatText = null;
          if (row.videoFormat === 0) {
            formatText = 'MP4';
          }
          return (
            <div>
              <div>{formatText}</div>
            </div>
          );
        },
      },
      {
        title: '介绍',
        width: '20%',
        render: (key, row) => {
          return (
            <div>
              <div>
                <small>{row.videoIntroduce}</small>
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
          rowKey={newsContentVideo => newsContentVideo.newsContentVideoId}
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

NewsTable.STATUS_MAP = STATUS_MAP;
export default NewsTable;
