import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Modal,
    Input,
    Select, 
    Divider
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const { TextArea } = Input;
const ModalAlert = Form.create()(props => {
  const { modalVisible, okHandle, cacleHandle, modalTitle, selectType,words, id, form } = props;
  const { getFieldDecorator } = form;

  return(
      <Modal 
          visible={modalVisible}
          onOk={okHandle}
          onCancel={cacleHandle}
          title={modalTitle}
          width={520}
          maskClosable={false}
      >
        <Form>
          <FormItem  label='选择类型'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 6 }}
          >
            {getFieldDecorator('selectType', {
            initialValue:selectType,
            rules:[{required:true,message:'请选择类型'}]
          })(
              <Select disabled={id ? true : false}>
                <Option value=''>请选择</Option>
                <Option value={1}>提醒</Option>
                <Option value={2}>记账</Option>
              </Select>
            )}
          </FormItem>
          <FormItem  
          label='关键字'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('words', {
            initialValue:words,
            rules:[{required:true,message:'请输入关键字'}]
          })(
              <TextArea placeholder="请输入关键字" rows={4}/>
            )}
          </FormItem>
          </Form>
      </Modal>
  )
})
@connect(({ dataTemplate, loading }) => ({
  dataTemplate,
  loading: loading.models.dataTemplate,
}))
@Form.create()
export default class DataTemplate extends PureComponent {

    componentDidMount() {
        this.getData();
    }
    state = {
      type:'',
      page:0,
      pageSize:10,
      modalTitle:'',
      searchWords:'',
      selectType:'',
      words:'',
      id:null,
      modalVisible:false,
    }
    // 查询
    getData = () => {
      const { dispatch,form } = this.props;
      const { page, pageSize } = this.state;
      form.validateFields((err,values)=>{
        const { type,searchWords } = values;
        dispatch({
          type:'dataTemplate/queryData',
          payload:{
            page,
            pageSize,
            type,
            words:searchWords,
          },
        })
      })
    }
    searchData = () =>{
      this.setState({page:0},()=>{
        this.getData();
      })
    }
    // 重置
    reset = () => {
      const { dispatch, form } = this.props;
      form.resetFields();
      dispatch({
        type:'dataTemplate/queryData',
        payload:{
          type:'',
          words:'',
          page:0,
          pageSize:10,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.setState({
              type:'',
              searchWords:'',
              page:0,
              pageSize:10,
            })
          }
        }
      })
    }
     // 分页改变
     onPageChange = (pagination) => {
      const { dispatch } = this.props;
      const { type, searchWords } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
          page:current,
          pageSize,
      });
      dispatch({
          type:'dataTemplate/queryData',
          payload:{
              type,
              words:searchWords,
              page:current,
              pageSize:pageSize                
          },
      })
  }
    // 搜索结构
    renderForm() {
      const { type, searchWords } = this.state;
      const { getFieldDecorator } = this.props.form;
      return (
      <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={4} sm={24}>
                  <FormItem label="类型">
                      {getFieldDecorator('type',{
                          initialValue: type
                      })(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value={1}>提醒</Option>
                          <Option value={2}>记账</Option>
                        </Select>
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24}>
                  <FormItem label="关键字">
                      {getFieldDecorator('searchWords',{
                          initialValue: searchWords
                      })(
                        <Input placeholder="请输入关键词" />
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24} >
                  <span style={{ marginBottom: 24 }}>
                      <Button type="primary" onClick={this.searchData}>
                      查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                      重置
                      </Button>
                  </span>
              </Col>
          </Row>
      </Form>
      );
  }
  // 添加
  handleModalVisible = () =>{
    this.props.form.resetFields(['selectType','words'])
    this.setState({
      modalVisible:true,
      selectType:'',
      words:'',
      id:null,
      modalTitle:'添加',
    })
  }
  // 确定添加
  okHandle = () => {
    const { dispatch, form } = this.props;
    const { id } = this.state;
    form.validateFields((err,values)=>{
      if(err) return;
      const { selectType,words } = values;
      let url = 'dataTemplate/addTemplate';
      let params = {
        type:selectType,
        words,
      }
      if(id){
        url = 'dataTemplate/updateData';
        params.id = id;
      }
      dispatch({
        type:url,
        payload:params,
        callback:(res)=>{
          if(res.code == 0){
            if(id){
              message.success('修改成功');
            }else{
              message.success('添加成功');
            }
            this.getData();
            this.cacleHandle();
          }
        }
      })
    })
  }
  // 取消添加
  cacleHandle = () => {
    this.setState({
      modalVisible:false,
    })
  }
  // 编辑
  editData = (key) =>{
    const { id, type, words } = key;
    this.props.form.resetFields(['selectType','words'])
    this.setState({
      id,
      selectType:type,
      words,
      modalVisible:true,
      modalTitle:'修改',
    })
  }
  // 删除
  handleDelete = (key) => {
    
    const { dispatch } = this.props;
    const {id,type} = key;
    const _this = this;
    confirm({
      title: '确定要删除',
      onOk() {
        dispatch({
          type:'dataTemplate/delete',
          payload:{
            id,
            type
          },
          callback:(res)=>{
            if(res.code == 0){
              message.info('删除成功');
              _this.getData();
            }
          }
        })
      },
    })
  }
    render() {
   
        const { data:{list},pagination, loading } = this.props.dataTemplate;
        const columns = [
          {
            title:'类型',
            dataIndex:'type',
            key:'type',
            render:(key)=>{
              let text;
              if(key == 1){
                text = '提醒'
              }else if(key ==2){
                text = '记账';
              }
              return <div>{text}</div>
            }
          },{
            title:'关键字',
            dataIndex:'words',
            key:'words',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'操作',
            key:'todo',
            width:110,
            render:(key)=>{
              return (
                <div>
                  <a href="javascript:void(0)" onClick={this.editData.bind(this,key)}>编辑</a>
                  <Divider type="vertical" />
                  <a href="javascript:void(0)" onClick={this.handleDelete.bind(this,key)}>删除</a>
                </div>
              )
            }
          }
        ];
        const events = {
          okHandle:this.okHandle,
          cacleHandle:this.cacleHandle,
          form:this.props.form,
        }
        return(
            <div>
              <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <div className={styles.tableListOperator}>
                      <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                          添加
                      </Button>
                  </div>
                  <Table 
                      className={styles.myTable}
                      style={{backgroundColor:'white',marginTop:16}}
                      columns={columns} 
                      dataSource={list} 
                      onChange={this.onPageChange}
                      pagination={pagination}
                      loading={loading}
                      rowKey='id'
                  />
              </div>
              <ModalAlert { ...this.state } { ...events }/>
            </div>
        )
    }
}