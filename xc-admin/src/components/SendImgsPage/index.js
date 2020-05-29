import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, Button, Icon, Radio, Upload, message  } from 'antd';
import PhoneSimulator from '../../components/PhoneSimulator/index';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
message.config({
  duration: 1,
  maxCount: 1,
});
@Form.create()
export default class SendImgsPage extends Component {
    state = {
      selectVal:0,
      fileList:[],
      imgFile:[],
    }
    componentDidMount(){
      this.index = 1;
      this.titleId2 =  document.getElementById('titleId2');
      this.abstractId2 = document.getElementById('abstractId2');
      this.authorId2 = document.getElementById('authorId2');
      this.imgTextId2 = document.getElementById('imgTextId2');
    
      const { title, newsAbstract, newsSource, imageUrl, newsType, imageUrlMore} = this.props.viewImageData;
      this.titleId2.value = title;
      this.authorId2.value = newsSource;
      this.abstractId2.value = newsAbstract;
      const imgArr = eval(imageUrl);
      const imgText = eval(imageUrlMore);
      const textArr = [];
      let imgFile = []; 
    
      for(let i=0;i<imgText.length;i++){
        imgFile.push(
          {
            uid:i+1,
            name:'00'+i,
            status: 'done',
            url:imgText[i].imageUrl,
            response:{
              result:imgText[i].imageUrl,
            }
          }
        );
        textArr.push(imgText[i].describe);
      }
      this.imgTextId2.value = textArr.join('\r\n');
      let fileList = [];
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
        selectVal:newsType||0,
        imgFile,
        fileList,
      });
    }
    componentDidUpdate(){
   
      if(this.index && this.index == 1){
        const { title, newsAbstract, newsSource, imageUrl, newsType} = this.props.viewImageData;
        this.titleId2.value = title;
        this.authorId2.value = newsSource;
        this.abstractId2.value = newsAbstract;
        const imgArr = eval(imageUrl);
        let fileList = [];
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
          selectVal:newsType||0,
          fileList,
        });
      }
      this.index++
    }
    componentWillUnmount(){
      this.props.resetWriteNews();
    }
     // 选择新闻类型
    selectType = (e) => {
      this.setState({selectVal:e});
    }
    // 重置数据
    resetData = () => {
      // this.props.resetWriteNews();
      // this.titleId2.value = '';
      // this.abstractId2.value='';
      // this.authorId2.value='';
      // this.imgTextId2.value='';
      // this.setState({
      //   selectVal:null,
      //   fileList:[],
      //   imgFile:[],
      // });
      this.props.history.push('/newsEdit/manage-news');
    }
    // 发布
    handleSend = ( type ) => {
      const _this = this;
      const { dispatch } = this.props;
      let title = this.titleId2.value;
      let newsAbstract = this.abstractId2.value;
      let newsSource = this.authorId2.value;
      let imgText = this.imgTextId2.value;
      let htmlArr = imgText.replace(/(\r|\n)/g,'_ENTER_').split('_ENTER_');
      const { imgFile, selectVal, fileList } = this.state;
      const newsType = selectVal;
      let status = 1;
      const contentType = 1;
      let imageUrl = fileList.length ? [fileList[0].response.result] : [];
      let imgTextArr = [];

      if(this.repeatClick && type != 1){
        return;
      }

      // 转化输入图文描述
      if(htmlArr.length){
        let text = [];
        for(let i=0;i<htmlArr.length;i++){
          if(htmlArr[i].replace(/(^\s+)|(\s+$)/g,'')){
            text.push(htmlArr[i].replace(/(^\s+)|(\s+$)/g,''));
            continue;
          }
        }
        htmlArr = text;
      }
      for(let i=0;i<imgFile.length;i++){
        let url = imgFile[i].response.result;
        let text = htmlArr[i] || '';
        let obj = {
          order:i+1,
          imageUrl:url,
          describe:text,
        };
        imgTextArr.push(obj);
      }
      if( type === 1){
        // 更新数据
        this.props.updateViewImage({
          titleText:title,
          asbstractText:newsAbstract,
          autorText:newsSource,
          imgTextArr,
        });
        return;
      }else if( type === 0){
        status = 2;
        if(!title){
          message.info('至少输入标题');
          return;
        }
      }else{
        
        if(!title||!newsSource||(!newsType && newsType!=0)||!newsAbstract){
          message.info('请完善信息');
          return;
        }
        
        if(imgTextArr.length<2 || imgTextArr.length>50){
          message.info('图集限制2~50张');
          return;
        }
        if(!imageUrl.length){
          message.info('请上传封面图');
          return;
        }
      }
      this.repeatClick = true;
      dispatch({
        type:'sendNews/addSendNews',
        payload:{
          title,
          newsSource,
          newsType,
          newsAbstract,
          status,
          contentType,
          imageUrl,
          imageUrlMore:imgTextArr,
        },
        callback:(res)=>{
          setTimeout(function(){
            _this.repeatClick = false;
          },300)
          if(res.code == 0){
            
            if(type !== 0){
              message.success('发布成功');
              setTimeout(()=>{
                _this.resetData();
              },1000);
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
    // 预览
    handleShow = () => {
      this.handleSend(1);  
    }
    // 返回
    handleBack = () => {
      this.props.history.push('/newsEdit/manage-news');
    }
    // 上传图文
    handleImgText = (e) => {
      const imgArr = e.fileList.slice(0,e.fileList.length-1);
      if(e.file.status !='done' || e.file.response.code === 0){
        this.setState({ imgFile:e.fileList });
      }else{
        this.setState({ imgFile:imgArr });
        message.error(e.file.response.message);
      }
    }
    // 上传封面图片
    handleChange = (e) => {
      if(e.file.status !='done' || e.file.response.code === 0){
        this.setState({ fileList:e.fileList });
      }else{
        this.setState({ fileList:[] });
        message.error(e.file.response.message);
      }
    }
    // 移除封面图片
    handleRemove = (e) => {

    }

    render(){
        const { editData, dispatch, title, phoneSimulator }  = this.props;
        const { selectVal, imgFile, fileList } = this.state;
        const imgTextDom = (
          <div className={styles.addImage}>
            <div className={styles.image}>
                <Icon type="plus" theme="outlined" />
                <p>
                  单张大小不超过5M；宽度大于等于400像素，高度大于等于224像素;上传数量为2-50张  
                </p>
              </div>
          </div>
        );
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
                <Col span={22}><Input id="titleId2"/></Col>
              </Row>
              <Row style={{paddingTop:15}}>
                <Col span={14}>
                  <div className={styles.dic}>摘要：</div>
                  <div className={styles.astract}>
                    <TextArea id="abstractId2" rows={2} style={{resize:'none'}}/>
                  </div>
                </Col>
                <Col span={10} style={{paddingTop:10}}>
                  <div className={styles.dic}>作者：</div>
                  <div className={styles.astract}><Input id="authorId2" /></div>
                </Col>
              </Row>
              <div className={styles.imageInfo}>
                <div className={styles.showImg}>
                  <Upload
                    action="/work-api/work/uploadImg"
                    listType="picture-card"
                    fileList={imgFile}
                    name="file"
                    data={{type:3}}
                    showUploadList={{showPreviewIcon:false}}
                    onChange={this.handleImgText}
                    multiple={true}
                  >
                    {imgFile.length >= 50 ? null : imgTextDom}
                  </Upload>
                </div>
                 
              </div>
              <div className={styles.dicWord}>
                  <TextArea placeholder="请输入大图描述" id="imgTextId2"  rows={22} style={{resize:'none'}} />
              </div>
              <div className={styles.footer}>
                  <Row>
                    <Col span={2} style={{textAlign:'center'}}>封面：</Col>
                    <Col>
                      <RadioGroup value={1}>
                        <Radio value={1}>大图</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className={styles.upload}>
                      <div className={styles.box}>
                        <Upload
                          action="/work-api/work/uploadImg"
                          listType="picture-card"
                          fileList={fileList}
                          name="file"
                          data={{type:3}}
                          showUploadList={{showPreviewIcon:false}}
                          onChange={this.handleChange}
                          onRemove={this.handleRemove}  
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span style={{display:'inline-block',width:66,textAlign:'center'}}>类型：</span>
                      <Select onChange={this.selectType} value={selectVal} style={{width:120}}>
                        <Option value={0}>推荐</Option>
                      </Select>
                    </Col>
                    <Col span={12} style={{textAlign:'right'}}>
                      <Button type="primary" className={styles.btns} onClick={this.handleSend}>发布</Button>
                      <Button className={styles.btns} onClick={this.handleSave}>存草稿</Button>
                      <Button className={styles.btns} onClick={this.handleShow}>预览</Button>
                      <Button className={styles.btns} onClick={this.handleBack} disabled={searchData ? false : true}>返回</Button>
                    </Col>
                  </Row>
              </div>
            </div>
            <PhoneSimulator className={styles.phoneSimulator} {...phoneSimulator}>modal</PhoneSimulator>
          </div>
        )
    }
};
