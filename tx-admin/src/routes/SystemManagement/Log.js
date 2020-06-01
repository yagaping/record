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
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import moment from 'moment';
const { Option } = Select;
const FormItem = Form.Item;

const operator = {
    0: '电信',
    1: '联通',
    2: '移动',
    3: '其他'
}
const network = {
    0: 'WiFi',
    1: '4G',
    2: '3G'
}
const device = {
    0: '其它',
    1: '华为',
    2: '小米',
    3: '苹果'
}
const system = {
    1: 'Android',
    2: 'iOS'
}
const starttype = {
    0: '全新启动',
    1: '后台启动'
}
const logType = {
    1: '启动日志',
    2: '操作日志',
    3: '浏览时长日志'
}


@connect(({ log, loading }) => ({
    log,
    loading: loading.models.log
}))
@Form.create()
export default class Log extends React.Component {
    state = {
        page: 1,
        pageSize: 10,
    }

    componentDidMount() {
        this.getLogList();
    }

    getLogList = () => {
        const { dispatch, form } = this.props;
        const { page, pageSize } = this.state;
        form.validateFields((err, fieldsValue) => {
            dispatch({
                type: 'log/getLogList',
                payload: {
                    ...fieldsValue,
                    pageSize: pageSize,
                    offset: (page - 1) * pageSize
                },
                callback: res => {
                    if(res) {
                        if(res.code === 0) {
                            
                        }
                        else {
                            message.error(res.message || '服务器错误')
                        }
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
            dispatch({
                type: 'log/getLogList',
                payload: {
                    ...fieldsValue,
                    pageSize: 10,
                    offset: 0
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
            if(err) return;
            dispatch({
                type: 'log/getLogList',
                payload: {
                    ...fieldsValue,
                    offset: (current - 1) * pageSize,
                    pageSize: pageSize,
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
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="日志类型">
                            {getFieldDecorator('logType', {
                                initialValue: '',
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value=''>请选择</Option>
                                    <Option value='1'>启动日志</Option>
                                    <Option value='2'>操作日志</Option>
                                    <Option value='3'>浏览时长日志</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="IDFA">
                            {getFieldDecorator('idfa', {
                                initialValue: '',
                            })(<Input placeholder="请输入IDFA" />)}
                            
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24} >
                        <span style={{ marginBottom: 24 }}>
                            <Button type="primary" onClick={this.getLogList}>
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

    render() {
        const { loading, page, pageSize } = this.state;
        const { list, total } = this.props.log.data;
        const columns = [{
            title: 'IDFA',
            dataIndex: 'idfa',
            key: 'idfa',
            width: 100
        },{
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },{
            title: '启动类型',
            dataIndex: 'starttype',
            key: 'starttype',
            render: value => {
                return(<span>{starttype[value]}</span>)
            }
        },{
            title: '模块名称(ID)',
            dataIndex: 'modularName',
            key: 'modularName',
            render: (value, row, index) => {

                if(value && row.modularId) {

                    return(<span>{(value + '('+ row.modularId + ')') }</span>)

                }else if(value && !row.modularId) {

                    return(<span>{value}</span>)

                }else if(!value && row.modularId) {

                    return(<span>{'(' + row.modularId + ')'}</span>)

                }else { return '--' }
            }
        },{
            title: '页面名称(ID)',
            dataIndex: 'menuName',
            key: 'menuName',
            render: (value, row, index) => {
                //日志类型为操作日志时  取pageName和pageId （这时事件名称才有值） 为其他类型时  取menuName和menuId（事件名称无值）
                if(row.logType == 2) {

                    if(row.pageName && row.pageId) {

                        return(<span>{row.pageName + '('+row.pageId+')'}</span>)

                    }else if(row.pageName && !row.pageId) {

                        return(<span>{row.pageName}</span>)
                        
                    }else if(!row.pageName && row.pageId) {

                        return(<span>{'(' + row.pageId + ')'}</span>)

                    }else { return '--' }

                }else {

                    if(value && row.menuid) {

                        return(<span>{value + '(' + row.menuid + ')'}</span>)

                    }else if(value && !row.menuid) {

                        return(<span>{value}</span>)
                        
                    }else if(!value && row.menuid) {

                        return(<span>{'(' + row.menuid + ')'}</span>)

                    }else { return '--' }

                }
            }
        },{
            title: '事件名称(ID)',
            dataIndex: 'eventName',
            key: 'eventName',
            render: (value, row, index) => {

                if(row.logType == 2) {
                    
                    if(row.menuName && row.menuid) {

                        return(<span>{row.menuName + '(' + row.menuid + ')'}</span>)

                    }else if(row.menuName && !row.menuid) {

                        return(<span>{row.menuName}</span>)
                        
                    }else if(!row.menuName && row.menuid) {

                        return(<span>{'(' + row.menuid + ')'}</span>)

                    }else { return '--' }

                }else { return '--' }
            }
        },{
            title: '日志类型',
            dataIndex: 'logType',
            key: 'logType',
            render: value => {
                return(<span>{logType[value]}</span>)
            }
        },{
            title: '日志时间',
            dataIndex: 'datetime',
            key: 'datetime',
        },{
            title: '启动时间',
            dataIndex: 'launchTime',
            key: 'launchTime',
            render:key => key || '--'
        }, {
            title: '进入时间',
            dataIndex: 'enterTime',
            key: 'enterTime',
            render: value => {
                return(<span>{value ? moment(parseInt(value)).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>)
            }
        },{
            title: '离开时间',
            dataIndex: 'leaveTime',
            key: 'leaveTime',
            render: value => {
                return(<span>{value ? moment(parseInt(value)).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>)
            }
        },
        // {
        //     title: '设备',
        //     dataIndex: 'device',
        //     key: 'device',
        //     render: value => {
        //         return(<span>{device[value]}</span>)
        //     }
        // },
        {
            title: '设备信息',
            dataIndex: 'model',
            key: 'model',
        },{
            title: '操作系统',
            dataIndex: 'system',
            key: 'system',
            render: value => {
                return(<span>{system[value]}</span>)
            }
        },{
            title: '系统版本',
            dataIndex: 'osversion',
            key: 'osversion',
        },{
            title: '软件版本',
            dataIndex: 'version',
            key: 'version',
        },{
            title: '网络',
            dataIndex: 'network',
            key: 'network',
            render: value => {
                return(<span>{network[value]}</span>)
            }
        },{
            title:'内容',
            dataIndex:'content',
            key:'content',
            width:360,
            render: key => key || '--'
        },{
            title: '运营商',
            dataIndex: 'operator',
            key: 'operator',
            render: value => {
                return(<span>{operator[value]}</span>)
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
                        scroll={{x:2100}}
                    />
                </div>
            </div>            
        )
    }
}