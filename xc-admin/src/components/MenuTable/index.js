import React, { PureComponent } from 'react';
import { Table, Alert, Badge, Menu, Dropdown, Icon } from 'antd';
import styles from './index.less';

class MenuTable extends PureComponent {
  state = {
  
  };
 
  render() {
    const { data, loading, onEdit } = this.props;
    const columns = [{
      title:'菜单名',
      key:'name',
      width:260,
      render:( key, row )=>{
        let name = row.name;
        if(row.type == 2){
          name = `【写】${row.name}`;
          if(row.menuType==0){
            name = `【读】${row.name}`;
          }
        }
        return (
          <span>{name||'--'}</span>
        )
      },
    },{
      title:'菜单图标',
      key:'icon',
      width:200,
      render:( key, row )=>{
        return (
          <span>{row.icon||'--'}</span>
        )
      },
    },{
      title:'菜单路径',
      key:'path',
      width:260,
      render:( key, row )=>{
        return (
          <span>{row.path||'--'}</span>
        )
      },
    },{
      title:'菜单链接',
      key:'url',
      render:( key, row )=>{
        return (
          <span>{row.url||'--'}</span>
        )
      },
    },{
      title:'操作',
      key:'work',
      width:200,
      render:( key, row )=>{
        return onEdit(row);
      },
    }];
   
    return (
     <Table 
      rowKey="id"
      columns={columns}
      loading={loading}
      dataSource={data}
      pagination={false}
     />
    );
  }
}
export default MenuTable;
