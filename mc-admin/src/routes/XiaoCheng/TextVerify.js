import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Button,
    Table, 
    Modal,
    Input,
    Divider,
    Popconfirm,
    Select,
    Upload,
    TreeSelect,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const status = ['全部','正常','异常'];

//添加 编辑弹框
const CreateForm = Form.create()(props => {
    const { 
        handleModalVisible,
        modalVisible,
        form,
        btn,
        handleAdd,
        handleEdit,
        getText,
        textChange,
        matchJson,
        btnLoading,
        onModalTreeChange,
        modalTreeValue,
        treeData,
        modalTreeId
    } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if (!matchJson.json) return message.error('请先获取文本匹配');
            if(matchJson.json.matchType == 'BOOKKEEPING' || matchJson.json.matchType == 'BOOKKEEPING_SEARCH') {
                fieldsValue.categoryName = modalTreeValue;
                fieldsValue.category = modalTreeId || matchJson.json.data.category;
                fieldsValue.eventDate = fieldsValue.eventDate;
            }else {
                fieldsValue.beginTime = fieldsValue.beginTime;
                fieldsValue.repeatrepetitiveMode = repeatMode;
            }
            form.resetFields();
            btn == 'add' ? handleAdd(fieldsValue,matchJson) : handleEdit(fieldsValue,matchJson);
        });
    }
   
    const  disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('hour');
    }
    const week = ['天','一','二','三','四','五','六'];
    const strToWeek = (str) => {
        let newStr = '';
        if(typeof str == 'string'){
            str = str.replace(/,/g, "");
            for(let i of str) {
                newStr += week[i - 1]
            }
            return newStr.split('').join('，');
        }
    }
    let remind_eventType = null;
    let repeatMode = null;
    if(Object.keys(matchJson).length > 0) {
        if( matchJson.json.matchType == 'REMIND') {

            if(matchJson.json.data.type == '11') {
                remind_eventType = '提醒（一次性事件）';
            }else {
                remind_eventType = '提醒（重复事件）';
            }

            //重复方式判断
            let data = matchJson.json.data;
            if(data.repetitiveModeType == 10) {
                repeatMode = '法定工作日'
            }
            if(data.repetitiveModeType == 11) {
                repeatMode = '法定节假日'
            }
            if(data.repetitiveModeType == 12) {
                repeatMode = '金融交易日'
            }
            if(data.repetitiveModeType == 13) {
                repeatMode = '股指期货最后交易日'
            }
            if(data.repetitiveModeType == 14) {
                repeatMode = '国债期货最后交易日'
            }
            if(data.repetitiveModeType == 15) {
                repeatMode = '50ETF期权行权日'
            }
            if(data.frequency == 3) {  //天
                repeatMode = '每'+data.per+'天'
            }
            if(data.frequency == 4) {  //星期
                repeatMode = '每'+data.per+'个星期的星期'+strToWeek(data.times);
            }
            if(data.frequency == 5) {  //月
                if(data.times.includes('0:')){  //按日期
                    var dayArr = [];
                    var dayStr = data.times.slice(data.times.indexOf(':')+ 1);
                    dayStr.split(',').forEach(function(item, i) {
                        if(item.indexOf('-') > -1) {
                            dayArr.push('倒数第'+ item.replace(/-/,'') +'天')
                        } else {
                            dayArr.push(item +'号')
                        }
                    })
                    if(data.per == 1) return '每月的' + dayArr.join(',');
                    return '每'+ data.per +'个月的'+ dayArr.join(',');
                }
                if(data.times.includes('1:')) {
                    if(data.per == 1) return '每月的第'+ data.times[2] +'个星期'+ strToWeek(data.times[4]);
                    return '每'+ data.per +'个月的第'+ data.times[2] +'个星期'+ strToWeek(data.times[4]);
                }
              }
            if(data.frequency == 6) {  //年
                var monthArr = [];
                var dayStr = '';
                var dayArr = [];
                var newTime = data.times.split(',');
                for(var time of newTime) {
                    monthArr.push(time.slice(0, time.indexOf('-')));
                    dayStr = time.slice(time.indexOf(':')+1);
                }
                dayStr.split('_').forEach(function(item,i) {
                    if(item.indexOf('-') > -1) {
                        dayArr.push('倒数第'+ item.replace(/-/,'') +'天')
                    } else {
                        dayArr.push(item+'号')
                    }
                })
                if(data.per == 1)  return '每年的'+ monthArr.join(',') +'月的'+ dayArr.join(',');
                return '每'+ data.per +'年的'+ monthArr.join(',') +'月的'+ dayArr.join(',');
            }
        }
        if(matchJson.json.matchType == 'BIRTHDAY') {
            if(matchJson.json.data.type == '11') {
                remind_eventType = '生日（一次性事件）';
            }else {
                remind_eventType = '生日（重复事件）';
            }
        }
        if(matchJson.json.matchType == 'MARK_DAY') {
            if(matchJson.json.data.type == '11') {
                remind_eventType = '纪念日（一次性事件）';
            }else {
                remind_eventType = '纪念日（重复事件）';
            }
        }

        
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == 'add' ? '添加' : '编辑'}
            width={800}
            destroyOnClose={true}
        >
            {
                btn == 'add' ? 
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本">
                    {form.getFieldDecorator('text', {
                        rules: [{ required: true, message: '请输入文本' }],
                        initialValue: '',
                    })(
                        <div>
                            <Input placeholder="请输入文本" style={{width: '78%'}} onChange={(e) => textChange(e)}/>
                            <Button type="primary" style={{marginLeft: 10}} onClick={() => getText()} loading={btnLoading}>获取</Button>                 
                        </div>
                    )}
                </FormItem>
                :
                null
            }
            
            {
                Object.keys(matchJson).length > 0  ? 
                    matchJson.json.matchType == 'BOOKKEEPING' || matchJson.json.matchType == 'BOOKKEEPING_SEARCH' ?
                    <div>   {/*记账,记账查询*/}
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件类型">
                            <p>{matchJson.json.matchType == 'BOOKKEEPING' ? '记账' : '记账查询'}</p>            
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="金额">
                            {form.getFieldDecorator('amount', {
                                rules: [{ required: true, message: '请输入金额' }],
                                initialValue: matchJson.json.data.amount,
                            })(<Input placeholder="请输入金额" />)}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                            {form.getFieldDecorator('tradeType', {
                                rules: [{ required: true, message: '请选择类型' }],
                                initialValue: matchJson.json.data.tradeType,
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value={1}>收入</Option>
                                    <Option value={2}>支出</Option>
                                </Select>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类">
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                treeData={treeData}
                                value={modalTreeValue}
                                dropdownStyle={{ maxHeight: 500, overflow: 'auto', }}
                                placeholder="请选择"
                                onChange={onModalTreeChange}
                                // onSelect={onModalTreeSelect}
                                treeNodeFilterProp="title" 
                            />
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="来源">
                            {form.getFieldDecorator('introduce', {
                                rules: [{ required: true, message: '请输入来源' }],
                                initialValue: matchJson.json.data.introduce,
                            })(<Input placeholder="请输入来源" />)}                 
                        </FormItem>
                        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
                            {form.getFieldDecorator('eventDate', {
                                rules: [{ required: true, message: '请输入时间' }],
                                initialValue: moment(matchJson.json.data.eventDate),
                            })(
                                <DatePicker
                                    style={{width: '100%'}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={disabledDate}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                />
                            )}                 
                        </FormItem> */}
                         <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
                            {form.getFieldDecorator('eventDate', {
                                rules: [{ required: true, message: '请输入时间' }],
                                initialValue: matchJson.json.data.eventDate,
                            })(
                                <Input placeholder="请输入时间"/>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
                            {form.getFieldDecorator('place', {
                                // rules: [{ required: true, message: '请输入地址' }],
                                initialValue: matchJson.json.data.place,
                            })(<Input placeholder="请输入地址" />)}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="验证时间">
                            {form.getFieldDecorator('checkTime', {
                                rules: [{ required: true, message: '请输入验证时间' }],
                                initialValue: matchJson.checkTime,
                            })(
                                <Input placeholder="请输入验证时间"/>
                            )}                 
                        </FormItem>
                    </div>
                    :
                    <div>   {/*提醒，生日，纪念日*/}
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件类型">
                            <p>{remind_eventType}</p>            
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="提醒次数">
                            <p>{matchJson.json.data.count}</p>              
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件名称">
                            {form.getFieldDecorator('introduce', {
                                rules: [{ required: true, message: '请输入事件名称' }],
                                initialValue: matchJson.json.data.introduce,
                            })(<Input placeholder="请输入事件名称" />)}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间类型">
                            {form.getFieldDecorator('checkTime', {
                                rules: [{ required: true, message: '请选择时间类型' }],
                                //农历重复性事件isLunarTimes会为true 用该字段判断 
                                initialValue:  matchJson.json.data.isLunarTimes ? '农历' : (matchJson.json.data.lunar == 'false' ? '公历' : '农历'),
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value="公历">公历</Option>
                                    <Option value="农历">农历</Option>
                                </Select>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
                            {form.getFieldDecorator('beginTime', {
                                rules: [{ required: true, message: '请输入开始时间' }],
                                initialValue: matchJson.json.data.beginTime,
                            })(
                                <Input placeholder="请输入开始时间"/>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否电话">
                            {form.getFieldDecorator('phone', {
                                // rules: [{ required: true, message: '请选择是否电话' }],
                                initialValue: matchJson.json.data.phone ? matchJson.json.data.phone : '否',
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value="是">是</Option>
                                    <Option value="否">否</Option>
                                </Select>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否短信">
                            {form.getFieldDecorator('sms', {
                                // rules: [{ required: true, message: '请选择是否短信' }],
                                initialValue: matchJson.json.data.sms ? matchJson.json.data.sms : '否',
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value="是">是</Option>
                                    <Option value="否">否</Option>
                                </Select>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否微信">
                            {form.getFieldDecorator('weixin', {
                                // rules: [{ required: true, message: '请选择是否微信' }],
                                initialValue: matchJson.json.data.weixin ? matchJson.json.data.weixin : '否',
                            })(
                                <Select style={{width: '100%'}}>
                                    <Option value="是">是</Option>
                                    <Option value="否">否</Option>
                                </Select>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="验证时间">
                            {form.getFieldDecorator('checkTime', {
                                rules: [{ required: true, message: '请输入验证时间' }],
                                initialValue: matchJson.checkTime,
                            })(
                                <Input placeholder="请输入验证时间"/>
                            )}                 
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="间隔时间">
                            <p>{matchJson.json.data.intercycle > 0 ? '每'+matchJson.json.data.intercycle+'分钟' : ''}</p>            
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重复方式">
                            <p>{repeatMode}</p>         
                        </FormItem>
                    </div>
                : null

            }
            
        </Modal>
    )
})

//验证对比列表
const VerifyForm = Form.create()(props => {
    const { form, verify, verifyModalVisible, verification } = props;
    let errJson = Object.keys(verify).length && JSON.parse(verify.checkJson);
    const BOOKKEEPING = [{
            title: '',
            dataIndex: 'text',
            key: 'text',
        }, {
            title: '输入数据',
            dataIndex: 'success',
            key: 'success',
            render: (value, row, index) => {
                return (<span style={row.code == '-1' ? {color: 'red'} : {}}>{value}</span>)
            }
        }, {
            title: '验证数据',
            dataIndex: 'contrast',
            key: 'contrast',
            render: (value, row, index) => {
                return (<span  style={row.code == '-1' ? {color: 'red'} : {}}>{value}</span>)
            }
        }
    ]
    return(
        <Modal 
            visible={verifyModalVisible}
            // onOk={okHandle}
            onCancel={() => verification()}
            footer={null}
            title={"验证对比结果"}
            width={800}
        >
        {Object.keys(verify).length ? 
            <Table 
                className={styles.myTable}
                style={{backgroundColor:'white'}}
                columns={BOOKKEEPING} 
                dataSource={errJson.data} 
                pagination={false}
            />
        :
        null
        }
        </Modal>
    )
})
@connect(({ textVerify, infoTree, loading }) => ({
    textVerify,
    infoTree,
    loading: loading.models.textVerify,
}))
@Form.create()
export default class TextVerify extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        btnLoading: false,
        allVerifyLoading: false,   //一键验证
        detailModalVisible: false,
        verifyModalVisible: false,
        matchJson: {},    //文本匹配
        detail: {},      //详情内容
        verify: {},          //验证内容
        modalTreeValue: '',
        treeData: [{}],
        modalTreeId: ''
    }

    componentDidMount() {
        this.getData();
        this.getTree();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            fieldsValue.status = fieldsValue.status == '异常' ? '1' : fieldsValue.status;
            dispatch({
                type: 'textVerify/textQuery',
                payload: {
                    page: 1,
                    pageSize: this.state.pageSize,
                    ...fieldsValue,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({page:1})
                        }else {
                            message.error(res.message || '服务器错误');
                            
                        }
                        this.setState({ loading: false })
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
            type: 'textVerify/textQuery',
            payload: {
                page: 1,
                pageSize: 10,
                status: '',
                text: '',
                matchType: ''
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
                <Col md={6} sm={24}>
                    <FormItem label="文本内容">
                    {getFieldDecorator('text',{
                        initialValue: "",
                    })(<Input placeholder="请输入文本" />)}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="事件类型">
                    {getFieldDecorator('type',{
                        initialValue: "",
                    })(
                        <Select placeholder="请选择事件类型">
                            <Option value=''>全部</Option>
                            <Option value='1'>提醒</Option>
                            <Option value='0'>记账</Option>
                            {/* <Option value='3'>记账查询</Option>
                            <Option value='7'>生日</Option>
                            <Option value='8'>纪念日</Option> */}
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="状态">
                    {getFieldDecorator('status',{
                        initialValue: '',
                    })(
                        <Select placeholder="请选择状态">
                            <Option value=''>全部</Option>
                            <Option value='0'>正常</Option>
                            <Option value='1'>异常</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24} >
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
            fieldsValue.status = fieldsValue.status == '异常' ? '1' : fieldsValue.status;
            const values = {
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'textVerify/textQuery',
                payload: values,
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

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        const that = this;
        that.refs.myform.resetFields();
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            matchJson: params ? params : {},   //打开关闭弹窗将对象置为空，调接口时才设值(编辑时除外)
            modalTreeValue: params ? params.json.data.categoryName : ''
        });
       
    };

    //新增
    handleAdd = (fields,params) => {
        this.props.dispatch({
            type: 'textVerify/textSave',
            payload: {
                object: {
                    text: fields.text,
                    json: {
                        data: {
                            ...params.json.data,
                            ...fields
                        },
                        matchType: params.json.matchType
                    },
                    checkTime: fields.checkTime
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('添加成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
            });
            this.setState({ modalVisible: false });
    }

    //编辑
    handleEdit = (fields,params) => {
        this.props.dispatch({
            type: 'textVerify/textUpdate',
            payload: {
                object: {
                    id: params.id,
                    json: {
                        data: {
                            ...params.json.data,
                            ...fields
                        },
                        matchType: params.json.matchType
                    },
                    checkTime: fields.checkTime
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
            });
            this.setState({ modalVisible: false });
    }


    //删除
    showDeleteConfirm(ids) {
        this.props.dispatch({
            type: 'textVerify/textDelete',
            payload: {
                ids: ids,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }
    //获取文本框内容
    textChange = (e) => {
        const that = this;
        let textInput = e.target.value;
        this.setState({
            textInput: textInput,
        });
    }
    //根据text获取json
    getText = () => {
        this.setState({ btnLoading: true })
        const that = this;
        this.props.dispatch({
            type: 'textVerify/textGet',
            payload: {
                text: that.state.textInput
            },
            callback: (res) => {
                if(res)  {
                    if(res.code == 0) {
                        if(res.data.json.data) {
                            this.setState({
                                matchJson: res.data,
                                modalTreeValue: res.data.json.data.categoryName
                            });
                        }else {
                            message.error(res.data.json.tipMessage)
                        }
                    }else {
                        message.error(res.message || '服务器错误')
                    }
                    this.setState({ btnLoading: false })
                }
            }
        })
    }

     //详情弹框
     goDetail = (flag,  params) => {
        if(params.checkJson == null) { return message.error('请先验证') }
        this.setState({ 
            verifyModalVisible: !!flag,
            verify: params
        });
       
    };
    //验证
    verification = (flag,id) => {
        if(flag) {
            this.setState({loading: true})
            this.props.dispatch({
                type: 'textVerify/textCheck',
                payload: {
                    id: id
                },
                callback: (res) => {
                    if(res) {
                        if(res.data.checkJson) {
                            this.setState({
                                verify: res.data,
                                verifyModalVisible: true,
                            });
                        }else {
                            message.error(res.message)
                        }
                        this.getData();
                        this.setState({loading: false})
                    }
                }
            })
        }else {
            this.setState({ 
                verifyModalVisible: false,
            });
        }
    }
    //一键验证完毕后，查询所有异常
    setForm = () => {
        this.props.form.setFieldsValue({
            status: '异常'
        });
        this.getData();
    }
    //一键验证
    allVerification = () => {
        this.setState({allVerifyLoading: true});
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            fieldsValue.status = fieldsValue.status == '异常' ? '1' : fieldsValue.status;
            dispatch({
                type: 'textVerify/verifyAll',
                payload: {
                    ...fieldsValue,
                    token: new Date().getTime()
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == 0) {
                            this.setForm();
                            message.success(res.message || '验证完毕');
                        }else {
                            message.error(res.message || '服务器错误')
                        }
                        this.setState({ allVerifyLoading: false });
                    }
                }
            });
        });
    }
    // 上传exelc
    beforeUpload = ( e ) => {
        return false;
    }
    fileUpload = ( e ) => {
        let formData = new FormData();
        let file = e.file;
        formData.append('file', file);
        this.props.dispatch({
            type:'textVerify/fileUpload',
            payload:formData,
            callback:res=>{
                if( res.code == 0 ){
                    message.success('上传成功')
                }else{
                    message.error(res.message || '上传失败')
                }
                console.log(res,22)
            }
        })
    }
    //设置弹框里的tree
    onModalTreeChange = (value, label, extra) => {
        this.setState({ 
            modalTreeValue: label[0],
            modalTreeId: value
        });
    }
    //获取树结构
    getTree = () => {
        const {form, dispatch} = this.props;
        this.setState({ loading: true });
        dispatch({
            type: 'infoTree/treeList',
            payload: {
                object: {}
            },
            callback: (res) => {
                if(res) {
                    if(res.code =='0') {
                        const data = res.data[0].children[1].children;
                        const renderTreeNodes = (data) => {
                            return data.map((item,i) => {
                                if(item.children) {
                                    renderTreeNodes(item.children);
                                }
                                item.title = item.name;
                                item.key = item.id;
                                item.value = String(item.id);
                                return item;
                            })
                        }
                        renderTreeNodes(data)
                        this.setState({ treeData: data });
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { dataList, total } = this.props.textVerify && this.props.textVerify.data;
        const  { page, pageSize, loading, modalVisible, matchJson, detail, allVerifyLoading } = this.state;
        const columns = [{
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: '事件类型',
                dataIndex: 'type',
                key: 'type',
                render: (value, row, index) => {
                    let eventType;
                    switch(value) {
                        case 1:
                            eventType = '提醒';
                            break;
                        case 0:
                            eventType = '记账';
                            break;
                        // case 3:
                        //     eventType = '记账查询';
                        //     break;
                        // case 7:
                        //     eventType = '生日';
                        //     break;
                        // case 8:
                        //     eventType = '纪念日';
                        //     break;
                        default: 
                            eventType = '';
                    }
                    return(<span key={index}>{eventType}</span>)
                }
            }, {
                title: '文本内容',
                dataIndex: 'text',
                key: 'text',
                width: 400
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (value, row, index) => {
                    return (<span key={index}>{value}</span>)
                }
            }, {
                title: '验证时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
                render: (value, row, index) => {
                    return (<span key={index}>{value}</span>)
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (value, row, index) => {
                    return (<span key={index} style={value == '1' ? {color: 'red'} : {}}>{status[value+1]}</span>)
                }
            }, {
                title: '验证结果',
                dataIndex: 'detail',
                key: 'detail',
                render: (value, row, index) => {
                    return(<a key={index} href="javascript:;" onClick={() => this.goDetail(true,row)}>查看</a>) 
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width:160,
                render: (value, row, index) => {
                    return(
                        <Fragment key={index}>
                            <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                            <Divider type="vertical" />
                            <a href="javascript:;"  onClick={() =>  this.verification(true,row.id)}>验证</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row.id)}>
                                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                            </Popconfirm>
                        </Fragment>
                    ) 
                }
            }  
        ];
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

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
            textChange: this.textChange,
            normalizeAll: this.normalizeAll,
            getText: this.getText,
            goDetail: this.goDetail,
            verification: this.verification,
            onModalTreeChange: this.onModalTreeChange,
        };

        return(
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                            添加
                        </Button>
                        <Button type="primary" onClick={() => this.allVerification()} style={{marginLeft:20}} loading={allVerifyLoading}>
                            一键验证
                        </Button>
                        <Upload 
                            style={{marginLeft:20}}
                            showUploadList={false}
                            accept=".xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={this.fileUpload}
                            beforeUpload={this.beforeUpload}
                        >
                            <Button type="primary" >
                                文件导入
                            </Button>
                        </Upload>
                        
                    </div>
                    <Table 
                        className={styles.myTable}
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={dataList} 
                        pagination={pagination}
                        loading={loading}
                        rowKey={(record) => record.id}
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
                {/* <DetailForm {...this.state} {...parentMethods} ref="detailForm"/> */}
                <VerifyForm {...this.state} {...parentMethods} ref="verifyForm"/>
            </div>
        )
    }
}