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
    Select,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, params, handleAdd, handleEdit, data } = props;
    const moduleName = data.length > 0 ? data.map((item, i) => {
        return <Option value={item.id} key={i}>{item.name}</Option>
      }) : <Option value="-1"></Option>;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if(btn == 'edit') {
                //下拉框没有重新选取
                if(fieldsValue.modularId == params.modularName) {
                    data.length > 0 && data.map((item, i) => {
                        if(fieldsValue.modularId == item.name) {
                          fieldsValue.modularId = item.id;
                        }
                    })
                }
            }
            if(fieldsValue.modularId == '请选择分组') return message.error('请选择分组');
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? '添加页面' : '编辑页面'}
            // width={850}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="页面名称">
                {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入页面名称' }],
                initialValue: params ? params.name : '',
                })(<Input placeholder="请输入页面名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模块分组">
                {form.getFieldDecorator('modularId', {
                    rules: [{ required: true, message: '请选择分组' }],
                    initialValue: params ? params.modularName : '请选择分组',
                })(
                    <Select placeholder="请选择分组" style={{ width: '100%' }} >
                        {moduleName}
                    </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="页面简介">
                {form.getFieldDecorator('introduction', {
                rules: [{ required: true, message: '请输入页面简介' }],
                initialValue: params ? params.introduction : '',
                })(<Input placeholder="请输入页面简介" />)}
            </FormItem>
        </Modal>
    )
})
@connect(({ pageManage, module_Name, loading }) => ({
    pageManage,
    module_Name,
    loading: loading.models.pageManage,
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
        this.getModuleNameList();
    }
    //模块列表
    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: this.state.page,
                pageSize: this.state.pageSize,
                pageTab: {
                    ...fieldsValue
                }
            };
            dispatch({
                type: 'pageManage/getPageList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false })
                        }
                    }
                }
            });
        });
    }

    //获取modlue name
    getModuleNameList = () => {
        this.props.dispatch({
            type: 'module_Name/getModuleName',
            payload: {},
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        // message.success("1111");
                    }else{
                        message.error(res.message || '服务器错误')
                    }
                }
            }          
        });
    }

    //重置
    reset = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'pageManage/getPageList',
            payload: {
                page: 1,
                pageSize: 10,
                pageTab: {
                    name: '',
                    modularId: '',
                    id: ''
                }
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
        const { data } = this.props.module_Name && this.props.module_Name.data;
        const moduleName = data.length > 0 ? data.map((item, i) => {
            return <Option value={item.id} key={i}>{item.name}</Option>
        }) : <Option value=""></Option>;
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
                    <FormItem label="页面名称">
                        {getFieldDecorator('name',{
                            initialValue: "",
                        })(
                            <Input placeholder="请输入名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="模块名称">
                    {getFieldDecorator('modularId',{
                        initialValue: "",
                    })(
                        <Select style={{ width: '100%' }}  placeholder="请选择模块">
                            {moduleName}
                        </Select>
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
                pageTab: { ...fieldsValue }
            };
            dispatch({
                type: 'pageManage/getPageList',
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
            type: 'pageManage/addPage',
            payload: {
                pageTab: {
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
            type: 'pageManage/updatePage',
            payload: {
                pageTab: {
                    ...fields,
                    id: this.state.params.id
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
            type: 'pageManage/deletePage',
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
        const { dataList, total } = this.props.pageManage && this.props.pageManage.data;
        const { data } = this.props.module_Name && this.props.module_Name.data;
        const  { page, pageSize, loading } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'pageId',
            key: 'pageId',
          },{
            title: '页面名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '简介',
            dataIndex: 'introduction',
            key: 'introduction',
          },{
            title: '模块ID',
            dataIndex: 'modularId',
            key: 'modularId',
          },{
            title: '模块名称',
            dataIndex: 'modularName',
            key: 'modularName',
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
                <CreateForm {...this.state} {...parentMethods} data={data} ref="myform"/>
            </div>
        )
    }
}