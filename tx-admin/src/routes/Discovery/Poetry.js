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
            fieldsValue.quote = fieldsValue.quote.replace(/↵/g,"");   //去掉回车符
            btn == 'add' ?  handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? "添加" : "编辑"}
            width={800}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                {form.getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题' }],
                    initialValue: params ? params.title : '',
                })(<Input placeholder="请输入标题" maxLength={200} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                {form.getFieldDecorator('type', {
                    initialValue: params ? params.type : '',
                })(<Input placeholder="请输入诗词类型"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
                {form.getFieldDecorator('author', {
                    initialValue: params ? params.author : '',
                })(<Input placeholder="请输入作者"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="朝代">
                {form.getFieldDecorator('dynasty', {
                    initialValue: params ? params.dynasty : '',
                })(<Input placeholder="请输入朝代"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="经典语句">
                {form.getFieldDecorator('quote', {
                    rules: [{ required: true, message: '请输入经典语句' }],
                    initialValue: params ? params.quote : '',
                })(<TextArea placeholder="请输入精选语句" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本内容">
                {form.getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入文本内容' }],
                    initialValue: params ? params.content : '',
                })(<TextArea placeholder="请输入文本内容" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="评析">
                {form.getFieldDecorator('analyse', {
                    initialValue: params ? params.analyse : '',
                })(<TextArea placeholder="请输入评析" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="译文">
                {form.getFieldDecorator('translation', {
                    initialValue: params ? params.translation : '',
                })(<TextArea placeholder="请输入译文" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="注释">
                {form.getFieldDecorator('annotation', {
                    initialValue: params ? params.annotation : '',
                })(<TextArea placeholder="请输入注释" rows={4}/>)}                 
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赏析">
                {form.getFieldDecorator('appreciation', {
                    initialValue: params ? params.appreciation : '',
                })(<TextArea placeholder="请输入赏析" rows={4}/>)}                 
            </FormItem>
        </Modal>
    )
})
@connect(({ poetry, loading }) => ({
    poetry,
    loading: loading.models.poetry,
}))
@Form.create()
export default class Poetry extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        modalVisibleTime: false,
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        time: moment(new Date().getTime()).format('YYYY-MM-DD'),
        showSort: false,
        publishType: ''
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
                type: 'poetry/getPoetryList',
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
            type: 'poetry/getPoetryList',
            payload: {
                page: 1,
                pageSize: 10,
                key: '',
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
            this.setState({ showSort: false});
        }
        this.setState({ publishType: a })
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="标题">
                    {getFieldDecorator('key',{
                        initialValue: '',
                    })(<Input placeholder="请输入作者、内容或标题" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                    {getFieldDecorator('publishId',{
                        initialValue: '',
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.optionChange} >
                            <Option value="">全部</Option>
                            <Option value="0">待发布</Option>
                            <Option value="1">已发布</Option>
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
                type: 'poetry/getPoetryList',
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
            type: 'poetry/addPoetryList',
            payload: {
                graspPoetryContent: {
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
        const { publishId, id } = this.state.params;
        this.props.dispatch({
            type: 'poetry/updatePoetryList',
            payload: {
                graspPoetryContent: {
                    ...fields,
                    id: id,
                    publishId: publishId
                },
                publishType: this.state.publishType
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
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
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'poetry/deletePoetryList',
            payload: {
                id: params.id,
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
        this.canPublish = true;
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
            publishTime: dateString,
            time: publishTime ? publishTime._d.getTime() : ''
        })
    }

    publish = () => {
        const { publishTime, params, time } = this.state;
        if(!(!!publishTime)) return message.error('请选择发布时间');
        if(this.canPublish) {
            this.props.dispatch({
                type: 'poetry/publish',
                payload: {
                    id: params.id,
                    // publishId: 1,
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
        type: 'poetry/deletePoetryList',
        payload: {
            id: params.id,
            publishId: this.state.showSort ? params.id : params.publishId,       //已发布的publishid和id相同
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
        const { dataList, total } = this.props.poetry && this.props.poetry.data || [];
        const  { page, pageSize, loading, modalVisibleTime, publishTime } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
          }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
          }, {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
          }, {
            title: '朝代',
            dataIndex: 'dynasty',
            key: 'dynasty',
          }, {
            title: '经典语句',
            dataIndex: 'quote',
            key: 'quote',
            width: 300
          }, {
            title: '文本内容',
            dataIndex: 'content',
            key: 'content',
            width: 600
          }, {
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
          },{
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
          },
        //    {
        //     title: '评析',
        //     dataIndex: 'analyse',
        //     key: 'analyse',
        //     render: (value, row, index) => {
        //         return(<p style={{width: 200, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
        //     }
        //   }, {
        //     title: '译文',
        //     dataIndex: 'translation',
        //     key: 'translation',
        //     render: (value, row, index) => {
        //         return(<p style={{width: 200, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
        //     }
        //   }, {
        //     title: '注释',
        //     dataIndex: 'annotation',
        //     key: 'annotation',
        //     render: (value, row, index) => {
        //         return(<p style={{width: 200, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
        //     }
        //   }, {
        //     title: '赏析',
        //     dataIndex: 'appreciation',
        //     key: 'appreciation',
        //     render: (value, row, index) => {
        //         return(<p style={{width: 200, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
        //     }
        //   }, 
          {
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
                        rowKey="id"
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
                        <DatePicker style={{width: '100%'}} value={publishTime ? moment(publishTime) : null} onChange={this.getDate} format="YYYY-MM-DD"  />
                    </FormItem>   
                </Modal>
            </div>
        )
    }
}