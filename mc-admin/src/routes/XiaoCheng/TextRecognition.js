import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Modal,
    Input,
    Select,
    Divider,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import HZRecorder from './recorder';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea  } = Input;
let recorder;

//验证弹框
const CheckForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, handleSendNotice, matchJson, getText,
            startLoading, endLoading, getBtnLoading, getInput, getContent,
            textChange, params, startRecord, endRecord, inputValue 
    } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if (!matchJson.textJson) return message.error('请先开始录音获取文本');
            handleSendNotice(form, params, 1);
        });
    }
    const cacleHandle = (e) => {
        if(e.target.value == '') {
            if(e.key == 'Escape' || e.keyCode == 27) {
                handleModalVisible();    //点击ESC
                return;
            }
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                handleSendNotice(form, params, 2);
            });
        }else {
            handleModalVisible();    //点击蒙层
        }
    }
    let remind_eventType = null;
    if(Object.keys(matchJson).length > 0) {
        if( matchJson.textJson.matchType == 'REMIND') {
            if(matchJson.textJson.data.frequency == '0') {
                remind_eventType = '提醒（一次性事件）';
            }else {
                remind_eventType = '提醒（重复事件）';
            }
        }
        if(matchJson.textJson.matchType == 'BIRTHDAY') {
            if(matchJson.textJson.data.frequency == '0') {
                remind_eventType = '生日（一次性事件）';
            }else {
                remind_eventType = '生日（重复事件）';
            }
        }
        if(matchJson.textJson.matchType == 'MARK_DAY') {
            if(matchJson.textJson.data.frequency == '0') {
                remind_eventType = '纪念日（一次性事件）';
            }else {
                remind_eventType = '纪念日（重复事件）';
            }
        }
    }
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 1 },
        },
    };
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={cacleHandle}
            cancelText={'无法识别'}
            title={'验证'}
            width={800}
            destroyOnClose={true}
        >
            <p style={{fontSize: 12, color: '#999'}}>（alt + c开始录音，alt + v结束录音）</p>
            <FormItem {...formItemLayout} label='文本输入'>
                <div>
                    <Input onChange={(e) => getInput(e)} style={{width: '72%'}} value={inputValue}/>
                    <Button type="primary" style={{marginLeft: 10}} onClick={() => getContent(params.id)} loading={getBtnLoading}>获取</Button>  
                </div>
            </FormItem>
            <FormItem {...formItemLayout} label="录音输入">
                {form.getFieldDecorator('text', {
                    // rules: [{ required: true, message: '请输入录音' }],
                    // initialValue: '',
                })(
                    <div>
                        {/* <Input placeholder="请输入文本" style={{width: '78%'}} onChange={(e) => textChange(e)}/>
                        <Button type="primary" style={{marginLeft: 10}} onClick={() => getText(form,params)} loading={btnLoading}>获取</Button> */}
                        <Button type="primary" onClick={() => startRecord()} loading={startLoading}>开始录音</Button>
                        <Button type="primary" style={{marginLeft: 10}} onClick={() => endRecord(params)} loading={endLoading}>结束录音</Button>
                    </div>
                )}
            </FormItem>
            

            {
                Object.keys(matchJson).length > 0 && Object.keys(matchJson.textJson.data).length > 0 ? 
                    matchJson.textJson.matchType == 'BOOKKEEPING' || matchJson.textJson.matchType == 'BOOKKEEPING_SEARCH' ?
                    <div>   {/*记账,记账查询*/}
                        <FormItem {...formItemLayout} label="事件类型">
                            <p>{matchJson.textJson.matchType == 'BOOKKEEPING' ? '记账' : '记账查询'}</p>            
                        </FormItem>
                        <FormItem {...formItemLayout} label="金额">
                            <p>{matchJson.textJson.data.amount}</p>          
                        </FormItem>
                        <FormItem {...formItemLayout} label="类型">
                            <p>{matchJson.textJson.data.categoryName}</p>              
                        </FormItem>
                        <FormItem {...formItemLayout} label={matchJson.textJson.data.categoryName == '收入' ? "来源" : "用途"}>
                            <p>{matchJson.textJson.data.introduce}</p>     
                        </FormItem>
                         <FormItem {...formItemLayout} label="时间">
                            <p>{matchJson.textJson.data.eventDate}</p>            
                        </FormItem>
                        <FormItem {...formItemLayout} label="地址">
                            <p>{matchJson.textJson.data.place}</p>               
                        </FormItem>
                        <FormItem {...formItemLayout} label="语音转文本内容">
                            <p>{matchJson.text}</p>                
                        </FormItem>
                    </div>
                    :
                    <div>   {/*提醒，生日，纪念日*/}
                        <FormItem {...formItemLayout} label="事件类型">
                            <p>{remind_eventType}</p>            
                        </FormItem>
                        <FormItem {...formItemLayout} label="提醒次数">
                            <p>{matchJson.textJson.data.count}</p>              
                        </FormItem>
                        <FormItem {...formItemLayout} label="事件名称">
                            <p>{matchJson.textJson.data.introduce}</p>                
                        </FormItem>
                        <FormItem {...formItemLayout} label="时间类型">
                            <p>{(typeof(matchJson.textJson.data.lunar) == 'string' ?  JSON.parse(matchJson.textJson.data.lunar) : matchJson.textJson.data.lunar) ? '农历' : '公历'}</p>       
                        </FormItem>
                        <FormItem {...formItemLayout} label="开始时间">
                            <p>{matchJson.textJson.data.beginTime}</p>           
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否电话">
                            <p>{matchJson.textJson.data.phone ? matchJson.textJson.data.phone : '否'}</p>            
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否短信">
                            <p>{matchJson.textJson.data.sms ? matchJson.textJson.data.sms : '否'}</p>   
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否微信">
                            <p>{matchJson.textJson.data.weixin ? matchJson.textJson.data.weixin : '否'}</p>                
                        </FormItem>
                        <FormItem {...formItemLayout} label="语音转文本内容">
                            <p>{matchJson.text}</p>                
                        </FormItem>
                    </div>
                : null

            }
        </Modal>
    )
})

