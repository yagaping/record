import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Button,
    Table, 
    Modal,
    Select,
    Input,
    Divider,
    Popconfirm,
    DatePicker
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params } = props;
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
            title={btn == 'add' ? "添加" : '编辑'}
            width={800}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="成语">
                {form.getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入成语' }],
                    initialValue: params ? params.content : '',
                })(<Input placeholder="请输入成语" maxLength={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拼音">
                {form.getFieldDecorator('pronounce', {
                    rules: [{ required: true, message: '请输入拼音' }],
                    initialValue: params ? params.pronounce : '',
                })(<Input placeholder="请输入拼音" />)}             
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="释义">
                {form.getFieldDecorator('analysis', {
                    // rules: [{ required: true, message: '请输入释义' }],
                    initialValue: params ? params.analysis : '',
                })(<TextArea placeholder="请输入释义" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="来源">
                {form.getFieldDecorator('source', {
                    // rules: [{ required: true, message: '请输入来源' }],
                    initialValue: params ? params.source : '',
                })(<TextArea placeholder="请输入来源" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="示例">
                {form.getFieldDecorator('example', {
                    // rules: [{ required: true, message: '请输入示例' }],
                    initialValue: params ? params.example : '',
                })(<TextArea placeholder="请输入示例" rows={4}/>)}                 
            </FormItem>
        </Modal>
    )
})
@connect(({ idiom, loading }) => ({
    idiom,
    loading: loading.models.idiom,
}))
@Form.create()
export default class Idiom extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        modalVisibleTime: false,
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        showSort: false,
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
                type: 'idiom/getIdiomList',
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
        this.setState({ loading: true, showSort: false });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'idiom/getIdiomList',
            payload: {
                page: 1,
                pageSize: 10,
                title: '',
                publishId: '',
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

    optionChange = (a, b) => {
        if(a == '1') {
            this.setState({ showSort: true });
        }else {
            this.setState({ showSort: false });
        } 
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="成语">
                    {getFieldDecorator('content',{
                        initialValue: '',
                    })(<Input placeholder="请输入成语" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                        {getFieldDecorator('publishId',{
                            initialValue: "",
                        })(
                            <Select placeholder="请选择发布状态" onChange={this.optionChange}>
                                <Option value="" key="-1">全部</Option>
                                <Option value="0" key="0">待发布</Option>
                                <Option value="1" key="1">已发布</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                {
                    this.state.showSort ? 
                    <Col md={4} sm={24}>
                        <FormItem label="排序方式">
                            {getFieldDecorator('state', {
                                initialValue: '1',
                            })(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="1">发布时间</Option>
                                    <Option value="2">收藏数</Option>
                                    <Option value="3">分享数</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col> :
                    null
                }
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
                type: 'idiom/getIdiomList',
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
            type: 'idiom/addIdiomList',
            payload: {
                graspIdiom: {
                    ...fields,
                    publishId: 0
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
        const { params } = this.state;
        this.props.dispatch({
            type: 'idiom/updateIdiomList',
            payload: {
                graspIdiom: {
                    ...fields,
                    id: this.state.id,
                    publishId: params.publishId
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
    }

      //删除
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'idiom/deleteIdiomList',
            payload: {
                id: params.id,
                publishId: 0
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
    //发布时间弹框
    showTimeModal = (flag, params) => {
        this.canPublish = true;  //打开发布  设置标识
        this.setState({
            modalVisibleTime: !!flag,
            params: params,
            // publishTime: new Date()
        })  
    }
    
    hideTimeModal = () => {
        this.showTimeModal();
    }
    //获取时间
    getDate = (publishTime, dateString) => {
        this.setState({
            publishTime: dateString
        })
    }

    publish = () => {
        const { publishTime, params } = this.state;
        if(!(!!publishTime)) return message.error('请选择发布时间');
        if(this.canPublish) {
            this.props.dispatch({
                type: 'idiom/addIdiomList',
                payload: {
                    id: params.id,
                    publishId: 1,
                    publishTime: publishTime
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0'){
                            this.getData();
                            message.success('发布成功')
                        }else{
                            message.error(res.message || '服务器错误')
                        }
                    }
                    this.setState({ loading: false, modalVisibleTime: false  });
                },
            })
        }
        this.canPublish = false;
    }

    publishCancle = (params) => {
        this.props.dispatch({
            type: 'idiom/deleteIdiomList',
            payload: {
                id: params.id,
                publishId: params.publishId,       //已发布的publishid和id相同
                shareCount: params.shareCount
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('取消成功');
                        this.canPublish = true;
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

    render() {
        const { dataList, total } = this.props.idiom.data && this.props.idiom.data.data;
        const  { page, pageSize, loading, modalVisibleTime, publishTime } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '成语',
            dataIndex: 'content',
            key: 'content',
            width: 200
          }, {
            title: '拼音',
            dataIndex: 'pronounce',
            key: 'pronounce',
            width: 200
          }, {
            title: '释义',
            dataIndex: 'analysis',
            key: 'analysis',
            width: 300
          }, {
            title: '来源',
            dataIndex: 'source',
            key: 'source',
            width: 300
          }, {
            title: '示例',
            dataIndex: 'example',
            key: 'example',
            width: 300
          },{
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
          },{
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
          }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (value, row, key) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
            }
          }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (value, row, key) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD') : null}</span>)
            }
          }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (value, row, index) => {
            return(
                <Fragment key={index}>
                     <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                        <Divider type="vertical" />
                        {row.publishId == 0 ?
                            <a href="javascript:;" onClick={ () => this.showTimeModal(true,row) }>{'发布'}</a>
                            :
                            <a href="javascript:;" style={{color:"#3bfc7b"}} >{'已发布'}</a>
                        }
                        <Divider type="vertical" />
                        {row.publishId == 0 ?
                            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
                                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                            </Popconfirm>
                            :
                            <a href="javascript:;" onClick={ () => this.publishCancle(row)}>{'取消发布'}</a>
                        }
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
                        pagination={pagination}
                        loading={loading}
                        rowKey='id'
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
                {/* 发布时间 */}
                <Modal 
                    visible={modalVisibleTime}
                    onOk={this.publish}
                    onCancel={this.hideTimeModal}
                    title={"发布时间"}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布时间">
                        <DatePicker style={{width: '100%'}} value={publishTime ?  moment(publishTime) : null} onChange={this.getDate} format="YYYY-MM-DD"  />
                    </FormItem>   
                </Modal>
            </div>
        )
    }
}