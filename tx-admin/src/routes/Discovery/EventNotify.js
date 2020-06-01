import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Button,
    Table, 
    Input
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
@connect(({ eventNotify, loading }) => ({
    eventNotify,
    loading: loading.models.eventNotify,
}))
@Form.create()
export default class EventNotify extends PureComponent {
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
                id: '',
                page: 1,
                pageSize: this.state.pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'eventNotify/findAll',
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
            type: 'eventNotify/findAll',
            payload: {
                id: '',
                page: 1,
                pageSize: 10,
                phoneNumber: ''
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
                    <FormItem label="手机号码">
                    {getFieldDecorator('phoneNumber',{
                        initialValue: "",
                    })(
                        <Input placeholder="请输入电话号码" />
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
                id: '',
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'eventNotify/findAll',
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
        const { dataList, total } = this.props.eventNotify && this.props.eventNotify.data;
        const  { page, pageSize, loading } = this.state;
        const newData = [];
        const columns = [{
            title: '手机号码',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width:130,
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:170,
            render: (value, row, index) => {
                return(<span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
          }, {
            title: '通知内容',
            dataIndex: 'sendText',
            key: 'sendText',
          },{
            title: '通知类型',
            dataIndex: 'type',
            key: 'type',
            width:120,
            render: (value, row, index) => {
                let valueText;
                switch (value) {
                    case 1:
                        valueText = '手机通知';
                        break;
                    case 2:
                        valueText = '微信通知';
                        break;
                    case 3:
                        valueText = '自身短信通知';
                        break;
                    case 4:
                        valueText = '语音通知';
                        break;
                    case 5:
                        valueText = '短信通知';
                        break;
                    default:
                        valueText = '';
                        break;
                }
                return(<span key={index} >{valueText}</span> )
            }
          },{
            title: '语音回执码',
            dataIndex: 'code',
            key: 'code',
            width:110,
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
        return(
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
        )
    }
}