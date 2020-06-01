import React, { PureComponent, Fragment } from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    message,
    Icon,
    Button,
    Table, 
    Modal,
    Select,
    Popconfirm,
    DatePicker,
    Input,
    Divider,
    Popover,
    Tooltip,
    Radio,
    Tabs
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import UploadFile from '../../components/UploadFile';
import ModuleIntroduce from '../../components/ModuleIntroduce'
import styleBtn from './BeautifulListening.less';
import { secondsToDate } from '../../utils/utils';
import TextArea from 'antd/lib/input/TextArea';
import DateContent from '../../components/DateContent';
import PreviewAudio from './components/PreviewAudio';
import CellEditor from '../../components/CellEditor';
import Recommend from './Recommend';
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const CreateForm = Form.create()(props => {
    const { 
        handleModalVisible,
        modalVisible,
        form, 
        btn, 
        handleAdd, 
        handleEdit, 
        params, 
        getImgUrl, 
        getThumbnailUrl,
        fileList, 
        thumbnailFileList,
        setFileList, 
        setThumbnailFileList,
        changePath, 
        upload, 
        audioUrl, 
        cancleUpload, 
        loading, 
        typeNameList 
    } = props;
    
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
        //   if(audioUrl) form.resetFields();
          btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    };

    const typeArr = [];

    const TYPE = typeNameList ? typeNameList.map(item => {
        typeArr.push(item.typeName)
        return <Option value={item.id} key={item.id}>{item.typeName}</Option>
    }) : <Option value="">暂无</Option>;

    

    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "新增美听" : "编辑美听"}
            width={800}
            confirmLoading={loading}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="创建时间">
                {form.getFieldDecorator('createTime', {
                    rules: [{ required: true }],
                    initialValue: params ? moment(params.createTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类">
                {form.getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择分类' }],
                    initialValue: params ? params.type : 1,
                })(
                    <Select style={{width: '100%'}}>
                        {TYPE}
                    </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配音">
                {form.getFieldDecorator('author', {
                    rules: [{ required: true, message: '请输入配音' }],
                    initialValue: params ? params.author : '',
                })(<Input placeholder="请输入配音"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                {form.getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题' }],
                    initialValue: params ? params.title : '',
                })(<Input placeholder="请输入标题"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
                {form.getFieldDecorator('content', {
                    initialValue: params ? params.content : '',
                })(<TextArea placeholder="请输入内容" rows={6} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                {form.getFieldDecorator('describe', {
                    initialValue: params ? params.describe : '',
                })(<TextArea placeholder="请输入描述" rows={3} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标">
                <UploadFile getImgUrl={getThumbnailUrl} fileList={thumbnailFileList} setFileList={setThumbnailFileList} />
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="封面">
                <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="音频地址">
                {/* <input */}
                <Row className={styles.videoWrap}>
                    <Col className={styleBtn.colWrap}>
                        <div>
                            <label className={styleBtn.input} >选择文件
                                <input className={styleBtn.inputBtn} value="" type='file' accept='audio/*' onChange={changePath.bind(this,typeNameList)}/>
                            </label>
                        </div>
                        {/* <div>
                            <Button type='primary' loading={loading} onClick={upload} style={{marginLeft:20}}>上传</Button>
                        </div> */}
                    </Col>
                </Row>
                <Row className={styleBtn.videoWrap}>
                    <Col>{audioUrl ? <audio src={audioUrl} controls  /> : null}</Col>
                </Row>
                {/* <UploadVideo changePath={changePath} upload={upload} src={src} cancleUpload={cancleUpload} loading={loading}/> */}
            </FormItem>
        </Modal>
    )
})
@connect(({ beautifulListening, loading }) => ({
    beautifulListening,
    loading: loading.models.beautifulListening,
}))
@Form.create()
export default class BeautifulListening extends PureComponent {
    constructor(props){
        super(props);
        this.date = null;
    }
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        publishLoading: false,
        modalVisible: false,
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        modalVisibleTime: false,
        audioImg:'',
        thumbnail:'',
        fileList:[],
        detailFileList: [],
        name: '',
        path: '',
        preview: null,
        data: null,
        audioUrl: '',
        audioSize: 0,
        clickType: '',   //全部
        typeArr: [],  //类别数组
        previewData:[],
        modalVisiblePreview:false,
    }
    
    componentDidMount() {
        this.getData('1');
        this.getOneMonthData();
    }

    getData = (page, date) => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        page = page ? page : this.state.page;
        
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            let params = {
                page: page,
                pageSize: this.state.pageSize,
                ...fieldsValue,
                type: this.state.clickType
            }
            this.date = null;
            if( date ){
                params['publishTime'] = date;
                this.date = date;
            }
            dispatch({
                type: 'beautifulListening/findListenAudio',
                payload: {
                    ...params
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            const type_arr = []
                            res.data.data.typeNameList.map(item => {type_arr.push(item.typeName)})
                            this.setState({ typeArr: type_arr })
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
        this.date = null;
        this.setState({ loading: true, clickType: '' });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'beautifulListening/findListenAudio',
            payload: {
                page: 1,
                pageSize: 10,
                title: '',
                isPublish: '',
                type: ''
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

    // 获取一个月日期发布内容数
    getOneMonthData = ( startTime, endTime ) => {
        startTime = startTime ? startTime : moment().startOf('month').format('YYYY-MM-DD');
        endTime = endTime ? endTime : moment().endOf('month').format('YYYY-MM-DD');
        const { dispatch } = this.props;
        dispatch({
            type:'beautifulListening/getOneMonthData',
            payload:{
                startTime,
                endTime,
            }
        })
    }

    // 查询一天发布的内容
    queryOneDay = ( date,  obj={ page:0, pageSize:10 } ) => {
        this.date = true;
        const { dispatch } = this.props;
        let params = {
            page:obj.page,
            pageSize:obj.pageSize,
            publishTime:date
        }
        this.props.form.resetFields();
        this.setState({ 
            clickType: '',
            title: '',
            isPublish: '',
            date,
            ...params
        },()=>{
            dispatch({
                type:'beautifulListening/queryOneDay',
                payload:{
                    ...params
                }
            })
        });
       
    }

    typeChange = (e) => {
        this.setState({ 
            clickType: e.target.value
          },() => {
            this.getData(1);
          } 
        );
    }

    renderForm() {
        const selfStyle = {
            color: '#fff', 
            backgroundColor: '#1890ff',
            border: '1px solid #1890ff'
        };
        const { clickType } = this.state;
        const { typeNameList } = this.props.beautifulListening && this.props.beautifulListening.data.data;

        const TYPE = typeNameList.length && typeNameList.map(item => {
            return (
                <RadioButton key={item.id} value={item.id} style={clickType == item.id ? selfStyle : null}>{item.typeName}</RadioButton>
            )
        }) 

        const { getFieldDecorator } = this.props.form;
        return (
        <Form layout="inline">
            <Row gutter={{ lg:16, xxl: 24 }}>
                <Col lg={12} xxl={5}>
                    <FormItem label="标题">
                        {getFieldDecorator('title',{
                        })(<Input placeholder="请输入标题" />)}
                    </FormItem>
                </Col>
                <Col lg={12} xxl={5} >
                    <FormItem label="配音员">
                        {getFieldDecorator('author',{
                        })(<Input placeholder="请输入配音员" />)}
                    </FormItem>
                </Col>
                <Col lg={6} xxl={4}>
                    <FormItem label="发布状态">
                    {getFieldDecorator('isPublish',{
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }} >
                            <Option value="0">待发布</Option>
                            <Option value="1">已发布</Option>
                            <Option value="2">已下架</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col lg={12} xxl={6}> 
                    <FormItem label="分类">
                        <RadioGroup onChange={this.typeChange} value={this.state.clickType}>
                            <RadioButton value='' style={this.state.clickType == '' ? selfStyle : null}>全部</RadioButton>
                            {TYPE}
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col lg={6} xxl={4}>
                    <FormItem style={{float:'right'}}>
                        <Button type="primary" onClick={() => this.getData(this.state.page)}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8}} onClick={this.reset}>
                        重置
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        );
    }
    
    //pagination 点击分页
    onClick(current, pageSize) {
        const { date } = this.state;
        this.setState({ page: current, pageSize: pageSize},()=>{
            if(this.date){
                this.queryOneDay( date , { page: current, pageSize: pageSize });
                return;
            }
            this.getData(current, this.date);
        });
        const { dispatch, form } = this.props;
        // form.validateFields((err, fieldsValue) => {
        //     if(err) return;
        //     const values = {
        //         page: current,
        //         pageSize: pageSize,
        //         type:this.state.clickType,
        //         ...fieldsValue
        //     };
        //     dispatch({
        //         type: 'beautifulListening/findListenAudio',
        //         payload: values,
        //         callback: (res) => {
        //             if(res) {
        //                 if(res.code == '0') {
        //                 }else {
        //                     message.error(res.message || '服务器错误');
        //                 }
        //             }
        //             this.setState({ loading: false });
        //         }
        //     });
        // });
    }

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            loading: false,
            btn: btn ? btn : null,
            data:null,
            params: params ? params : null, 
            fileList: params && params.audioImg ? [{
                uid: -1,
                status: 'done',
                url: params.audioImg
              }] : [],
            thumbnailFileList: params && params.thumbnail ? [{
                uid: -1,
                status: 'done',
                url: params.thumbnail
              }] : [],
            audioImg: params ? params.audioImg : null,
            thumbnail: params ? params.thumbnail : null,
            audioUrl: params ? params.audioUrl : '',
            audioSize: params && params.audioSize,
            duration: params ? params.time : ''
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        let that = this;
        const { audioUrl, audioImg, thumbnail, duration, audioSize, data } = that.state;
      
        if( !audioUrl ){
             return message.error('请先上传音频');
        }else{
            if (!data) {
                message.error('未选择文件');
                return;
            }
            that.setState({loading: true })
            const formData = new FormData();
            formData.append("audioFile", data);
            that.props.dispatch({
                type: 'beautifulListening/uploadAudio',
                payload: formData,
                callback: (res) => {
                    if(res.code == 0) {
                        that.setState({
                            audioUrl: res.message
                        },() => {
                            that.props.dispatch({
                                type: 'beautifulListening/audioAdd',
                                payload: {
                                    listenAudio: {
                                        ...fields,
                                        audioUrl: res.message,
                                        audioImg: audioImg,
                                        thumbnail: thumbnail,
                                        isPublish: 0,
                                        publishTime: '',
                                        time: duration,   //时长
                                        audioSize: audioSize    //视频大小
                                    }
                                },
                                callback: (res) => {
                                    if(res) {
                                        that.setState({ 
                                            audioUrl: '',
                                            loading:false,
                                            modalVisible: false 
                                        })  //重置audioUrl
                                        if(res.code == '0') {
                                            that.refs.myform.resetFields();
                                            that.getData(that.state.page);
                                            message.success('添加成功');
                                        }else{
                                            message.error(res.message || '服务器错误');
                                        }
                                    }
                                }
                            });
                        });
                        // message.success('音频上传成功')
                    }else {
                        that.setState({
                            audioUrl: '',
                            loading: false
                        });
                        message.error('服务器错误')
                    }
                }
            })
        }
       
    }
    //编辑
    handleEdit = (fields) => {
        const that = this;
        const { audioUrl, audioImg, thumbnail, duration, audioSize, params, data, date, page, pageSize } = that.state;
        const { isPublish, id } = params;
        if( !audioUrl ){
            return message.error('请先上传音频');
        }else{
            that.setState({loading: true, })
            if (!data) {
                that.props.dispatch({
                    type: 'beautifulListening/audioUpdate',
                    payload: {
                        listenAudio: {
                            ...fields,
                            audioUrl: audioUrl,
                            audioImg: audioImg,
                            thumbnail: thumbnail,
                            isPublish: isPublish,
                            publishTime: '',
                            id: id,
                            time: duration,   //时长
                            audioSize: audioSize    //视频大小
                        }
                    },
                    callback: (res) => {
                        if(res) {
                            that.setState({ 
                                audioUrl: '',
                                loading: false,
                                modalVisible: false  
                            }) //重置audioUrl
                            if(res.code == '0') {
                                if(that.date){
                                    this.queryOneDay(date,{page,pageSize});
                                }else{
                                    that.getData(that.state.page);
                                }
                                that.refs.myform.resetFields();
                                message.success('编辑成功');
                            }else{
                                message.error(res.message || '服务器错误');
                            }
                        }
                    }
                });
            }else{
                const formData = new FormData();
                formData.append("audioFile", data);
                that.props.dispatch({
                    type: 'beautifulListening/uploadAudio',
                    payload: formData,
                    callback: (res) => {
                        if(res.code == 0) {
                            that.setState({
                                audioUrl: res.message,
                            },()=>{
                                that.props.dispatch({
                                    type: 'beautifulListening/audioUpdate',
                                    payload: {
                                        listenAudio: {
                                            ...fields,
                                            audioUrl: res.message,
                                            audioImg: audioImg,
                                            thumbnail: thumbnail,
                                            isPublish: isPublish,
                                            publishTime: '',
                                            id: id,
                                            time: duration,   //时长
                                            audioSize: audioSize    //视频大小
                                        }
                                    },
                                    callback: (res) => {
                                        if(res) {
                                            that.setState({ 
                                                audioUrl: '',
                                                loading: false,
                                                modalVisible: false  
                                            }) //重置audioUrl
                                            if(res.code == '0') {
                                                if(that.date){
                                                    this.queryOneDay(date,{page,pageSize});
                                                }else{
                                                    that.getData(that.state.page);
                                                }

                                                that.refs.myform.resetFields();
                                                message.success('编辑成功');
                                            }else{
                                                message.error(res.message || '服务器错误');
                                            }
                                        }
                                    }
                                    });
                            });
                            // message.success('音频上传成功')
                        }else {
                            that.setState({
                                audioUrl: '',
                                loading: false
                            });
                            message.error('服务器错误')
                        }
                    }
                })
            }
            
        }   
    }

    // 设置封面图
    setFileList = ( obj ) => {
        this.setState({
            fileList:obj
        })
    }

    // 获取上传设置封面图base64
    getImgUrl = (url) => {
        this.setState({
            audioImg:url,
        })
    }

    // 设置图标
    setThumbnailFileList = ( obj ) => {
        this.setState({
            thumbnailFileList:obj
        })
    }

    // 获取上传图标base64
    getThumbnailUrl = (url) => {
        this.setState({
            thumbnail:url,
        })
    }

    //发布时间弹框
    showTimeModal = (flag, params) => {
        this.canPublish = true;
        this.setState({
            modalVisibleTime: !!flag,
            params: params,
            // publishTime: new Date()
        })  
    }
    
    hideTimeModal = () => {
        this.setState({
            publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        })
        this.showTimeModal();
    }

    // 审核
    checkItem = ( row ) => {
        const { id } = row;
        const { dispatch } = this.props;
        dispatch({
            type:'beautifulListening/checkItem',
            payload:{
                id,
            },
            callback:( res )=>{
                if( res.code == 0 ){
                    message.success('审核成功');
                    this.getData();
                }else{
                    message.info( res.message );
                }
                console.log(res)
            }
        })
    }
    //获取时间
    getDate = (publishTime, dateString) => {
        this.setState({
            publishTime: dateString
        })
    }
    //更改音频地址
    changePath = ( typeNameList, e ) => {
        const that = this;
        const file = e.target.files[0];
        this.setState({ audioUrl: null })   //取消上传  
        if( !file ) return;
        let src, audioElement, duration, type = file.type;
        // 匹配类型为audio/开头的字符串
        if (/^audio\/\S+$/.test(type)) {
            src = URL.createObjectURL(file);
            audioElement = new Audio(src); 
            audioElement.addEventListener("loadedmetadata", (e) => {

                duration = Math.ceil(audioElement.duration);

                that.setState({ data: file, audioUrl: src, duration: duration, audioSize: file.size })   //覆盖新音频
                //命名规则  2019-11-25 国学 《闭门羹的由来》 青.mp3
                let fileName = file.name;
                //取出空字符串  长度为三
                let nullStringArr = []
                for(let i = 0; i < fileName.length; i++) {
                    if(fileName[i] == ' ') {
                        nullStringArr.push(fileName[i])
                    }
                }
              
                let createTime, type, title, author;
                if (fileName.match(/《(.+)》/).length > 1) {
                    title = fileName.match(/《(.+)》/)[1].trim();
                  }
                  if (fileName.match(/》(.+)\./).length > 1) {
                    author = fileName.match(/》(.+)\./)[1].trim();
                  }
                  if (fileName.match(/^(\d+\-\d+\-\d+)/).length > 1) {
                    createTime = fileName.match(/^(\d+\-\d+\-\d+)/)[1];
                  }
            
                  for (let i = 0; i < typeNameList.length; ++i) {
                    if (fileName.indexOf(typeNameList[i].typeName) > -1) {
                        type = typeNameList[i].typeName;
                      break;
                    }
                  }
                if( createTime || type || title || author ) {
                    //设置表单
                    that.refs.myform.setFieldsValue({
                        createTime,
                        type:that.state.typeArr.indexOf(type)+1,
                        title,
                        author,
                    });
                } else {
                    message.error('文件名不符合规则！')
                }

            });
        }
    }

    cancleUpload = () => {
        this.setState({ preview: null, path: '' })
    }

    // 上传音频文件
    uploadAudio = () => {
     
        const data = this.state.data;
        if (!data) {
            message.error('未选择文件');
            return;
        }
        this.setState({loading: true, })
        const formData = new FormData();
        formData.append("audioFile", data);
        this.props.dispatch({
            type: 'beautifulListening/uploadAudio',
            payload: formData,
            callback: (res) => {
                if(res.code == 0) {
                    this.setState({
                        audioUrl: res.message,
                        loading: false
                    });
                    message.success('音频上传成功')
                }else {
                    this.setState({
                        audioUrl: '',
                        loading: false
                    });
                    message.error('服务器错误')
                }
            }
        })
    }

    publish = () => {
        this.setState({ publishLoading: true });
        const { publishTime, params, sort } = this.state;
        let modalVal = ['audioImg','thumbnail','audioUrl',...Object.keys(this.refs.myform.getFieldsValue())];
        if(!publishTime){
            this.setState({ publishLoading: false });
            return message.error('请选择发布时间');
        }
        for(let i=0;i<modalVal.length;i++){
            if(!params[modalVal[i]]){
                this.setState({ publishLoading: false });
                return message.error('请完善信息再发布');
            }
        }
        if(this.canPublish) {
            this.props.dispatch({
                type: 'beautifulListening/publishAudio',
                payload: {
                    id: params.id,
                    publishTime: publishTime,
                    sort
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0'){
                            this.setState({ publishLoading: false });
                            this.getData(this.state.page);
                            message.success('发布成功')
                        }else{
                            this.setState({ publishLoading: false });
                            message.error(res.message || '服务器错误')
                        }
                    }
                    this.setState({ loading: false, modalVisibleTime: false, publishLoading: false });
                },
            })
        } 
        this.canPublish = false;
    }

    publishCancle = (params) => {
        const { date, page, pageSize } = this.state;
        this.props.dispatch({
            type: 'beautifulListening/unPublishAudio',
            payload: {
                id: params.id,
                // publishId: params.publishId,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        if(this.date){
                            this.queryOneDay(date,{ page, pageSize})
                        }else{
                            this.getData(this.state.page);
                        }
                        message.success('取消成功');
                        this.canPublish = true;
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

      //删除
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'beautifulListening/audioDelete',
            payload: {
                id: params.id,
                isPublish: 0
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData(this.state.page);
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    // 播放音频
    audioClick = ( url ) => {
        const _this = this;
        if(!url){
            _this.refs.audio.pause();
        }
        this.setState({
            audioUrl:url,
        },()=>{
            _this.refs.audio.onended = function(){
               _this.setState({
                    audioUrl:null
               })
            }
        })
    }
   
    // 保存
    handleSave = row => {
        const { id, dailySort } = row;
        const { dataList } = this.props.beautifulListening.data.data.pageRet;
        const newData = dataList;
        const index = newData.findIndex(item => id === item.id);
        const item = newData[index];
        if(item['dailySort'] == dailySort) return;
        this.props.dispatch({
            type:'beautifulListening/rankSave',
            payload:{
                listenAudio:{
                    id,
                    dailySort,
                }
            },
            callback:res => {
                if( res.code == 0){
                    const { date, page, pageSize } = this.state;
                    this.queryOneDay( date , { page, pageSize });
                }else{
                    message.error(res.message)
                }
                
            }
        })
    }  
    previewAudio = row =>{
        this.setState({
            previewData:row,
            modalVisiblePreview:true,
        })
    }
    previewHide = () => {
        this.setState({
            modalVisiblePreview:false,
        })
    }
    render() {
        const { dataList, total } = this.props.beautifulListening && this.props.beautifulListening.data.data.pageRet;
        const { typeNameList } = this.props.beautifulListening && this.props.beautifulListening.data.data;
        const  { page, pageSize, loading, modalVisibleTime, publishTime, publishLoading, audioUrl, previewData,
            modalVisiblePreview, } = this.state;
        const { getFieldDecorator } = this.props.form;
        let columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '分类',
            dataIndex: 'typeName',
            key: 'typeName',
            render: value => {
                return(<span>{value||'--'}</span>)
            }
          }, {
            title: '图标',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (value, row, index) => {
                const content = (<img src={value} width={300}/>)
                return (
                    <div>
                        {value ? 
                        <Popover placement='rightTop' key={index} content={content}>
                            <div style={{width:'50px',height:'50px'}}><img width="50" height="50" src={value}/></div>
                        </Popover>
                        :
                        '--'
                        }
                    </div>
                )
            }
          }, {
            title: '音频',
            dataIndex: 'audioUrl',
            key: 'audioUrl',
            render: (value) => {
                let bool = false;
                if(audioUrl == value && !this.state.modalVisible){
                    bool = true;
                }
                return(
                    <div>
                        {bool ? <Icon className={styles.audioBtn}  onClick={this.audioClick.bind(this,null)} type="pause-circle" /> 
                        :
                        <Icon className={styles.audioBtn} onClick={this.audioClick.bind(this,value)} type="play-circle" />
                        }
                    </div>
                )
            }
          },{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
          },{
              title:'描述',
              key:'describe',
              dataIndex:'describe',
              render: value => {
                let text = value 
                ? 
                <Tooltip title={ value }>
                    <div className={styles.describe}>{ value }</div>
                </Tooltip> 
                : 
                '--';
                return text;
              }
          },{
            title: '配音',
            dataIndex: 'author',
            key: 'author',
          },{
            title: '时长',
            dataIndex: 'time',
            key: 'time',
            render: value => {
                return(<span>{value ? secondsToDate(value) : '--'}</span>)
            }
          }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD') : '--'}</span>)
            }
          }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width:250,
            render: (value, row, index) => {
                let publishEle;
                if( row.isAudit == 0 ){
                    publishEle = (
                        <Popconfirm
                            title="确定审核?"
                            onConfirm={this.checkItem.bind(this,row)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="javascript:;">{'审核'}</a>
                        </Popconfirm>
                     )
                }
                if(row.isPublish == 0 && row.isAudit == 1) {
                    publishEle = (<a href="javascript:;" onClick={ () => this.showTimeModal(true,row) }>{'发布'}</a>)
                }
                if(row.isPublish == 1) {
                    publishEle = (<a href="javascript:;" style={{color:"#3bfc7b"}} >{'已发布'}</a>)
                }
                if(row.isPublish == 2) {
                    publishEle = (<a href="javascript:;" style={{color:"#fadb14"}} >{'已下架'}</a>)
                }
                return(
                    <Fragment key={index}>
                        <a href="javascript:;" onClick={() => this.previewAudio(row)}>预览</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                        <Divider type="vertical" />
                        {publishEle}
                        {row.isPublish == 2 && row.isAudit == 1 ?
                            (<span><Divider type="vertical" />
                            <a href="javascript:;" onClick={ () => this.showTimeModal(true,row) }>{'重新发布'}</a>
                            </span>)
                            :
                            null
                        }
                        {row.isPublish == 1 && <span>
                            <Divider type="vertical" />
                            <Popconfirm title="是否下架?" onConfirm={() => this.publishCancle(row)}>
                                <a href="javascript:void(0);" >下架</a>
                            </Popconfirm>
                            </span>
                        }
                    </Fragment>
                )
            }
          }];
          const components = {
            body: {
              row: EditableFormRow,
              cell: CellEditor,
            },
          };
          if(this.date){
              columns.splice(4,0,{
                title:'排序',
                dataIndex:'dailySort',
                width:110,
                editable:true
              })
              columns = columns.map(col => {
                if (!col.editable) {
                  return col;
                }
                return {
                  ...col,
                  onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                  }),
                };
              });
          }
          
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
            getImgUrl: this.getImgUrl,
            setFileList: this.setFileList,
            getThumbnailUrl: this.getThumbnailUrl,
            setThumbnailFileList: this.setThumbnailFileList,
            changePath: this.changePath,
            cancleUpload: this.cancleUpload,
            upload: this.uploadAudio
        };
        return(
            <PageHeaderLayout title="美听" style={{overflow:'hidden'}}>
                
                    <Card bordered={false}>
                        <ModuleIntroduce text={'APP美听'} />
                        <Tabs 
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        type='card'
                        >   
                            <TabPane tab='美听' key='1' >
                                <div className={styles.tableList}>
                                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                                    <div className={styles.tableListOperator}>
                                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                                            添加
                                        </Button>
                                    </div>
                                    <div className={styleBtn.tableAndDate}>
                                        <div className={styleBtn.table}>
                                            <Table
                                                components={components}
                                                className={styles.myTable}
                                                style={{backgroundColor:'white',marginTop:16}}
                                                columns={columns} 
                                                dataSource={dataList} 
                                                pagination={pagination}
                                                loading={loading}
                                                rowKey='id'
                                                />
                                        </div>
                                        
                                        <div className={styleBtn.date} ref="showDate">
                                        <DateContent  
                                            dateData={this.props.beautifulListening.dateData}
                                            getOneMonthData={ this.getOneMonthData }
                                            queryOneDay={ this.queryOneDay }
                                            type="beauty"
                                        />
                                        </div>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab='推荐' key='2'>
                                <Recommend />
                            </TabPane>
                        </Tabs>  
                        
                        <CreateForm {...this.state} {...parentMethods} typeNameList={typeNameList} ref='myform'/>
                        {/* 发布时间 */}
                        <Modal 
                            visible={modalVisibleTime}
                            onOk={this.publish}
                            onCancel={this.hideTimeModal}
                            title={"发布时间"}
                            footer={[
                                <Button key="back" onClick={this.hideTimeModal}>
                                取消
                                </Button>,
                                <Button key="submit" type="primary" loading={publishLoading} onClick={this.publish}>
                                确定
                                </Button>,
                            ]}
                        >
                            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布时间">
                                <DatePicker style={{width: '100%'}} value={publishTime ?  moment(publishTime) : null} onChange={this.getDate} format="YYYY-MM-DD"  />
                            </FormItem>    
                        </Modal>
                        <PreviewAudio previewData={previewData} modalVisiblePreview={modalVisiblePreview} handleCancel={this.previewHide}/>
                        {/* 音频 */}
                        <audio ref='audio' autoPlay={this.state.modalVisible ? false : true} src={audioUrl} />
                    </Card>
            </PageHeaderLayout>
        )
    }
}