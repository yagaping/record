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
    Divider,
    Tabs
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import NaturalLanClassify from './NaturalLanClassify';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const _INTENTTAG = [
    {
      type:'EXPENDITURE',
      name:'支出',
    },{
      type:'INCOME',
      name:'收入'
    } ,{
      type:'REMIND',
      name:'提醒'
    } ,{
      type:'OTHER',
      name:'其他'
    }
  ]
const ModalAlert = Form.create()(props => {
  const { 
    modalVisible, 
    okHandle, 
    cancelHandle, 
    modalTitle, 
    form,
    typeName,
    mod_intentTag,
    mod_consumerType,
    mod_text,
    mod_entity
    } = props;
  const { getFieldDecorator } = form;

  return(
      <Modal 
          visible={modalVisible}
          onOk={okHandle}
          onCancel={cancelHandle}
          title={modalTitle}
          width={520}
          maskClosable={false}
      >
        <Form>
          <FormItem  label='事件类型'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_intentTag', {
            initialValue:mod_intentTag,
            rules:[{required:true,message:'请选择事件类型'}]
          })(
              <Select>
                {
                  _INTENTTAG.map( item => {
                    return <Option key={item.type}>{item.name}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem  label='类别'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_consumerType', {
            initialValue:mod_consumerType,
            rules:[{required:true,message:'请选择类别'}]
          })(
              <Select>
                {
                  typeName.map( ( item,idx )=>{
                    return <Option key={idx}>{item}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem  
          label='事件名'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_text', {
            initialValue:mod_text,
            rules:[{required:true,message:'请输入事件名'}]
          })(
              <Input placeholder="请输入事件名" />
            )}
          </FormItem>
           <FormItem  
           label='具体实体'
           labelCol={{ span: 5 }}
           wrapperCol={{ span: 18 }}
           >
             {getFieldDecorator('mod_entity', {
             initialValue:mod_entity,
           })(
               <Input placeholder="请输入实体" />
             )}
           </FormItem>
          </Form>
      </Modal>
  )
})
@connect(({ naturalLan, loading }) => ({
  naturalLan,
  loading: loading.models.naturalLan,
}))
@Form.create()
export default class NaturalLanDiscern extends PureComponent {

    componentDidMount() {
       this.getTypeName();
       this.getData();
    }
    state = {
      type:'',
      page:0,
      pageSize:10,
      modalTitle:'',
      memberId:'',
      remark:'',
      mod_intentTag:'',
      mod_consumerType:'',
      mod_text:'',
      mod_entity:'',
      status:'',
      intentTag:'',
      consumerType:'',
      id:null,
      modalVisible:false,
    }
    // 获取选项菜单
    getTypeName = () => {
      const { dispatch } = this.props;
      dispatch({
        type:'naturalLan/queryTypeName',
        payload:{
          object:{}
        },
        callback:(res) => {
          // console.log(res)
        }
      })
    }
    // 查询
    getData = () => {
      const { dispatch,form, naturalLan:{typeName} } = this.props;
      const { page, pageSize } = this.state;
      form.validateFields((err,values)=>{
        const { status, intentTag, consumerType } = values;
        let type='';
        if(consumerType!=''){
          type = typeName[consumerType]
        }
        dispatch({
          type:'naturalLan/queryData',
          payload:{
            page,
            pageSize,
            status,
            intentTag,
            consumerType:type
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
        type:'naturalLan/queryData',
        payload:{
          status:'',
          intentTag:'',
          consumerType:'',
          page:0,
          pageSize:10,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.setState({
              status:'',
              intentTag:'',
              consumerType:'',
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
      const { status , intentTag, consumerType } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
          page:current,
          pageSize,
      });
      dispatch({
          type:'naturalLan/queryData',
          payload:{
              status,
              intentTag,
              consumerType,
              page:current,
              pageSize:pageSize                
          },
      })
  }
    // 搜索结构
    renderForm() {
      const { status, intentTag, consumerType } = this.state;
      const { form:{getFieldDecorator}, naturalLan:{typeName}} = this.props;
      return (
      <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={4} sm={24}>
                  <FormItem label="事件类型">
                      {getFieldDecorator('intentTag',{
                          initialValue: intentTag
                      })(
                        <Select>
                          <Option value=''>全部</Option>
                          {
                            _INTENTTAG.map(item=>{
                              return  <Option key={item.type} value={item.type}>{item.name}</Option>
                            })
                          }
                        </Select> 
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24}>
                  <FormItem label="审核状态">
                      {getFieldDecorator('status',{
                          initialValue: status
                      })(
                        <Select>
                          <Option value="">全部</Option>
                          <Option value="0">未审核</Option>
                          <Option value="1">审核</Option>
                        </Select> 
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24}>
                  <FormItem label="类别">
                      {getFieldDecorator('consumerType',{
                          initialValue: consumerType
                      })(
                        <Select>
                          <Option value="">全部</Option>
                          {
                            typeName.map( (item,idx) => {
                              return <Option key={idx}>{item}</Option>
                            })
                          }
                        </Select> 
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
    this.props.form.resetFields(['mod_intentTag','mod_consumerType','mod_text','mod_entity'])
    this.setState({
      mod_intentTag:'',
      mod_consumerType:'',
      mod_text:'',
      mod_entity:'',
      modalVisible:true,
      modalTitle:'添加',
      id:null,
    })
  }
  // 确定添加,修改
  okHandle = () => {
    const { dispatch, form,  naturalLan:{typeName} } = this.props;
    const { id } = this.state;
    form.validateFields((err,values)=>{
      if(err) return;
      const { mod_intentTag,mod_consumerType,mod_text,mod_entity } = values;
      let url = 'naturalLan/addDiscern';
      let params = {
        intentTag:mod_intentTag,
        consumeType:typeName[mod_consumerType],
        text:mod_text,
        entity:mod_entity
      }
      if(id){
        url = 'naturalLan/updateData';
        params.id = id;
      }
      dispatch({
        type:url,
        payload:{
          object:params
        },
        callback:(res)=>{
          if(res.code == 0){
            if(id){
              message.success('修改成功');
            }else{
              message.success('添加成功');
            }
            this.getData();
            this.cancelHandle();
          }else{
            message.error(res.message)
          }
        }
      })
    })
  }
  // 取消添加
  cancelHandle = () => {
    this.setState({
      modalVisible:false,
    })
  }
  // 编辑
  editData = (key) =>{
    const {naturalLan:{typeName} } = this.props;
    const { id, intentTag, consumeType, text, entity } = key;
    this.props.form.resetFields(['mod_intentTag','mod_consumerType','mod_text','mod_entity'])
    this.setState({
      id,
      mod_intentTag:intentTag, 
      mod_consumerType:typeName.indexOf(consumeType)+'', 
      mod_text:text, 
      mod_entity:entity,
      modalVisible:true,
      modalTitle:'修改',
    })
  }
  // 审核
  check = (key) => {
    const { dispatch } = this.props;
    const _this = this;
    const { id, status } = key;
    confirm({
      title: '是否审核本条记录?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type:'naturalLan/check',
          payload:{
            id,
            status:1
          },
          callback:(res)=>{
              if(res.code == 0){
                message.success('审核成功')
                _this.getData()
              }else{
                message.error( res.message )
              }
          }
        })
      },
    });
  }
  // 删除
  handleDelete = (key) => {
    
    const { dispatch } = this.props;
    const {id} = key;
    const _this = this;
    confirm({
      title: '确定要删除',
      onOk() {
        dispatch({
          type:'naturalLan/deleteDiscern',
          payload:{
            id,
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
   
        const { data:{dataList,pagination}, typeName, loading } = this.props.naturalLan;
        const columns = [
          {
            title:'id',
            dataIndex:'id',
            key:'id',
            render:(key, row, index)=>{
              return <div key={index}>{key||'--'}</div>
            }
          },{
            title:'类别',
            dataIndex:'consumeType',
            key:'consumeType',
            render:(key, row, index)=>{
              return <div key={index}>{key||'--'}</div>
            }
          },{
            title:'具体实体',
            dataIndex:'entity',
            key:'entity',
            render:(key, row, index)=>{
              return <div key={index}>{key||'--'}</div>
            }
          },{
            title:'事件类型',
            dataIndex:'intentTag',
            key:'intentTag',
            render:(key, row, index)=>{
              let text;
              text = _INTENTTAG.filter( item=>{
                return item.type == key
              })
              return <div key={index}>{text[0].name||'--'}</div>
            }
          },{
            title:'事件名称',
            dataIndex:'text',
            key:'text',
            render:(key, row, index)=>{
              return <div key={index} >{key||'--'}</div>
            }
          },{
            title:'操作',
            key:'todo',
            width:170,
            render:(key, row, index)=>{
              let checkDom;
              if(key.status == 0){
                checkDom = <a href="javascript:void(0)" onClick={this.check.bind(this,key)}>审核</a>;
              }else{
                checkDom = <span style={{color:"#ccc"}}>已审核</span>;
              }
              return (
                <div key={index}>
                  <a href="javascript:void(0)" onClick={this.editData.bind(this,key)}>编辑</a>
                  <Divider type="vertical" />
                  {checkDom}
                  <Divider type="vertical" />
                  <a href="javascript:void(0)" onClick={this.handleDelete.bind(this,key)}>删除</a>
                </div>
              )
            }
          }
        ];
        const events = {
          okHandle:this.okHandle,
          cancelHandle:this.cancelHandle,
          form:this.props.form,
          typeName,
        }
        return(
            <PageHeaderLayout title={'自然语言'}>
                <Card bordered={false}>
                  <Tabs
                    defaultActiveKey='1' 
                    tabBarGutter={10} 
                    type='card'
                  >
                    <TabPane tab='自然语言文本识别' key='1'>
                      <ModuleIntroduce text={'自然语言文本识别审核'} />
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
                              dataSource={dataList} 
                              onChange={this.onPageChange}
                              pagination={pagination}
                              loading={loading}
                              rowKey='id'
                          />
                      </div>
                    </TabPane>
                    <TabPane tab='自然语言分类' key='2'>
                      <ModuleIntroduce text={'自然语言分类审核'} />
                      <NaturalLanClassify />
                    </TabPane>
                  </Tabs>
                  <ModalAlert { ...this.state} { ...events }/>
                </Card>
            </PageHeaderLayout>
        )
    }
}