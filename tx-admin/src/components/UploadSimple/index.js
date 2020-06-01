import 'rc-drawer-menu/assets/index.css';
import React,{Component} from 'react';
import { Upload, message } from 'antd';

export default class UploadSimple extends Component {
  getBase64 = (img, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload = (file) => {
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      message.error('图片须小于4MB!');
    }
    return isLt4M;
  }
  handleChange = (file) => {
    const that = this;
    this.getBase64(file.fileList[0].originFileObj, (imgUrl) => {
      file.fileList[0].url = imgUrl;
      let iconBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
      that.props.upload(iconBase64,that.props.params)
    });
  }
  handleChange1 = (file) => {
    const that = this;
    this.getBase64(file.fileList[0].originFileObj, (imgUrl) => {
      file.fileList[0].url = imgUrl;
      let iconBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
      that.props.upload(iconBase64,that.props.params)
    });
  }
  handleChange2 = (file) => {
    const that = this;
    this.getBase64(file.fileList[0].originFileObj, (imgUrl) => {
      file.fileList[0].url = imgUrl;
      let iconBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
      that.props.upload(iconBase64,that.props.params)
    });
  }
  render(){
    if(this.props.type === 'icon') {
      return (
        <Upload
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          showUploadList={false}
          accept= "image/jpg,image/jpeg,image/png"
        >
          {this.props.children || null}
        </Upload>
      )
    }else if(this.props.type === 'banner') {
      return (
        <Upload
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange1}
          showUploadList={false}
          accept= "image/jpg,image/jpeg,image/png"
        >
          {this.props.children || null}
        </Upload>
      )
    }else if(this.props.type === 'bgImg') {
      return (
        <Upload
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange2}
          showUploadList={false}
          accept= "image/jpg,image/jpeg,image/png"
        >
          {this.props.children || null}
        </Upload>
      )
    }
  }
    
}