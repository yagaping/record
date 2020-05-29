import React, { Component } from 'react';
import { Modal, Form, Input, Select, Radio, Col, Row, Button, Icon, Upload, message, Popconfirm } from 'antd';
import ContentEditor from '../../components/ContentEditor/ContentEditor';
import PhoneSimulator from '../../components/PhoneSimulator/index';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { confirm } = Modal;
message.config({
  duration: 1,
  maxCount: 1,
});
@Form.create()
export default class SendNewsPage extends Component {
  state = {
    raidoType:1,
    selectVal:1,
    previewVisible: false,
    previewImage: '',
    fileList: [],
  } 
  componentDidMount(){
    this.index = 1;
    this.titleId =  document.getElementById('titleId');
    this.abstractId = document.getElementById('abstractId');
    this.authorId = document.getElementById('authorId');
  }
  componentDidUpdate(){
    
    if(this.index && this.index == 1 && localStorage.getItem('someNews')){
      const { title, newsAbstract, newsSource, imageUrl, newsType} = this.props.viewNewsData;
      this.article = this.props.editData;
      this.titleId.value = title;
      this.authorId.value = newsSource;
      this.abstractId.value = newsAbstract;
      const imgArr = eval(imageUrl);
      let fileList = [];
      let raidoType = 1;
      if(imgArr.length>1){
        raidoType = 3;
      }
      for(var i=0;i<imgArr.length;i++){
        fileList.push(
          {
            uid:i+1,
            name:'00'+i,
            status: 'done',
            url:imgArr[i],
            response:{
              result:imgArr[i],
            }
          }
        );
      }
      this.setState({
        selectVal:newsType,
        raidoType,
        fileList,
      });
    }
    this.index++
  }
  componentWillUnmount(){
    this.props.resetNews();
  }
  // 编辑内容
  handleContentEditorChange = (text) =>{
    this.props.changeText(text);
    this.article = text;
  }
  // 选择封面图
  handleRadio = (e) => {
    
    this.setState({
      raidoType: e.target.value,
    });
  }
  // 选择新闻类型
  selectType = (e) => {
    this.setState({selectVal:e});
  }

  // 重置编辑
  resetData = () => {
    // this.props.resetNews();
    // this.titleId.value = '';
    // this.authorId.value = '';
    // this.abstractId.value = '';
    // this.article = '';
    // this.setState({
    //   selectVal:null,
    //   fileList:[],
    // });
    this.props.history.push('/newsEdit/manage-news');
  }

