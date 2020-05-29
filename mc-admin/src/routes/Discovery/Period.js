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
    DatePicker,
    Select,
    Divider,
    Popconfirm,
    InputNumber 
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import WangEditor from '../../components/WangEditor';
import UploadFile from '../../components/UploadFile';
import PhoneView from '../../components/PhoneView';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
    const { modalVisible, form, params,  content, handleAdd, handleEdit, btn, handleModalVisible,richText, setFileList, fileList, getImgUrl } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    };
    return (
        <Modal 
            visible={modalVisible} 
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "添加" : "编辑"}
            width={1050}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                {form.getFieldDecorator('title', {
                    // rules: [{ required: true, message: '请输入标题' }],
                    initialValue: params ? params.title : '',
                })(<Input placeholder='请输入标题' maxLength={200}/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="列表图片">
                <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                {form.getFieldDecorator('desc', {
                    initialValue: params ? params.desc : '',
                })(<TextArea placeholder="请输入描述" rows={4}/>)}      
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本内容">
                <WangEditor richText={richText} content={content} modalVisible={modalVisible} />         
            </FormItem>
        </Modal>
    );
});
@connect(({ period, loading }) => ({
    period,
    loading: loading.models.period,
}))
@Form.create()
export default class Period extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        fileList: [],
        content: '',
        img:'',
    }

    componentDidMount() {
        this.getData();
    }
    //搜索
    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'period/findPeriod',
                payload: {
                    physiologyTips: {
                        ...fieldsValue
                    },
                    page: this.state.page,
                    pageSize: this.state.pageSize,
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
            type: 'period/findPeriod',
            payload: {
                physiologyTips: {
                    title: ''
                },
                page: 1,
                pageSize: 10,
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
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                    <FormItem label="标题">
                        {getFieldDecorator('title', {
                            initialValue: '',
                        })(<Input placeholder='请输入标题' />)}
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
    
    //pagination 点击分页
    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                ...fieldsValue
            };
            dispatch({
                type: 'period/findPeriod',
                payload: {
                    physiologyTips: values,
                    page: current,
                    pageSize: pageSize,
                },
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
            params: params ? params : null, 
            id: params ? params.id : null,
            btn: btn ? btn : null,
            month: params ? params.month : null,
            fileList: params && params.img ? [{
                uid: -1,
                status: 'done',
                url: params.img || '',
            }] : [],
            content: params ?  params.content : '',
            img: params ? params.img : null
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        const that = this;
        const { content, img } = that.state;
        if(content == undefined) return message.error('文本与图片之间需回车换行');  
        this.props.dispatch({
            type: 'period/addPeriod',
            payload: {
                physiologyTips: { 
                    img: img,
                    title: fields.title,
                    desc: fields.desc,
                    content: content,
                },
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

    //编辑数据
    handleEdit = fields => {
        const that = this;
        const { content, img, month, id } = that.state;
        if(content == undefined) return message.error('文本与图片之间需回车换行');  
        this.props.dispatch({
            type: 'period/modifyPeriod',
            payload: {
                physiologyTips: { 
                    img: img,
                    title: fields.title,
                    desc: fields.desc,
                    content: content,
                    id: id,
                },
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

      // 获取富文本
    richText = (html) =>{
        this.setState({
            content: html
        })
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
            img:url,
        })
    }

    //删除
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'period/removePeriod',
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
    //手机预览弹框
    showPhone = (flag,row) => {
        this.setState({
            phoneModalVisible: flag,
            phoneContent: row ? row.content : '',
            phoneTitle: row ? row.title : '',
            phoneYear: row ? row.lastYear : ''
        })
    }

    render() {
        const { form } = this.props;
        const { dataList, total } = this.props.period && this.props.period.data;
        const  { page, pageSize, loading, phoneTitle, phoneYear, phoneContent, phoneModalVisible } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '列表图片',
            dataIndex: 'img',
            key: 'img',
            width:160,
            render: (value, row, index) => {
                return(
                <Fragment key={index}>
                    {value ? <img src={value} style={{width: 95,height: 75, borderRadius: 3}}/> : <p>未上传</p>}
                </Fragment>
                )
            }
        }, {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            width: 600
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
            }
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
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
                        {/* <a href="javascript:;" onClick={() => this.showPhone(true,row)}>预览</a>
                        <Divider type="vertical" /> */}
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
            richText: this.richText,
            getImgUrl: this.getImgUrl,
            setFileList: this.setFileList,
            okHandle: this.okHandle,
            handleModalVisible: this.handleModalVisible,
            handleEdit: this.handleEdit,
            handleAdd: this.handleAdd,
        };

        return(
            <PageHeaderLayout title={'经期小贴士'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'APP中经期管家中的经期百科'} />
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
                <CreateForm {...parentMethods} {...this.state} ref="myform"/>
                <PhoneView 
                    phoneTitle={phoneTitle} 
                    phoneYear={phoneYear}
                    phoneContent={phoneContent} 
                    phoneModalVisible={phoneModalVisible} 
                    showPhone={this.showPhone}
                />
            </PageHeaderLayout>
        )
    }
}