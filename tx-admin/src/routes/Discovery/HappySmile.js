import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Modal,
    Select,
    Divider,
    Input,
    Popconfirm,
    DatePicker,
    Tabs
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import WangEditor from '../../components/WangEditor';
import { setRichText } from '../../utils/toRichText';
import DailyReadingKnowledge from './DailyReadingKnowledge';
import WellKnownSaying from './WellKnownSaying';
import Story from './Story';
import Poetry from './Poetry';
import Idiom from './Idiom';
import Word from './Word';
import HistoryList from './HistoryList';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params, content, richText,} = props;
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
            title={btn == 'add' ? "添加" : '编辑'}
            width={1050}
            keyboard={false}
            maskClosable={false}            
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                {form.getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入标题' }],
                initialValue: params ? params.title : '',
                })(<Input placeholder="请输入标题" maxLength={200}/>)}
            </FormItem>   
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本内容">
                <WangEditor richText={richText} content={content} modalVisible={modalVisible} replaceLabel={true} />         
            </FormItem>
        </Modal>
    )
})
@connect(({ happySmile, loading }) => ({
    happySmile,
    loading: loading.models.happySmile,
}))
@Form.create()
export default class HappySmile extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        modalVisibleTime: false,
        content:[],
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
                type: 'happySmile/getHappySmile',
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
            type: 'happySmile/getHappySmile',
            payload: {
                page: 1,
                pageSize: 10,
                title: ''
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
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="标题">
                    {getFieldDecorator('title',{
                        initialValue: '',
                    })(<Input placeholder="请输入标题" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                    {getFieldDecorator('publishId',{
                        initialValue: "",
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
                type: 'happySmile/getHappySmile',
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
            content: params ?  setRichText(params.content) : [],
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        const { content } = this.state;
        if(content == undefined) return message.error('文本与图片之间需回车换行');  
        this.props.dispatch({
            type: 'happySmile/addHappySmile',
            payload: {
                graspJoke: {
                    ...fields,
                    content: content,
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
        const { content } = this.state;
        const { publishId, id } = this.state.params;
        if(content == undefined) return message.error('文本与图片之间需回车换行');  
        this.props.dispatch({
            type: 'happySmile/updateHappySmile',
            payload: {
                graspJoke: {
                    ...fields,
                    content: content,
                    publishId: publishId,
                    id: id
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

    //删除
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'happySmile/deleteHappySmile',
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

    // 获取富文本
    richText = (html) =>{
        this.setState({
            content:html
        })
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
        this.setState({ publishTime: dateString })
    }

    publish = () => {
        const { publishTime, params } = this.state;
        if(!(!!publishTime)) return message.error('请选择发布时间');
        if(this.canPublish) {
            this.props.dispatch({
                type: 'happySmile/addHappySmile',
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
        type: 'happySmile/deleteHappySmile',
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
        const { dataList, total } = this.props.happySmile.data && this.props.happySmile.data.data;
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
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
          },{
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
          },
        //   {
        //     title: '文本内容',
        //     dataIndex: 'content',
        //     key: 'content',
        //     render: (value, row, index) => {
        //         return(<p style={{width: 600, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
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
            richText: this.richText,
            setFileList: this.setFileList,
        };

        return(
            <PageHeaderLayout title={'涨知识'}>
                <Card bordered={false}>
                    <Tabs 
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        type='card'
                    >                        
                        <TabPane tab='笑一笑' key='1'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} />
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
                        </TabPane>
                        <TabPane tab='没想到' key='2'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} />  
                            <DailyReadingKnowledge />
                        </TabPane>
                        <TabPane tab='正能量' key='3'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <WellKnownSaying />
                        </TabPane>
                        <TabPane tab='精选文章' key='4'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <Story />
                        </TabPane>
                        <TabPane tab='诗词' key='5'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <Poetry />
                        </TabPane>
                        <TabPane tab='成语' key='6'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <Idiom />
                        </TabPane>
                        <TabPane tab='英语单词' key='7'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <Word />
                        </TabPane>
                        <TabPane tab='历史今天' key='8'>
                            <ModuleIntroduce text={'APP涨知识编辑发布配置'} /> 
                            <HistoryList />
                        </TabPane>
                    </Tabs>
                </Card>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
                {/* 发布时间弹框 */}
                <Modal 
                    visible={modalVisibleTime}
                    onOk={this.publish}
                    onCancel={this.hideTimeModal}
                    title={"发布时间"}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布时间">
                        <DatePicker  value={publishTime ? moment(publishTime) : null} onChange={this.getDate}  style={{width: '100%'}} format="YYYY-MM-DD"  />
                    </FormItem>   
                </Modal>
            </PageHeaderLayout>
        )
    }
}