import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
 Table,
 Divider,
 message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
export default class AuthorityList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/getAllPermission',
      payload: {},
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
          
          }else {
            message.error(res.message || '服务器错误')
          }
        }
      }
    });
  }
  render() {
    const { children } = this.props.authority && this.props.authority.data;
    const { loading } = this.props;
    const renderContent = (value, row, index) => {
      let obj = {};
      let name = [];
      row.children.map((item, i) => {
        const opt = (i == row.children.length - 1) ? <div key={i}>{item.name}</div> : <div key={i}>{item.name}<Divider/></div>;
        name.push(opt)
      });
      obj.children = name;
      return obj;
    };
    const columns = [{
      title: '权限组',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '权限名',
      dataIndex: 'children',
      render: renderContent,
    }, {
      title: '权限类型',
      dataIndex: 'type',
      render: (value, row, index) => {
        let obj1 = {};
        let name1 = [];
        row.children.map((item, i) => {
          const opt1 = (i == row.children.length - 1) ? <div key={i}>{item.type}</div> : <div key={i}>{item.type}<Divider/></div>;
          name1.push(opt1)
        });
        obj1.children = name1;
        return obj1;
      },
    },{
      title: '描述',
      dataIndex: children ? 'id' : '',
      render: (value, row, index) => {
        const obj2 = {
          
        };
        const name2 = [];
        row.children.map((item, i) => {
          const opt2 = (i == row.children.length - 1) ? <div key={i}>{item.desc}</div> : <div key={i}>{item.desc}<Divider/></div>;
          name2.push(opt2)
        });
        obj2.children = name2;
        return obj2;
      },
    }];
    
    return (
      <div>
        <Table 
          style={{backgroundColor:'white'}}
          columns={columns} 
          dataSource={children} 
          bordered 
          loading={loading}
          childrenColumnName={'children1'}
          rowKey="id"
          pagination={{
            // showSizeChanger: true,
            // showQuickJumper: true,
            pageSize:50
          }}/>
      </div>
    );
  }
}
