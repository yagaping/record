import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Input,
    Tabs
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import imgUrl from '../../assets/nodata.png';
import HZRecorder from './recorder';
import ModalResult from '../../components/ModalResult';
import TextArea from 'antd/lib/input/TextArea';
import TextRecognition from './TextRecognition';
import TextVerify from './TextVerify';
import DataTemplate from './DataTemplate';
import TextCount from './commponents/TextCount';
import TextMatching from './TextMatching';
import TextMatchList from './TextMatchList';
import ModuleIntroduce from '../../components/ModuleIntroduce';
let recorder;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const MATCHTYPE = {
    REMIND:'提醒',
    BIRTHDAY:'提醒（生日）',
    MARK_DAY:'提醒（纪念日）',
    BOOKKEEPING:'记账',
}
@connect(({ textExamine,textRecognition, loading }) => ({
    textExamine,
    textRecognition,
    loading: loading.models.textExamine,
}))
@Form.create()
export default class TextExamine extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        startLoading: false,   //开始录音
        endLoading: false,      //结束录音
        noticeLoading: false,     //通知
        unrecognizedLoading: false,    //无法识别
        getBtnLoading: false,    //获取按钮
        inputValue: '',    //输入框默认值
        matchJson: {},  //录音验证数据
        isStartRecord: true,   //是否开始录音
        show: true,    //按钮显示  
        isShow:false, 
        updataTips:'',
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        
    } 

    //键盘实现录音  停止录音
    keyPress = () => {
        window.addEventListener('keydown',this.keyBordListener)
    }

    keyBordListener = (e) => {
        const that = this;
        const { data } = this.props.textExamine;
        if(e.altKey) {
            if(e.key == 'c' || e.keyCode == 115) {
                that.startRecord();
            }
            if(e.key == 'v' || e.keyCode == 101) {
                that.endRecord(data.id);
            }
        }
        if(e.key == 'Enter' || e.keyCode == 13 ) {
            this.getContent(data.id);
        }
    }

    getData = () => {
        // message.config({ top: 400 });
        // message.loading('',0.2);
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'textExamine/examineText',
                payload: {},
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({matchJson: {}});    //请求数据后将matchJson置空
                            if(Object.keys(res.data).length == 0) { 
                                //如果请求数据为空  1s后再次请求 
                                this.setState({show: false});   //如果请求数据为空  按钮将不显示
                                this.timer = setTimeout(() => {
                                    message.error(res.message,1);
                                    this.getData()
                                },1000);
                            }else {
                                this.setState({show: true});   //如果请求数据不为空  按钮显示
                            }
                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                }
            });
        });
    }

    //验证发送通知   type不为空直接通知 否则验证通知
    handleSendNotice = (params,type) => {
        if(this.state.startLoading) return message.error('请先结束录音');
        if(this.state.endLoading) return message.error('请等录音结束');
        if(type == 0 || type == 1) { this.setState({ noticeLoading: true }) }
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
                        message.success('通知成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                    // this.setState({ isStartRecord: true });   //可以再次录音
                    this.setState({ 
                        noticeLoading: false,
                        unrecognizedLoading: false,
                        inputValue: ''    // 通知后文本框置空
                    });   
                }
            }
        });
    }


     //根据text获取json
     getText = (blob,id) => {
        recorder = false;    //结束录音后  不可继续点击结束录音
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({ endLoading: true, startLoading: false })
            const that = this;
            let formData = new FormData();
            formData.append("voiceFile", blob);
            formData.append("json", "{object:{id: "+id+"}}");
            this.props.dispatch({
                type: 'textRecognition/textByCheck',
                payload: formData,
                callback: (res) => {
                    if(res)  {
                        if (res.code == "0") {
                            if(res.data.textJson.data) {
                                that.setState({
                                    matchJson: res.data,
                                    inputValue: res.data.text
                                });   //识别成功
                            }else{
                                message.error(res.data.textJson.errorMsg);
                                that.setState({
                                    matchJson: {},
                                    inputValue: ''
                                }); 
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
            })
        });
        
    }

    //开始录音
    startRecord = () => {
        // if(!this.state.isStartRecord) return message.error('请先通知'); 
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
        if(this.state.inputValue == '') return message.error('请先输入文本');
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
                            that.setState({
                                matchJson: {},
                                inputValue: ''
                            }); 
                        }
                    }else {
                        that.setState({
                            matchJson: {},
                            inputValue: ''
                        }); 
                        message.error(res.message || '服务器错误');
                    }
                    this.setState({ getBtnLoading: false });
                }
            }
        })
    }

    // 显示修改结果弹框
    modifeResult = (data) =>{
        this.setState({
            isShow:true,
        })
    }
    // 隐藏修改结果弹框
    hideModal = () => {
        this.setState({
            isShow:false,
        })
    }
    // 输入错误提示内容
    updateTips = (e) => {
        const { value } = e.target;
        this.setState({
            updataTips:value
        })
    }
    // 确定修改提示内容
    updataTipsOk = (data) => {
        
        const { dispatch } = this.props;
        const { updataTips } = this.state;
        const {id, } = data;
        const _this = this;
        dispatch({
            type:'textExamine/updataTips',
            payload:{
                id,
                errorMsg:updataTips,
                matchType:'REMIND',
            },
            callback:(res)=>{
                if(res.code == 0){
                    message.success('修改成功');
                    _this.handleSendNotice(data,1);
                    // _this.getData();
                }else{
                    message.error(code.message);
                }
            }
        })
    }

    tabChange = e => {
        if(e == '3') {
            this.getData();
            this.keyPress();
        }else if(e != '3') {
            window.removeEventListener('keydown',this.keyBordListener);
            this.timer && clearTimeout(this.timer);
        }
    }

    render() {
        const { data } = this.props.textExamine;
        const  {show, matchJson, startLoading, endLoading, noticeLoading, unrecognizedLoading, getBtnLoading, inputValue ,isShow} = this.state;
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
        //事件类型
        let eventType = '';
       
        //result页面展示数据  结果
        let resultPageData;  
        if(data.modife){
            resultPageData = data.result.replace(/\\/g,'');
            eventType = MATCHTYPE[data.matchType];
        }else{
            if(Object.keys(data).length > 0 && Object.keys(data.result).length > 0) {
                if(data.status == -1) {
                    eventType = data.result;
                }else {
                    switch(JSON.parse(data.result).matchType) {
                        case 'REMIND':
                            if(JSON.parse(data.result).repetitiveModeType == 0) {
                                eventType = '提醒（一次性事件）';
                            }else {
                                eventType = '提醒（重复事件）';
                            }
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
                            eventType = '';
                    }
                }
            }
            // if(data.textJson == '' || data.textJson == null) {
            //     resultPageData = data.result;
            // }
            // else {
                if(data && data.result && Object.keys(data.result).length == 0) {
                    resultPageData = ''
                }else {
                    const resultData = data.result && JSON.parse(data.result);  
                    if(resultData) {
                        if((resultData.matchType == 'REMIND' || resultData.matchType == 'BIRTHDAY' || resultData.matchType == 'MARK_DAY') && resultData.data) {
                            resultPageData = `事件名称：${resultData.data.introduce}；开始时间：${resultData.data.beginTime}；
                                            是否短信：${resultData.data.sms ? resultData.data.sms ? '是' : '否' : '否'}；是否电话：${resultData.data.phone ? resultData.data.phone ? '是' : '否' : '否'}；
                                            是否微信：${resultData.data.weixin ? resultData.data.weixin ? '是' : '否' : '否'}；提醒次数：${resultData.data.count}；日期类型：${(typeof(resultData.data.lunar) == 'string' ? JSON.parse(resultData.data.lunar) : resultData.data.lunar) ? '农历' : '公历'}`;  
                        }else {
                            if(resultData.matchType == 'BOOKKEEPING' && resultData.data) {
                                resultPageData = `类型：${resultData.data.tradeType == 1 ? '收入' : '支出'}；分类：${resultData.data.categoryName}；金额：${resultData.data.amount}；
                                                用途：${resultData.data.introduce}；日期：${resultData.data.eventDate}；地点：${resultData.data.place}`;
                            }else if(resultData.matchType == 'BOOKKEEPING_SEARCH'  && resultData.data) {
                                resultPageData = `开始时间：${moment(resultData.data.beginTime).format('YYYY-MM-DD HH:mm:ss')}；结束时间：${moment(resultData.data.endTime).format('YYYY-MM-DD HH:mm:ss')}； 关键词：${resultData.data.keyWord}`;
                            }else {
                                resultPageData = resultData.errorMsg;
                            }
                        }
                    }
                }
            // }
        }
        //textJson页面展示数据  验证结果
        let textJsonData;   
        if(data.textJson == '' || data.textJson == null) {
            textJsonData = data.textJson;
        }else {
            if(Object.keys(data.result).length == 0) {
                textJsonData = ''
            }else {
                const resultData = JSON.parse(data.result);
                const textData = JSON.parse(data.textJson); 
                if((resultData.matchType == 'REMIND' || resultData.matchType == 'BIRTHDAY' || resultData.matchType == 'MARK_DAY') && resultData.data) {
                    if(textData) {
                        textJsonData = `事件名称：${textData.introduce}；开始时间：${textData.beginTime}；
                                        是否短信：${textData.sms ? textData.sms ? '是' : '否' : '否'}；是否电话：${textData.phone ? textData.phone ? '是' : '否' : '否'}；
                                        是否微信：${textData.weixin ? textData.weixin ? '是' : '否' : '否'}；提醒次数：${textData.count}；日期类型：${(typeof(textData.lunar) == 'string' ? JSON.parse(textData.lunar) : textData.lunar) ? '农历' : '公历'}`;  
                    }
                }else {
                    if(textData && resultData.matchType == 'BOOKKEEPING' && resultData.data) {
                        textJsonData = `${textData.tradeType == 1 ? '收入' : '支出'}；类型：${resultData.data.categoryName}；金额：${textData.amount}；
                                        用途：${textData.introduce}；日期：${textData.eventDate}；地点：${textData.place}`;
                    }else if(textData && resultData.matchType == 'BOOKKEEPING_SEARCH' && resultData.data) {
                        textJsonData = `开始时间：${moment(textData.beginTime).format('YYYY-MM-DD HH:mm:ss')}；结束时间：${moment(textData.endTime).format('YYYY-MM-DD HH:mm:ss')}； 关键词：${textData.keyWord}`;
                    }else {
                        textJsonData = Object.keys(data.textJson).length != 0 ? data.textJson : null;
                    }
                }
            }
        }
        //提醒类型
        let remind_eventType = null;
        if(Object.keys(matchJson).length > 0) {
            if( matchJson.textJson.matchType == 'REMIND') {
                if(matchJson.textJson.data.repetitiveModeType == '0') {
                    remind_eventType = '提醒（一次性事件）';
                }else {
                    remind_eventType = '提醒（重复事件）';
                }
            }
            if(matchJson.textJson.matchType == 'BIRTHDAY') {
                if(matchJson.textJson.data.repetitiveModeType == '0') {
                    remind_eventType = '生日（一次性事件）';
                }else {
                    remind_eventType = '生日（重复事件）';
                }
            }
            if(matchJson.textJson.matchType == 'MARK_DAY') {
                if(matchJson.textJson.data.repetitiveModeType == '0') {
                    remind_eventType = '纪念日（一次性事件）';
                }else {
                    remind_eventType = '纪念日（重复事件）';
                }
            }
        }

        const repetitiveModeType = {
            "0": "单次事件",
            "1": "每天",
            "2": "每星期",
            "3": "每2个星期",
            "4": "每月",
            "5": "每月第二个星期几",
            "6": "每年的今天",
            "7": "自定义",
            "8": "工作日",
            "9": "周末",
            "10": "法定工作日",
            "11": "节假日",
            "12": "金融交易日",
            "13": "股指交割日",
            "14": "国债交割日",
            "15": "50ETF期权行权日（每月第四个星期三）"
        }

        return(
            <PageHeaderLayout title={'文本识别'}>
                <Card bordered={false}>
                    <Tabs
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        onChange={this.tabChange.bind(this)}
                        type='card'
                    >
                        <TabPane tab='文本识别验证' key='1'>
                            <ModuleIntroduce text={'小橙语音验证'} />
                            <TextVerify />
                        </TabPane>
                        <TabPane tab='文本识别记录' key='2'>
                            <ModuleIntroduce text={'小橙语音识别记录'} />
                            <TextRecognition />
                        </TabPane>
                        <TabPane tab='文本语音审核' key='3'>
                            <ModuleIntroduce text={'语音人工审核'} />
                            {show ? 
                                <div>
                                    <p style={{fontSize: 12, color: '#999'}}>（alt + c开始录音，alt + v结束录音）</p>
                                    <Row style={{marginTop: 50}}>
                                        <Col span={12}>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='ID'>
                                                        <p>{data ? data.id : null}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='事件类型'>
                                                        <p>{eventType}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='文本内容'>
                                                        <p>{data ? data.content : null}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='结果'>
                                                        <p>{resultPageData}</p>
                                                        {/* <ModalResult
                                                            data={data}
                                                            isShow={isShow}
                                                            dispatch={this.props.dispatch}
                                                            hideModal={this.hideModal}
                                                        />
                                                        <Button type='primary' onClick={this.modifeResult.bind(this,data)}>修改</Button> */}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='验证文本'>
                                                        <p>{data ? data.text : null}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='验证结果'>
                                                        <p>{textJsonData}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row> */}
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='创建时间'>
                                                        <p>{data ? data.createTime : null}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='状态'>
                                                        <p>{data ? data.status == 1 ? '异常' : '正常' : null}</p>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>    
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='文本输入（或者语音输入）'>
                                                        <div>
                                                            <Input onChange={(e) => this.getInput(e)} style={{width: '80%'}} value={inputValue}/>
                                                            <Button type="primary" style={{marginLeft: 10}} onClick={() => this.getContent(data.id)} loading={getBtnLoading}>获取</Button>  
                                                        </div>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                <Col  sm={24}>
                                                    <FormItem {...formItemLayout} label='错误信息提示'>
                                                        <TextArea onChange={this.updateTips} rows={4} />
                                                        <Button type="primary" onClick={this.updataTipsOk.bind(this,data)} style={{marginTop:10}}>修改</Button>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            {
                                                Object.keys(matchJson).length > 0 && Object.keys(matchJson.textJson.data).length > 0
                                                ? 
                                                matchJson.textJson.matchType == 'BOOKKEEPING' || matchJson.textJson.matchType == 'BOOKKEEPING_SEARCH' ?
                                                <div>   {/*记账,记账查询*/}
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="事件类型">
                                                                <p>{matchJson.textJson.matchType == 'BOOKKEEPING' ? '记账' : '记账查询'}</p>            
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="类型">
                                                                <p>{matchJson.textJson.data.tradeType == '2' ? '支出' : '收入'}</p>              
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="分类">
                                                                <p>{matchJson.textJson.data.categoryName}</p>              
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="金额">
                                                                <p>{matchJson.textJson.data.amount}</p>          
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label={matchJson.textJson.data.tradeType == '2' ? "用途" : "来源"}>
                                                                <p>{matchJson.textJson.data.introduce}</p>     
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="时间">
                                                                <p>{matchJson.textJson.data.eventDate}</p>            
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="地址">
                                                                <p>{matchJson.textJson.data.place}</p>               
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="验证文本">
                                                                <p>{matchJson.text}</p>               
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                :
                                                <div>   {/*提醒，生日，纪念日*/}
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="事件类型">
                                                                <p>{remind_eventType}</p>            
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="提醒次数">
                                                                <p>{matchJson.textJson.data.count}</p>              
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="事件名称">
                                                                <p>{matchJson.textJson.data.introduce}</p>                
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="时间类型">
                                                                <p>{matchJson.textJson.data.lunar ? '农历' : '公历'}</p>       
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="开始时间">
                                                                <p>{matchJson.textJson.data.beginTime}</p>           
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="重复方式">
                                                                <p>{repetitiveModeType[matchJson.textJson.data.repetitiveModeType]}</p>           
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="是否电话">
                                                                <p>{matchJson.textJson.data.phone ? matchJson.textJson.data.phone : '否'}</p>            
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="是否短信">
                                                                <p>{matchJson.textJson.data.sms ? matchJson.textJson.data.sms : '否'}</p>   
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="是否微信">
                                                                <p>{matchJson.textJson.data.weixin ? matchJson.textJson.data.weixin : '否'}</p>                
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                                        <Col  sm={24}>
                                                            <FormItem {...formItemLayout} label="验证文本">
                                                                <p>{matchJson.text}</p>               
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                :
                                                null
                                            }
                                        </Col>
                                    </Row>
                                </div> 
                                :
                                <Row>
                                    <Col span={24} style={{display: 'flex',justifyContent: 'center'}}>
                                        <img src={imgUrl}/>
                                    </Col>
                                    <Col span={24} style={{display: 'flex',justifyContent: 'center', marginTop: '10px'}}>
                                        <span>暂无数据</span>
                                    </Col>
                                </Row>
                                }
                                {show ?    
                                    <Row style={{marginTop: 150}}>
                                        <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                                            <Button type="primary" style={{marginLeft: 10}} onClick={() => this.startRecord()} loading={startLoading}>开始录音</Button>
                                            <Button type="primary" style={{marginLeft: 10}} onClick={() => this.endRecord(data.id)} loading={endLoading}>结束录音</Button>
                                            <Button type="primary" style={{marginLeft: 10}} onClick={() => {
                                                //type 0直接通知、1验证通知(录音）、2无法识别
                                                Object.keys(matchJson).length > 0 ? this.handleSendNotice(data,1) :  this.handleSendNotice(data,0)
                                            }} loading={noticeLoading}>通知</Button>
                                            <Button type="primary" style={{marginLeft: 10}} onClick={() => this.handleSendNotice(data,2)} loading={unrecognizedLoading}>无法识别</Button>
                                        </Col>
                                    </Row>
                                :
                                null}
                        </TabPane>
                        <TabPane tab='模板数据' key='4'>
                            <ModuleIntroduce text={'记账提醒模板数据'} />
                            <DataTemplate />
                        </TabPane>
                        <TabPane tab='文本识别统计' key='5'>
                            <ModuleIntroduce text={'文本识别统计模板数据'} />
                            <TextCount />
                        </TabPane>
                        {/* <TabPane tab='文本匹配' key='5'>
                            <TextMatching />
                        </TabPane>
                        <TabPane tab='文本匹配识别列表' key='6'>
                            <TextMatchList />
                        </TabPane> */}
                    </Tabs>
                
                </Card>
                
            </PageHeaderLayout>
        )
    }
}