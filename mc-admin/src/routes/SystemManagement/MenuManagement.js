import React, { PureComponent, Fragment } from 'react';
import {
    Form,
    message,
    Card,
    Button,
    Table, 
    Input,
    Modal,
    Divider,
    Popconfirm,
    Icon
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
    const { 
        handleModalVisible, 
        modalVisible, 
        form, 
        btn, 
        handleAdd, 
        handleAddChild, 
        handleEdit, 
        handleEditChild, 
        params, 
        pname 
    } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            if( btn == "add") {
                if(params) {
                    //新增二,三级菜单
                    const parentParams = {
                        pid: params.id,
                        pname: params.name,
                        ...fieldsValue
                    };
                    handleAddChild(parentParams)
                }else {
                    //新增一级菜单
                    handleAdd(fieldsValue)
                }
            }else {
                if(params.menuLevel == 1) {
                    //编辑一级菜单
                    const parentParams = {
                        id: params.id,
                        ...fieldsValue
                    };
                    handleEdit(parentParams)
                }else {
                    //编辑二, 三级菜单
                    const childParams = {
                        pid: params.id,
                        pname: pname,
                        oldName: params.name,
                        ...fieldsValue
                    };
                    handleEditChild(childParams)
                }
            }
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? params ? "添加二级菜单" : "添加一级菜单" : params&&params.children ? '编辑一级菜单' : '编辑二级菜单'}
            // width={850}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入菜单名称' }],
                    initialValue: btn == 'edit' && params  ? params.name : '',
                })(<Input placeholder="请输入菜单名称" />)}
            </FormItem>
            {
                //新增一级菜单  和编辑一级菜单才有Icon
                (btn == 'add' && !params) || (btn == 'edit' && params && params.menuLevel == 1) ?
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单Icon">
                    {form.getFieldDecorator('icon', {
                        // rules: [{ required: true, message: '请输入菜单Icon' }],
                        initialValue: btn == 'edit' && params  ? params.icon : '',
                    })(<Input placeholder="请输入菜单Icon" />)}
                </FormItem>
                : null
            }
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单地址">
                {form.getFieldDecorator('path', {
                    rules: [{ required: true, message: '请输入菜单地址' }],
                    initialValue: btn == 'edit' && params ? params.path : '',
                })(<Input placeholder="请输入菜单地址" />)}
            </FormItem>
        </Modal>
    )
})
@connect(({ menuManagement, permission, loading }) => ({
    menuManagement,
    permission,
    loading: loading.models.menuManagement,
}))
@Form.create()
export default class MenuManagement extends PureComponent {
    state = {
        loading: false,
        modalVisible: false,
        pname: ''
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        this.props.dispatch({
            type: 'permission/findPermission',
            payload: {},
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
                this.setState({ loading: false })
            },
        });
    }

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            id: params ? params.id : null
        });
        this.refs.myform.resetFields();
    };

    //新增一级菜单
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'menuManagement/parentMenuAdd',
            payload: {
                ...fields
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('添加成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
          });
          this.setState({ modalVisible: false });
    }

    //新增二级菜单
    handleAddChild = (fields) => {
        this.props.dispatch({
            type: 'menuManagement/childMenuAdd',
            payload: {
                ...fields
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('添加成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
          });
          this.setState({ modalVisible: false });
    }

    //编辑一级菜单
    handleEdit = (fields) => {
        this.props.dispatch({
            type: 'menuManagement/parentMenuUpdate',
            payload: {
                ...fields,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    }

    //编辑二级菜单
    handleEditChild = (fields) => {
        this.props.dispatch({
            type: 'menuManagement/childMenuUpdate',
            payload: {
                ...fields,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    }

    //删除父菜单
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'menuManagement/parentMenuDelete',
            payload: {
                id: id,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    //删除子菜单
    showDeleteChildConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'menuManagement/childMenuDelete',
            payload: {
                id: params.id,
                oldName: params.name
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    onExpand = (expanded, record) => {
        this.setState({
            pname: record.name         //展开时  获取当前菜单的名字
        });
    };

    render() {
        const { children } = this.props.permission && this.props.permission.data;
        const  { loading } = this.state;
        const columns = [{
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '菜单Icon',
            dataIndex: 'icon',
            key: 'icon',
          }, {
            title: '菜单地址',
            dataIndex: 'path',
            key: 'path',
          }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width:266,
            render: (value, row, index) => {
                if(row.children != undefined) {
                    return(
                        <Fragment key={row.id}>
                            <Button type="primary" onClick={() => this.handleModalVisible(true,"add",row)}>新增</Button>
                            <Divider type="vertical" />
                            <Button type="primary" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</Button>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除本条记录（同时删掉当前菜单下的所有子菜单）?" onConfirm={() => this.showDeleteConfirm(row.id)}>
                                <Button type="primary" >删除</Button>
                            </Popconfirm>
                        </Fragment>
                    )
                }else {
                    return(
                        <Fragment key={row.id}>
                            <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteChildConfirm(row)}>
                                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                            </Popconfirm>
                        </Fragment>
                    ) 
                }
            }
          }];

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleAddChild: this.handleAddChild,
            handleEdit: this.handleEdit,
            handleEditChild: this.handleEditChild,
            handleModalVisible: this.handleModalVisible,
        };

        return(
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                            添加
                        </Button>
                    </div>
                    <Table 
                        className={styles.myTable}
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={children}
                        rowKey='id'
                        loading={loading}
                        pagination={false}
                        onExpand={this.onExpand}
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
            </div>
        )
    }
}