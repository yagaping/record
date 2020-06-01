import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Form,
 Card,
 Table,
 Input,
 Row,
 Col,
 Button,
 message,
 Modal,
 Select,
 Divider,
 Popconfirm 
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const _TYPE = {
  1:'语音',
  2:'短信',
  3:'微信',
  4:'app通知'
}
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()( props => {
  const { form, visible, type, modalKey, modalTitle, handleOk, handleCancel,handleSelect
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
  const handleChange = (e) =>{
    handleSelect(e,form);
  }
  return (
    <Modal
      visible={visible}
      title={modalTitle}
      onOk={handleYes}
      onCancel={handleNo}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="禁用类别">
        {getFieldDecorator('type', {
          initialValue:type,
        })(<Select onChange={handleChange} style={{width:'100%'}}>
          {
            Object.keys(_TYPE).map(item=>{
            return <Option key={item} value={parseInt(item)}>{_TYPE[item]}</Option>
            })
          }
        </Select>)}
      </FormItem>
      {
        type == 1 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {getFieldDecorator('modalKey', {
            initialValue:modalKey,
            rules: [
              { required: true, message: '请输入手机号码' },
              {
              pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
              }
          ],
          })(<Input placeholder="请输入框手机号" maxLength={11}/>)}
        </FormItem>
        )
      }
      {
        type == 2 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {getFieldDecorator('modalKey', {
            initialValue:modalKey,
            rules: [
              { required: true, message: '请输入手机号码' },
              {
              pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
              }
          ],
          })(<Input placeholder="请输入框手机号" maxLength={11}/>)}
        </FormItem>
        )
      }
      {
        type == 3 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {getFieldDecorator('modalKey', {
            initialValue:modalKey,
            rules: [{ required: true, message: '请输入框openid' }],
          })(<Input placeholder="请输入框openid"/>)}
        </FormItem>
        )
      }
      {
        type == 4 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {getFieldDecorator('modalKey', {
            initialValue:modalKey,
            rules: [{ required: true, message: '请输入用户ID' }],
          })(<Input placeholder="请输入用户ID"/>)}
        </FormItem>
        )
      }
    </Modal>
  )
})

@connect(({ userOnline, loading }) => ({
  userOnline,
  loading: loading.models.userOnline,
}))
@Form.create()
export default class UserMessageStop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize:20,
      page:1,
      type:1,
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
      const { key } = values;
      dispatch({
        type: 'userOnline/queryUserMessage',
        payload: {
          key,
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
                <FormItem label="内容">
                {getFieldDecorator('key',{
                  initialValue: "",
                })(<Input placeholder="请输入搜索内容" />)}
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
    console.log(row)
    this.setState({
      visible:true,
      modalTitle:row ? '编辑' : '新增',
      id:row ? row.id : null,
      type:row ? row.type : 1,
      modalKey:row ? row.key : '',
    })
  }
  // 保存
  handleOk = (values,form) => {
    const { dispatch } = this.props;
    const {
      modalTitle,
      id 
    } = this.state;
    const { type, modalKey } = values;
    let params = {
      type,
      key:modalKey
    }
    let url = modalTitle == '新增' ? 'addMessage' : 'modMessage';
    url = 'userOnline/' + url;
    if( id ) params.id = id;
    dispatch({
      type: url,
      payload:{
        ...params
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
    const { id, type, key } = row;
    dispatch({
      type:'userOnline/deleteUserMessage',
      payload:{
        id,
        type,
        key
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
  // 选择类型
  handleSelect = (e, form) => {

    this.setState({type:e,modalKey:''},()=>{
      form.resetFields();
    })
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
      handleSelect:this.handleSelect
    }
    const columns = [
      {
        title:'ID',
        key:'id',
        dataIndex:'id'
      },{
        title:'关键词',
        key:'type',
        dataIndex:'type',
        render:key=> {
        return <span>{_TYPE[key]}</span>
        }
      },{
        title:'key',
        key:'key',
        dataIndex:'key',
        render:key=> key || '--'
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
      <PageHeaderLayout title={'用户关键信息停用'}>
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