  // 发布
  handleSend = ( type ) => {
    const _this = this;
    const { dispatch } = this.props;
    const title = this.titleId.value;
    const article = this.article;
    const newsSource = this.authorId.value;
    const newsType = this.state.selectVal;
    const newsAbstract = this.abstractId.value;
    let status = 1;
    const contentType = 0;
    let imageUrl = [];
    let imgArr = this.state.fileList;
    if(this.repeatClick){
      return;
    }
    if(imgArr.length){
      for(let i=0;i<imgArr.length;i++){
        imageUrl.push(imgArr[i].response.result);
        }
      }
     
    // 存草稿
    if(type === 0){
      status = 2;
      if(!title){
        message.info('至少输入标题');
        return;
      }
    }else{
        // 判断输入数据是否完整
        if(!title || !article || !newsSource || !newsAbstract || (!newsType && newsType!=0)){
          message.info('请完善信息');
          return;
        }
        if(imageUrl.length){
          if(this.state.raidoType>imageUrl.length){
            message.info('请上传完图片');
            return;
          }
        }else{
          message.info('请上传封面图');
          return;
        }
    }
    // 标记手动编辑新闻
    let formatTxt = (article || '').replace(/(\<span(\s+?)style=\"display:none\"\>_MC_HAS_FORMAT_\<\/span\>)/g,'');
    formatTxt = `<span style="display:none">_MC_HAS_FORMAT_</span>${formatTxt}`
    this.repeatClick = true;
    dispatch({
      type:'sendNews/addSendNews',
      payload:{
        title,
        article:formatTxt,
        newsSource,
        newsType,
        newsAbstract,
        status,
        contentType,
        imageUrl,
      },
      callback:(res)=>{
        setTimeout(function(){
          _this.repeatClick = false;
        },300);
        if(res.code == 0){
          
          if(type != 0){
            message.success('发布成功');
            setTimeout(()=>{
              _this.resetData();
            },1000)
            
          }else{
            message.success('保存成功');
          }
        }else{
          message.error(res.message);
        }
      }
    });
  }
  // 存草稿
  handleSave = () => {
    this.handleSend(0);
  }

  // 格式化全文
  handleFormat = () => {
    const { dispatch } = this.props;
    let contentText = this.props.editData;
    let titleText = this.titleId.value;
    let asbstractText = this.abstractId.value;
    let autorText = this.authorId.value;
    confirm({
      title: '是否格式上下文',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        sessionStorage.setItem('formatText',1);
        dispatch({
          type:'sendNews/formatText',
          payload:{
            contentText,
            titleText,
            asbstractText,
            autorText,
          }
        });
      },
    })
  }

  // 预览
  handleShow = () => {
    let contentText = this.props.editData;
    let titleText = this.titleId.value;
    let asbstractText = this.abstractId.value;
    let autorText = this.authorId.value;
    // 更新数据
    this.props.updateView({
      contentText,
      titleText,
      asbstractText,
      autorText,
    });
  }
  // 返回
  handleBack = () => {
    this.props.history.push('/newsEdit/manage-news');
  }
  // 上传图片
  handleChange = (e) => {
  
    const imgArr = e.fileList.slice(0,e.fileList.length-1);
    if(e.file.status !='done' || e.file.response.code === 0){
      this.setState({ fileList:e.fileList });
    }else{
      this.setState({ fileList:imgArr });
      message.error(e.file.response.message);
    }
    
  }


  // 从编辑器中获取设置封面
  setViewImg = (src) => {
 
    if(src){
      let name = src.split('/')[src.split('/').length - 1]; 
      const { fileList, raidoType } = this.state;
      const img = {
        uid:+new Date(),
        name,
        status:'done',
        url:src,
        response:{
          result:src,
        }
      }; 
      if(raidoType>fileList.length){
        this.setState({
          fileList:fileList.concat(img),
        });
      }
    }
    
  }
    render(){
      const { editData, dispatch, title, phoneSimulator }  = this.props;
      const { raidoType, selectVal, fileList } = this.state;
      // 切换单图，多图封面
      let fileImgs = fileList.slice(0,raidoType);
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      );
      const searchData = localStorage.getItem('searchData');
    
      return (
        <div className={styles.content}>
          <div className={styles.info}>
            <Row>
              <Col span={2} style={{lineHeight:'32px',textAlign:'center'}}>标题：</Col>
              <Col span={22}><Input id="titleId"/></Col>
            </Row>
            <Row style={{paddingTop:15}}>
              <Col span={14}>
                <div className={styles.dic}>摘要：</div>
                <div className={styles.astract}>
                  <TextArea id="abstractId" rows={2} style={{resize:'none'}}/>
                </div>
              </Col>
              <Col span={10} style={{paddingTop:10}}>
                <div className={styles.dic}>作者：</div>
                <div className={styles.astract}><Input id="authorId"/></div>
              </Col>
            </Row>
          </div>
        <ContentEditor
          style={0}
          className={styles.contentEditor}
          htmlData={editData}
          dispatch={dispatch}
          title={title}
          onChange={this.handleContentEditorChange}
          setViewImg={this.setViewImg}
        />
        <div className={styles.footer}>
            <Row>
              <Col span={2} style={{textAlign:'center'}}>封面：</Col>
              <Col>
                <RadioGroup onChange={this.handleRadio} value={raidoType}>
                  <Radio value={1}>单图</Radio>
                  <Radio value={3}>多图</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row>
              <Col className={styles.upload}>
                <div className={styles.box}>
                  <Upload
                    action="/work-api/work/uploadImg"
                    listType="picture-card"
                    fileList={fileImgs}
                    name="file"
                    data={{type:1}}
                    showUploadList={{showPreviewIcon:false}}
                    onChange={this.handleChange}
                  >
                    {fileImgs.length >= raidoType ? null : uploadButton}
                  </Upload>
                 
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <span style={{display:'inline-block',width:66,textAlign:'center'}}>类型：</span>
                <Select onChange={this.selectType} value={selectVal} style={{width:120}}>
                  <Option value={0}>推荐</Option>
                  <Option value={20}>视频</Option>
                  <Option value={1}>娱乐</Option>
                  <Option value={7}>科技</Option>
                  <Option value={8}>体育</Option>
                  <Option value={9}>军事</Option>
                  <Option value={10}>财经</Option>
                  <Option value={14}>汽车</Option>
                </Select>
              </Col>
              <Col span={18} style={{textAlign:'right'}}>
                <Button type="primary" className={styles.btns} onClick={this.handleSend}>发布</Button>
                <Button className={styles.btns} onClick={this.handleSave}>存草稿</Button>
                <Button className={styles.btns} onClick={this.handleFormat}>格式化</Button>
                <Button className={styles.btns} onClick={this.handleShow}>预览</Button>
                <Button className={styles.btns} onClick={this.handleBack} disabled={searchData ? false : true}>返回</Button>
              </Col>
            </Row>
        </div>
        <PhoneSimulator className={styles.phoneSimulator} {...phoneSimulator}>modal</PhoneSimulator>
        </div>
      )
    }
};
