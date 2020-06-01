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
const confirm = Modal.confirm;
const { Option } = Select;
const _TYPE = [1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1028,1029,1030]
const _DESCRIBE = {
  '1001':'饮食','1002':'烟酒','1003':'服饰','1004':'珠宝首饰','1005':'美容美妆','1006':'母婴亲子','1007':'玩具','1008':'医疗保健','1009':'健身瑜伽','1010':'用品百货','1011':'生活服务','1012':'办公用品','1013':'电脑数码','1014':'家装家电','1015':'缴费借还','1016':'交通出行','1017':'通讯','1018':'教育培训','1019':'游戏娱乐','1020':'理财保险','1021':'宠物','1022':'博彩工艺','1023':'结婚','1024':'送礼','1025':'其他','1026':'工资','1027':'奖金','1028':'礼金','1029':'分红','1030':'酬劳'
}
const ModalAlert = Form.create()(props => {
  const { 
    modalVisible, 
    okHandle, 
    cancelHandle, 
    modalTitle, 
    changeType,
    form,
    mod_type,
    mod_describe,
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
          <FormItem  label='类型'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_type', {
            initialValue:mod_type,
            rules:[{required:true,message:'请选择类型'}]
          })(
              <Select onChange={changeType}>
                {
                  _TYPE.map( (item, idx) => {
                    return <Option key={idx} value={idx}>{item}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem  
          label='分类描述'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_describe', {
            initialValue:mod_describe,
            rules:[{required:true,message:'请输入分类描述'}]
          })(
              <Input placeholder="请输入分类描述" />
            )}
          </FormItem>
          <FormItem  
          label='具体事件'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('mod_entity', {
            initialValue:mod_entity,
            rules:[{required:true,message:'请输入具体事件'}]
          })(
              <Input placeholder="请输入具体事件" />
            )}
          </FormItem>
          </Form>
      </Modal>
  )
})
@connect(({ naturalLanClassify, loading }) => ({
  naturalLanClassify,
  loading: loading.models.naturalLanClassify,
}))
@Form.create()
export default class NaturalLanClassify extends PureComponent {

    componentDidMount() {
       this.getData();
    }
    state = {
      type:'',
      status:'',
      describe:'',
      page:0,
      pageSize:10,
      modalTitle:'',
      memberId:'',
      remark:'',
      mod_type:'',
      mod_describe:'',
      mod_entity:'',
      id:null,
      modalVisible:false,
    }
    // 查询
    getData = () => {
      const { dispatch,form } = this.props;
      const { page, pageSize } = this.state;
      form.validateFields((err,values)=>{
        const { status, type, describe } = values;
        let typeVal = '';
        if(type != ''){
          typeVal = _TYPE[type]
        }
        dispatch({
          type:'naturalLanClassify/queryData',
          payload:{
            page,
            pageSize,
            status,
            type:typeVal,
            describe:_DESCRIBE[describe]
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
        type:'naturalLanClassify/queryData',
        payload:{
          status:'',
          type:'',
          describe:'',
          page:0,
          pageSize:10,
        },
        callback:(res)=>{
          if(res.code == 0){
            this.setState({
              status:'',
              type:'',
              describe:'',
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
      const { status , type, describe } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
          page:current,
          pageSize,
      });
      dispatch({
          type:'naturalLanClassify/queryData',
          payload:{
              status,
              type,
              describe,
              page:current,
              pageSize:pageSize                
          },
      })
  }
    // 搜索结构
    renderForm() {
      const { status, type, describe } = this.state;
      const { form:{getFieldDecorator}} = this.props;
      const describeVal = [];
      for(let o in _DESCRIBE){
        describeVal.push(
          <Option key={o}>{_DESCRIBE[o]}</Option>
        )
      }
      return (
      <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                      {getFieldDecorator('type',{
                          initialValue: type
                      })(
                        <Select>
                          <Option value="">全部</Option>
                          {
                            _TYPE.map( (item,idx) => {
                              return <Option key={idx}>{item}</Option>
                            })
                          }
                        </Select> 
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24}>
                  <FormItem label="分类描述">
                      {getFieldDecorator('describe',{
                          initialValue: describe
                      })(
                       <Select>
                         <Option value=''>全部</Option>
                         {describeVal}
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
    this.props.form.resetFields(['mod_type','mod_describe','mod_entity'])
    this.setState({
      mod_type:'',
      mod_describe:'',
      mod_entity:'',
      modalVisible:true,
      modalTitle:'添加',
      id:null,
    })
  }
  // 确定添加,修改
  okHandle = () => {
    const { dispatch, form} = this.props;
    const { id } = this.state;
    form.validateFields((err,values)=>{
      if(err) return;
      const { mod_type, mod_describe, mod_entity } = values;
      let url = 'naturalLanClassify/addFlItem';
      let params = {
        type:_TYPE[mod_type],
        describe:mod_describe,
        entity:mod_entity
      }
      if(id){
        url = 'naturalLanClassify/updateData';
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
    const { id, type, describe, entity } = key;
    this.props.form.resetFields(['mod_type','mod_describe','mod_entity'])
    this.setState({
      id,
      mod_type:_TYPE.indexOf(parseInt(type)), 
      mod_describe:describe, 
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
          type:'naturalLanClassify/check',
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
          type:'naturalLanClassify/deleteFl',
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
  // 选择类型
  changeType = (val) => {
    this.setState({
      mod_describe:_DESCRIBE[_TYPE[val]]
    })
  }
    render() {
   
        const { data:{dataList,pagination}, typeName, loading } = this.props.naturalLanClassify;
        const columns = [
          {
            title:'id',
            dataIndex:'id',
            key:'id',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'类别',
            dataIndex:'type',
            key:'type',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'描述',
            dataIndex:'describe',
            key:'describe',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'具体事件',
            dataIndex:'entity',
            key:'entity',
            render:(key)=>{
              return <div>{key||'--'}</div>
            }
          },{
            title:'操作',
            key:'todo',
            width:170,
            render:(key)=>{
              let checkDom;
              if(key.status == 0){
                checkDom = <a href="javascript:void(0)" onClick={this.check.bind(this,key)}>审核</a>;
              }else{
                checkDom = <span style={{color:"#ccc"}}>已审核</span>;
              }
              return (
                <div>
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
          changeType:this.changeType,
          form:this.props.form,
          typeName,
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
                    dataSource={dataList} 
                    onChange={this.onPageChange}
                    pagination={pagination}
                    loading={loading}
                    rowKey='id'
                />
            </div>
            <ModalAlert { ...this.state} { ...events }/>
          </div>    
        )
    }
}