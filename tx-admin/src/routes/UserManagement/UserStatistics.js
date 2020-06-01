import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Radio,
    DatePicker,
    Button,
    Table, 
} from 'antd';
import {
    ChartCard,
    yuan,
    MiniArea,
    MiniBar,
    MiniProgress,
    Field,
    Bar,
    Pie,
    TimelineChart,
} from 'components/Charts';
import { connect } from 'dva';
import moment from 'moment';
import Line from '../../components/Charts/Line';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const RadioGroup = Radio.Group; 
const { RangePicker } = DatePicker;
const timeNow = moment(new Date()).format('YYYY-MM-DD');        //当天
const monthFirstDay = timeNow.substr(0,timeNow.length-2)+'01';   //当月第一天
const nearlyWeek = addDate('-7',new Date());              //近一周
//日期加减
function addDate(days, date){ 
    let d = new Date(date); 
    d.setDate(d.getDate() + Number(days)); 
    let month = d.getMonth()+1; 
    let day = d.getDate(); 
    if(month < 10){ 
        month = "0"+month; 
    } 
    if(day < 10){ 
        day = "0"+day; 
    } 
    let val = d.getFullYear() + "-" + month + "-" + day; 
    return val; 
}
@connect(({ userStatistics, loading }) => ({
    userStatistics,
    loading: loading.models.userStatistics,
}))
@Form.create()
export default class UserStatistics extends PureComponent {
    state = {
        beginTime: nearlyWeek,
        endTime: timeNow,
        btn : '近一周',
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
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                system: fieldsValue.system,
                page: 1,
                pageSize: this.state.pageSize,
            };
            dispatch({
                type: 'userStatistics/findAll',
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
    
    dateSelect = (date,dateString) => {
        this.setState({
            btn: '',         //手动选取时间  按钮颜色设为默认
            beginTime: dateString[0],
            endTime: dateString[1],
        });
    }
 
    buttonClick = (btnText, days, reset, date = new Date()) => {
        reset && this.props.form.resetFields();
        this.setState({ 
            btn: btnText,      //设置按钮颜色
            beginTime: '',
            endTime: '',
            loading: true,
        });  
        let beginTime = '';
        // let timeNow = moment(date).format('YYYY-MM-DD');
        if(days) { 
            beginTime = addDate(days, date);  //如果有天数,进行计算
        }else {
            //如果没有天数,代表当月，初始时间设为当月1号
            beginTime = monthFirstDay;   
        }
        this.setState({ 
            btn: btnText,      //设置按钮颜色
            beginTime: beginTime,
            endTime: timeNow,
        });  
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {this.setState({ loading: false }); return;}
            this.props.dispatch({
                type: 'userStatistics/findAll',
                payload: {
                    beginTime: beginTime,
                    endTime: timeNow,
                    system: fieldsValue.system,
                    page: 1,
                    pageSize: this.state.pageSize,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({
                                // data: res.data ? res.data.dataList : [],
                                // total: res.data ? res.data.sumCount : '',
                                loading: false,
                                page: 1,
                            });
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false });
                        }
                    }
                }
             });
         });

       
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                    <FormItem label="客户端系统">
                    {getFieldDecorator('system',{
                        initialValue: "",
                    })(
                        <RadioGroup onChange={this.onRadioChange} initialValue={1}>
                            <Radio value={""}>全选</Radio>
                            <Radio value={1}>Android</Radio>
                            <Radio value={2}>iOS</Radio>
                        </RadioGroup>
                    )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
                    <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.beginTime && this.state.endTime) ? [moment(this.state.beginTime),moment(this.state.endTime)] : ''} />
                </Col>
                <Col md={6} sm={24} >
                    <Button type={btn == '当月' ? "primary" : 'default'} onClick={() => this.buttonClick('当月','')} style={{marginRight:'10px'}}>
                        当月
                    </Button>
                    <Button type={btn == '近一周' ? "primary" : 'default'} onClick={() => this.buttonClick('近一周','-7')} style={{marginRight:'10px'}}>
                        近一周
                    </Button>
                    <Button type={btn == '近一月' ? "primary" : 'default'} onClick={() => this.buttonClick('近一月','-30')} style={{marginRight:'10px'}}>
                        近一月
                    </Button>
                    <Button type={btn == '近三月' ? "primary" : 'default'} onClick={() => this.buttonClick('近三月','-90')} >
                        近三月
                    </Button>
                </Col>
                <Col md={4} sm={24} >
                    <span style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.buttonClick('近一周','-7','reset')}>
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
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                system: fieldsValue.system,
                page: current,
                pageSize: pageSize,
            };
            dispatch({
                type: 'userStatistics/findAll',
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
        const { dataList, total } = this.props.userStatistics && this.props.userStatistics.data;
        const  { page, pageSize, loading } = this.state;
        const newData = [];
        dataList && dataList.forEach((val, index) => {
            var dayString = String(val.dayInt);
            var dayStringForMat = dayString.substr(0,4) + '-' + dayString.substr(4,2) + '-' + dayString.substr(6,2);  //20180712转2018-07-12
            val.dayInt = dayString;
            newData.push(val)
            // return newData;
        })
        const columns = [{
            title: '时间',
            dataIndex: 'dayInt',
            key: 'dayInt',
            render: (value, row, index) => {
                return(<span key={index}>{value}</span>)
            }
          }, {
            title: '注册用户数',
            dataIndex: 'registerNum',
            key: 'registerNum',
            align: 'center',
          }, {
            title: '新设备用户数',
            dataIndex: 'newMemberNum',
            key: 'newMemberNum',
            align: 'center',
          },{
            title: '日活跃数',
            dataIndex: 'activeDayNum',
            key: 'activeDayNum',
            align: 'center',
          },{
            title: '周活跃数',
            dataIndex: 'activeWeekNum',
            key: 'activeWeekNum',
            align: 'center',
          },{
            title: '月活跃数',
            dataIndex: 'activeMonthNum',
            key: 'activeMonthNum',
            align: 'center',
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
            <PageHeaderLayout title={'用户数据统计'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'用户统计'} />
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div style={{ padding: '0' }}>
                            <Line
                                height={400}
                                data={newData || []}
                                xAxis={'dayInt'}   //传入x坐标轴名称
                                titleMap={{ registerNum: '注册用户数', newMemberNum: '新设备用户数', activeDayNum: '日活跃数', activeWeekNum: '周活跃数', activeMonthNum: '月活跃数'}}
                            />
                        </div>
                    </div>
                </Card>
                <Card bordered style={{marginTop:'20px'}}>
                    <Table 
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={newData} 
                        pagination={pagination}
                        loading={loading}
                    />
                </Card>
            </PageHeaderLayout>
        )
    }
}