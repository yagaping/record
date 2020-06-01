import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Row, Col, Form, Card, Table, Button, Select, message, Modal, Input, Popconfirm, Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const EventType = {
    '1': '重要事件',
    '2': '生日',
    '3': '纪念日',
    '5': '提醒',
    '6': '记账',
    '9': '位置提醒',
    '10': 'WiFi提醒'
};
@connect(({eventName, loading}) => ({
    eventName,
    loading: loading.models.eventName,
}))
@Form.create()
export default class EventName extends PureComponent {
    state = {
        loading: false,
        page: 1,
        pageSize: 10,
        modalVisible: false,
        title: ''
    }

    componentDidMount() {
       this.getEventList();
    }
//查询列表 
    getEventList() {
        const {form, dispatch} = this.props;
        this.setState({ loading: true });
        form.validateFields((err, fieldsValue) => {
            dispatch({
                type: 'eventName/findByChoose',
                payload: {
                   type: fieldsValue.type,
                   page: this.state.page,
                   pageSize: this.state.pageSize,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code =='0') {

                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }
//重置列表
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({ loading: true });
        dispatch({
        type: 'eventName/findByChoose',
            payload: {
                page: 1,
                pageSize: this.state.pageSize,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({
                            page: 1,
                            pageSize: 10,
                            loading: false
                        });
                    }else {
                        this.setState({ loading: false });
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={4} sm={24}>
                        <FormItem label="事件类型">
                            {getFieldDecorator('type',{
                            })(<Select placeholder='请选择' style={{width:'100%'}}>
                                    <Option value="1">重要事件</Option>
                                    <Option value="2">生日</Option>
                                    <Option value="3">纪念日</Option>
                                    <Option value="5">提醒</Option>
                                    <Option value="6">记账</Option>
                                    <Option value="9">位置提醒</Option>
                                    <Option value="10">WiFi提醒</Option>
                               </Select>)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" onClick={() => this.getEventList()}>
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset()}>
                                重置
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }
//点击页面
    onClickPage(current, size) {
        this.setState({ page: current, pageSize: size, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'eventName/findByChoose',
                payload: {
                    type: fieldsValue.type ? fieldsValue.type : "",
                    page: current,
                    pageSize: size,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {

                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                },
            });
        });
    }

    handleModalVisible(flag,  btn, params) {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn,
            title: btn == 'add' ? '新建事件' : '编辑事件',
            type: params ? params.type : '',
            text: params ? params.text : '',
            sort: params ? params.sort : '',
            id: params ? params.id : '',
        });
        this.props.form.resetFields(['modalType','text']);
    }
//弹框确定
    onOk() {
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) return;
            this.state.btn == 'add' ?  this.handleAdd(fieldsValue) : this.handleEdit(fieldsValue);
        });
    }
//新增
    handleAdd(fields) {
        this.props.dispatch({
            type: 'eventName/saveChoose',
            payload: {
                chooseText: {
                    type: fields.modalType,
                    text: fields.text,
                    sort: 0,
                }
            },
            callback: (res) => {
                if(res) {
                    if (res.code == '0') {
                        this.getEventList();
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
    handleEdit(fields) {
        this.props.dispatch({
            type: 'eventName/modifyChoose',
            payload: {
                chooseText: {
                    type: fields.modalType,
                    text: fields.text,
                    sort: this.state.sort,
                    id: this.state.id,
                }
            },
            callback: (res) => {
                if(res) {
                    if (res.code == '0') {
                        this.getEventList();
                        message.success('编辑成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    }
//删除
    showDeleteConfirm(params) {
        this.props.dispatch({
            type: 'eventName/deleteChoose',
            payload: {
                id: params.id,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getEventList();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    render() {
        const { loading, page, pageSize, modalVisible, title, btn, type, text } = this.state;
        const { total, dataList } = this.props.eventName && this.props.eventName.data;
        const { form } = this.props;
        const columns = [{
            title: '事件类型',
            dataIndex: 'type',
            key: 'type',
            width:100,
            render: (value, row, index) => {
                return(<span key={index}>{EventType[value]}</span>)
            }
        },{
            title: '事件名称',
            dataIndex: 'text',
            key: 'text',
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width:120,
            render: (value, row, index) => {
                return(
                    <Fragment key={index}>
                        <a key={index} href='javascript:;' onClick={() => this.handleModalVisible(true, 'edit', row)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
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
                this.onClickPage(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClickPage(current, pageSize)
            },
        }

        return (
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                            添加
                        </Button>
                    </div>
                    <Table 
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={dataList} 
                        pagination={pagination}
                        rowKey='id'
                        loading={loading}
                    />
                </div>
                <Modal
                    visible={modalVisible}
                    title={title}
                    onOk={() => this.onOk()}
                    onCancel={() => this.handleModalVisible()}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件类型">
                        {
                            form.getFieldDecorator('modalType', {
                                // rules: [{ required: true, message: '请选择事件类型1' }],
                                initialValue: btn == "edit" ? String(type) : "请选择",
                            })(<Select placeholder='请选择' style={{width:'100%'}}>
                                    <Option value="1">重要事件</Option>
                                    <Option value="2">生日</Option>
                                    <Option value="3">纪念日</Option>
                                    <Option value="5">提醒</Option>
                                    <Option value="6">记账</Option>
                                    <Option value="9">位置提醒</Option>
                                    <Option value="10">WiFi提醒</Option>
                                </Select>)
                        }
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件名称">
                        {
                            form.getFieldDecorator('text', {
                                // rules: [{ required: true, message: '请输入事件名称' }],
                                initialValue: btn == "edit" ? text : "",
                            })(<Input placeholder="请输入事件名称" />)
                        }
                    </FormItem>
                </Modal>
            </div>
        )
    }
}