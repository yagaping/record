import React, { PureComponent } from 'react';
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
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const { Option } = Select;
const payType = ['微信支付','支付宝支付','苹果支付'];
const rechargeType= ['支付中','支付成功','支付失败'];
@connect(({ payment, loading }) => ({
    payment,
    loading: loading.models.payment,
}))
@Form.create()
export default class Payment extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: 1,
                pageSize: this.state.pageSize,
                record: {
                    ...fieldsValue
                    // userId: '',
                    // orderNo: '',
                    // type: '',
                    // status: ''
                }
            };
            dispatch({
                type: 'payment/getPaymentList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ page: 1, loading: false })
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
            type: 'payment/getPaymentList',
            payload: {
                page: 1,
                pageSize: 10,
                record: {
                    userId: '',
                    orderNo: '',
                    type: '',
                    status: ''
                }
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
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="用户ID">
                    {getFieldDecorator('userId',{
                        initialValue: "",
                    })(
                        <Input placeholder="请输入用户ID" />
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="充值状态">
                        {getFieldDecorator('status',{
                            initialValue: "",
                        })(
                            <Select placeholder="请选择充值状态">
                                <Option value='' >{'请选择充值状态'}</Option>
                                <Option value='0' >{'支付中'}</Option>
                                <Option value='1' >{'支付成功'}</Option>
                                <Option value='2' >{'支付失败'}</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="支付类型">
                        {getFieldDecorator('type',{
                            initialValue: "",
                        })(
                            <Select placeholder="请选择支付类型">
                                <Option value='' >{'请选择支付类型'}</Option>
                                <Option value='1' >{'微信支付'}</Option>
                                <Option value='2' >{'支付宝支付'}</Option>
                                <Option value='3' >{'苹果支付'}</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="流水号">
                    {getFieldDecorator('orderNo',{
                        initialValue: "",
                    })(
                        <Input placeholder="请输入流水号" />
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
    

    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: current,
                pageSize: pageSize,
                record: {
                    ...fieldsValue
                }
            };
            dispatch({
                type: 'payment/getPaymentList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            // this.setState({ page: 1, loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            // this.setState({ loading: false })
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }

    render() {
        const { dataList, total } = this.props.payment && this.props.payment.data;
        const  { page, pageSize, loading } = this.state;
        const newData = [];
        const columns = [{
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
          }, {
            title: '套餐类型',
            dataIndex: 'setMealType',
            key: 'setMealType',
          }, {
            title: '充值金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (value, row, index) => {
                return(<span key={index}>{value+'元'}</span>)
            }
          }, {
            title: '购买条数',
            dataIndex: 'num',
            key: 'num',
          }, {
            title: '充值状态',
            dataIndex: 'status',
            key: 'status',
            render: (value, row, index) => {
                if(value == '0') {
                    return(<span key={index} style={{}}>{rechargeType[value]}</span>)
                }
                if(value == '1') {
                    return(<span key={index} style={{color: '#52c41a'}}>{rechargeType[value]}</span>)
                }
                if(value == '2') {
                    return(<span key={index} style={{color: 'rgb(255, 53, 0)'}}>{rechargeType[value]}</span>)
                }
            }
          }, {
            title: '流水号',
            dataIndex: 'OrderNo',
            key: 'OrderNo',
          }, 
        //   {
        //     title: '订单号',
        //     dataIndex: 'PayNumber',
        //     key: 'PayNumber',
        //   }, 
          {
            title: '支付类型',
            dataIndex: 'type',
            key: 'type',
            render: (value, row, index) => {
                return(<span key={index}>{payType[value-1]}</span>)
            }
          }, {
            title: '支付系统',
            dataIndex: 'system',
            key: 'system',
            render: (value, row, index) => {
                return(<span key={index}>{value == '1' ? 'Android' : 'iOS'}</span>)
            }
          }, {
            title: '失败原因',
            dataIndex: 'failReason',
            key: 'failReason',
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (value, row, index) => {
                return(<span key={index}>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value}</span>)
            }
          }, {
            title: '更改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (value, row, index) => {
                return(<span key={index}>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value}</span>)
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
        }
        // let _data = [{
        //     key: '001',
        //     phoneNumber: "15015009038",
        //     createTime: "15015009038",
        //     sendText: "15015009038",
        //     type: 1
        // }]
        return(
            <PageHeaderLayout title={'支付列表'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'购买支付列表'} />
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <Table 
                            style={{backgroundColor:'white',marginTop:16}}
                            columns={columns} 
                            dataSource={dataList} 
                            pagination={pagination}
                            loading={loading}
                            rowKey='id'
                            // footer={() => 
                            //     <Table 
                            //         style={{padding:0}}
                            //         columns={columns}
                            //         dataSource={_data} 
                            //         showHeader={false}
                            //         pagination={false}
                            //     />
                            // }
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}