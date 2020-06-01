import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Button,
    Table, 
    DatePicker
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
@connect(({ eventNotifyCount, loading }) => ({
    eventNotifyCount,
    loading: loading.models.eventNotifyCount,
}))
@Form.create()
export default class EventNotifyCount extends PureComponent {
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
                createTime: fieldsValue.createTime ? moment(fieldsValue.createTime).format('YYYY-MM-DD') : fieldsValue.createTime,
            };
            dispatch({
                type: 'eventNotifyCount/findAll',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            res.data.dataList.map((item, i) => {

                            })
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
            type: 'eventNotifyCount/findAll',
            payload: {
                page: 1,
                pageSize: 10,
                createTime: ''
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
                    <FormItem label="创建时间">
                    {getFieldDecorator('createTime',{
                        initialValue: null,
                    })(
                        <DatePicker placeholder='请选择创建时间' style={{width: '100%'}}/>
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
                ...fieldsValue
            };
            dispatch({
                type: 'eventNotifyCount/findAll',
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
        const { dataList, total } = this.props.eventNotifyCount && this.props.eventNotifyCount.data;
        const  { page, pageSize, loading } = this.state;
        const newData = [];
        const columns = [{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 450,
            render: (value, row, index) => {
                return(<span key={index}>{moment(value).format('YYYY-MM-DD')}</span>)
            }
          }, 
        //   {
        //     title: '手机通知',
        //     dataIndex: 'mobileCount',
        //     key: 'mobileCount',
        //     width: 250,
        //   }, {
        //     title: '微信通知',
        //     dataIndex: 'weiXinCount',
        //     key: 'weiXinCount',
        //     width: 250,
        //   }, 
          {
            title: '自身短信通知',
            dataIndex: 'msgCount',
            key: 'msgCount',
            width: 250,
          }, {
            title: '语音通知',
            dataIndex: 'yuYinCount',
            key: 'yuYinCount',
            width: 250,
          }, {
            title: '短信祝福',
            dataIndex: 'blessMsgCount',
            key: 'blessMsgCount',
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
        const columnsCount = [{
            title: '总数',
            dataIndex: 'count',
            key: 'count',
            width:450
          }, 
        //   {
        //     title: '手机通知',
        //     dataIndex: 'mobileCount',
        //     key: 'mobileCount',
        //     width: 250,
        //   }, {
        //     title: '微信通知',
        //     dataIndex: 'weiXinCount',
        //     key: 'weiXinCount',
        //     width: 250,
        //   },
           {
            title: '自身短信通知',
            dataIndex: 'msgCount',
            key: 'msgCount',
            width: 250,
          }, {
            title: '语音通知',
            dataIndex: 'yuYinCount',
            key: 'yuYinCount',
            width: 250,
          }, {
            title: '短信祝福',
            dataIndex: 'blessMsgCount',
            key: 'blessMsgCount',
        }];

        let countList = [];
        let countObj = {};
        countObj.mobileCount = 0;
        countObj.weiXinCount = 0;
        countObj.msgCount = 0;
        countObj.yuYinCount = 0;
        countObj.blessMsgCount = 0;
        countObj.count = '总计';
        dataList[1].length > 0 && dataList[1].map((item, i) => {
            if( item.type == '1') { countObj.mobileCount = item.amount; } 
            if( item.type == '2') { countObj.weiXinCount = item.amount; } 
            if( item.type == '3') { countObj.msgCount = item.amount; }
            if( item.type == '4') { countObj.yuYinCount = item.amount; }
            if( item.type == '5') { countObj.blessMsgCount = item.amount; }
            // return countObj;
        });
        countList.push(countObj);
        return(
            <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <Table 
                    className={styles.myTable}
                    style={{backgroundColor:'white',marginTop:16}}
                    columns={columns} 
                    dataSource={dataList[0]} 
                    pagination={pagination}
                    loading={loading}
                    rowKey='id'
                    footer={() => 
                        <Table 
                            style={{padding:0}}
                            columns={columnsCount}
                            dataSource={countList}
                            showHeader={false}
                            pagination={false}
                            rowKey='type'
                        />
                    }
                />
            </div>
        )
    }
}