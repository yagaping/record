import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
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
import styles from '../SystemManagement/TableList.less';
import WangEditor from '../../components/WangEditor';
import UploadFile from '../../components/UploadFile';
import PhoneView from '../../components/PhoneView';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
    const { modalVisible, form, params,  content, handleAdd, handleEdit, btn, handleModalVisible,richText, setFileList, fileList, getImgUrl, historyTime, getDate } = props;
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
            {
                btn == 'add' 
                ?
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
                    <DatePicker style={{width: '100%'}} value={historyTime ?  moment(historyTime) : null} onChange={getDate} format="YYYY-MM-DD"  />
                </FormItem>
                :
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年份">
                    {form.getFieldDecorator('year', {
                        // rules: [{ required: true, message: '请输入年份' }],
                        initialValue: params ? params.year : '',
                    })(<InputNumber style={{width: '100%'}}/>)}
                </FormItem>
            }
            
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                {form.getFieldDecorator('modifyTitle', {
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
@connect(({ historyList, loading }) => ({
    historyList,
    loading: loading.models.historyList,
}))
@Form.create()
export default class HistoryList extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        fileList: [],
        content: '',
        imgUrl:'',
        affair: { 
            img: "",
            month: "",
            id: ""
        },
        phoneContent: '',
        phoneModalVisible: false,
        phoneTitle: '',
        phoneYear: '',
        historyTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
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
                type: 'historyList/findAffair',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    date: fieldsValue.date ? moment(fieldsValue.date).format('YYYY-MM-DD') : '',
                    ...fieldsValue
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
            type: 'historyList/findAffair',
            payload: {
                page: 1,
                pageSize: 10,
                date: '',
                isImg: '3',
                state: ''
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
                <Col md={4} sm={24}>
                    <FormItem label="列表图片">
                        {getFieldDecorator('isImg', {
                            // rules: [{ required: true, message: '请选择日期' }],
                            initialValue: '3',
                        })(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                <Option value="3">全部</Option>
                                <Option value="1">有</Option>
                                <Option value="2">无</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="日期">
                        {getFieldDecorator('date', {
                            // rules: [{ required: true, message: '请选择日期' }],
                            // initialValue: moment(this.state.prevStartTime),
                        })(<DatePicker style={{width: '100%'}} format="YYYY-MM-DD" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="审核状态">
                        {getFieldDecorator('state', {
                            initialValue: '',
                        })(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                <Option value="">全部</Option>
                                <Option value="0">待审核</Option>
                                <Option value="1">已审核</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="排序方式">
                        {getFieldDecorator('type', {
                            initialValue: '2',
                        })(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                <Option value="2">收藏数</Option>
                                <Option value="3">分享数</Option>
                            </Select>
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
                date: fieldsValue.date ? moment(fieldsValue.date).format('YYYY-MM-DD') : '',
                ...fieldsValue
            };
            dispatch({
                type: 'historyList/findAffair',
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
            params: params ? params : null, 
            id: params ? params.id : null,
            btn: btn ? btn : null,
            month: params ? params.month : null,
            fileList: params && params.imgUrl ? [{
                uid: -1,
                status: 'done',
                url: params.imgUrl || '',
            }] : [],
            content: params ?  params.content : '',
            imgUrl: params ? params.imgUrl : null
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        const that = this;
        const { content, imgUrl, historyTime } = that.state;
        if(content == undefined) return message.error('文本与图片之间需回车换行');    
        this.props.dispatch({
            type: 'historyList/addAffair',
            payload: {
                affair: { 
                    imgUrl: imgUrl,
                    title: fields.modifyTitle,
                    desc: fields.desc,
                    content: content,
                },
                date: historyTime
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
        const { content, imgUrl, month, id } = that.state;
        if(content == undefined) return message.error('文本与图片之间需回车换行');    
        this.props.dispatch({
            type: 'historyList/modifyAffair',
            payload: {
                affair: { 
                    imgUrl: imgUrl,
                    month: month,
                    title: fields.modifyTitle,
                    desc: fields.desc,
                    content: content,
                    id: id,
                    year: fields.year
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
            imgUrl:url,
        })
    }

    //删除
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'historyList/removeAffair',
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
    // 人工审核数据是否通过
    peopleExamine = (row) => {
        this.props.dispatch({
            type: 'historyList/peopleExamine',
            payload: {
                id: row.id,
                state: row.state == 0 ? '1' : '0'
            },
            callback: (res) => {
                if(res) {
                    if(res.code == 0) {
                        this.getData();
                        message.success(row.state == 0 ? '审核成功' : '取消审核成功');
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

    //获取时间
    getDate = (historyTime, dateString) => {
        this.setState({ historyTime: dateString })
    }

    render() {
        const { form } = this.props;
        const { dataList, total } = this.props.historyList && this.props.historyList.data;
        const  { page, pageSize, loading, phoneTitle, phoneYear, phoneContent, phoneModalVisible } = this.state;
        const columns = [{
            title: '列表图片',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
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
            render: (value, row, index) => {
                return(<a href={row.url ? row.url : 'javascript:;'} target='_blank'>{value}</a>)
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            width: 600
        }, {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width:110,
            render: (value, row, index) => {
                return(<span>{row.year + '-' + row.month + '-' + row.day}</span>)
            }
        }, {
            title: '审核状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, row, index) => {
                return(<span style={value == 0 ? null : {color: '#3bfc7b'}}>{value == 0 ? '待审核' : '已审核'}</span>)
            }
        }, {
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
        }, {
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
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
                        <a href="javascript:;" onClick={() => this.showPhone(true,row)}>预览</a>
                        <Divider type="vertical" />
                        {row.state == 0 ?
                            <a href="javascript:;" onClick={() => this.peopleExamine(row)}>{'审核'}</a>
                          :
                            <a href="javascript:;" style={{color:"#FF3500"}} onClick={() => this.peopleExamine(row)}>{'取消审核'}</a>
                        }
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
            richText: this.richText,
            getImgUrl: this.getImgUrl,
            setFileList: this.setFileList,
            okHandle: this.okHandle,
            handleModalVisible: this.handleModalVisible,
            handleEdit: this.handleEdit,
            handleAdd: this.handleAdd,
            getDate: this.getDate,
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
                <CreateForm {...parentMethods} {...this.state} ref="myform"/>
                <PhoneView 
                    phoneTitle={phoneTitle} 
                    phoneYear={phoneYear}
                    phoneContent={phoneContent} 
                    phoneModalVisible={phoneModalVisible} 
                    showPhone={this.showPhone}
                />
            </div>
        )
    }
}