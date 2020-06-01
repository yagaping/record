import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm, 
  Checkbox, 
  Table,
  Tree,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
const CheckboxGroup  = Checkbox.Group;
const statusMap = ['success', 'default','processing', 'default' ];
const status = ['正常', '禁用'];
const switch_ = ['禁用', '启用'];
let checkArray = [];
const CreateForm = Form.create()(props => {
  const { 
    modalVisible, 
    form, 
    handleAdd, 
    handleModalVisible, 
    pidList, 
    children, 
    btn, 
    rolename, 
    rRemarks, 
    rid, 
    handleEdit, 
    onCheck
  } = props;
  const okHandle = () => {
    form.validateFields({ rid: rid },(err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  const renderTreeNodes = (data) => {
      return data.map((item) => {
          if (item.children) {
            //首页
            if(item.id == 1) {
              return <TreeNode title={item.name} key={item.id} checkable={true} disableCheckbox={true}/>;
            }
            return (
                <TreeNode 
                  title={item.name} 
                  key={item.id} 
                  dataRef={item}
                >
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
          }
          return <TreeNode title={item.name} key={item.id} />;
      });
  }

  return (
    <Modal
      title={btn == "add" ? "新建角色" : "编辑角色"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
        {
          btn == "add" 
          ? 
            form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入角色' }],
              // initialValue: btn == "edit" ? rolename : "",
            })(<Input placeholder="请输入角色名" />)
          :
            form.getFieldDecorator('roleName', {
              // rules: [{ required: true, message: '请输入角色' }],
              initialValue: btn == "edit" ? rolename : "",
              // normalize: rid,
            })(<Input placeholder="请输入角色名" />)
          }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('rRemarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
          initialValue: btn == "edit" ? rRemarks : "",
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={pidList.concat(['1'])}
          defaultExpandParent
          // checkStrictly={true}
          // selectedKeys={this.state.selectedKeys}
        >
          {Object.keys(children).length > 0 
              ? 
              renderTreeNodes(children) 
              :
              <TreeNode title="default" key="0-0-0-1" onSelect={() => {}}/>
          }
        </Tree>
      </FormItem>
    </Modal>
  );
});

@connect(({ role, permission, loading }) => ({
  role,
  permission,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleList extends PureComponent {
    state = {
        modalVisible: false,
        pidList: [],
        halfCheckedKeys: [],   //tree半选时  父节点暂存值
    };

  componentDidMount() {
    this.handleFormReset();
     // 查询所有权限
    this.props.dispatch({
        type: 'permission/findPermission',
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

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'role/fetchRoleList',
      payload: {
        name: "",
        rStats: ""
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
          
          }else{
            message.error(res.message || '服务器错误')
          }
        }
      }
    });
  };
  //弹框
  handleModalVisible = (flag, btn, role) => {
    checkArray = [];  //重置
    this.setState({
      modalVisible: !!flag,
      btn: btn ? btn : null,
      rolename: role && role.name ? role.name : null,
      rRemarks: role && role.rRemarks ?  role.rRemarks : null,
      pidList: role && role.pidList ?  role.pidList : [],
      rid: role && role.id ?  role.id : null,
    });
    this.refs.myform.resetFields();
  };
  //删除
  showDeleteConfirm = (id) => {
    const dispatch  = this.props.dispatch;
        dispatch({
          type: 'role/roleRemove',
          payload: {
            rId: id,
          },
          callback: (res) => {
            if(res) {
              if(res.code == '0'){
                this.handleFormReset();
                message.success('删除成功');
              }else{
                message.error(res.message || '服务器错误');
              }
            }
          }
        });
  }
  //新增
  handleAdd = fields => {
    this.props.dispatch({
      type: 'role/addRole',
      payload: {
        ...fields,
        pId: (this.state.pidList).map(Number),
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.handleFormReset();
            message.success('添加成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ modalVisible: false });
  };
  //编辑
  handleEdit = fields => {
    const that = this;
    const { pidList, halfCheckedKeys } = that.state;
    this.props.dispatch({
      type: 'role/editRole',
      payload: {
        rRemarks: fields.rRemarks,
        roleName: fields.roleName == this.state.rolename ? '' : fields.roleName,  //角色名没有更改
        rId: that.state.rid,
        pId: pidList.map(Number),
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.handleFormReset();
            message.success('修改成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ modalVisible: false });
  };
  //编辑状态
  editRole = (roleId,roleState) => {
    this.props.dispatch({
      type: 'role/editRoleState',
      payload: {
        id: roleId,
        state: roleState,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.handleFormReset();
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  }

  //tree选中
  onCheck = (checkedKeys, e) => {
    console.log(checkedKeys)
    console.log(e)
    //tree半选情况下  checkedKeys会去除掉父节点  放到e.halfCheckedKeys其中
    this.setState({ 
      pidList: checkedKeys,
      halfCheckedKeys: e.halfCheckedKeys
    });
  }

  render() {
    const { roleList, totla } = this.props.role && this.props.role.data;
    const {  children } = this.props.permission && this.props.permission.data;
    const { btn } = this.state;
    const { loading } = this.props;
    const columns = [
      {
        title: '角色名',
        dataIndex: 'name',
        editable: true,
        width:150,
      },
      {
        title: '备注',
        dataIndex: 'rRemarks',
        editable: true,
      },
      {
        title: '状态',
        dataIndex: 'rStats',
        width:80,
        render(val,row,index) {
          return <Badge key={index} status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        width:160,
        render: (text, record, index) => {
          return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",record)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editRole(record.id,record.rStats)} className={record.rStats == 1 ? null : styles.stateRed}>{switch_[record.rStats]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(record.id)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
          </Fragment>
          )
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      children: children,
      rolename: this.state.rolename,
      rRemarks: this.state.rRemarks,
      pidList: this.state.pidList,
      rid: this.state.rid,
      modalVisible: this.state.modalVisible,
      onCheck: this.onCheck,
      onSelect: this.onSelect
    };

    return (
        <div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,"add")} >
                添加
              </Button>
            </div>
            <Table
              style={{ backgroundColor: 'white', marginTop: 16 }}
              columns={columns}
              dataSource={roleList}
              loading={loading}
              rowKey='id'
            />
          </div>
          <CreateForm {...parentMethods} that={this} btn={btn} ref="myform"/>
        </div>   
    );
  }
}
