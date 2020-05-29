import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Table,Card, Form, Input, Modal, Select, Message } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const { Option } = Select;
const FormItem = Form.Item;
const _TYPE = [
  {isThing:1,name:'父类'},
  {isThing:0,name:'子类'}
]
@Form.create()
@connect(state => ({
  relevancy:state.relevancy
}))
export default class Relevancy extends PureComponent{
  state = {
    index:0,
    size:20,
    name:'',
    parent:'', 
    type:1,
    list:[],
    selectParent:'',
    parentList:[],
    children:'',
    modTitle:'', 
    pid:-1,
    modRows:null,
    modVisible:false
 }
componentDidMount(){
  this.queryParent();
  this.handleSubmit();
}
// 查父类
queryParent = () => {
  const { dispatch } = this.props;
  dispatch({
    type:'relevancy/query',
    payload:{
      isThing:1,
      size:500,
    },
    callback:(res)=>{
      if(res.code == 0){
        const { data } = res.result;
        let arr = [];
        for(let i=0;i<data.length;i++){
          let item = data[i];
          arr.push(
            <Option key={item.id} value={item.id}>{item.name}</Option>
          )
        }
        this.setState({
          parentList:arr,
        })
      }
    }
  })
}
dataList = () => {
  const { dispatch } = this.props;
  const _this = this;
  const { size, index, name, type, pid } = this.state;
  const params = {
    size,
    index,
    name,
    isThing:type
  }
  if(type == 0){
    params.pid = pid
  }
  dispatch({
    type:'relevancy/query',
    payload:{
      ...params
    },
    callback:(res)=>{
      if(res.code == 0 || res.code == 1 ){
        const { result } = res;
        _this.setState({
          list:result
        })
      }
    }
  });
}
// 查询
 handleSubmit = (e) =>{
   
  if (e) e.preventDefault();
    const { form } = this.props;
    const _this = this;
    form.validateFields((err, values) => {
      const { name, type } = values;
     
      this.setState({
          name,
          type,
        },()=>{
          _this.dataList()
        });
    })
}
// 选择类型
handleType = ( value ) => {
  const _this = this;
  this.setState({
    type:value
  },()=>{
    _this.dataList();
  })
}
// 查询表单
searchForm = () => {
  const { form } = this.props;
  const { getFieldDecorator } = form;
  const { name, type } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
            <dl className={styles.searchLayout}>
              <dd style={{width:'280px'}}>
                  <FormItem 
                  label="名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('type', { initialValue: type })(
                      <Select onChange={this.handleType}>
                        {
                          _TYPE.map(item=>{
                            return <Option key={item.isThing} value={item.isThing}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'280px'}}>
                  <FormItem 
                  label="名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('name', { initialValue: name })(
                      <Input placeholder="请输入名称" />
                    )}
                  </FormItem>
                </dd>
              <dd style={{width:'160px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </span>
              </dd>
          </dl>
        </Form>
    );
}
// 弹框dom
additem = () => {
  const { form } = this.props;
  const { getFieldDecorator } = form;
  const { parent, children,selectParent, parentList, type, modRows  } = this.state;
  return (
      <Form>
        {
        type == 1 || !modRows?
        (<dl className={styles.searchLayout}>
          <dd style={{width:'780px'}}>
            <FormItem 
            label="父类"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
            >
              {getFieldDecorator('parent', { 
                initialValue: parent,
                rules: [
                  { required: true, message: '请输入父类名称' },
                ], 
              })(
                <Input placeholder="请输入父类名称" />
              )}
            </FormItem>
          </dd>
        </dl>) :
        (<dl className={styles.searchLayout}>
          <dd style={{width:'780px'}}>
            <FormItem 
            label="子类类"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
            >
              {getFieldDecorator('children', { 
                initialValue: children,
                rules: [
                  { required: true, message: '请输入子类名称' },
                ],  
              })(
                <Input placeholder="请输入子类名称" />
              )}
            </FormItem>
          </dd>
          <dd style={{width:'780px'}}>
            <FormItem 
            label="父类"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
            >
              {getFieldDecorator('selectParent', { initialValue: selectParent })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key='-1' value={0}>未选择</Option>
                  {parentList}
                </Select>
              )}
            </FormItem>
          </dd>
      </dl>
      )
      }
    </Form>
  )
}
// 新增或修改
addOrModify = ( rows ) => {
  const { form } = this.props;
  form.resetFields(['parent','children'])
  this.setState({
    modTitle:rows ? '修改' : '新增',
    modRows:rows,
    modVisible:true,
    parent:rows.name,
    children:rows.name,
    selectParent:rows.pid,
  })
}

