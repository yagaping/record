import React, { Fragment } from 'react';
import {
    Table,
    Input,
    Form,
    message,
    Card,
    Row,
    Col,
    Button,
    Select,
    DatePicker,
    Tabs
} from 'antd';
import Log from './Log';
import NoticeLog from './NoticeLog';
import ModuleManage from './ModuleManage';
import IncidentManage from './IncidentManage';
import PageManage from './PageManage';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ commonLog, loading }) => ({
    commonLog,
    loading: loading.models.commonLog
}))
@Form.create()
export default class CommonLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            msgId: '',   //从通知日志跳转进来
            refresh: false,
            activeKey: '1'
        };
        this.timer = null;
    }

    componentDidMount() {
        this.getLogList();
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    getLogList = () => {
        this.setState({ loading: true })
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
                    tab: 'common_log',
                    indexName: 'msgId_index'
                },
                callback: res => {
                    if(res) {
                        if(res.code === 0) {
                            
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

    reset = () => {
        this.timer && clearInterval(this.timer);
        this.setState({ loading: true, msgId: '' })
        const { dispatch, form } = this.props;
        form.resetFields();
        form.validateFields((err, fieldsValue) => {
            dispatch({
                type: 'commonLog/getLog',
                payload: {
                    list: { 
                        msgId: '',
                        logMsg: '',
                        logLevel: '',
                        createTime: '',
                    },
                    pageSize: 10,
                    offset: 0,
                    tab: 'common_log',
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
                    tab: 'common_log',
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

    renderForm = () => {
        const { getFieldDecorator } = this.props.form;
        const { msgId, refresh } = this.state;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={4} sm={24}>
                        <FormItem label="消息ID">
                            {getFieldDecorator('msgId', {
                                initialValue: msgId,
                            })(<Input placeholder='请输入消息ID' />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="日志等级">
                            {getFieldDecorator('logLevel', {
                                // initialValue: '',
                            })(
                                <Select style={{width: '100%'}}  placeholder='请选择日志等级'>
                                    <Option value='INFO'>INFO</Option>
                                    <Option value='DEBUG'>DEBUG</Option>
                                    <Option value='WARN'>WARN</Option>
                                    <Option value='ERROR'>ERROR</Option>
                                    <Option value='FATAL'>FATAL</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="日志消息">
                            {getFieldDecorator('logMsg', {
                                initialValue: '',
                            })(<Input placeholder='请输入日志消息' />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="创建时间">
                            {getFieldDecorator('createTime', {
                                initialValue: null,
                            })(<DatePicker  style={{width: '100%'}} format={'YYYY-MM-DD'} />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24} >
                        <span style={{ marginBottom: 24 }}>
                            <Button type="primary" onClick={this.getLogList}>
                            查询
                            </Button>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.refreshBtn(refresh)}>
                            {!refresh ? '自动刷新' : '停止刷新'}
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

    tabChange = (e, param) => {
        this.setState({ 
            activeKey: e,
            msgId: param ? param : ''
        })
    }

    render() {
        const { loading, page, pageSize, activeKey } = this.state;
        const { list, total } = this.props.commonLog.data;
        const { form } = this.props;
        const columns = [{
            title: '消息ID',
            dataIndex: 'msgId',
            key: 'msgId'
        },{
            title: '日志等级',
            dataIndex: 'logLevel',
            key: 'logLevel',
        },{
            title: '日志消息',
            dataIndex: 'logMsg',
            key: 'logMsg',
            width: 850,
            render: (value, row, index) => {
                const regExp = new RegExp(form.getFieldValue('logMsg'), 'g');
                let newValue = value.replace(regExp, `<span style='color:#ff8000'>${form.getFieldValue('logMsg')}</span>`);
                if(form.getFieldValue('logMsg')) {
                    return(
                        <span dangerouslySetInnerHTML = {{ __html:newValue }} key={index}></span>
                    )
                }else {
                    return(<span key={index}>{value}</span>)
                }
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
            <PageHeaderLayout title={'软件日志'}>
                <Card bordered={false}>
                    <Tabs
                        tabBarGutter={10} 
                        onChange={this.tabChange.bind(this)}
                        type='card'
                        activeKey={activeKey}
                    >
                        <TabPane tab='统计日志' key='1'>
                            <ModuleIntroduce text={'查看进入APP相应模块的日志'} />
                            <Log />
                        </TabPane>
                        <TabPane tab='公共日志' key='2'>
                            <ModuleIntroduce text={'查看公共日志'} />
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
                        </TabPane>
                        <TabPane tab='通知日志' key='3'>
                            <ModuleIntroduce text={'查看APP消息推送日志'} />
                            <NoticeLog tabChange={this.tabChange} />
                        </TabPane>
                        <TabPane tab='模块配置' key='4'>
                            <ModuleIntroduce text={'APP模块配置'} />
                            <ModuleManage />
                        </TabPane>
                        <TabPane tab='事件配置' key='5'>
                            <ModuleIntroduce text={'APP事件配置'} />
                            <IncidentManage />
                        </TabPane>
                        <TabPane tab='页面配置' key='6'>
                            <ModuleIntroduce text={'APP页面配置'} />
                            <PageManage />
                        </TabPane>
                    </Tabs>
                </Card>
            </PageHeaderLayout>
        )
    }
}