@connect(({ textRecognition, loading }) => ({
    textRecognition,
    loading: loading.models.textRecognition,
}))
@Form.create()
export default class TextRecognition extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        modalVisible: false,
        loading: false,
        type:'',
        startLoading: false,   //开始录音
        endLoading: false,      //结束录音
        noticeLoading: false,     //通知
        getBtnLoading: false,    //获取按钮
        unrecognizedLoading: false,    //无法识别
        inputValue: '',    //输入框默认值
        matchJson: {},  //录音验证数据
        isStartRecord: true,   //是否开始录音
        errorVisible:false,
        matchType:'',
    }

    componentDidMount() {
        this.getData();
        this.keyPress();
        // this.queryCount();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown',this.keyBordListener);
    } 

    // 统计展示
    queryCount = () =>{
        const { dispatch } = this.props;
        dispatch({
            type:'textRecognition/queryCount',
            payload:{},
            callback:(res)=>{
                if(res.code == 0){
                    const { userName,total,unmathNum } = res.data;
                    this.setState({
                        countObj:{
                            userName,
                            total,
                            unmathNum,
                        },
                    })
                }
            }
        })
    }
    //键盘实现录音  停止录音
    keyPress = () => {
        window.addEventListener('keydown',this.keyBordListener)
    }

    keyBordListener = (e) => {
        const that = this;
        if(this.state.modalVisible) {   //验证弹框出来才执行录音
            if(e.altKey) {
                if(e.key == 'c' || e.keyCode == 115) {
                    that.startRecord();
                }
                if(e.key == 'v' || e.keyCode == 101) {
                    const { params } = this.state;
                    that.endRecord(params.id);
                }
            }
        }
    }


    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'textRecognition/textQuery',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    ...fieldsValue,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            // this.setState({page:1})
                        }else {
                            message.error(res.message || '服务器错误');
                            
                        }
                        this.setState({ loading: false, page: this.state.page })
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
            type: 'textRecognition/textQuery',
            payload: {
                page: 1,
                pageSize: 10,
                status: '',
                content: '',
                reviewStatus: '',
                recogStatus:'',
                type:'',
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
                    <FormItem label="文本内容">
                    {getFieldDecorator('content',{
                        initialValue: "",
                    })(<Input placeholder="请输入文本" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="状态">
                    {getFieldDecorator('status',{
                        initialValue: '',
                    })(
                        <Select placeholder="请选择状态">
                            <Option value=''>全部</Option>
                            <Option value='0'>正常</Option>
                            <Option value='-1'>异常</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="匹配状态">
                    {getFieldDecorator('recogStatus',{
                        initialValue: '',
                    })(
                        <Select>
                            <Option value=''>全部</Option>
                            <Option value={1}>未匹配</Option>
                            <Option value={2}>结果为空</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="审核状态">
                    {getFieldDecorator('reviewStatus',{
                        initialValue: '',
                    })(
                        <Select placeholder="请选择审核状态">
                            <Option value=''>全部</Option>
                            <Option value='0'>未审核</Option>
                            <Option value='1'>正确</Option>
                            <Option value='2'>异常</Option>
                            <Option value='3'>已确认</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="创建类型">
                    {getFieldDecorator('type',{
                        initialValue: '',
                    })(
                        <Select>
                            <Option value=''>全部</Option>
                            <Option value={1}>小橙</Option>
                            <Option value={2}>记账</Option>
                            <Option value={3}>提醒</Option>
                            <Option value={4}>生日纪念日</Option>
                            <Option value={5}>小橙记账</Option>
                            <Option value={6}>小橙提醒</Option>
                            <Option value={7}>小橙生日纪念日</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24} >
                    <div style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                        重置
                        </Button>
                    </div>
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
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'textRecognition/textQuery',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false, page: current });
                }
            });
        });
    }

    // //删除
    // showDeleteConfirm(ids) {
    //     this.props.dispatch({
    //         type: 'textVerify/textDelete',
    //         payload: {
    //             ids: ids,
    //         },
    //         callback: (res) => {
    //             if(res) {
    //                 if(res.code == '0'){
    //                     this.getData();
    //                     message.success('删除成功');
    //                 }else{
    //                     message.error(res.message || '服务器错误');
    //                 }
    //             }
    //         }
    //     });
    // }
    
    //审核
    verify = (id,status) => {
        this.props.dispatch({
            type: 'textRecognition/verify',
            payload: {
                object: {
                    id: id,
                    reviewStatus: status
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == 0) {
                        message.success(res.message)
                        this.getData();
                    }else {
                        message.error(res.message || '服务器错误')
                    }
                }
            }
        })
    }

    //验证发送通知   type为0直接通知、1验证通知(录音）、2无法识别
    handleSendNotice = (form,params,type) => {
        if(type == 1) { this.setState({ noticeLoading: true }) }
        if(type == 2) { this.setState({ unrecognizedLoading: true }) }   
        this.props.dispatch({
            type: 'textRecognition/sendNotice',
            payload: {
                id: params.id,  
                type    
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        type ? message.success('验证成功') : message.success('通知成功');
                        if (type != 0) {
                            form.resetFields();
                        }
                        this.setState({ modalVisible: false });
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                    // this.setState({ isStartRecord: true });   //可以再次录音
                    this.setState({ 
                        noticeLoading: false,
                        unrecognizedLoading: false
                    });   
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
    getText = (blob,params) => {
        recorder = false;    //结束录音后  不可继续点击结束录音
        const that = this;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({ endLoading: true, startLoading: false })
            let formData = new FormData();
            formData.append("voiceFile", blob);
            formData.append("json", "{object:{id: "+params.id+"}}");
            this.props.dispatch({
                type: 'textRecognition/textByCheck',
                payload: formData,
                callback: (res) => {
                    if(res) {
                        if (res.code == "0") {
                            if(res.data.textJson.data) {
                                that.setState({
                                    matchJson: res.data,
                                    inputValue: res.data.text
                                });    //识别成功
                            }else{
                                message.error(res.data.textJson.errorMsg);
                                that.setState({ 
                                    matchJson: {},
                                    inputValue: ''
                                });    //识别失败,无数据  可以录音 
                            }
                        }else {
                            that.setState({
                                matchJson: {},
                                inputValue: ''
                            }) 
                            message.error(res.message || '服务器错误');
                        }
                        that.setState({endLoading: false});
                    }
                }
            });
        });
        
    }

     //验证弹框
     handleModalCheck = (flag, btn, params) => {
        const that = this;
        that.refs.checkform.resetFields();
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            matchJson: {},   //打开关闭弹窗将对象置为空，调接口时才设值(编辑时除外)
            inputValue: ''    //打开关闭弹框  将输入框清空
        });
       
    };

    //取消
    handleModalVisible = (flag, btn, params) => {
        const that = this;
        recorder = false;    //弹框打开或取消设置录音为
        that.refs.checkform.resetFields();
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            matchJson: {},   //打开关闭弹窗将对象置为空，调接口时才设值(编辑时除外)
            startLoading: false,
            endLoading: false,
            getBtnLoading: false
        });
       
    };

    //开始录音
   
    startRecord = () => {
        // if(!this.state.isStartRecord) return message.error('请先确定'); 
        this.setState({ startLoading: true, recorder: true });
        if(recorder){
            recorder.start();
            return;
        }
        
        HZRecorder.get(function (rec) {  
            recorder = rec;  
            recorder.start();  
        },{error:'1'});  
        // this.setState({ isStartRecord: false });    //录音后不可录音（通知后才行）    
    }
    //结束录音
    endRecord = (id) => {
        if(!recorder){
            message.error("请先录音");
            return;
        }
       let record = recorder.getBlob();  
       if(record.duration!==0){
    //    downloadRecord(record.blob);
            this.getText(record.blob,id)
       }else{
        message.error("请先录音")
       }
    }

    //获取输入框内容
    getInput = (e, id) => {
        let textInput = e.target.value;
        this.setState({ inputValue: textInput });
    }

    //通过输入文本获取内容
    getContent = (id) => {
        const that = this;
        this.setState({ getBtnLoading: true });
        this.props.dispatch({
            type: 'textRecognition/updateByText',
            payload: {
                object: {
                    id: id,
                    text: this.state.inputValue
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == 0) {
                        if(res.data.textJson.data) {
                            that.setState({
                                matchJson: res.data,
                            });   //识别成功
                        }else{
                            message.error(res.data.textJson.errorMsg);
                            // that.setState({ isStartRecord: true });    //识别失败,无数据  可以录音 
                            that.setState({
                                matchJson: {},
                                inputValue: ''
                            }); 
                        }
                    }else {
                        message.error(res.message || '服务器错误');
                        that.setState({
                            matchJson: {},
                            inputValue: ''
                        }); 
                    }
                    this.setState({ getBtnLoading: false });
                }
            }
        })
    }

    // 修改错误文本弹框
    modifeError = (row) => {
        this.setState({
            errorVisible:true,
            errorData:row,
            matchType:row.matchType,
        })
    }
    errorOk = () =>{
        const { dispatch } = this.props;
        const { errorData:{id,matchType} } = this.state;
        const _this = this;
        this.props.form.validateFields((error,values)=>{
            const { errorText } = values;
            let matchType = values.matchType || 'BOOKKEEPING';
            if(!errorText){
                _this.errorCancel();
                return;
            }
            dispatch({
                type:'textRecognition/modifeError',
                payload:{
                    id,
                    matchType,
                    errorMsg:errorText,
                },
                callback:(res)=>{
                    if(res.code == 0){
                        message.info('修改成功');
                        this.getData();
                        _this.errorCancel();
                    }
                }
            })
        })
       
    }
    errorCancel = () => {
        this.setState({
            errorVisible:false,
        })
    }
    render() {
        const { dataList, total } = this.props.textRecognition && this.props.textRecognition.data;
        const  { page, pageSize, loading, countObj,errorVisible, matchType} = this.state;
        let {errorData={}} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [{
                title: 'memberId',
                dataIndex: 'memberId',
                key: 'memberId',
                width:120,
                render:(key,row)=>{
                    return row.tab ?  
                        <div>{key}<span style={{color:'#40a9ff',marginLeft:5}}>[测试]</span></div>
                        :
                        <div>{key}</div>
                }
            },{
                title: '创建类型',
                dataIndex: 'type',
                key: 'type',
                width:100,
                render:(key)=>{
                    let text;
                    if(key == 1){
                        text = '小橙';
                    }else if(key == 2){
                        text = '记账';
                    }else if(key == 3){
                        text = '提醒';
                    }else if(key == 4){
                        text = '生日纪念日';
                    }else if(key == 5){
                        text = '小橙记账';
                    }else if(key == 6){
                        text = '小橙提醒';
                    }else if(key == 7){
                        text = '小橙生日纪念日';
                    }
                    return <div>{text}</div>
                }
            }, {
                title: '事件类型',
                dataIndex: 'matchType',
                key: 'matchType',
                width:100,
                render: (value, row, index) => {
                    let eventType;
                    switch(row.matchType) {
                        case 'REMIND':
                            eventType = '提醒';
                            break;
                        case 'BOOKKEEPING':
                            eventType = '记账';
                            break;
                        case 'BOOKKEEPING_SEARCH':
                            eventType = '记账查询';
                            break;
                        case 'BIRTHDAY':
                            eventType = '提醒（生日）';
                            break;
                        case 'MARK_DAY':
                            eventType = '提醒（纪念日）';
                            break;
                        default: 
                            eventType = '--';
                    }
                    return(<span key={index}>{eventType}</span>)
                }
            }, {
                title: '文本内容',
                dataIndex: 'content',
                key: 'content',
                width: 220,
            }, {
                title: '结果',
                dataIndex: 'detail',
                key: 'detail',
                render: (value, row, index) => {
                    if(row.code == -1) {
                        return  <span key={row.id} style={{color: 'red'}}>{row.result}</span>
                    }else {
                        if((row.matchType == 'REMIND' || row.matchType == 'BIRTHDAY' || row.matchType == 'MARK_DAY') && row.result) {
                            const data = row.result.data;
                            if(data) {
                                return(
                                    <span key={row.id}>
                                        {`事件名称：${data.introduce}；开始时间：${data.beginTime}；
                                        是否短信：${data.sms ? data.sms ? '是' : '否' : '否'}；是否电话：${data.phone ? data.phone ? '是' : '否' : '否'}；
                                        是否微信：${data.weixin ? data.weixin ? '是' : '否' : '否'}；提醒次数：${data.count}；日期类型：${(typeof(data.lunar) == 'string' ? JSON.parse(data.lunar) : data.lunar)  ? '农历' : '公历'}  
                                        `}
                                    </span>
                                ) 
                            }
                            if(row.matchType == 'REMIND'){
                                return ( 
                                <div>
                                    <span key={row.id} style={{color: 'red'}}>{row.result.errorMsg}</span>
                                    <a href="javascript:void(0)" style={{marginLeft:5}} onClick={this.modifeError.bind(this,row)}>修改</a>
                                </div>
                             )
                            }
                        }else {
                            const data = row.result.data;
                            if(data && row.matchType == 'BOOKKEEPING') {
                                return(
                                    <span key={row.id}>
                                        {`类型：${data.tradeType == 2 ? '支出' : '收入'}；分类：${data.categoryName}；金额：${data.amount}；
                                        ${data.tradeType == 2 ? '用途' : '来源'}：${data.introduce}；日期：${data.eventDate}；地点：${data.place}
                                        `}
                                    </span>
                                ) 
                            }else if(data && row.matchType == 'BOOKKEEPING_SEARCH') {
                                return(
                                    <span key={row.id}>
                                        {`开始时间：${moment(data.beginTime).format('YYYY-MM-DD HH:mm:ss')}；结束时间：${moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')}； 关键词：${data.keyWord}`}
                                    </span>
                                ) 
                            }else {
                                let dom = null;
                                if(row.result.errorMsg||(Object.keys(row.result).length==1&&row.result['spendTime:'])||!Object.keys(row.result).length){
                                    dom = (
                                    <div>
                                        <span key={row.id} style={{color: 'red'}}>{row.result.errorMsg}</span>
                                        <a href="javascript:void(0)" style={{marginLeft:5}} onClick={this.modifeError.bind(this,row)}>修改</a>
                                    </div>
                                    )
                                }else{
                                    dom = <span key={row.id}>{row.result.tipMessage}</span>;
                                }
                                return dom
                            }    
                        }
                    }
                }
            }, {
                title: '验证文本',
                dataIndex: 'text',
                key: 'text',
                width:90,
            }, {
                title: '验证结果',
                dataIndex: 'textJson',
                key: 'textJson',
                width:90,
                render: (value, row, index) => {
                    if(value == '' || value == null) {
                        return(<span key={row.id} style={{color: 'red'}}>{row.textJson}</span>)
                    }else {
                        if((row.textJson.matchType == 'REMIND' || row.textJson.matchType == 'BIRTHDAY' || row.textJson.matchType == 'MARK_DAY') && row.textJson) {
                            const data = row.textJson.data;
                            if(data) {
                                return(
                                    <span key={row.id}>
                                        {`事件名称：${data.introduce}；开始时间：${data.beginTime}；
                                        是否短信：${data.sms ? data.sms ? '是' : '否' : '否'}；是否电话：${data.phone ? data.phone ? '是' : '否' : '否'}；
                                        是否微信：${data.weixin ? data.weixin ? '是' : '否' : '否'}；提醒次数：${data.count}；日期类型：${(typeof(data.lunar) == 'string' ? JSON.parse(data.lunar) : data.lunar) ? '农历' : '公历'}  
                                        `}
                                    </span>
                                ) 
                            }
                        }else {
                            const data = row.textJson.data;
                            if(data && row.matchType == 'BOOKKEEPING') {
                                return(
                                    <span key={row.id}>
                                        {`类型：${data.tradeType == 2 ? '支出' : '收入'}；分类：${data.categoryName}；金额：${data.amount}；
                                        ${data.tradeType == 2 ? '用途' : '来源'}：${data.introduce}；日期：${data.eventDate}；地点：${data.place}
                                        `}
                                    </span>
                                ) 
                            }else if(data && row.matchType == 'BOOKKEEPING_SEARCH') {
                                return(
                                    <span key={row.id}>
                                        {`开始时间：${moment(data.beginTime).format('YYYY-MM-DD HH:mm:ss')}；结束时间：${moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')}； 关键词：${data.keyWord}`}
                                    </span>
                                ) 
                            }
                            
                        }
                    }
                }
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width:170,
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:60,
                render: (value, row, index) => {
                    return (<span key={index} style={value == -1 ? {color: 'red'} : {}}>{value == -1 ? '异常' : '正常'}</span>)
                }
            }, {
                title: '审核状态',
                dataIndex: 'reviewStatus',
                key: 'reviewStatus',
                width:90,
                render: (value, row, index) => {
                    let reviewStatus,myStyle;
                    switch(value) {
                        case 0:
                            reviewStatus = '未审核';
                            myStyle = {};
                            break;
                        case 1:
                            reviewStatus = '正确';
                            myStyle={color: 'green'}
                            break;
                        case 2:
                            reviewStatus = '异常';
                            myStyle={color: 'red'}
                            break;
                        case 3:
                            reviewStatus = '已确认';
                            myStyle={color: '#1990ff'}
                            break;
                        default:
                            reviewStatus = '';
                    }
                    return (<span key={row.id} style={myStyle}>{reviewStatus}</span>)
                }
            }, {
                title: '审核',
                dataIndex: 'operate',
                key: 'operate',
                width: 410,
                render: (value, row, index) => {
                    return(
                        <Fragment key={index}>
                            <Button onClick={() => this.verify(row.id,'1')} type='primary'>正确</Button>
                            <Button style={{marginLeft: '5px'}} onClick={() => this.verify(row.id,'2')} type='primary'>异常</Button>
                            <Button  style={{marginLeft: '5px'}} onClick={() => this.verify(row.id,'3')} type='primary'>已确认</Button>
                            <Button  style={{marginLeft: '5px'}} onClick={() => this.handleModalCheck(true, 'edit', row)} type='primary'>验证</Button>
                            <Button  style={{marginLeft: '5px'}} onClick={() => this.handleSendNotice(null, row, 0)} type='primary'>通知</Button>
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
            handleSendNotice: this.handleSendNotice,
            handleModalVisible: this.handleModalVisible,
            getText: this.getText,
            getInput: this.getInput,
            startRecord: this.startRecord,
            endRecord: this.endRecord,
            getContent: this.getContent
        };
       
        return(
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    {
                        countObj ? 
                        (
                            <div className={styles.number}>
                                小橙智能数据条数：<span>{countObj.total}</span>
                                <Divider type="vertical" />
                                未匹配到的数据条数：<span>{countObj.unmathNum}</span>
                            </div>
                        ):null
                    }
                    <div></div>
                    {/* <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                            添加
                        </Button>
                    </div> */}
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

                <CheckForm {...this.state} {...parentMethods} ref="checkform"/>
                <Modal
                    visible={errorVisible}
                    title="修改结果"
                    onOk={this.errorOk}
                    onCancel={this.errorCancel}
                    destroyOnClose={true}
                >
                    <Form>
                        <FormItem 
                        label="文本内容"
                        labelCol={{span:4}}
                        wrapperCol={{span:20}}
                        >
                            <div style={{color:'red'}}>{errorData.result&&errorData.result.errorMsg}</div>
                        </FormItem>
                        <FormItem 
                        label="修改内容"
                        labelCol={{span:4}}
                        wrapperCol={{span:20}}
                        >
                        {getFieldDecorator('errorText',{
                            initialValue: "",
                        })(<TextArea  row={2} />)}
                        </FormItem>
                        <FormItem 
                        label="识别类型"
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                        >
                        {getFieldDecorator('matchType',{
                            initialValue: matchType||'BOOKKEEPING',
                        })(
                            <Select>
                                <Option value="BOOKKEEPING">记账</Option>
                                <Option value="REMIND">提醒</Option>
                            </Select>
                        )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}