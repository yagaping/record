import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Table,
 Card,
 Form,
 Row,
 Col,
 Input,
 Button,
 Popconfirm,
 Select,
 message,
 Modal,
 Icon,
 Popover,
} from 'antd';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SelectModal from './components/SelectModal';
import UploadFile from '../../components/UploadFile';
import styles from '../SystemManagement/TableList.less';
import css from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const _TYPE = {
  1:'文本',
  2:'图片',
  3:'音频',
  4:'视频',
}
@connect(({ userStatistics, loading }) => ({
  userStatistics,
  loading: loading.models.userStatistics,
}))
@Form.create()
export default class SendMessage extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      loading: false,
      modalVisible: false,
      modalSelectVisible:false,
      time:null,
      type:'',
      modaltype:1,
      title:'',
      addOrEditor:'',
      duration:'',
      base64:'',
      fileList:[],
      base64_v:'',
      fileList_v:[],
      videoVisible:false,
      videoPlayUrl:null
    };
    this.text = '';
    this.waitLoading=false;
    this.userName = localStorage.getItem('realName') || '';
    this.userId = localStorage.getItem('userId') || '';
  }
  

  componentDidMount() {
   this.querySendMessage();
   this.getCustomer();
  }

  querySendMessage = () => {
    const { dispatch, form } = this.props;
    const { page, pageSize } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { type, title } = fieldsValue;
      dispatch({
        type:'userStatistics/querySendMessage',
        payload:{
          page,
          pageSize,
          type,
          title
        }
      })
    });
    
  }
  // 客服列表
  getCustomer(){
    this.props.dispatch({
      type:'userStatistics/getCustomer',
      payload:{},
      callback:res=>{
        if(res.code == 0){
          this.setState({
            customerList:res.data
          })
        }
      }
    })
  }
  changePage = (page,pageSize) => {
    this.setState({
      page,
      pageSize
    },()=>{ this.querySendMessage(); })
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      page:1,
      pageSize:10,
      type:'',
      title:''
    },()=>{ this.querySendMessage() })

  }
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { addOrEditor, modalid, base64, fileList, base64_v, fileList_v, audioUrl, videoUrl, duration } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err) return;
     
      const { modaltitle, modaltext, modaltype } = fieldsValue;
      const params = {
        payload:{
          title:modaltitle,
          text:modaltext,
          type:modaltype,
          time:duration
        }
      }
      let text;
      if( modaltype == 1){
        if(!modaltext){
          return message.error('请输入内容');
        }
        text = modaltext;
      }else if(modaltype == 2 ){
        if( !base64 && !fileList.length ){
          return message.error('请先上传图片');
        }
        text = '';
        params.img = base64 || null;
      }else if(modaltype == 3 ){
        if(!audioUrl){
          return message.error('请先上传音频');
        }
        text = audioUrl;
      }else if(modaltype == 4 ){
        if(!videoUrl||(!base64_v&&!fileList_v.length)){
          return message.error('请先上传视频及封面图');
        }
        text = videoUrl;
        params.img = base64_v || null;
      }
      this.waitLoading = true;
      params.payload.text = text;
      let url = 'userStatistics/saveMessage';
      if( addOrEditor == '编辑'){
        url = 'userStatistics/editorMessage';
        params.payload.id = modalid;
        params.payload.state = 0;
      }
      dispatch({
        type:url,
        payload:{
            ...params,
        },
        callback:res=>{
          this.waitLoading = false;
          if(res.code == 0){
            message.success(`${addOrEditor}成功`);
            this.querySendMessage();
            this.handleCancel();
          }else{
            message.success(res.message);
          }
        }
      })
    });
  }
  handleCancel = () => {
    this.setState({
      modalVisible:!this.state.modalVisible
    })
  }
 
  // 选择号码发送、群发
  sendSpecify = (row, allSend) => {
    this.setState({
      modalid:row && row.id,
      modaltitle:row && row.title,
      modaltext:row && row.text,
      modaltype:row && row.type,
      time:row && row.time,
      img:row && row.img,
      allSend,
      modalSelectVisible:true,
    })
  }
  sendSpecifyOk = ( phoneArr, values ) => {
    const { dispatch, loading } = this.props;
    const { modalid, modaltitle, modaltext, modaltype, time, img, allSend } = this.state;
    const { customer } = values;
    this.setState({waitLoading:true});
    const params = {
      userId:customer,
      payload:{
        id:modalid,
        title:modaltitle,
        text:modaltext,
        type:modaltype,
        time,
        img,
      }
    }
    let state = 0;
    if(!allSend || allSend == 'one'){
      this.saveHistoryPhone(phoneArr);
      params.mobiles = phoneArr;
      if(allSend == 'one'){
        state = 1;
      }
    }
    dispatch({
      type:'userStatistics/sendMessageData',
      payload:{
        ...params,
        state,
      },
      callback:res => {
        this.setState({waitLoading:false});
        if(res.code == 0){
          message.success('发送成功');
          this.sendSpecifyNo();
          this.querySendMessage();
        }else{
          message.error(res.message);
        }
      }
    })
  }
  sendSpecifyNo = () => {
    this.setState({
      modalSelectVisible:false,
      waitLoading:false
    })
  }
  // 撤销
  repeal = (row) => {
    const { dispatch } = this.props;
    const payload = { ...row };
    dispatch({
      type:'userStatistics/sendMessageData',
      payload:{
        payload,
        state:1
      },
      callback:res => {
        if(res.code == 0){
          message.success('覆盖成功');
          this.querySendMessage();
        }else{
          message.error(res.message);
        }
      }
    })
  }
  saveHistoryPhone( phoneArr ){
    if(phoneArr.length){
      let historyPhone = localStorage.getItem('historyPhone');
      historyPhone = historyPhone ? JSON.parse(historyPhone) : [];
      historyPhone = phoneArr.concat(historyPhone);
      historyPhone = Array.from(new Set(historyPhone)).splice(0,10);
      localStorage.setItem('historyPhone',JSON.stringify(historyPhone));
    }
  }

  // 编辑
  editor = row => {
    const { form } = this.props;
    
    form.resetFields(['modaltitle','modaltext','modaltype']);
    const params = {
      audioUrl:'',
      videoUrl:'',
      fileList:[],
      base64:'',
      fileList_v:[],
      base64_v:'',
    };
    this.text = '';
    if(row){
        const { text, img } = row;
        switch(parseInt(row.type)){
          case 1:
            params.modaltext = text;
            break;
          case 2:
            params.fileList = text ? [{
              uid: -1,
              status: 'done',
              url: text
            }]:[];
            break;
          case 3:
            params.audioUrl = text;
            break;
          case 4:
            params.videoUrl = text;
            params.fileList_v = img ? [{
              uid: -1,
              status: 'done',
              url: img
            }]:[];
            break;
          default:
            break;
        }
    }
    this.setState({
      addOrEditor:row ? '编辑' : '新增',
      modalid:row && row.id,
      modaltitle:row && row.title,
      modaltext:row && row.text,
      modaltype:row && row.type||1,
      duration:row && row.time,
      modalVisible:true,
      ...params
    })
  }
  changeType = ( e ) => {
    // const { form } = this.props;
    // form.resetFields(['modaltitle','modaltext']);
    this.setState({
      modaltype:e
    })
  }
  // 输入内容
  inputText = ( e ) => {
    this.text = e.target.value;
  }
  renderSearch = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
                <FormItem label="标题">
                {getFieldDecorator('title',{
                  initialValue: "",
                })(<Input placeholder="请输入标题" />)}
                </FormItem>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="类型">
                {getFieldDecorator('type',{
                  initialValue: "",
                })(
                <Select>
                  <Option key='' value=''>全部</Option>
                  {
                    Object.keys(_TYPE).map(item => <Option key={item} value={item}>{_TYPE[item]}</Option>)
                  }
                </Select>
              )}
                </FormItem>
            </Col>
            <Col>
            <div style={{ overflow: 'hidden' }}>
                <span style={{ marginBottom: 24 }}>
                    <Button type="primary" onClick={this.querySendMessage}>
                     查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                    </Button>
                </span>
            </div>
            </Col>
        </Row>
      </Form>
    );
  }
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { modaltitle, modaltext, modaltype, audioUrl, videoUrl, fileList, fileList_v } = this.state;
    const text = this.text || modaltext;
    return (
      <Form>
        <FormItem label="标题">
        {getFieldDecorator('modaltitle',{
          initialValue:modaltitle,
          rules:[{ required: true, message: '请输入标题' }]
        })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem label="类型">
        {getFieldDecorator('modaltype',{
          initialValue: modaltype+'' || '1'
        })(
          <Select onChange={this.changeType}>
            {
              Object.keys(_TYPE).map(item => <Option key={item} value={item}>{_TYPE[item]}</Option>)
            }
          </Select>
        )}
        </FormItem>
        { modaltype == 1 && <FormItem label="内容">
          {getFieldDecorator('modaltext',{
            initialValue:text,
          })(<TextArea placeholder="请输入内容" onChange={this.inputText} autosize={{ minRows: 3, maxRows: 5 }}/>)}
          </FormItem>
        }
        { modaltype == 2 && <FormItem>
          <UploadFile getImgUrl={this.getImgBase64} fileList={fileList||[]} setFileList={this.setFileList} />
          </FormItem>
        }
        { modaltype == 3 && <FormItem>
          <div className={css.warp}>
            <label className={css.input} >上传音频
              <input type="file" className={css.audioBtn} value="" type='file' accept='audio/*' onChange={(e)=>this.uploadAudio(e,'audio')}/>
            </label>
          </div>
          { audioUrl && <audio src={audioUrl} controls style={{marginTop:20}} /> }
          </FormItem>
        }
        { modaltype == 4 && (<Fragment>
          <FormItem>
            <div className={css.warp}>
            <label className={css.input} >上传视频
              <input className={css.videoBtn} type='file' accept='video/*' onChange={(e)=>this.uploadAudio(e,'video')}/>
            </label>
            </div>
            { videoUrl && <video src={videoUrl} controls style={{width: 200,height: 200,marginTop:20}} /> }
              </FormItem>
              <FormItem>
              <UploadFile getImgUrl={this.getImgBase64_v} fileList={fileList_v||[]} setFileList={this.setFileList_v} />
            </FormItem>
          </Fragment>)
        }
        
      </Form>
    );
  }
   // 获取上传图标base64
   getImgBase64 = ( base64 ) => {
    this.setState({
      base64,
    })
  }
   // 设置图片
   setFileList = ( imgObj ) => {
      this.setState({
        fileList:imgObj
      })
  }
   // 获取上传图标base64
   getImgBase64_v = ( base64_v ) => {
    this.setState({
      base64_v,
    })
  }
   // 设置图片
   setFileList_v = ( imgObj ) => {
      this.setState({
        fileList_v:imgObj
      })
  }
  // 上传音频、视频
  uploadAudio = (e, type) => {
    this.waitLoading = true;
    const _this = this;
    const file = e.target.files[0];
    const formData = new FormData();
    let text = type == 'audio' ? '音频' : '视频';
    formData.append('audioFile',file);
    let url = URL.createObjectURL(file);
    let audioElement = new Audio(url);
    let duration;
    audioElement.addEventListener("loadedmetadata", function (_event) {
        duration = Math.ceil(audioElement.duration);
        _this.setState({duration})
    });
    this.props.dispatch({
      type:'userStatistics/uploadFile',
      payload:formData,
      callback:res=>{
        this.waitLoading = false;
        if(res.code == 0){
          if(type == 'audio'){
            this.setState({
              audioUrl:res.message
            })
          }else{
            this.setState({
              videoUrl:res.message
            })
          }
         
        }else{
          message.error(res.message || `上传${text}失败`);
        }
      }
    })
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
  // 播放视频
  videoPlay = ( url ) => {
      this.setState({
          videoVisible:true,
          videoPlayUrl:url
      })
      // 关闭音频
      this.audioClick(null);
  }
  // 关闭视频
  closeVideo = () => {
      this.setState({
          videoVisible:false,
          videoPlayUrl:null
      })
  }
  render() {
    const { loading, data:{ dataList, total, pageNum, pageSize } } = this.props.userStatistics;
    const { 
      modalVisible, 
      addOrEditor, 
      audioUrl, 
      videoVisible, 
      videoPlayUrl,
    } = this.state;
    const events = {
      sendSpecifyOk:this.sendSpecifyOk,
      sendSpecifyNo:this.sendSpecifyNo
    }

    const columns = [
      {
        title:'ID',
        key:'id',
        dataIndex:'id'
      },
      {
        title:'标题',
        key:'title',
        dataIndex:'title'
      },{
        title:'类型',
        key:'type',
        dataIndex:'type',
        render:key => <span>{_TYPE[key]}</span>
      },{
        title:'内容',
        key:'text',
        dataIndex:'text',
        render:( key, row ) => {
          let type = row.type;
          let content = null;
          let bool = false;
          if(type == 3 && audioUrl == key){
            bool = true;
          }
          switch(parseInt(type)){
            case 1:
              content = key;
              break;
            case 2:
              let img = <img src={key} width="600" />
              content = (<Popover  placement="leftTop" content={img}>
                <img src={key} width="120" height="80" style={{objectFit: 'cover'}} />
              </Popover>);
              break;
            case 3:
              content = (<div style={{width:120,textAlign:'center'}}>
                {bool ? <Icon className={styles.audioBtn}  onClick={this.audioClick.bind(this,null)} type="pause-circle" /> 
                :
                <Icon className={styles.audioBtn} onClick={this.audioClick.bind(this,key)} type="play-circle" />
                }
              </div>)
              break;
            case 4:
              content = (<div className={styles.videoCan} onClick={this.videoPlay.bind(this,key)}>
              <img src={row.img} width="120" height="80" />
              <Icon type="play-circle" className={styles.videoBtn}/>
              </div>);
              break;
            default:
                break;
          }
          return content; 
        }
      },{
        title:'操作',
        key:'todo',
        width:420,
        render:row => {
          return (<Fragment>
            <Button type="primary" style={{marginRight:10}} onClick={this.editor.bind(this,row)}>编辑</Button>
            {!row.state && row.state != 2 && (<Fragment>
            <Button type="primary" style={{marginRight:10}} onClick={this.sendSpecify.bind(this,row,null)}>发送</Button>
              <Button type="primary" style={{marginRight:10}} onClick={this.sendSpecify.bind(this,row,'allSend')}>群发</Button></Fragment>)
            }
            <Button type="primary" style={{marginRight:10}} onClick={this.sendSpecify.bind(this,row,'one')}>单覆盖</Button>
           {
             row.state != 2 ? (<Popconfirm
              title="确定全部覆盖？"
              onConfirm={this.repeal.bind(this,row)}
              >
                <Button type="primary" >全覆盖</Button>
              </Popconfirm>) : <Button disabled type="primary" >已覆盖</Button>
           }
              
           </Fragment>)
        
          
        }
      }
    ];
    let pagination = {
      total: total,
      current: pageNum,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (page, pageSize) => {
        this.changePage(page, pageSize)
      },
      onChange:(page, pageSize) => {
          this.changePage(page, pageSize)
      },
    }
    return (
      <PageHeaderLayout title="用户列表">
            <Card bordered={false}>
              <ModuleIntroduce text={'群发管理'} />
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  { this.renderSearch() }
                </div>
                <div style={{paddingBottom:20}}><Button type="primary" icon="plus" onClick={()=>this.editor()}>添加</Button></div>
                <Table 
                    columns={columns}
                    dataSource={dataList}
                    pagination={pagination}
                    rowKey='id'
                    loading={loading}
                />
              </div>
              <Modal
                visible={modalVisible} 
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title={addOrEditor}
                confirmLoading={this.waitLoading}
              >
                { this.renderModal() }
              </Modal>
              <SelectModal
                { ...this.state }
                visible={this.state.modalSelectVisible}
                { ...events }
              />
               {/* 音频 */}
               <audio ref='audio' autoPlay={true} src={audioUrl} />
              {/* 视频 */}
              <Modal
                  visible={videoVisible}
                  width={560}
                  maskClosable={true}
                  footer={null}
                  destroyOnClose={true}
                  onCancel={this.closeVideo}
              >
                  <video src={videoPlayUrl} autoPlay={true} width="500" controls></video>
              </Modal>
            </Card>
      </PageHeaderLayout>
    );
  }
}
