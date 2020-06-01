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
    Divider
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const ModalAlert = Form.create()(props => {
  const { modalVisible, okHandle, cancelHandle, modalTitle, remark,memberId, id, form } = props;
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
          <FormItem  label='memberId'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('memberId', {
            initialValue:memberId,
            rules:[{required:true,message:'请输入memberId'}]
          })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem  
          label='描述'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('remark', {
            initialValue:remark,
            rules:[{required:true,message:'请输入描述'}]
          })(
              <TextArea placeholder="请输入描述" rows={4}/>
            )}
          </FormItem>
          </Form>
      </Modal>
  )
})
@connect(({ manageTester, loading }) => ({
  manageTester,
  loading: loading.models.manageTester,
}))
@Form.create()
export default class ManageTester extends PureComponent {

    componentDidMount() {
       this.getData();
    }
    state = {
      type:'',
      page:0,
      pageSize:10,
      modalTitle:'',
      memberId:'',
      remark:'',
      searchMemberId:'',
      searchRemark:'',
      id:null,
      modalVisible:false,
    }
    // 查询
    getData = () => {
      const { dispatch,form } = this.props;
      const { page, pageSize } = this.state;
      form.validateFields((err,values)=>{
        const { searchMemberId,searchRemark } = values;
        dispatch({
          type:'manageTester/queryData',
          payload:{
            page,
            pageSize,
            memberId:searchMemberId,
            remark:searchRemark,
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
        type:'manageTester/queryData',
        payload:{
          searchMemberId:'',
          searchRemark:'',
          page:0,
          pageSize:10,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.setState({
              searchMemberId:'',
              searchRemark:'',
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
      const { searchMemberId , searchRemark } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
          page:current,
          pageSize,
      });
      dispatch({
          type:'manageTester/queryData',
          payload:{
              memberId:searchMemberId,
              remark:searchRemark,
              page:current,
              pageSize:pageSize                
          },
      })
  }
    // 搜索结构
    renderForm() {
      const { searchMemberId, searchRemark } = this.state;
      const { getFieldDecorator } = this.props.form;
      return (
      <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                  <FormItem label="memberId">
                      {getFieldDecorator('searchMemberId',{
                          initialValue: searchMemberId
                      })(
                        <Input placeholder="请输入memberId" />
                      )}
                  </FormItem>
              </Col>
              <Col md={6} sm={24}>
                  <FormItem label="描述">
                      {getFieldDecorator('searchRemark',{
                          initialValue: searchRemark
                      })(
                        <Input placeholder="请输入描述" />
                      )}
                  </FormItem>
              </Col>
              <Col md={8} sm={24} >
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
    this.props.form.resetFields(['memberId','remark'])
    this.setState({
      modalVisible:true,
      memberId:'',
      remark:'',
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
      const { memberId,remark } = values;
      let url = 'manageTester/addTester';
      let params = {
        memberId,
        remark,
      }
      if(id){
        url = 'manageTester/updateData';
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
    const { id, memberId, remark } = key;
    this.props.form.resetFields(['memberId','remark'])
    this.setState({
      id,
      memberId,
      remark,
      modalVisible:true,
      modalTitle:'修改',
    })
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
          type:'manageTester/deleteTester',
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
   
        const { data:{dataList,pagination}, loading } = this.props.manageTester;
        const columns = [
          {
            title:'memberId',
            dataIndex:'memberId',
            key:'memberId',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'描述',
            dataIndex:'remark',
            key:'remark',
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
          cancelHandle:this.cancelHandle,
          form:this.props.form,
        }
        return(
            <PageHeaderLayout title={'测试人员管理'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'测试人员管理，待定'} />
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
                    <ModalAlert { ...this.state } { ...events }/>
                </Card>
               
            </PageHeaderLayout>
        )
    }
}