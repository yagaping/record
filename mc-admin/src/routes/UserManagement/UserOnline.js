import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Form,
 Card,
 Table,
 Input,
 Row,
 Col,
 Button,
 message,
 Switch,
 Modal,
 Badge,
 Divider,
 Popconfirm 
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;

const CreateForm = Form.create()( props => {
  const { form, visible, memberId,modalTitle, handleOk, handleCancel,handleSwitch,
    mainSwitch,
    sendSms,
    sendPhone,
    sendWx,
    sendApp, 
  } =  props;
  const { getFieldDecorator } = form;
  const handleYes = () => {
    form.validateFields((err, values) => {
      if (err) return;
      handleOk(values,form);
    });
  }
  const handleNo = () => {
    handleCancel(form);
  } 
  const disabled = modalTitle == '新增' ? false : true;
  return (
    <Modal
      visible={visible}
      title={modalTitle}
      onOk={handleYes}
      onCancel={handleNo}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户ID">
        {getFieldDecorator('memberId', {
          initialValue:memberId,
          rules: [{ required: true, message: '请输入用户ID' }],
        })(<Input placeholder="请输入用户ID" disabled={disabled}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="总开关">
        <Switch onChange={handleSwitch.bind(this,'mainSwitch')} checked={mainSwitch} checkedChildren="开" unCheckedChildren="关"/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="APP通知">
        <Switch onChange={handleSwitch.bind(this,'sendApp')} checked={sendApp} checkedChildren="开" unCheckedChildren="关"/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微信通知">
        <Switch onChange={handleSwitch.bind(this,'sendWx')} checked={sendWx} checkedChildren="开" unCheckedChildren="关"/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信通知">
        <Switch onChange={handleSwitch.bind(this,'sendSms')} checked={sendSms} checkedChildren="开" unCheckedChildren="关"/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="语音通知">
        <Switch onChange={handleSwitch.bind(this,'sendPhone')} checked={sendPhone} checkedChildren="开" unCheckedChildren="关"/>
      </FormItem>
    </Modal>
  )
})

@connect(({ userOnline, loading }) => ({
  userOnline,
  loading: loading.models.userOnline,
}))
@Form.create()
export default class UserOnline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize:20,
      page:1,

      visible:false,
      modalTitle:'新增',
      mainSwitch:false,
      sendSms:false,
      sendPhone:false,
      sendWx:false,
      sendApp:false,
    }
  }
  componentDidMount(){
    this.handleSearch();
  }
   //搜索
   handleSearch = () => {
    this.setState({ loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const { pageSize, page} = this.state;
      const { memberId } = values;
      dispatch({
        type: 'userOnline/queryUserList',
        payload: {
          memberId,
          pageSize,
          page
        }
      });
    });
  };
   //重置
   handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      page: 1,
      pageSize: 20,
    },()=>{
      this.handleSearch();
    });
   
  }
  //搜索菜单
  searchRender() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
                <FormItem label="用户ID">
                {getFieldDecorator('memberId',{
                  initialValue: "",
                })(<Input placeholder="请输入用户id" />)}
                </FormItem>
            </Col>
            <Col>
              <div style={{ overflow: 'hidden' }}>
                  <span style={{ marginBottom: 24 }}>
                      <Button type="primary" onClick={this.handleSearch}>
                      查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                      </Button>
                  </span>
              </div>
            </Col>
        </Row>
      </Form>
    );
  }
   //pagination分页
   _onClick(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize},() => this.handleSearch());   
  }
  // 新增、编辑
  addItem = (row) => {
    let all = false;
    if(row){
      if(row.sendSms && row.sendPhone && row.sendWx && row.sendApp){
        all = true;
      }
    }
    this.setState({
      visible:true,
      modalTitle:row ? '编辑' : '新增',
      memberId:row ? row.memberId : '' ,
      mainSwitch: all,
      sendSms: row ? row.sendSms : false,
      sendPhone: row ? row.sendPhone : false,
      sendWx: row ? row.sendWx : false,
      sendApp: row ? row.sendApp : false,
    })
  }
  // 保存
  handleOk = (values,form) => {
    const { dispatch } = this.props;
    const {
      modalTitle,
      mainSwitch,
      sendSms,
      sendPhone,
      sendWx,
      sendApp, 
    } = this.state;
    let mark = '';
    const { memberId } = values;
    let url = modalTitle == '新增' ? 'addOnline' : 'modOnline';
    url = 'userOnline/' + url;
    if(sendSms&&sendPhone&&sendWx&&sendApp){
      mark = true;
    }else if(!sendSms&&!sendPhone&&!sendWx&&!sendApp){
      mark = false;
    }
    dispatch({
      type: url,
      payload:{
        mainSwitch:mark,
        sendSms:sendSms||false,
        sendPhone:sendPhone||false,
        sendWx:sendWx||false,
        sendApp:sendApp||false,
        memberId,
      },
      callback:res=>{
        if(res.code == 0){
          message.success(`${modalTitle}成功`);
          this.handleSearch();
        }else{
          message.success(res.message || `${modalTitle}失败`);
        }
        this.handleCancel(form)
      }
    })
  }
  // 删除
  delete = ( row ) => {
    const { dispatch } = this.props;
    const { memberId, id } = row;
    dispatch({
      type:'userOnline/deleteUserOnline',
      payload:{
        id,
        memberId
      },
      callback:res=>{
        if(res.code == 0){
          message.success('删除成功')
          this.handleSearch()
        }else{
          message.success(res.message || '删除失败')
        }
      }
    })
  }
  // 取消
  handleCancel = (form) => {
    form.resetFields();
    this.setState({
      visible:false
    })
  }
  // 开关
  handleSwitch = (name, type) =>{
    const {
      mainSwitch,
      sendSms,
      sendPhone,
      sendWx,
      sendApp,
      } = this.state;
    let params = {
      mainSwitch,
      sendSms,
      sendPhone,
      sendWx,
      sendApp,
    };
    switch(name){
      case 'mainSwitch':
          params = {
            mainSwitch:type,
            sendSms:type,
            sendPhone:type,
            sendWx:type,
            sendApp:type,
          }
          break;
        case 'sendSms':
          params.sendSms = type;
          break;
        case 'sendPhone':
          params.sendPhone = type;
          break;
        case 'sendWx':
          params.sendWx = type;
          break;
        case 'sendApp':
          params.sendApp = type;
          break;
    }
    let all = true;
    for(let item in params){
      if(item != 'mainSwitch' && params[item] == false){
        all = false;
      }
    }
    params.mainSwitch = all;
    this.setState({
            ...params
    });
  }
  render() {
    const { page, pageSize } = this.state;
    const { userOnline, loading } = this.props;
    const { data:{ dataList, total } } = userOnline;
    const pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this._onClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this._onClick(current, pageSize)
      },
    }
    const evnets = {
      handleOk:this.handleOk,
      handleCancel:this.handleCancel,
      handleSwitch:this.handleSwitch
    }
    const columns = [
      {
        title:'用户ID',
        key:'memberId',
        dataIndex:'memberId'
      },{
        title:'APP通知开',
        key:'sendApp',
        dataIndex:'sendApp',
        render:key=> key ? <Badge status="success" text="开" /> : <Badge status="default" text="关" />
      },{
        title:'微信通知',
        key:'sendWx',
        dataIndex:'sendWx',
        render:key=> key ? <Badge status="success" text="开" /> : <Badge status="default" text="关" />
      },{
        title:'短信通知',
        key:'sendSms',
        dataIndex:'sendSms',
        render:key=> key ? <Badge status="success" text="开" /> : <Badge status="default" text="关" />
      },{
        title:'语音通知',
        key:'sendPhone',
        dataIndex:'sendPhone',
        render:key=> key ? <Badge status="success" text="开" /> : <Badge status="default" text="关" />
      },
      {
        title:'操作',
        key:'todo',
        width:120,
        render:row=>{
          return (
          <Fragment>
            <a href="javascript:void(0)" onClick={this.addItem.bind(this,row)}>修改</a>
            <Divider type="vertical"/>
            <Popconfirm onConfirm={this.delete.bind(this,row)} title={'确定要删除？'}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>
          </Fragment>
          )
        }
      }
    ];
    return (
      <PageHeaderLayout title={'用户启停'}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableListForm}>{this.searchRender()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.addItem()} >
                    添加
                  </Button>
                </div>
                <div className={styles.tableList}>
                  <Table 
                    style={{backgroundColor:'white',marginTop:16}}
                    columns={columns} 
                    dataSource={dataList} 
                    pagination={pagination}
                    loading={loading}
                    rowKey='id'
                  />
                </div> 
                <CreateForm {...this.state} { ...evnets }/>
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
