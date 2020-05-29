import React, { PureComponent } from 'react';
import { Table, Alert, Badge, Modal, Tooltip  } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import moment from 'moment';
export default class BackTable extends PureComponent{
 
  render(){
    const { data:{ list, pagination }, loading, onTableChange, deleteRow } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      {
        title:'日期',
        key:'time',
        width:200,
        dataIndex:'addTime',
        render:(key) => {
          return (
            <div>{moment(key).format('YYYY-MM-DD HH:mm:ss')}</div>
          )
        }
      },
      {
        title:'唯一编号',
        key:'number',
        width:200,
        render:(key,row) => {
          return (
            <div>{row.feedbackId}</div>
          )
        }
      },
      {
        title:'类型',
        key:'type',
        width:100,
        render:(key,row) => {
          return (
            <div>{row.adoptedStatus}</div>
          )
        }
      },
      {
        title:'内容',
        key:'content',
        render:(key,row) => {
          let text = '--';
          if(row.feedbackContent.replace(/(^\s*)|(\s*$)/g, '')){
            text = row.feedbackContent;
          }
          return (
            <div>{text}</div>
          )
        }
      },{
        title:'联系方式',
        key:'contact',
        dataIndex:'contactInformation',
        width:160,
        render:(key) => {
          return (
            <div>{key||'--'}</div>
          )
        }
      },
      {
        title:'操作',
        key:'info',
        width:100,
        render:(key,row) => {
          const text = (<dl>
            <dt>设备信息</dt>
            <dd><div className={styles.dic}>设备型号：</div><div className={styles.name}>{row.terminal||'--'}</div></dd>
            <dd><div className={styles.dic}>系统版本：</div><div className={styles.name}>{row.sdk||'--'}</div></dd>
            <dd><div className={styles.dic}>应用版本：</div><div className={styles.name}>{row.version||'--'}</div></dd>
          </dl>);
          return (
            <div className={styles.todo}>
              <p>
                <Tooltip title={text} trigger="click" overlayClassName={styles.textTips}>
                  <a href="javascript:void(0)">设备信息</a>
                </Tooltip>
              </p>
              <p><a href="javascript:void(0)" onClick={deleteRow.bind(this,row)}>删除</a></p>
            </div>
          )
        }
      }
    ];
    
    return <Table
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={paginationProps}
            rowKey='feedbackId'
            onChange={onTableChange}
          />
  }
}