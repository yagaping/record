import React, { Fragment } from 'react';
import {
    Table,
    Input,
    Form,
    message,
    Select,
    Card,
    Row,
    Col,
    Button,
    DatePicker
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ commonLog, loading }) => ({
    commonLog,
    loading: loading.models.commonLog
}))
@Form.create()
export default class NoticeLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            refresh: false,
        };
        this.timer = null;
    }

    componentDidMount() {
        this.getLogList();
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    setStateAsync = state => {
        return Promise.resolve(
            this.setState(state)
        )
    }

    //自动刷新
    async refreshBtn(flag) {
        await this.setStateAsync({ refresh: !flag });
        if(this.state.refresh) { 
            this.timer = setInterval(() => {
                this.getLogList();
            },3000)
        }else{
            clearInterval(this.timer);
        }
    }

    getLogList = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        const { page, pageSize } = this.state;
        form.validateFields((err, fieldsValue) => {
            fieldsValue.createTime = fieldsValue.createTime ? Date.parse(moment(fieldsValue.createTime).format('YYYY-MM-DD HH:mm:ss')) : '';
            fieldsValue.logLevel = fieldsValue.logLevel ? fieldsValue.logLevel : '';
            dispatch({
                type: 'commonLog/getLog',
                payload: {
                    list: { ...fieldsValue },
                    pageSize: pageSize,
                    offset: (page - 1) * pageSize,
                    tab: 'notice_log',
                    indexName: 'msgId_index'
                },
                callback: res => {
                    if(res) {
                        if(res.code === 0) {
                            
                        }
                        else {
                            message.error(res.message || '服务器错误')
                        }
                        this.setState({ loading: false });
                    }
                }
            })
        })
    }

    reset = () => {
        this.setState({ loading: true })
        const { dispatch, form } = this.props;
        form.resetFields();
        form.validateFields((err, fieldsValue) => {
            fieldsValue.createTime = '';
            dispatch({
                type: 'commonLog/getLog',
                payload: {
                    list: { ...fieldsValue },
                    pageSize: 10,
                    offset: 0,
                    tab: 'notice_log',
                    indexName: 'msgId_index'
                },
                callback: res => {
                    if(res) {
                        if(res.code === 0) {
                            this.setState({ 
                                page: 1, 
                                pageSize: 10,
                            })
                        }
                        else {
                            message.error(res.message || '服务器错误')
                        }
                        this.setState({ loading: false })
                    }
                }
            })
        })
    }

    pageClick = (current, pageSize) => {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            fieldsValue.createTime = fieldsValue.createTime ? Date.parse(moment(fieldsValue.createTime).format('YYYY-MM-DD HH:mm:ss')) : '';
            fieldsValue.logLevel = fieldsValue.logLevel ? fieldsValue.logLevel : '';
            dispatch({
                type: 'commonLog/getLog',
                payload: {
                    list: { ...fieldsValue },
                    offset: (current - 1) * pageSize,
                    pageSize: pageSize,
                    tab: 'notice_log',
                    indexName: 'msgId_index'
                },
                callback: (res) => {
                    if(res) {
                        if(res.code === 0) {
                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }

    //跳转到公共日志详情
    detail = id => {
        // this.props.dispatch(routerRedux.push({
        //     pathname: '/systemManagement/journal-management',
        //     id: id
        // }))
        this.props.tabChange('2', id)
    }

    renderForm = () => {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="消息ID">
                            {getFieldDecorator('msgId', {
                                initialValue: '',
                            })(<Input placeholder="请输入消息ID" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="日志等级">
                            {getFieldDecorator('logLevel', {
                                // initialValue: '',
                            })(
                                <Select style={{width: '100%'}} placeholder='请选择日志等级'>
                                    <Option value='INFO'>INFO</Option>
                                    <Option value='DEBUG'>DEBUG</Option>
                                    <Option value='WARN'>WARN</Option>
                                    <Option value='ERROR'>ERROR</Option>
                                    <Option value='FATAL'>FATAL</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="日志消息">
                            {getFieldDecorator('logMsg', {
                                initialValue: '',
                            })(<Input placeholder='请输入日志消息' />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="方法名">
                            {getFieldDecorator('methodIn', {
                                initialValue: '',
                            })(<Input placeholder="请输入方法名" />)}
                            
                        </FormItem>
                    </Col>
                </Row>
                <Row  gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="类名">
                            {getFieldDecorator('classnameIn', {
                                initialValue: '',
                            })(<Input placeholder="请输入类名" />)}
                            
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="日志状态">
                            {getFieldDecorator('logStatusStr', {
                                initialValue: '',
                            })(<Input placeholder="请输入日志状态" />)}
                            
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="创建时间">
                            {getFieldDecorator('createTime', {
                                initialValue: null,
                            })(<DatePicker placeholder='请选择时间' style={{width: '100%'}} format={'YYYY-MM-DD'} />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24} >
                        <span style={{ marginBottom: 24 }}>
                            <Button type="primary" onClick={this.getLogList}>
                            查询
                            </Button>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.refreshBtn(this.state.refresh)}>
                            {!this.state.refresh ? '自动刷新' : '停止刷新'}
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

    render() {
        const { loading, page, pageSize } = this.state;
        const { list, total } = this.props.commonLog.data;
        const { form } = this.props;
        const columns = [{
            title: '日志等级',
            dataIndex: 'logLevel',
            key: 'logLevel',
        },{
            title: '日志状态',
            dataIndex: 'logStatusStr',
            key: 'logStatusStr',
        },{
            title: '方法名',
            dataIndex: 'methodIn',
            key: 'methodIn',
        },{
            title: '类名',
            dataIndex: 'classnameIn',
            key: 'classnameIn',
        },{
            title: '日志消息',
            dataIndex: 'logMsg',
            key: 'logMsg',
            width: 850,
            render: (value, row, index) => {
                const regExp = new RegExp(form.getFieldValue('logMsg'), 'g');
                let newValue = value.replace(regExp, `<span style='color: #ff8000'>${form.getFieldValue('logMsg')}</span>`);
                if(form.getFieldValue('logMsg')){
                    return(<span key={index} dangerouslySetInnerHTML = {{ __html:newValue }}></span>)
                }else {
                    return(<span key={index}>{value}</span>)
                }
            }
        },{
            title: '消息ID',
            dataIndex: 'msgId',
            key: 'msgId',
            render: (value, row, index) => {
                return (
                    <a key={index} href='javascript:;' onClick={() => this.detail(value)}>{value}</a>
                )
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
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
              this.pageClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.pageClick(current, pageSize)
            },
        };
        return (
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <Table 
                        className={styles.myTable}
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={(list instanceof Array) ? list : []} 
                        loading={loading}
                        pagination={pagination}
                        rowKey='id'
                    />
                </div>
            </div>
        )
    }
}