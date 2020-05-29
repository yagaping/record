import React, { PureComponent } from 'react';
import { Table, Alert, Badge, Modal } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

export default class UserListTable extends PureComponent{
  componentDidMount(){

  }
  
  render(){
    const { data:{ list, pagination },loading, onTableChange, handleTabelMore } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      {
        title:'ID',
        key:'id',
        render:(key,row) => {
          return (
            <div>{row.id}</div>
          )
        }
      },
      {
        title:'账号',
        key:'account',
        render:(key,row) => {
          return (
            <div>{row.username}</div>
          )
        }
      },
      {
        title:'姓名',
        key:'name',
        render:(key,row) => {
          return (
            <div>{row.realName}</div>
          )
        }
      },
      {
        title:'项目',
        key:'project',
        render:(row) => {
          return <div>{row.projectName}</div>;
        }
      },
      {
        title:'部门',
        key:'department',
        render:(row) => {
          return (
            <div>{row.departmentName||'--'}</div>
          )
        }
      },{
        title:'岗位',
        key:'job',
        render:(row) => {
          return (
            <div>{row.departmentLevelName||'--'}</div>
          )
        }
      },
      {
        title:'邮件',
        key:'mail',
        render:(row) => {
          return (
            <div>{ row.mail || '--' }</div>
          )
        }
      }, {
        title:'状态',
        key:'status',
        width:150,
        render:(row) => {
          let text;
          if(row.status == 0){
            text = <Badge status="success" text='正常'/>;
          }else if(row.status == 1){
            text = <Badge status="error" text='禁用'/>;
          }
          return (
            <div>{ text }</div>
          )
        }
      },
      {
        title:'操作',
        key:'todo',
        width:150,
        render:(row) => {
          return (
            <div>{handleTabelMore(row)}</div>
          )
        }
      },
    ];
    return <Table
            loading={loading}
            columns={columns}
            rowKey='id'
            dataSource={list}
            pagination={paginationProps}
            onChange={onTableChange}
          />
  }
}