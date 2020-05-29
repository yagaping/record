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
    Popconfirm,
    DatePicker,
    Divider 
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
import UploadFile from '../../components/UploadFile';
const FormItem = Form.Item;
const { Option } = Select;
const TextArea = Input.TextArea;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params, getImgUrl, fileList, setFileList } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            btn == 'add' ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? "添加" : "编辑"}
            width={1050}
            keyboard={false}
            maskClosable={false}
        >
             <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
                <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="对齐方式">
                {form.getFieldDecorator('align', {
                rules: [{ required: true, message: '请选择对齐方式' }],
                initialValue: params ? String(params.align) : '1',
                })(
                <Select placeholder="请选择重复方式" style={{ width: '100%' }} > 
                    <Option value='1' >{'左'}</Option>
                    <Option value='2' >{'中'}</Option>
                    <Option value='3' >{'右'}</Option>
                    <Option value='4' >{'两端'}</Option>
                </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
                {form.getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入内容' }],
                initialValue: params ? params.content : '',
                })(<TextArea placeholder="请输入内容"   rows={16}/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
                {form.getFieldDecorator('author', {
                // rules: [{ required: true, message: '请输入作者' }],
                initialValue: params ? params.author : '',
                })(<Input placeholder="请输入作者"  />)}
            </FormItem>
        </Modal>
    )
})
@connect(({ wellKnownSaying, loading }) => ({
    wellKnownSaying,
    loading: loading.models.wellKnownSaying,
}))
@Form.create()
export default class WellKnownSaying extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        modalVisibleTime: false,
        imgUrl: '',
        fileList: [],
        showSort: false
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
                type: 'wellKnownSaying/getQuotes',
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
        const { form, dispatch } = this.props;
        this.setState({ loading: true, showSort: false });
        form.resetFields();
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'wellKnownSaying/getQuotes',
                payload: {
                    ...fieldsValue,
                    page: 1,
                    pageSize: 10,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({
                                page: 1,
                                pageSize: 10,
                                loading: false
                            });
                        }else{
                            this.setState({ loading: false });
                            message.error(res.message || '服务器错误');
                        }
                    }
                },
            });
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
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="内容">
                        {getFieldDecorator('content',{
                            initialValue: '',
                        })(<Input placeholder="请输入内容" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="作者">
                        {getFieldDecorator('author',{
                            initialValue: '',
                        })(<Input placeholder="请输入作者" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                        {getFieldDecorator('publishId',{
                            initialValue: '',
                        })(
                            <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.optionChange}>
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
                type: 'wellKnownSaying/getQuotes',
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
            id: params ? params.id : null,
            imgUrl: params ? params.picpath : null,
            fileList: params && params.picpath ? [{
                uid: -1,
                status: 'done',
                url: params.picpath
            }] : [],
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'wellKnownSaying/addQuotes',
            payload: {
                graspQuotes: {
                    ...fields,
                    picpath: this.state.imgUrl,
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
            type: 'wellKnownSaying/updateQuotes',
            payload: {
                graspQuotes: {
                    ...fields,
                    id: params.id,
                    picpath: this.state.imgUrl,
                    publishId: params.publishId
                }
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

      // 设置图片
    setFileList = ( obj ) => {
        this.setState({
            fileList:obj
        })
    }

    // 获取上传图片base64
    getImgUrl = (url) => {
        this.setState({
            imgUrl:url,
        })
    }
      //删除
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'wellKnownSaying/deleteQuotes',
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
            publishTime: dateString
        })
    }

    publish = () => {
        const { publishTime, params } = this.state;
        if(!(!!publishTime)) return message.error('请选择发布时间');
        if(this.canPublish) {
            this.props.dispatch({
                type: 'wellKnownSaying/addQuotes',
                payload: {
                    id: params.id,
                    publishId: 1,
                    publishTime: publishTime,
                    align: params.align
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
                    this.setState({ modalVisibleTime: false  });
                },
            })
        }
        this.canPublish = false;
    }

    publishCancle = (params) => {
        this.props.dispatch({
            type: 'wellKnownSaying/deleteQuotes',
            payload: {
                id: params.id,
                publishId: params.publishId,
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
        const { dataList, total } = this.props.wellKnownSaying.data && this.props.wellKnownSaying.data.data || [];
        const  { page, pageSize, loading, modalVisibleTime, publishTime } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '对齐方式',
            dataIndex: 'align',
            key: 'align',
            render: (value, row, key) => {
              let openType;
              switch(value) {
                case 1:
                  openType = '左';
                  break;
                case 2: 
                  openType = '中';
                  break;
                case 3: 
                  openType = '右边';
                  break;
                case 4: 
                  openType = '两端';
                  break;
              }
              return (
                <div>{openType}</div>          
              )
            }
          }, {
            title: '图片',
            dataIndex: 'picpath',
            key: 'picpath',
            render: (value, row, index) => {
                return( value ? <div style={{width:'100px',height:'60px'}}><img width="100" height="60" src={value}/></div> : null)
            }
          }, {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            render: (value, row, index) => {
                return(<p style={{width: 600, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
            }
          }, {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
          }, {
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
          },{
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
          },{
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
            setFileList: this.setFileList,
            getImgUrl: this.getImgUrl,
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