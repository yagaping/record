import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Input,
    Modal,
    Divider,
    Popconfirm,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, params, handleAdd, handleEdit } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? '添加模块' : '编辑模块'}
            // width={850}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模块名称">
                {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模块名称' }],
                initialValue: params ? params.name : '',
                })(<Input placeholder="请输入模块名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模块简介">
                {form.getFieldDecorator('introduction', {
                rules: [{ required: true, message: '请输入模块简介' }],
                initialValue: params ? params.introduction : '',
                })(<Input placeholder="请输入模块简介" />)}
            </FormItem>
        </Modal>
    )
})
@connect(({ module, loading }) => ({
    module,
    loading: loading.models.module,
}))
@Form.create()
export default class ModuleManage extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
    }

    componentDidMount() {
        this.getData();
    }
    //模块列表
    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: 1,
                pageSize: this.state.pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'module/getModuleList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ page: 1, loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false })
                        }
                    }
                }
            });
        });
    }

    //重置
    reset = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'module/getModuleList',
            payload: {
                page: 1,
                pageSize: 10,
                name: '',
                id: ''
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({ page: 1, pageSize: 10, loading: false })
                    }else {
                        message.error(res.message || '服务器错误');
                        this.setState({ loading: false })
                    }
                }
            }
        });
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                    <FormItem label="ID">
                        {getFieldDecorator('id',{
                            initialValue: "",
                        })(
                            <Input placeholder="请输入ID"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="名称">
                        {getFieldDecorator('name',{
                            initialValue: "",
                        })(
                            <Input placeholder="请输入名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24} >
                    <span style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
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
    
    //pagination点击
    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'module/getModuleList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            // this.setState({ page: 1, loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            // this.setState({ loading: false })
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }

      //弹框
    handleModalVisible = (flag, btn, row) => {
        this.setState({
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: row ? row : null,
            modularId: row && row.id ?  row.id : null,  //设置模板id
        });
        this.refs.myform.resetFields();
    };
    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'module/addModuleList',
            payload: {
                modular: {
                    ...fields
                }
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

    //编辑
    handleEdit = (fields) => {
        this.props.dispatch({
            type: 'module/updateModuleList',
            payload: {
                modular: {
                    ...fields,
                    id: this.state.modularId
                }
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

    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'module/deleteModuleList',
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

    render() {
        const { dataList, total } = this.props.module && this.props.module.data;
        const  { page, pageSize, loading } = this.state;
        const newData = [];
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },{
            title: '模块名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '简介',
            dataIndex: 'introduction',
            key: 'introduction',
          },{
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              width:120,
              render: (value, row, index) => {
                return(
                    <Fragment key={index}>
                        <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row.id)}>
                            <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                        </Popconfirm>
                    </Fragment>
                )
              }
          }];
        const pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
              this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        };

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
        };

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
                        rowKey='id'
                        pagination={pagination}
                        loading={loading}
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
            </div>
        )
    }
}