import React, { PureComponent,createClass} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Table, DatePicker,Card, Form, Select, Divider, Popconfirm, message, 
  Input, Modal  } from 'antd';
import moment from 'moment';
import styles from './PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select; 
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const _ISTHING = [
  {
    type:-1,
    name:'全部'
  },{
    type:0,
    name:'无分组'
  },{
    type:1,
    name:'事物'
  },{
    type:2,
    name:'未处理'
  },{
    type:3,
    name:'人物'
  }
]
@Form.create()
@connect(state => ({
  tagList: state.tagList,
}))
export default class TagList extends PureComponent{

  state = {
    index:0,
    size:20,
    pid:'-1',
    isThing:-1,
    isThingVal:0,
    tagName:'',
    pidList:[],
    pidVal:'0',
    addOrUpdate:0,
    modalVisible:false,
    modalTitle:'添加',
    btnVisible:true,
    ids:[],
  };
  componentDidMount(){
    this.parentTag();
    this.handleSubmit();
  }
  // 获取父标签
  parentTag = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'tagList/parentTag',

    })
  }
  searchForm = () => {
    const { form, tagList:{parentTag} } = this.props;
      const { isThing, pid } = this.state;
      const { getFieldDecorator } = form;
      const parentTag2 = [{id:'-1',name:'全部'},...parentTag];
     
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
                <dd style={{width:'200px'}}>
                  <FormItem 
                  label="是否事物"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  >
                    {getFieldDecorator('isThing', { initialValue: isThing })(
                      <Select>
                        {
                          _ISTHING.map(item=>{
                            return <Option value={item.type} key={item.type}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'180px'}}>
                  <FormItem 
                  label="父标签"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('pid', { initialValue: pid })(
                      <Select>
                        {
                          parentTag2.map(item=>{
                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'160px'}}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </dd>
            </dl>
          </Form>
      );
  }
  // 查询
  handleSubmit = (e) =>{
    if (e) e.preventDefault();
      const { form, dispatch } = this.props;
      const _this = this;
      form.validateFields((err, values) => {
        const { isThing, pid } = values;
        const { index, size } = this.state;
        const params = {
          isThing,
          pid
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'tagList/queryList',
          payload:{
            index,
            size,
            pid,
            isThing,
          },
          callback:(res)=>{
            if(!res.code==0 || !res.result.data.length){
              _this.setState({
                btnVisible:false,
              })
            }
          }
        });
      })
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const params = {
        index:0,
        size:20,
        pid:'-1',
        isThing:-1,
    }
    this.setState({
      ...params
    },()=>{  this.handleSubmit(); })
  }
  // 表格分页
  handleTable = ( pagination ) =>{
      const { current, pageSize } = pagination;
      this.setState({
        index:current-1,
        size:pageSize,
      },()=>{ this.handleSubmit() });

  }
  // 弹框dom
  addOrUpdateDom = () => {
    const { form } = this.props;
    const { isThingVal, tagName, pidList, addOrUpdate, pidVal } = this.state;
    const { getFieldDecorator } = form;
    let data = _ISTHING.slice(1);
    return (
        <Form>
            <dl className={`${styles.searchLayout} ${styles.modalDom}`}>
            <dd>
                <FormItem 
                label="是否事物"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('isThingVal', { initialValue: isThingVal })(
                    <Select>
                      {
                        data.map(item=>{
                          return <Option value={item.type} key={item.type}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </dd>
              <dd>
                <FormItem 
                label="父类型"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('pidVal', { initialValue: pidVal })(
                    <Select>
                      {
                        pidList.map(item=>{
                          return <Option value={item.id} key={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </dd>
            <dd>
                <FormItem 
                label="标签名"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                  {getFieldDecorator('tagName', { 
                    initialValue: tagName, 
                    rules: [{ required: true, message: '请输入标签名!' }],
                  })(
                    <Input placeholder="请输入标签名" />
                  )}
                </FormItem>
              </dd>
          </dl>
        </Form>
    );
  }
  showModal = (type) => {
    const { dispatch, form, tagList } = this.props;
    form.resetFields(['tagName'])
    const _this = this;
    let pidList =  [{id:'0',name:'未选择'},...tagList.parentTag];
    if(!type){
      _this.setState({
        isThingVal:0,
        tagName:'',
        modalTitle:'添加',
        addOrUpdate:0,
        pidVal:'0',
        modalVisible:true,
        pidList,
      })
    }else{
      _this.setState({
        isThingVal:type.isThing,
        tagName: type.name,
        modalTitle:'修改',
        modalVisible:true,
        addOrUpdate:1,
        tagId:type.id,
        pidVal:type.pid+'',
        pidList,
      })
    }
  }
  // 添加、修改标签确认
  handleOk = () => {
    const { dispatch, form } = this.props;
    const {  addOrUpdate, tagId } = this.state;
    const _this = this;
    form.validateFields((err, values) => {
      if(err) return;
      const { tagName, pidVal, isThingVal } = values;
      if(!addOrUpdate){
        dispatch({
          type:'tagList/addTag',
          payload:{
            name:tagName,
            isThing:isThingVal,
            pid:pidVal,
          },
          callback:(res)=>{
            if(res.code == 0){
              message.success('添加成功');
              _this.handleSubmit();
              _this.handleCancel();
            }else{
              message.error(res.message)
            }
          }
        })
     }else{
      dispatch({
        type:'tagList/updateTag',
        payload:{
          id:tagId,
          name:tagName,
          pid:pidVal,
          isThing:isThingVal,
        },
        callback:(res)=>{
          if(res.code == 0){
            message.success('修改成功');
            _this.handleSubmit();
            _this.handleCancel();
          }else{
            message.error(res.message)
          }
        }
      })
     }
    })
    
    
  }
  // 取消添加、修改标签
  handleCancel = () => {
    this.setState({
      modalVisible:false
    })
  }
  // 删除
  delete = (key) => {
    const { dispatch } = this.props;
    const { ids } = this.state;
    const _this = this;
    dispatch({
      type:'tagList/delete',
      payload:{
        ids:key.id
      },
      callback:(res)=>{
        if(res.code == 0){
          message.info('删除成功')
          _this.handleSubmit();
          if(ids.indexOf(key.id)!=-1){
            ids.splice(ids.indexOf(key.id),1)
            _this.setState({ids})
          }
        }else{
          message.error(res.message)
        }
      }
    })
  }
  // 删除选中
  deleteSelect = () => {
    const { ids } = this.state;
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type:'tagList/delete',
      payload:{
        ids:ids.join(',')
      },
      callback:(res)=>{
        if(res.code == 0){
          message.info('删除成功')
          _this.setState({
            ids:[]
          })
          _this.handleSubmit();
        }else{
          message.error(res.message)
        }
      }
    })
  }
   // 表格选择
   onSelectChange = (e,selectedRows) => {
    this.setState({
      ids:e
    })
  }
  render(){
    const { list, pagination, loading } = this.props.tagList;
    const { modalVisible, modalTitle, ids, btnVisible } = this.state;
    const columns = [
      {
        title:'ID',
        key:'id',
        dataIndex:'id'
      },
      {
        title:'事物',
        key:'isThing',
        dataIndex:'isThing',
        render:(key)=>{
          let text;
          for(let o in _ISTHING){
            if(_ISTHING[o].type == key){
              text = _ISTHING[o].name;
              break;
            }
          }
          return <span>{text}</span>
        }
      },
      {
        title:'父标签',
        key:'pid',
        dataIndex:'pid',
        render:(key,row)=>{
          return <span>{`${key} [${row.parentName||'--'}]`}</span>
        }
      },
      {
        title:'名称',
        key:'name',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        key:'createTime',
        dataIndex:'createTime',
        render:(key)=>{
          return <div>{key||'--'}</div>
        }
      },
      {
        title:'操作',
        key:'todo',
        width:120,
        render:(key)=>{
          let text;
          if(key.pid == 0){
            text = `“${key.name}”下的子标签pid将重置为0，确认删除“${key.name}”标签？`;
          }else{
            text = `确定删除“${key.name}”标签？`
          }
          return (
            <div>
              <a href="javascript:void(0)" onClick={this.showModal.bind(this,key)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm placement="top" title={text} onConfirm={this.delete.bind(this,key)} okText="确定" cancelText="取消">
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          )
        }
      },
    ];
    const rowSelection = {
      onChange:this.onSelectChange,
      selectedRowKeys:ids,
    }
    let deletDom = ids.length ? (
      <Popconfirm title="确定删除选中记录?" onConfirm={this.deleteSelect} okText="确定" cancelText="取消"> 
        <Button type="primary">删除</Button>
      </Popconfirm>
      ):(
        <Button type="primary" disabled={true}>删除</Button>
      )
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            {this.searchForm()}
            <Row style={{marginBottom:20}}>
              <Col>
                <Button type='primary' onClick={this.showModal.bind(this,0)}>添加标签</Button>
              </Col>
            </Row>
            <div className={styles.table}>
              <Table 
                columns={columns}
                dataSource={list}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={this.handleTable}
                rowSelection={rowSelection}
              /> 
               <div className={styles.deleteSelect} style={{display:btnVisible ? 'display' : 'none'}}>
                {deletDom}
              </div>
            </div>
            <Modal
              visible={modalVisible}
              title={modalTitle}
              width={500}
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              { this.addOrUpdateDom() }
            </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
