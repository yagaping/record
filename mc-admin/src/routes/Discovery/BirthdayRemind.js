import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Row, Col, Form, Card, Table, Button, Select, message, Modal, Input, Popconfirm, Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import styles from '../SystemManagement/TableList.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
// const personDesc = ['','常用','祝老年人','祝爸爸','祝妈妈','祝老公','祝妻子','祝恋人','祝教师','祝学生','祝挚友','祝老板','祝同事','祝客户'];
@connect(({birthdayRemind, loading}) => ({
    birthdayRemind,
    loading: loading.models.birthdayRemind,
}))
@Form.create()
export default class BirthdayRemind extends PureComponent {
    state = {
        loading: false,
        page: 1,
        pageSize: 10,
        modalVisible: false,
        title: '',
        selectData: [],
        personDescArray: [],
    }

    componentDidMount() {
        this.getSelectData();
        this.getbirthdayRemindList();
    }

    getSelectData() {
        this.props.dispatch({
            type: 'birthdayRemind/findByPersonType',
            payload: {},
            callback: (res) => {
                let personDesc = [];
                if(res) {
                    if(res.code =='0') {
                        res.data.forEach(element => {
                            personDesc.push(element.personDesc)
                        });
                        this.setState({
                            selectData: res.data,
                            personDescArray: personDesc,
                        });
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }
//查询列表 
    getbirthdayRemindList() {
        const {form, dispatch} = this.props;
        this.setState({ loading: true });
        form.validateFields((err, fieldsValue) => {
            dispatch({
                type: 'birthdayRemind/findByBlessingsText',
                payload: {
                    personType: fieldsValue.personType,
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
        this.setState({ loading: true });
        form.resetFields();
        dispatch({
            type: 'birthdayRemind/findByBlessingsText',
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
        const selectOption =  this.state.selectData.length > 0 ? this.state.selectData.map((item, i) => {
            return <Option value={item.personType} key={i}>{item.personDesc}</Option>
        }) : <Option value=""></Option>;
       
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={4} sm={24}>
                        <FormItem label="祝福对象">
                            {getFieldDecorator('personType',{
                            })(<Select placeholder='请选择' style={{width:'100%'}}>
                                   {selectOption}
                               </Select>)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" onClick={() => this.getbirthdayRemindList()}>
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
                type: 'birthdayRemind/findByBlessingsText',
                payload: {
                    personType: fieldsValue.personType ? fieldsValue.personType : "",
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
            title: btn == 'add' ? '新建祝福' : '编辑祝福',
            personType: params ? params.personType : '',
            personDesc: params ? params.personDesc : '',
            text: params ? params.text : '',
            sort: params ? params.sort : '',
            id: params ? params.id : '',
        });
        this.props.form.resetFields(['modalPersonType','text']);
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
            type: 'birthdayRemind/saveChoose',
            payload: {
                blessingsText: {
                    personType: fields.modalPersonType,
                    personDesc: this.state.personDescArray[fields.modalPersonType-1],
                    text: fields.text,
                    sort: 0,
                }
            },
            callback: (res) => {
                if(res) {
                    if (res.code == '0') {
                        this.getbirthdayRemindList();
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
            type: 'birthdayRemind/modifyChoose',
            payload: {
                blessingsText: {
                    personType: fields.modalPersonType == this.state.personDesc ? this.state.personType : fields.modalPersonType,     //祝福对象没有更改
                    personDesc: fields.modalPersonType == this.state.personDesc ? this.state.personDesc : this.state.personDescArray[fields.modalPersonType-1],   //祝福对象没有更改
                    text: fields.text,
                    sort: this.state.sort,
                    id: this.state.id,
                }
            },
            callback: (res) => {
                if(res) {
                    if (res.code == '0') {
                        this.getbirthdayRemindList();
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
            type: 'birthdayRemind/deleteChoose',
            payload: {
                id: params.id,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getbirthdayRemindList();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    render() {
        const { loading, page, pageSize, modalVisible, title, btn, personType, text } = this.state;
        const { dataList, total } = this.props.birthdayRemind && this.props.birthdayRemind.data;
        const { form } = this.props;
        const columns = [{
            title: '祝福对象',
            dataIndex: 'personDesc',
            key: 'personDesc',
            width:100,
        },{
            title: '祝福语',
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
                        <a href='javascript:;' onClick={() => this.handleModalVisible(true, 'edit', row)}>编辑</a>
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

        const selectOption =  this.state.selectData.length > 0 ? this.state.selectData.map((item, i) => {
            return <Option value={item.personType} key={i}>{item.personDesc}</Option>
        }) : <Option value="-1">请选择</Option>;

        return (
            <PageHeaderLayout title={'祝福语配置'}>
                <div>
                    <Card bordered={false}>
                        <ModuleIntroduce text={'生日提醒的祝福语配置'} />
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
                            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="祝福对象">
                                {
                                    form.getFieldDecorator('modalPersonType', {
                                        initialValue: btn == "edit" ? this.state.personDescArray[personType-1] : "请选择",
                                    })(<Select placeholder={'请选择11'} style={{width:'100%'}}>
                                                {selectOption}
                                        </Select>)
                                }
                            </FormItem>
                            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="祝福语">
                                {
                                    form.getFieldDecorator('text', {
                                        // rules: [{ required: true, message: '请输入事件名称' }],
                                        initialValue: btn == "edit" ? text : "",
                                    })(<TextArea rows={4} placeholder="请输入祝福语" />)
                                }
                            </FormItem>
                        </Modal>
                    </Card>
                </div>
            </PageHeaderLayout>
        )
    }
}