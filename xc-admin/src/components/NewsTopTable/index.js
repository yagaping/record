import React, { PureComponent } from 'react';
import { Table, Alert, Tooltip, Modal } from 'antd';
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

class NewsTopTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    // if (nextProps.selectedRows.length === 0) {
    //   this.setState({
    //     selectedRowKeys: [],
    //     totalCallNo: 0,
    //   });
    // }
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
    const { newsType, contentType} = row;
    if (newsType != 5 && (contentType === 0 || contentType === 2 || contentType === 3)) {
       path = `/news/news-content-edit/${row.newsId}`;
    } else {
      path = `/news/news-content-view/${row.newsId}`;
    }
    localStorage.setItem('searchData',JSON.stringify(this.props.state));
    this.props.history.push(path);
  }
  handleRowClick = (row) => {
    let href = null;
    const { title } = row;
    href = <a href="javascript:void(0)" onClick={this.goToEdit.bind(this,row)}>{title||'--'}</a>;
    return (
      href
    );
  }
  // 
  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading, onTableChange } = this.props;
    
    const columns = [
      {
        title: '标题',
        render: (key, row) => {
          return (
            <div className={styles.newsTitle}>
              <Tooltip placement="top" title={row.title}>{this.handleRowClick(row)}</Tooltip>
            </div>
          );
        },
      },
      {
        title:'版本类型',
        key:'newsVisible',
        render:(row)=>{
            let text;
            if(row.versionType == 0){
              text = '丰富新闻';
            }else if(row.versionType == 1){
              text = '简洁新闻';
            }
            return <div>{text}</div>;
        }
      },
      {
        title: '类型',
        render: (key, row) => {
          let newsTypeText = <small>{getTypeName(row.newsGroup)}</small>;
          
          return (
            <div>
              <div>{newsTypeText}</div>
            </div>
          );
        },
      },
      {
        title: '操作',
        width:150,
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
        
        </div>
        <Table
          loading={loading}
          rowKey="newsTopId"
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

NewsTopTable.STATUS_MAP = STATUS_MAP;
export default NewsTopTable;
