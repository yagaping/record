import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

class SysFilterTab extends PureComponent {
  state = {
  
  };
  render() {
    const { loading, list, pagination, onTableChange } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      {
        title:'关键字',
        key:'key',
        width:260,
        dataIndex:'keywords',
      },
      {
        title:'内容替换',
        key:'replaceKey',
        width:260,
        render:(key, row)=>{
            let text = '--';
            if(row.type == 0){
              text = row.replaceContent;
            }
            return <div>{text}</div>
        }
      },
      {
        title:'描述',
        key:'dic',
        width:260,
        dataIndex:'description',
        render:(key, row)=>{
          return <div>{row.description || '--'}</div>
        }
      },
      {
        title:'添加时间',
        key:'time',
        render:(key, row)=>{
          let time = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
          return <div>{time}</div>;
        }
      },
      {
        title:'状态',
        key:'state',
        render:(key, row)=>{
          let text;
          if(row.status == 0){
            text = <Badge status="success" text="已激活" />
          }else if(row.status == 1){
            text = <Badge status="default" text="未激活" />
          }
          return <div>{text}</div>;
        }
      },
      {
        title:'内容类型',
        key:'contentType',
        render:(key, row)=>{
          let text;
          if(row.contentType == 0){
            text = '新闻内容';
          }else if(row.contentType == 1){
            text = '新闻来源';
          }else if(row.contentType == 2){
            text = 'MD5';
          }else if(row.contentType == 3){
            text = '标题';
          }
          
          return <div>{text}</div>
        }
      },
      {
        title:'匹配类型',
        key:'select',
        render:(key, row)=>{
          let text;
          if(row.validateType == 0){
            text = '关键字';
          }else if(row.validateType == 1){
            text = '正则表达式';
          }
          return <div>{text}</div>
        }
      },
      {
        title:'类型',
        key:'type',
        render:(key, row)=>{
          let text;
          if(row.type == 0){
            text = '内容替换';
          }else if(row.type == 1){
            text = '关键字跳过';
          }
          return <div>{text}</div>;
        }
      },
      {
        title:'操作',
        key:'todo',
        render:(key, row)=>{
          return <div>{this.props.onMore(row)}</div>;
        }
      }
    ];
    return (
      <div>
        <Table
        loading={loading}
        rowKey='id'
        dataSource={list}
        columns={columns}
        pagination={paginationProps}
        onChange={onTableChange}
        scroll={{x:1400}}
      />
    </div>
    );
  }
}

export default SysFilterTab;
