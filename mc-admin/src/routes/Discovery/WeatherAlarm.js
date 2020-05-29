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
    Select,
    DatePicker
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ weatherAlarm, weatherType, loading }) => ({
    weatherAlarm,
    weatherType,
    loading: loading.models.weatherAlarm,
}))
@Form.create()
export default class WeatherAlarm extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
    }

    componentDidMount() {
        this.getData();
        this.getWeatherType();
    }
    //搜索
    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'weatherAlarm/findWeather',
                payload: {
                    weatherAlarm: {
                        ...fieldsValue,
                        issueTime: fieldsValue.issueTime ? moment(fieldsValue.issueTime).format('YYYYMMDD') : ''
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

    getWeatherType = () => {
        this.props.dispatch({
            type: 'weatherType/weatherType',
            payload: {},
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        
                    }else {
                        message.error(res.message || '服务器错误')
                    }
                }
            } 
        })
    }

    reset = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.resetFields();
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'weatherAlarm/findWeather',
                payload: {
                    weatherAlarm: {
                        ...fieldsValue,
                        issueTime: fieldsValue.issueTime ? moment(fieldsValue.issueTime).format('YYYYMMDD') : ''
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
        })
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props.weatherType;
        const weather_type = data ? data.map((item, i) => {
            return <Option value={item} key={i}>{item}</Option>
        }) : <Option value=""></Option>;
        
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="地区名称">
                        {getFieldDecorator('stationName', {
                            initialValue: '',
                        })(<Input placeholder='请输入地区名称' />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="预警类型">
                        {getFieldDecorator('signalType', {
                            initialValue: '',
                        })(
                            <Select>
                                {weather_type}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="预警级别">
                        {getFieldDecorator('signalLevel', {
                            initialValue: '',
                        })(
                            <Select style={{ width: '100%' }} >
                                <Option value="未知">未知</Option>
                                <Option value="白色">白色</Option>
                                <Option value="蓝色">蓝色</Option>
                                <Option value="橙色">橙色</Option>
                                <Option value="黄色">黄色</Option>
                                <Option value="红色">红色</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="预警时间">
                        {getFieldDecorator('issueTime', {
                            initialValue: null,
                        })(<DatePicker style={{width:'100%'}}  format='YYYY-MM-DD' />)}
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
                ...fieldsValue
            };
            dispatch({
                type: 'weatherAlarm/findWeather',
                payload: {
                    weatherAlarm: {
                        ...fieldsValue,
                        issueTime: fieldsValue.issueTime ? moment(fieldsValue.issueTime).format('YYYYMMDD') : ''
                    },
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

    render() {
        const { dataList, total } = this.props.weatherAlarm && this.props.weatherAlarm.data;
        const  { page, pageSize, loading } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '标题',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '地区名称',
            dataIndex: 'stationName',
            key: 'stationName',
        }, {
            title: '预警类型',
            dataIndex: 'signalType',
            key: 'signalType',
        }, {
            title: '预警级别',
            dataIndex: 'signalLevel',
            key: 'signalLevel',
        },{
            title: '预警内容',
            dataIndex: 'issueContent',
            key: 'issueContent',
            width: 600
        },{
            title: '预警时间',
            dataIndex: 'issueTime',
            key: 'issueTime',
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

        return(
            <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        )
    }
}