// 关闭弹框
onCancel = () => {
  this.setState({modVisible:false})
}
// 确定新增、修改
submit = (e) => {
  const { form, dispatch } = this.props;
  const { modRows,type } = this.state;
  if (e) e.preventDefault();
    const _this = this;
    form.validateFields((err, values) => {
      if(err) return;
      const { parent,selectParent, children } = values;  
      if(!modRows){
        dispatch({
          type:'relevancy/addParentItem',
          payload:{
            name:parent
          },
          callback:(res)=>{
            if(res.code == 0){
              Message.info('添加成功')
              _this.onCancel();
              _this.dataList();
            }
          }
        })
      }else{
        let params = {}
        if(type == 1){
          params = {
            name:parent,
            id:modRows.id
          }
        }else{
          params = {
            name:children,
            pid:selectParent,
            id:modRows.id
          }
        }
        dispatch({
          type:'relevancy/updatefuzi',
          payload:{
            ...params
          },
          callback:(res)=>{
            if(res.code == 0){
              Message.info('修改成功')
              _this.onCancel();
              _this.dataList();
            }
          }
        })
      }
    })
}
// 分页
changeTable = ( page ) => {
  const { current, pageSize } = page;
  const params = {
    index:current-1,
    size:pageSize
  }
  this.setState({
    ...params
  },()=>{
    this.handleSubmit();
  });
}
  render(){
    const { relevancy:{ loading }} = this.props;
    const { modTitle, modVisible, list, index, size, type } = this.state;

    let column= type == 1 ? [{
      title:'ID',
      key:'id',
      width:120,
      dataIndex:'id'
    },{
      title:'父类',
      key:'parent',
      dataIndex:'name'
    },{
      title:'编辑',
      key:'todo',
      width:100,
      render:(row)=>{
        return <a href="javascript:void(0)" onClick={this.addOrModify.bind(this,row)}>编辑</a>
      }
    }]:[{
      title:'ID',
      key:'id',
      width:120,
      dataIndex:'id'
    },{
      title:'pid',
      key:'pid',
      dataIndex:'pid'
    },
      {
        title:'子类',
        key:'child',
        dataIndex:'name'
      },{
        title:'编辑',
        key:'todo',
        width:100,
        render:( row )=>{
          return <a href="javascript:void(0)" onClick={this.addOrModify.bind(this,row)}>编辑</a>
        }
      }
    ];
    const pagination = { 
      current: index+1,
      pageSize: size,
      total:list.total,
      showQuickJumper:true,
      showSizeChanger:true,
    } 
    return (
      <PageHeaderLayout>
          <Card bordered={false}>
            { this.searchForm() }
            <div style={{marginBottom:30}}><Button type="primary" icon="plus" onClick={this.addOrModify.bind(this,0)}>新增父类</Button></div>
            <div className={styles.table}>
              <Table 
                dataSource={list.data}
                columns={column}
                onChange={this.changeTable}
                pagination={pagination}
                rowKey="id"
                loading={loading}
              />
            </div>
            <Modal
              title={modTitle}
              visible={modVisible}
              width={800}
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.submit}
              onCancel={this.onCancel}
            >
              {this.additem()}
            </Modal>
          </Card>
			</PageHeaderLayout>
    )
  }
}
