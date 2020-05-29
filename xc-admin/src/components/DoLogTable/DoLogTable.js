import React, { PureComponent } from 'react';
import { Table, Alert, Badge, Modal, Button } from 'antd';
import { Link } from 'dva/router';
import { stringify, parse } from 'qs';
import moment from 'moment';
import styles from './index.less';

export default class DoLogTable extends PureComponent{
  state = {
    modalVisible:false,
    title:'',
    htmlData:'',
  };
  componentDidMount(){

  };
  // 查看修改前
  beforeModify = (obj,type) =>{
    if(type){
      this.setState({
        title:'修改后',
      });
      this.html(obj.updateDataObject);
    }else{
      if(obj.type!=1){
        return false;
      }
      this.setState({
        title:'修改前',
      });
      this.html(obj.beforeDataObject);
    }
    this.setModalVisible(true);
  }

  // 弹框内容
  html = (data) =>{
    if(data){
      let text =[];
      for(let key in data){
        text.push(<p key={'id'+key}>{key}:{data[key]}</p>);
      }
      this.setState({
        htmlData:<div>{text}</div>,
      });
    }
    return null;
  }

  // 

  // 关闭弹框
  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }
  render(){
    const { logData:{ list, pagination },loading, onTableChange } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      {
        title:'时间',
        key:'time',
        width:200,
        render:(key,row) => {
          return (
            <div>{moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          )
        }
      },
      {
        title:'账号',
        key:'account',
        render:(key,row) => {
          return (
            <div>{row.userName||'--'}</div>
          )
        }
      },
      {
        title:'修改前',
        key:'modbefore',
        render:(row) => {
          let dom = null;
          if(row.type==1){
              dom = (
              <a href="javascript:void(0)" onClick={this.beforeModify.bind(this,(row),0)}>查看</a>
            )
          }
          return (
            <div>{dom||'--'}</div>
          )
        }
      },
      {
        title:'修改后',
        key:'modafter',
        render:(row) => {
          return (
            <div><a href="javascript:void(0)" onClick={this.beforeModify.bind(this,(row),1)}>查看</a></div>
          )
        }
      },
      {
        title:'菜单名',
        key:'menuname',
        render:(row) => {
          return (
            <div>{row.menuName}</div>
          )
        }
      },
    ];
    return <div>
            <Table
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={paginationProps}
              rowKey={dolog => dolog.id}
              onChange={onTableChange}
            />
            <Modal
            title={this.state.title}
            wrapClassName="vertical-center-modal"
            visible={this.state.modalVisible}
            onOk={() => this.setModalVisible(false)}
            onCancel={() => this.setModalVisible(false)}
            footer={null}
          >
            {this.state.htmlData}
          </Modal>
        </div>
  }
}