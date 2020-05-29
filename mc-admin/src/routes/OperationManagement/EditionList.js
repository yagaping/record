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
    Radio
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const updateContent = {
    '1': '修复个人中心bug',
    '2': '修复天气节日节气bug',
    '3': '修复事件bug'
};
const updateContent1 = ['修复个人中心bug','修复天气节日节气bug','修复事件bug'];
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params } = props;
    let options = [];
    for(let i in updateContent) {
        options.push(<Option value={i} key={i}>{updateContent[i]}</Option>);
    }
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            //下拉框不进行修改时  给下拉框进行id赋值
            if(btn == "edit") {
                if(fieldsValue.fedUinfo == updateContent[params.fedUinfo]) {
                    fieldsValue.fedUinfo = params.fedUinfo
                }
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
            title={btn == "add" ? "添加" : '编辑'}
            width={850}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="版本号">
                {form.getFieldDecorator('vname', {
                    rules: [{ required: true, message: '请输入版本号' }],
                    initialValue: params ? params.vname : '',
                })(<Input placeholder="请输入版本号"/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="版本号数字">
                {form.getFieldDecorator('vnumber', {
                    rules: [{ required: true, message: '请输入版本号数字' }],
                    initialValue: params ? params.vnumber : '',
                })(<Input placeholder="请输入版本号数字" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="强制更新">
                {form.getFieldDecorator('forceUpdate', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.forceUpdate : 1,
                })(
                    <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="更新地址">
                {form.getFieldDecorator('fApp', {
                    rules: [{ required: true, message: '请输入更新地址' }],
                    initialValue: params ? params.fApp : '',
                })(<Input placeholder="请输入更新地址" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文件大小">
                {form.getFieldDecorator('fedAppsize', {
                    rules: [{ required: true, message: '请输入文件大小' }],
                    initialValue: params ? params.fedAppsize : '',
                })(<Input placeholder="请输入文件大小"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="更新内容">
                {form.getFieldDecorator('fedUinfo', {
                    rules: [{ required: true, message: '请选择更新内容' }],
                    initialValue: params ? updateContent[params.fedUinfo] : '',
                })(
                    <Select style={{ width: '100%' }}>
                    {options}
                    </Select>
                )}
            </FormItem>
        </Modal>
    )
})
@connect(({ editionList, loading }) => ({
    editionList,
    loading: loading.models.editionList,
}))
@Form.create()
export default class EditionList extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'editionList/getEditionList',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    vName: fieldsValue.vName
                },
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

    reset = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'editionList/getEditionList',
            payload: {
                page: 1,
                pageSize: 10,
                vName: ''
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
                <Col md={4} sm={24}>
                    <FormItem label="版本号">
                    {getFieldDecorator('vName',{
                        initialValue: "",
                    })(
                        <Input placeholder="请输入版本号"/>
                    )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24} >
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
                vName: fieldsValue.vName
            };
            dispatch({
                type: 'editionList/getEditionList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                        }else {
                            message.error(res.message || '服务器错误');
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
            id: params ? params.id : null
        });
        this.refs.myform.resetFields();
        // this.props.form.resetFields(['words1','words2','words3','words4','words5','words6','words7']);
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'editionList/addEditionList',
            payload: {
                edition: {
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
       //删除
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'editionList/removeEditionList',
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
    //编辑数据
    handleEdit = fields => {
        this.props.dispatch({
            type: 'editionList/modifyEditionList',
            payload: {
                edition: {
                    ...fields,
                    id: this.state.id,
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    };

    render() {
        const { dataList, total } = this.props.editionList && this.props.editionList.data;
        const  { page, pageSize, loading, modalVisible } = this.state;
        const columns = [{
            title: '版本号',
            dataIndex: 'vname',
            key: 'vname',
            width:80,
          }, {
            title: '版本号数字',
            dataIndex: 'vnumber',
            key: 'vnumber',
            width:110,
          }, {
            title: '是否强制更新',
            dataIndex: 'forceUpdate',
            key: 'forceUpdate',
            width:130,
            render: (value, row, index) => {
                return(<span>{value ? '是' : '否'}</span>)
            }
          }, {
            title: '更新地址',
            dataIndex: 'fApp',
            key: 'words2',
            width:120,
          }, {
            title: '文件大小',
            dataIndex: 'fedAppsize',
            key: 'fedAppsize',
            width:150,
          }, {
            title: '更新内容',
            dataIndex: 'fedUinfo',
            key: 'fedUinfo',
            render: (value, row, index) => {
                return(<span>{updateContent[value]}</span>)
            }
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
        };

        return(
            <PageHeaderLayout title={'版本管理'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'APP版本管理'} />
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
                            pagination={pagination}
                            loading={loading}
                            rowKey='id'
                        />
                    </div>
                </Card>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
            </PageHeaderLayout>
        )
    }
}