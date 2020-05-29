import React, { Component } from 'react';
import { Spin, Form, Card, Button, Select, Row, Col, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import reqwest from 'reqwest';
import moment from 'moment';
import logo from '../../assets/logo.svg';
import styles from './ProjectInfo.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const UPLOAD_URL = '/work-api/apk/uploadApk';



@connect(state => ({
  adminUserList: state.adminUserList,
}))
export default class ProjectInfo extends Component {
  state = {
    fileList: [],
  }
  componentDidMount(){
   this.queryProjectInfo();
  }
  queryProjectInfo = () => {
    this.props.dispatch({
      type:'adminUserList/projectInfo',
    });
  }
  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  };
  // 上传文件
  uploadFile = () => {

    const { fileList } = this.state;
    const version = this.refs.version.value;
    const _this = this;
    const { dispatch } = this.props;
    if(!fileList.length && !version){
      message.info('请上传文件并输入版本号！');
      return;
    }
  if(!fileList.length){
    message.info('请上传文件！');
    return;
  }
  if(!version){
    message.info('请输入版本号！');
    return;
  }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file );
      formData.append('version',version);
    });
    dispatch({
      type:'adminUserList/changeTableLoading',
      payload:{
        loading:true,
      },
    });
    reqwest({
      url: UPLOAD_URL,
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
        });
        message.success('上传成功.');
        _this.queryProjectInfo();
      },
      error: () => {
       dispatch({
          type:'adminUserList/changeTableLoading',
          payload:{
            loading:false,
          },
        });
        message.error('上传失败.');
      },
    });
    
  }
  render() {
    const {fileList} = this.state;
    const { projectInfo:{name, version, apk, time}, loading} = this.props.adminUserList;
    const props = {
      action: UPLOAD_URL,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    const uploadButton = (
      <Button>
        <Icon type="upload" />上传
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.project}>
            <Spin spinning={loading}>
              <Row>
                <Col className={styles.item}>
                  <div className={styles.dic}>项目LOGO：</div>
                  <div className={styles.info}>
                    <img src={logo} alt='logo' width='80' />
                  </div>
                </Col>
                <Col className={styles.item}>
                  <div className={styles.dic}>项目名称：</div>
                  <div className={styles.info}>{name}</div>
                </Col>
                <Col className={styles.item}>
                  <div className={styles.dic}>版本号：</div>
                  <div className={styles.info}>{version}</div>
                </Col>
                <Col className={styles.item}>
                  <div className={styles.dic}>更新时间：</div>
                  <div className={styles.info}>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</div>
                </Col>
                <Col className={styles.item}>
                  <div className={styles.dic}>下载APK：</div>
                  <div className={styles.info}>
                    <a href={apk}>{apk}</a>
                  </div>
                </Col>
                <Col className={styles.item+' '+styles.item2}>
                  <div className={styles.dic}>更新APK：</div>
                  <div className={styles.info}>
                    <Upload {...props}>
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <p className={styles.version}>
                      <input placeholder='请输入版本号' className='ant-input' ref='version'/>
                    </p>
                  
                    <Button onClick={this.uploadFile}>确定上传</Button>
                  </div>
                </Col>
              </Row>
            </Spin>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

