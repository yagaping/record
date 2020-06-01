import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
 Card,
 Form,
 Row,
 Col,
 Input,
 Button,
 DatePicker,
 message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import styles from '../SystemManagement/TableList.less';
import Map from '../../components/Map';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ positionRemind, loading }) => ({
    positionRemind,
    loading: loading.models.positionRemind,
}))
@Form.create()
export default class PositionRemind extends Component {
    state = {
        memberId: '',
        beginTime: '',
        endTime: '',
        flag: 1,
    };

    dateSelect = (date,dateString) => {
        this.setState({
            beginTime: dateString[0],
            endTime: dateString[1],
        });
    }

    handleSearch = () => {
        const that = this;
        const { dispatch, form } = this.props;
        that.refs.map.clear();
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                memberId: fieldsValue.memberId,
                beginTime: this.state.beginTime,
                endTime: this.state.endTime
            }
            dispatch({
                type: 'positionRemind/getPoint',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0'){
                            const data = res.data;
                            this.setState({ 
                                // PositionRecordPage: data.PositionRecordPage,
                                // PositionRemindPage: data.PositionRemindPage,
                                flag: ++that.state.flag 
                            })
                        }else{
                            message.error(res.message || '服务器错误');
                        }
                    }
                },
            });
        });
        
    };

    handleFormReset = () => {
        const that = this;
        that.props.form.resetFields();
        this.setState({
            beginTime: '',
            endTime: '',
        });
        that.refs.map.clear();
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={4} sm={24}>
                        <FormItem label="memberId">
                            {getFieldDecorator('memberId',{
                                // rules: [{ required: true, message: '请输入memberId' }],
                                initialValue: "",
                            })(<Input placeholder="请输入memberId" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24} style={{display:'flex',alignItems:'center'}}>
                        <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
                        <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.beginTime && this.state.endTime) ? [moment(this.state.beginTime),moment(this.state.endTime)] : ''} />
                    </Col>
                    <Col md={4} sm={24}>
                        <span style={{ marginBottom: 24 }}>
                            <Button type="primary" onClick={this.handleSearch}>
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

    render() {
        const { PositionRecordPage, PositionRemindPage } = this.props.positionRemind.data;
        const { flag } = this.state;
        return (
            <PageHeaderLayout title="位置提醒" style={{overflow:'hidden'}}>
                <div>
                    <Card bordered={false}>
                        <ModuleIntroduce text={'模拟APP中的位置提醒，测试作用'} />
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <Map ref="map" PositionRecordPage={PositionRecordPage} PositionRemindPage={PositionRemindPage} flag={flag}/>
                        </div>
                    </Card>
                </div>   
            </PageHeaderLayout>
        );
    }
}
