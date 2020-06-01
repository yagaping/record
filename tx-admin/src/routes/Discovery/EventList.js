import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Table,
    Form,
    message,
    Row,
    Col,
    Input,
    Button,
    Modal,
    Select,
    DatePicker,
    Radio,
    Tabs
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import moment from 'moment';
import EventNotify from './EventNotify';
import EventNotifyCount from './EventNotifyCount';
import EventName from './EventName';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const repeatType = ['一次性事件(不重复)','每天','每星期','每2个星期','每月','每月','每年','自定义','工作日','周末','法定工作日','法定节假日','金融交易日','股指交割日','国债交割日'];
@connect(({ eventList, loading }) => ({
    eventList,
    loading: loading.models.eventList,
}))
@Form.create()
export default class EventList extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        id: '',
        introduce: '',
        loading: false,
        modalVisible: false,
        dataDetail: [],   //详情数据
        pageDetail: 1,
    }

    componentDidMount() {
        this.getEventList();
    }

    getEventList = () => {
        this.setState({ loading: true });
        this.props.form.validateFields((err, fieldsValue) => {
            if(err) return;
            fieldsValue.createTime = fieldsValue.createTime ? moment(fieldsValue.createTime).format('YYYY-MM-DD')  : fieldsValue.createTime;
            this.props.dispatch({
                type: 'eventList/getEventList',
                payload: {
                    event: {
                        // id: '',
                        // introduce: '',
                        // createTime: '',
                        // repetitiveModeType: '',
                        // weixin: '',
                        // phone: '',
                        // email: '',
                        // sms: '',
                        // appPush: '',
                        // type: ''
                        ...fieldsValue
                    },
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code =='0') {

                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }
    
    handleFormReset = () => {  
        const { form, dispatch } = this.props;
        form.resetFields();
        dispatch({
          type: 'eventList/getEventList',
            payload: {
                page: 1,
                pageSize: 10,
                event: {
                    id: '',
                    introduce: '',
                    createTime: '',
                    repetitiveModeType: '-1',
                    weixin: '',
                    phone: '',
                    email: '',
                    sms: '',
                    appPush: '',
                    type: ''
                },
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({
                            page: 1,
                            pageSize: 10,
                            loading: false
                        });
                    }else {
                        message.error(res.message || '服务器错误');
                        this.setState({ loading: false });
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
                    <FormItem label="事件&nbsp;&nbsp;&nbsp;ID">
                        {getFieldDecorator('id',{
                            initialValue: '',
                        })(<Input placeholder="请输入ID" />)}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="事件名称">
                        {getFieldDecorator('introduce',{
                            initialValue: '',
                        })(<Input placeholder="请输入事件名称" />)}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="重复方式">
                        {getFieldDecorator('repetitiveModeType',{
                            initialValue: '-1',
                        })(
                            <Select placeholder="请选择重复方式">
                                <Option value='-1' >{'请选择'}</Option>
                                <Option value='0' >{'一次性事件(不重复)'}</Option>
                                <Option value='1' >{'每天'}</Option>
                                <Option value='2' >{'每星期'}</Option>
                                <Option value='3' >{'每2个星期'}</Option>
                                <Option value='4' >{'每月'}</Option>
                                <Option value='6' >{'每年'}</Option>
                                <Option value='7' >{'自定义'}</Option>
                                <Option value='8' >{'工作日'}</Option>
                                <Option value='9' >{'周末'}</Option>
                                <Option value='10' >{'法定工作日'}</Option>
                                <Option value='11' >{'法定节假日'}</Option>
                                <Option value='12' >{'金融交易日'}</Option>
                                <Option value='13' >{'股指交割日'}</Option>
                                <Option value='14' >{'国债交割日'}</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="事件类型">
                        {getFieldDecorator('type',{
                            initialValue: '',
                        })(
                            <Select placeholder="请选择事件类型">
                                <Option value='' >{'请选择'}</Option>
                                <Option value='1' >{'生日'}</Option>
                                <Option value='2' >{'纪念日'}</Option>
                                <Option value='3' >{'重要事件'}</Option>
                                <Option value='18' >{'用药'}</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                    <FormItem label="创建时间">
                        {getFieldDecorator('createTime',{
                            initialValue: null,
                        })(<DatePicker style={{width: '100%'}}/>)}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="微信提醒">
                        {getFieldDecorator('weixin',{
                            initialValue: '',
                        })(
                            <Radio.Group>
                                <Radio value="">全选</Radio>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="电话提醒">
                        {getFieldDecorator('phone',{
                            initialValue: '',
                        })(
                            <Radio.Group>
                                <Radio value="">全选</Radio>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="SMS提醒">
                        {getFieldDecorator('sms',{
                            initialValue: '',
                        })(
                            <Radio.Group>
                                <Radio value="">全选</Radio>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                 {/* <Col md={6} sm={24}>
                    <FormItem label="邮箱提醒">
                        {getFieldDecorator('email',{
                            initialValue: '',
                        })(
                            <Radio.Group>
                                <Radio value="">全选</Radio>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Col> */}
                <Col md={6} sm={24}>
                    <FormItem label="APP提醒">
                        {getFieldDecorator('appPush',{
                            initialValue: '',
                        })(
                            <Radio.Group>
                                <Radio value="">全选</Radio>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <span className={styles.submitButtons}>
                        <Button type="primary" onClick={() => this.getEventList()}>
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
                        </Button>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }
    //查看详情
    _dialog = (params) => {
        this.props.dispatch({
            type: 'eventList/eventStatus',
            payload: {
                eventId: params.id,
                status: params.status,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({
                            modalVisible: true,
                            dataDetail: res.data,
                        });
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    handleCancel = () => {
        this.setState({ modalVisible: false });
    }

    onClickPage(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
            dispatch({
                type: 'eventList/getEventList',
                payload: {
                    event: {
                        ...fieldsValue
                    },
                    page: current,
                    pageSize: pageSize,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0'){
                       
                        }else{
                            message.error(res.message || '服务器错误')
                        }
                    }
                    this.setState({loading: false});
                },
            });
        });
    }

    // onClickDetailPage(current, pageSize) {
    //     this.setState({ pageDetail:current });
    // }
    
    render() {
        const { page, pageSize, loading, modalVisible, detailPage } = this.state;
        const { dataList, total } = this.props.eventList && this.props.eventList.data || [];
        let pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.onClickPage(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClickPage(current, pageSize)
            },
        };
        let paginationDetail = {
            defaultCurrent: detailPage,
            current: detailPage,
            onChange:(current, pageSize) => {
                this.onClickDetailPage(current, pageSize)
            },
        };
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width:80,
          }, {
            title: '事件名称',
            dataIndex: 'introduce',
            key: 'introduce',
          }, {
            title: '事件日期',
            dataIndex: 'content',
            key: 'content',
            width: 230,
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:180,
            render: (value, row, index) => {
                return(<span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
          }, {
            title: '微信提醒',
            dataIndex: 'weixin',
            key: 'weixin',
            width:100,
            render: (value, row, index) => {
                return(<span key={index}>{value == '0' ? '否' : '是'}</span>)
            }
          }, {
            title: '电话提醒',
            dataIndex: 'phone',
            key: 'phone',
            width:100,
            render: (value, row, index) => {
                return(<span key={index}>{value == '0' ? '否' : '是'}</span>)
            }
          }, {
            title: 'APP提醒',
            dataIndex: 'appPush',
            key: 'appPush',
            width:100,
            render: (value, row, index) => {
                return(<span key={index}>{value == '0' ? '否' : '是'}</span>)
            }
          }, {
            title: '短信提醒',
            dataIndex: 'sms',
            key: 'sms',
            width:100,
            render: (value, row, index) => {
                return(<span key={index}>{value == '0' ? '否' : '是'}</span>)
            }
          }, {
            title: '事件类型',
            dataIndex: 'type',
            key: 'type',
            width:100,
            render: (value, row, index) => {
                if(value == '1') {
                    return(<span key={index}>{'生日'}</span>)
                }else  if(value == '2') {
                    return(<span key={index}>{'纪念日'}</span>)
                }else  if(value == '18') {
                    return(<span key={index}>{'用药'}</span>)
                }else{
                    return(<span key={index}>{'重要事件'}</span>)
                }
                
            }
          }, {
            title: '重复方式',
            dataIndex: 'repetitiveModeType',
            key: 'repetitiveModeType',
            render: (value, row, index) => {
                return(<span key={index} style={{minWidth:'140px',display:'block'}}>{repeatType[value]}</span>)
            }
          }, {
            title: '提示音',
            dataIndex: 'ring',
            key: 'ring',
            width:100,
            render: (value, row, index) => {
                if (row.ring.indexOf('girl') >= 0 ) {
                    return(
                        <span key={index}>{'女声'}</span>
                    )
                }else if (row.ring.indexOf('boy') >= 0 ) {
                    return(
                        <span key={index}>{'男声'}</span>
                    )
                }else if (row.ring.indexOf('custom') >= 0 ) {
                    return(
                        <span key={index}>{'提示音' + row.ring.substring(6)}</span>
                    )
                }
                
            },
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            render: (value, row, index) => {
                return(
                    <a key={index} href='javascript:;' onClick={() => this._dialog(row)}>查看详情</a>
                )
            }
        }];

        const columnsDetail = [{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            render: (value, row, index) => {
                return(<Fragment key={index}> <span >{row.solorText}</span><span style={{marginLeft:10,color:'rgb(255, 128, 0)'}}>{row.lunarText}</span></Fragment>)
            },
          }, {
            title: '总次数/发送次数',
            dataIndex: 'sendCount',
            key: 'sendCount',
            align: 'center',
            render: (value, row, index) => {
                return(<span key={index}>{`${row.count}/${value}`}</span>)
            }
          }, {  
            title: '是否预提醒',
            dataIndex: 'beginnings',
            key: 'beginnings',
            render: (value, row, index) => {
                let unit = '';
                const unit_num = row.beginnings ? row.beginnings.substring(0,row.beginnings.indexOf(':')) : '';
                const unit_value = row.beginnings ? row.beginnings.substring(row.beginnings.indexOf(':')+1) : '';
                switch( unit_num ) {
                    case '1':
                        unit = '分钟';
                        break;
                    case '2':
                        unit = '小时';
                        break;
                    case '3':
                        unit = '天';
                        break;
                    case '4':
                        unit = '周';
                        break;
                    case '5':
                        unit = '月';
                        break;
                    case '6':
                        unit = '年';
                        break;
                    default:
                        unit = '分钟';
                }
                return(<span key={index}>{(unit_value && unit ) ? `提前${unit_value}${unit}` : '否'}</span>)
            },
        }];
       
        return(
            <PageHeaderLayout title='事件' >
                <div>
                    <Card bordered={false} >
                        <Tabs 
                            defaultActiveKey='1' 
                            tabBarGutter={10} 
                            type='card'
                        >
                            <TabPane tab='事件列表' key='1'>
                                <ModuleIntroduce text={'事件提醒详细列表'} />
                                <div className={styles.tableList} >
                                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                                    <Table 
                                        style={{backgroundColor: 'white', marginTop: 16}}
                                        columns={columns}
                                        dataSource={dataList}
                                        pagination={pagination}
                                    loading={loading}
                                        rowKey={'id'}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='事件通知' key='2'>
                                <ModuleIntroduce text={'事件提醒通知内容'} />
                                <EventNotify />
                            </TabPane>
                            <TabPane tab='事件通知统计' key='3'>
                                <ModuleIntroduce text={'事件提醒通知统计'} />
                                <EventNotifyCount />
                            </TabPane>
                            <TabPane tab='事件名称配置' key='4'>
                                <ModuleIntroduce text={'事件提醒示例设置'} />   
                                <EventName />
                            </TabPane>
                        </Tabs>
                        
                    </Card>
                    <Modal 
                        visible={modalVisible} 
                        footer={null} 
                        onCancel={this.handleCancel}
                        title='事件详情'
                        width={850}
                    >
                        <Table 
                            columns={columnsDetail}
                            dataSource={this.state.dataDetail}
                            rowKey='id'
                            // pagination={paginationDetail}
                            // loading={loading}
                        />
                    </Modal>
                </div>
            </PageHeaderLayout>
        )
    }
}