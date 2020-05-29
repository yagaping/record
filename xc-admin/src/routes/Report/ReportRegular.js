import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Modal , Button, Table, Input, message, Select, Icon } from 'antd';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './ReportRegular.less';
import RegularItem from '../../components/RegularItem';
import AlertTips from '../../components/AlertTips';
const { Option } = Select;
const DateFormate = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
message.config({
  duration: 1,
  maxCount: 1,
});
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  report: state.report,
}))
export default class ReportRegular extends Component{
  state = {
    type:'-1',
    index:0,
    size:10,
    rowSelect:[],
    item:{
      title:'',
      visible:false,
      id:'',
      regex:'',
      replacement:'',
    },
    alertTips:{
      title:'删除', 
      visible:false, 
      html:'',
    }
  }
  componentDidMount(){
    this.queryList();
  }
  // 查询列表
  queryList = () => {
    const { dispatch } = this.props;
    const { type, index } = this.state;
    const size = sizeType(this.state.size,this.props);
    dispatch({
      type:'report/queryRegular',
      payload:{
        type,
        index,
        size,
      }
    });
  }
// 表格分页
handleCancel = (pagination, filters, sorter) => {
  const { type } = this.state;
  const index = pagination.current-1;
  const size = pagination.pageSize;
  sizeChange(size,this.props);
  this.setState({
    index,
    size,
  });
  this.props.dispatch({
    type:'report/queryRegular',
    payload:{
      index,
      size,
      type,
    },
  });
}

  // 查询按钮
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { index, size } = this.state;
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) { 
        const { type } = values;
        _this.setState({
          type
        });
        dispatch({
          type:'report/queryRegular',
          payload:{
            type,
            index,
            size,
          },
        });
      }
    });
  }

    // 重置查询按钮
    handleFormReset = () => {
      const { dispatch, form } = this.props;
      const { size } = this.state;
      form.resetFields();
      this.setState({
          index:0,
          size,
          type:'-1',
      });
      dispatch({
        type:'report/queryRegular',
        payload:{
          index:0,
          size,
          type:'-1',
        },
      });
    }
  // 搜索结构
  formHtml = () => {
    const { type  } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
      <dl className={styles.search}>
          <dd style={{width:160}}>
              <FormItem
                label="类型"
                labelCol={ {span: 7} }
                wrapperCol={{span:14}}
              >
                {getFieldDecorator('type', {
                  initialValue:type,
                })(
                  <Select>
                    <Option value='-1'>全部</Option>
                    <Option value='0'>标题</Option>
                    <Option value='1'>内容</Option>
                  </Select>
                )}
              </FormItem>
          </dd>
          <dd style={{width:'150px'}}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </dd>
      </dl>
  </Form>
    );
  }
  //添加过滤内容
  handleItem = () => {
    const { item } = this.state;
    this.setState({
      ...item,
      item:{
        title:'添加',
        id:'',
        regex:'',
        replacement:'',
        visible:true,
      }
    });
  }
  // 编辑过滤内容
  edit = (row) => {
    const { item } = this.state;
    const { id, regex, replacement } = row;
    this.setState({
      ...item,
      item:{
        title:'编辑',
        visible:true,
        id,
        regex,
        replacement,
      }
    });
  
  }
  // 删除过滤内容
  delete = () => {
    const { rowSelect } = this.state;    
    if(rowSelect.length){
      this.setState({
        alertTips:{
          title:'删除',
          visible:true,
          html:`是否删除所选过滤内容？`,
        }
      });
    }else{
      message.info('请选择要删除的内容');
    }
    
  }
  // 确认删除
  onOk = () => {
    const { dispatch } = this.props; 
    const { rowSelect } = this.state;
    
    dispatch({
      type:'report/itemDetele',
      payload:rowSelect,
      callback:(res)=>{
        if(res.code == 0){
          message.success('删除成功');
          this.onCancel();
          this.queryList();
        }else{
          message.success('删除失败');
        }
      }
    });
  }
  // 取消删除
  onCancel = () => {
    const { alertTips } = this.state;
    this.setState({
      alertTips:{
        ...alertTips,
        visible:false,
      }
    });
  }

  // 确认添加、编辑
  handleOk = ( item ) => {
    const { dispatch } = this.props;
    const { id, regex, replacement  } = item;
    dispatch({
      type:'report/addOrUpdate',
      payload:{
        id,
        regex,
        replacement,
      },
      callback:(res)=>{
        if(res.code == 0){
          if(id){
            message.success('编辑成功');
          }else{
            message.success('添加成功');
          }
          this.queryList();
          this.handelCancel();
        }else{
          if(id){
            message.error('编辑失败');
          }else{
            message.error('添加失败');
          }
        }
      }
    });
  }
  // 取消添加、编辑
  handelCancel = () => {
    const { item } = this.state;
    this.setState({
      ...item,
      item:{
        visible:false,
      }
    });
  }
  render(){
    const { item } = this.state;
    const { regularData, pagination, loading } = this.props.report;
    const columns = [{
      title:'ID',
      key:'id',
      dataIndex:'id',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'类型',
      key:'type',
      dataIndex:'type',
      render:(key)=>{
        let text;
        if(key == 0){
          text = '标题';
        }else if(key == 1){
          text = '内容';
        }
        return <div>{text||'--'}</div>;
      }
    },{
      title:'时间',
      key:'createTime',
      dataIndex:'createTime',
      render:(key)=>{
        return <div>{moment(key).format('YYYY-MM-DD HH:mm:ss')||'--'}</div>;
      }
    },{
      title:'正则',
      key:'regex',
      dataIndex:'regex',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'替换字符',
      key:'replacement',
      dataIndex:'replacement',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'操作',
      key:'todo',
      render:(key,row)=>{
        return (
          <div>
            <a href="javascript:void(0)" onClick={this.edit.bind(this,row)}>编辑</a>
          </div>
        );
      }
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          rowSelect:selectedRowKeys,
        });
      }
    };
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.regular}>
            {this.formHtml()}
            <div className={styles.addItem}>
              <Button type="primary" onClick={this.handleItem}><Icon type="plus" />添加过滤</Button>
            </div>
            <div className={styles.table}>
              <Table
                columns={columns}
                dataSource={regularData}
                rowKey='id'
                loading={loading}
                pagination={pagination}
                onChange={this.handleCancel}
                rowSelection={rowSelection}
              />
              <Button onClick={this.delete} className={styles.delete} type='primary'>删除</Button>
            </div>
            <RegularItem 
              data={item}
              onOk={this.handleOk}
              onCancel={this.handelCancel}
            />
            <AlertTips
              alertTips={this.state.alertTips}
              onOk={this.onOk}
              onCancel={this.onCancel}
            />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
