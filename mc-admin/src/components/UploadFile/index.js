import 'rc-drawer-menu/assets/index.css';
import React,{Component} from 'react';
import { Upload, Icon, message,Modal } from 'antd';
import styles from './index.less';

export default class UploadFile extends Component {
  state = {
    loading: false,
    previewVisible:false,
    previewImage:'',
  };

  getBase64 = (img, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   message.error('You can only upload JPG file!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    // return isJPG && isLt2M;
    return false;
  }
  handleChange = (info) => {
    const _this = this;
    if (info.file.status !== 'removed') {
      const isLt1M = info.file.size / 1024 / 1024 < 2;
      if (!isLt1M) {
        message.error('上传文件过大');
        return isLt1M;
      }
      _this.props.setFileList(info.fileList);
      // Get this url from response in real world.
      this.getBase64(info.fileList[0].originFileObj, imageUrl => {
        this.setState({
        imageUrl,
        loading: false,
        })
        _this.props.getImgUrl(imageUrl); 
    });
    }else if(info.file.status === 'removed'){
      this.setState({
        imageUrl:null,
        loading: false,
      })
      _this.props.getImgUrl(null);
      _this.props.setFileList(info.fileList);
    }
  }
  handleCancel = () => {
    this.setState({ previewVisible: false })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  render(){
    const { fileList } = this.props;
    const { previewVisible,previewImage } = this.state; 
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className={styles.upload}>
          <Upload
            listType="picture-card"
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            fileList={fileList}
            accept= "image/jpg,image/jpeg,image/png"
          >
            {fileList.length > 1 ? null: uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
      </div>
      )
  }
}