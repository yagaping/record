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
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            //下拉框不进行修改时  给下拉框进行id赋值
            // if(btn == "edit") {
            //     if(fieldsValue.fedUinfo == updateContent[params.fedUinfo]) {
            //         fieldsValue.fedUinfo = params.fedUinfo
            //     }
            // }
            form.resetFields();
            btn == 'add' ? handleAdd(fieldsValue) : handleEdit(fieldsValue) ;
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? "添加" : '编辑'}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地名">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入地名' }],
                    initialValue: params ? params.name : '',
                })(<Input placeholder="请输入地名" />)}                 
            </FormItem>
        </Modal>
    )
})
@connect(({ nonRelationalList, loading }) => ({
    nonRelationalList,
    loading: loading.models.nonRelationalList,
}))
@Form.create()
export default class NonRelationalList extends PureComponent {
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
                type: 'nonRelationalList/getMapList',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    ...fieldsValue,
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
            type: 'nonRelationalList/getMapList',
            payload: {
                page: 1,
                pageSize: 10,
                name: ''
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
                    <FormItem label="地名">
                    {getFieldDecorator('name',{
                        initialValue: "",
                    })(
                        <Input placeholder="请输入地名" />
                    )}
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
                ...fieldsValue
            };
            dispatch({
                type: 'nonRelationalList/getMapList',
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
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'nonRelationalList/mapTreeAdd',
            payload: {
                object: {
                    ...fields,
                    parentId: 0    
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
            type: 'nonRelationalList/mapTreeUpdate',
            payload: {
                object: {
                    ...fields,
                    id: this.state.id,   
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
            type: 'nonRelationalList/mapTreeDelete',
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
        const { dataList, total } = this.props.nonRelationalList && this.props.nonRelationalList.data;
        const  { page, pageSize, loading, modalVisible } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '地名',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '更新时间',
            dataIndex: 'lastTime',
            key: 'lastTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}</span>)
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
            <PageHeaderLayout title={'非关系地图列表'}>
                <Card bordered={false}>
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