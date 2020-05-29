import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
  Popconfirm,
  Table,
  Tabs
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import RoleManagement from './RoleManagement';
import MenuManagement from './MenuManagement';
import AuthorityManagement from './AuthorityManagement';
import ModuleIntroduce from '../../components/ModuleIntroduce';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const statusMap = ['success', 'default','processing', 'default' ];
const status = ['正常', '禁用'];
const switch_ = ['禁用', '启用'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, roleList } = props;
  const role = roleList.length > 0 ? roleList.map((item, i) => {
    return <Option value={item.id} key={i}>{item.name}</Option>
  }) : <Option value="-1">暂无</Option>;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields(['userNameModal','realName','passWord','rePassword','roleId','remarks','phoneNumber']);
      fieldsValue.userName = fieldsValue.userNameModal;
      handleAdd(fieldsValue);
    });
  };
  const compareToFirstPassword = (rule, value, callback) => {
    // const form = this.props.form;
    if (value && value !== form.getFieldValue('passWord')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  }
  const onCancel = () => {
    form.resetFields();
    handleModalVisible()
  }
  return (
    <Modal
      title="新建账户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('userNameModal', {
          rules: [{ required: true, message: '请输入用户名' }],
        })(<Input placeholder="请输入用户名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('realName', {
          rules: [{ required: true, message: '请输入真实姓名' }],
        })(<Input placeholder="请输入真实姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机">
        {form.getFieldDecorator('phoneNumber', {
          rules: [
            { required: true, message: '请输入手机号码' },
            {
              pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
            }
          ],
        })(<Input placeholder="请输入手机号码" maxLength={11}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('passWord', {
          rules: [{ required: true, message: '请输入密码' }],
        })(<Input placeholder="请输入密码" type="password"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('rePassword', {
          rules: [{ 
            required: true, message: '请再次输入密码',
           },{
            validator: compareToFirstPassword,
           }],
        })(<Input placeholder="请再次输入密码" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true, message: '请选择角色' }],
        })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {role}
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
      
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { editModalVisible, form, handleEdit, handleEditModalVisible, roleList, userName, realname, phoneNumber, remarks, roleName, } = props;
  const role = roleList.length > 0 ? roleList.map((item, i) => {
    return <Option value={item.id} key={i}>{item.name}</Option>
  }) : <Option value="-1">暂无</Option>;
  const okHandle = () => {
    form.validateFields({},(err, fieldsValue) => {
      if (err) return;
      //下拉框不进行修改时  给下拉框进行id赋值
      if(fieldsValue.roleId == roleName) {
          roleList.length > 0 && roleList.map((item, i) => {
            if(fieldsValue.roleId == item.name) {
              fieldsValue.roleId = item.id;
            }
          })
      }
      form.resetFields(['realName','roleId','remarks','phoneNumber']);
      handleEdit(fieldsValue);
    });
  };
  const onCancel = () => {
    form.resetFields();
    handleEditModalVisible()
  }
  return (
    <Modal
      title="编辑账户"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={ onCancel }
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        <Input placeholder="请输入用户名" value={userName} disabled/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('realName', {
            rules: [{ required: true, message: '请输入真实姓名' }],
            initialValue: realname ? realname : '',
          })(<Input placeholder="请输入真实姓名" />)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
        {form.getFieldDecorator('phoneNumber', {
            rules: [
              { required: true, message: '请输入手机号码' },
              {
              pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
              }
          ],
            initialValue: phoneNumber ? phoneNumber : '',
          })(<Input placeholder="请输入手机号码" maxLength={11}/>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true, message: '请选择角色' }],
          initialValue: roleName ? roleName : '0',
          // normalize: normalizeAll,
        })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {role}
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
          initialValue: remarks ? remarks : '',
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ account, roleData, loading }) => ({
  account,
  roleData,
  loading: loading.models.account,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    modalVisible: false,   //添加框状态
    editModalVisible: false,   //编辑框状态
    page: 1,
    pageSize: 10,
    loading: false,
    userState: {
      userName: '', 
      realName: '', 
      remarks: '', 
      roleName: '',
    }
  };

  componentDidMount() {
    this.handleSearch();
    // 查找所有角色roleList
    this.props.dispatch({
      type: 'roleData/allRole',
      payload: {},
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
         
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      },
    });
  }
  //查询
  handleSearch = () => {
    const { dispatch, form } = this.props;
    this.setState({ loading: true });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'account/fetch',
        payload: {
          userName: fieldsValue.userName,
          state: fieldsValue.state,
          page: this.state.page,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
           
            }else{
              message.error(res.message || '服务器错误')
            }
          }
        },
      });
    });
    this.setState({ loading: false });
  };
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    dispatch({
      type: 'account/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.setState({ page: 1, pageSize: 10, loading: false });
          }else{
            message.error(res.message || '服务器错误');
            this.setState({ loading: false });
          }
        }
      }
    });
  };

  //添加弹框
  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  //编辑弹框
  handleEditModalVisible = flag => {
    this.setState({ editModalVisible: !!flag });
  };

  //删除数据
  showDeleteConfirm = (id,userName) => {
    const dispatch  = this.props.dispatch;
    dispatch({
      type: 'account/remove',
      payload: {
        id: id,
        userName: userName,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.handleSearch();
            message.success('删除成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  }
  //重置密码
  resetPwd = (id,userName) => {
    const dispatch  = this.props.dispatch;
    dispatch({
      type: 'account/reset',
      payload: {
        id: id,
        // userName: userName,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleSearch();
            message.success('重置成功,初始密码为6个0');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  }
  //新增数据
  handleAdd = fields => {
    this.props.dispatch({
      type: 'account/add',
      payload: {
        ...fields
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleSearch();
            message.success('添加成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ modalVisible: false });
  };
  //编辑数据
  handleEdit = fields => {
    this.props.dispatch({
      type: 'account/edit',
      payload: {
        ...fields,
        id: this.state.userId,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleSearch();
            message.success('修改成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ editModalVisible: false });
  };
  //切换radio
  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      state: e.target.value,
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('userName',{
                initialValue: '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状 态">
              {getFieldDecorator('state',{
                initialValue: "",
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value={""}>全选</Radio>
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset()}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  //编辑状态
  editUserState = (userId,userState) => {
    this.props.dispatch({
      type: 'account/editState',
      payload: {
        id: userId,
        state: userState,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleSearch();
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  }

  onClickPage(current, pageSize) {
      this.setState({ page: current, pageSize: pageSize, loading: true });
      const { dispatch, form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
          type: 'account/fetch',
          payload: {
            userName: fieldsValue.userName,
            state: fieldsValue.state,
            page: current,
            pageSize: pageSize,
          },
          callback: (res) => {
            if(res) {
              if(res.code == '0') {
              
              }else {
                message.error(res.message || '服务器错误');
              }
            }
          },
        });
      });
      this.setState({ loading: false });
  }

  edit = user => {
    this.setState({
      editModalVisible: true,
      userId: user.id,    //设置user  id
      userState: user
    });
  }

  render() {
    const { dataList, total } = this.props.account && this.props.account.data;
    const { roleList } = this.props.roleData && this.props.roleData.data;
    let { page, pageSize } = this.state;
    const { loading } = this.props;
    let pagination = {
        total: total,
        defaultCurrent: page,
        pageSize: pageSize,
        current: page,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
            this.onClickPage(current, pageSize)
        },
        onChange:(current, pageSize) => {
            this.onClickPage(current, pageSize)
        },
    }
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
      },{
        title: '手机',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render:key => key || '--'
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // filters: [
        //   {
        //     text: status[0],
        //     value: 0,
        //   },
        //   {
        //     text: status[1],
        //     value: 1,
        //   },
        // ],
        // onFilter: (value, record) => record.status.toString() === value,
        render(val, row, index) {
          return <Badge key={index} status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        width:230,
        render: (text, record, index) => {
          return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.edit(record)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editUserState(record.id,record.state)} className={record.state == 1 ? null : styles.stateRed}>{switch_[record.state]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(record.id,record.userName)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="确定重置密码?" onConfirm={() => this.resetPwd(record.id,record.userName)}>
              <a href="javascript:;" style={{color:"#FF8000"}}>重置密码</a>
            </Popconfirm>
          </Fragment>
          )
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      modalVisible: this.state.modalVisible
    };

    const parentMethodsEdit = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      editModalVisible: this.state.editModalVisible,
      userName: this.state.userState.userName,
      realname: this.state.userState.realName,
      remarks: this.state.userState.remarks,
      roleName: this.state.userState.roleName,
      phoneNumber:this.state.userState.phoneNumber
    };

    return (
      <PageHeaderLayout title="后台账号">
        <Card bordered={false}>
          <Tabs
            defaultActiveKey='1' 
            tabBarGutter={10} 
            type="card"
          >
            <TabPane tab='账号列表' key='1'>
              <ModuleIntroduce text={'后台系统账号管理'} />
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} >
                    添加
                  </Button>
                </div>
                <Table
                  style={{ backgroundColor: 'white', marginTop: 16 }}
                  columns={columns}
                  dataSource={dataList}
                  pagination={pagination}
                  loading={loading}
                  rowKey="id"
                />
              </div>
            </TabPane>
            <TabPane tab='角色管理' key='2'>
              <ModuleIntroduce text={'后台系统角色管理'} />
              <RoleManagement />
            </TabPane>
            <TabPane tab='权限列表' key='3'>
              <ModuleIntroduce text={'后台系统权限列表'} />
              <AuthorityManagement />
            </TabPane>
            <TabPane tab='菜单管理' key='4'>
              <ModuleIntroduce text={'后台系统菜单管理'} />
              <MenuManagement />
            </TabPane>
          </Tabs>
          
        </Card>
        <CreateForm {...parentMethods} roleList={roleList}/>
        <EditForm {...parentMethodsEdit} roleList={roleList}/>
      </PageHeaderLayout>
    );
  }
}
