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
    Select,
    Divider,
    Popconfirm,
    TreeSelect 
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params, treeData, modalTreeValue, onModalTreeChange, modalTreeId } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if(btn == "edit") {
                if(modalTreeId) {   //下拉框有重新选取
                    fieldsValue.pageId = modalTreeId
                }else {      //没有重新选取
                    treeData.length > 0 && treeData.map((item, i) => {
                        if(params && params.pageId == item.id){
                            fieldsValue.pageId = params.pageId
                        }
                    })
                }
            }else {  //新增
                if(modalTreeId == 0) return message.error('请选择页面分组')
                fieldsValue.pageId = modalTreeId;
            }
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? "添加事件" : '编辑事件'}
            // width={850}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="页面分组">
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    treeData={treeData}
                    value={modalTreeValue ? modalTreeValue : (params ? params.pageName : '请选择')}
                    dropdownStyle={{ maxHeight: 500, overflow: 'auto', }}
                    placeholder="请选择"
                    onChange={onModalTreeChange}
                    treeNodeFilterProp="title" 
                />
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入事件名称' }],
                    initialValue: params ? params.name : '',
                })(<Input placeholder="请输入事件名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件简介">
                {form.getFieldDecorator('introduction', {
                    rules: [{ required: true, message: '请输入事件简介名' }],
                    initialValue: params ? params.introduction : '',
                })(<Input placeholder="请输入事件简介" />)}
            </FormItem>
        </Modal>
    )
})
@connect(({ incident, loading }) => ({
    incident,
    loading: loading.models.incident,
}))
@Form.create()
export default class IncidentManage extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        treeValue: '',       //搜索框里树的值
        treeId: 0,             //搜索框里树的id,默认为0表示全部
        treeData: [{}],
        modalTreeId: 0,
        modalTreeValue: ''
    }

    componentDidMount() {
        this.getData();
        this.getPageNameList();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: 1,
                pageSize: this.state.pageSize,
                incident: {
                    ...fieldsValue,
                    pageId: this.state.treeId
                }
            };
            dispatch({
                type: 'incident/getIncidentList',
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

    //获取page name
    getPageNameList = () => {
        this.props.dispatch({
            type: 'incident/getPageName',
            payload: {},
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        const data = res.data.data;
                        const renderTreeNodes = (data) => {
                            return data.map((item,i) => {
                                if(item.children) {
                                    renderTreeNodes(item.children);
                                }
                                item.title = item.name;
                                item.key = item.id;
                                item.value = String(item.id);
                                return item;
                            })
                        }
                        renderTreeNodes(data)
                        this.setState({ treeData: data });
                    }else{
                        message.error(res.message || '服务器错误')
                    }
                }
            }          
        });
    }

    reset = () => {
        this.setState({ loading: true, treeValue: '' });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'incident/getIncidentList',
            payload: {
                page: 1,
                pageSize: 10,
                incident: {
                    name: '',
                    pageId: '',
                    id: '',
                    modularId: ''
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
        const { treeData, treeValue } = this.state;
        const that = this;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="ID">
                        {getFieldDecorator('id',{
                            initialValue: "",
                        })(
                            <Input placeholder="ID"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="模块ID">
                        {getFieldDecorator('modularId',{
                            initialValue: "",
                        })(
                            <Input placeholder="模块ID"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="事件名称">
                        {getFieldDecorator('name',{
                            initialValue: "",
                        })(
                            <Input placeholder="请输入名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="页面名称">
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            value={treeValue}
                            dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                            treeData={treeData}
                            placeholder="请选择"
                            onChange={this.onTreeChange}
                            // onSelect={this.onTreeSelect}
                            // onSearch={this.onTreeSearch}
                            // allowClear
                            treeNodeFilterProp="title" 
                        />
                    </FormItem>
                </Col>
                <Col md={4} sm={24} >
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
    
    //pagination 点击分页
    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: current,
                pageSize: pageSize,
                incident: {
                    ...fieldsValue,
                    pageId: this.state.treeId
                }
            };
            dispatch({
                type: 'incident/getIncidentList',
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

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            id: params ? params.id : null,
            modalTreeValue: '',
            modalTreeId: 0
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'incident/addIncidentList',
            payload: {
                incident: {
                    ...fields,
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
            type: 'incident/updateIncidentList',
            payload: {
                incident: {
                    id: this.state.id,
                    ...fields, 
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
    //删除
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'incident/deleteIncidentList',
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

    //设置搜索框的tree
    onTreeChange = (value, label, extra) => {
        this.setState({ 
            treeValue: label[0],
            treeId: value
        });
    }

    onTreeSelect = (value, node, extra) => {
        this.setState({ treeId: node.props.id  });
    }

    //设置弹框里的tree
    onModalTreeChange = (value, label, extra) => {
        this.setState({ 
            modalTreeValue: label[0],
            modalTreeId: value
        });
    }

    render() {
        const { dataList, total } = this.props.incident && this.props.incident.data || [];
        const  { page, pageSize, loading, data } = this.state;
        const { form } = this.props;
        const newData = [];
        const columns = [{
            title: 'ID',
            dataIndex: 'incidentId',
            key: 'incidentId',
          },{
            title: '事件名称',
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
            title: '页面ID',
            dataIndex: 'pageId',
            key: 'pageId',
          }, {
            title: '页面名称',
            dataIndex: 'pageName',
            key: 'pageName',
          }, {
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
            onModalTreeChange: this.onModalTreeChange,
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