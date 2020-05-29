import React, { PureComponent } from 'react';
import { Table, Alert, Badge, Modal, Button, Tooltip } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import { getTypeName } from '../../components/newsTypeName.js';
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

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  handleError = (e) => {
    Modal.error({
      title: '提示信息',
      content: '该类型不支持查看',
      okText: '好的',
    })
  }

  goToEdit = (row) => {
    let path = '';
    let href = null;
    const { newsType, contentType, title, newsId } = row;
    if (newsType != 5 && (contentType === 0 || contentType === 2 || contentType === 3)) {
       path = `/news/news-content-edit/${row.newsId}`;
    } else {
      path = `/news/news-content-view/${row.newsId}`;
    }
  
    localStorage.setItem('searchData',JSON.stringify(this.props.state));
    this.props.history.push(path);
  }

  // 源链接
  handleRowClick = (row) => {
    return (
      <a href="javascript:void(0)" onClick={this.goToEdit.bind(this,row)}>
        <Tooltip placement="top" title={row.title}>
          {row.title}
        </Tooltip>
      </a>
    );
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading, onTableChange, pageType, state:{searchNewsGroup}, addStayAttention } = this.props;
   
    const columns = [
      { 
        title: '标题',
        render: (key, row) => {
          let source = <a href={row.newsSourceUrl} target='_blank'>源链接</a>; 
          let read = row.accessCount >= 0 ?   <span style={{color:'orange'}}>[ 浏览数：{row.accessCount} ]</span> : null;
          let comment = row.commentCount >=0 ? <span style={{color:'orange'}}>[ 评论数：{row.commentCount} ]</span> : null;
          let transpond = row.shareCount >=0 ? <span style={{color:'orange'}}>[ 转发数：{row.shareCount} ]</span> : null;
          return (
            <div className={styles.newsTitle}>
              {this.handleRowClick(row)} ({source}) {read} {comment} {transpond}
            </div>
          );
        },
      },
      {
        title: '类型',
        render: (key, row) => {
          let newsTypeText = getTypeName(row.newsType);
          return (
            <div>
              <div>{newsTypeText||'--'}</div>
            </div>
          );
        },
      },
      {
        title: '内容类型',
        render: (key, row) => {
          let contentTypeText;
          if (row.contentType === 0) {
            contentTypeText = <small>图文</small>;
          } else if (row.contentType === 1) {
            contentTypeText = <small>大图新闻</small>;
          } else if (row.contentType === 2) {
            contentTypeText = <small>文字</small>;
          } else if (row.contentType === 20) {
            contentTypeText = <small>视频列表</small>;
          }
          return (
            <div>
              <div>{contentTypeText}</div>
            </div>
          );
        },
      },
      {
        title: '状态',
        width:120,
        render: (key, row) => {
          let stateText;
          if (row.newsState === 0) {
            stateText = <small className={styles.normal}>已发布</small>;
          } else if (row.newsState === 1) {
            stateText = <small className={styles.nopass}>删除</small>;
          }else if(row.newsState === 2){
            stateText = <small>源数据</small>;
          }else if(row.newsState === 3){
            stateText = <small className={styles.nopass}>人工未通过</small>;
          }else if(row.newsState === 4){
            stateText = <small>机器通过</small>;
          }else if(row.newsState === 5){
            stateText = <small className={styles.nopass}>机器未通过</small>;
          }else if(row.newsState === 6){
            stateText = <small className={styles.nopass}>机器审核异常</small>;
          }else if(row.newsState === 7){
            stateText = <small>待人工审核</small>;
          }else if(row.newsState === 8){
            stateText = <small>快速审核通过</small>;
          }
          return (
            <div>
              <div>{stateText}</div>
            </div>
          );
        },
      },
      {
        title: '操作',
        width:260,
        render: (row) => {
          return this.props.operation(row);
        },
      },
    ];
    let isShow = false;
    if( pageType == 0 && searchNewsGroup != 20 && list.length){
      isShow = true;
      columns.splice(1,0, {
        title: '关注',
        width:100,
        render: (key, row) => {
          let text;
          if(row.attention==0){
            text = <Badge status="default" text="未设" />;
          }else{
            text = <Badge status="success" text="已设" />
          }
          return (
            <div>
              {text}
            </div>
          );
        },
      });
    }
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
          rowKey="newsId"
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={onTableChange}
        />
        <div style={{display:isShow?'block':'none'}} className={styles.addStay}><Button type="primary" onClick={addStayAttention}>添加待关注</Button></div>
      </div>
    );
  }
}

NewsTable.STATUS_MAP = STATUS_MAP;
export default NewsTable;
