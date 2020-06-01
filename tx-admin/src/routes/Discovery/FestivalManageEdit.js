import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Upload,
 Radio, 
 Button,
 message,
 Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@connect(({ festivalManage, loading }) => ({
  festivalManage,
  loading: loading.models.festivalManage,
}))
@Form.create()
export default class FestivalEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    let bgImg_ios1 = [];
    let bgImg_ios2 = [];
    let bgImg_ios3 = [];
    let bgImg_android1 = [];
    let bgImg_android2 = [];

    let new_bgImg_ios1 = [];
    let new_bgImg_ios2 = [];
    let new_bgImg_ios3 = [];
    let new_bgImg_android1 = [];
    let new_bgImg_android2 = [];
    prevParams && prevParams.bgImg.forEach((value,index,array) => {
        if(value.indexOf('/ios_1') >= 0) {
            let obj = {};
            obj.uid = -1*Math.random();
            obj.url = value;
            bgImg_ios1.push(obj);
        }
        if(value.indexOf('/ios_2') >= 0) {
            let obj4 = {};
            obj4.uid = -1*Math.random();
            obj4.url = value;
            bgImg_ios2.push(obj4);
        }
        if(value.indexOf('/ios_3') >= 0) {
            let obj2 = {};
            obj2.uid = -1*Math.random();
            obj2.url = value;
            bgImg_ios3.push(obj2);
        }
        if(value.indexOf('/android_1') >= 0) {
            let obj1 = {};
            obj1.uid = -1*Math.random();
            obj1.url = value;
            bgImg_android1.push(obj1);
        }
        if(value.indexOf('/android_2') >= 0) {
            let obj3 = {};
            obj3.uid = -1*Math.random();
            obj3.url = value;
            bgImg_android2.push(obj3);
        }
    });

    prevParams && prevParams.newBgImg.forEach((value,index,array) => {
        if(value.indexOf('/ios_1') >= 0) {
            let obj = {};
            obj.uid = -1*Math.random();
            obj.url = value;
            new_bgImg_ios1.push(obj);
        }
        if(value.indexOf('/ios_2') >= 0) {
            let obj4 = {};
            obj4.uid = -1*Math.random();
            obj4.url = value;
            new_bgImg_ios2.push(obj4);
        }
        if(value.indexOf('/ios_3') >= 0) {
            let obj2 = {};
            obj2.uid = -1*Math.random();
            obj2.url = value;
            new_bgImg_ios3.push(obj2);
        }
        if(value.indexOf('/android_1') >= 0) {
            let obj1 = {};
            obj1.uid = -1*Math.random();
            obj1.url = value;
            new_bgImg_android1.push(obj1);
        }
        if(value.indexOf('/android_2') >= 0) {
            let obj3 = {};
            obj3.uid = -1*Math.random();
            obj3.url = value;
            new_bgImg_android2.push(obj3);
        }
    });
    this.state = {
      // params: props.location.query.title,
      fileListIcon: [{
        uid: -1,
        status: 'done',
        url: prevParams && prevParams.icon || '',
        // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      fileListBanner: [{
        uid: -2,
        status: 'done',
        url: prevParams && prevParams.banner || '',
        // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    //   fileListBgImg: bgImgArray,
      bgImg_ios1: bgImg_ios1,
      bgImg_ios2: bgImg_ios2,
      bgImg_ios3: bgImg_ios3,
      bgImg_android1: bgImg_android1,
      bgImg_android2: bgImg_android2,
      modal_ios1: {size: 'ios_1', bgImg : ''},
      modal_ios2: {size: 'ios_2', bgImg : ''},
      modal_ios3: {size: 'ios_3', bgImg : ''},
      modal_android1: {size: 'android_1', bgImg : ''},
      modal_android2: {size: 'android_2', bgImg : ''},

      new_bgImg_ios1: new_bgImg_ios1,
      new_bgImg_ios2: new_bgImg_ios2,
      new_bgImg_ios3: new_bgImg_ios3,
      new_bgImg_android1: new_bgImg_android1,
      new_bgImg_android2: new_bgImg_android2,
      new_modal_ios1: {size: 'ios_1', bgImg : ''},
      new_modal_ios2: {size: 'ios_2', bgImg : ''},
      new_modal_ios3: {size: 'ios_3', bgImg : ''},
      new_modal_android1: {size: 'android_1', bgImg : ''},
      new_modal_android2: {size: 'android_2', bgImg : ''},

      id: prevParams && prevParams.id || '',
      banner: prevParams && prevParams.banner || '',
      bgImg: prevParams && prevParams.bgImg || [],
      new_bgImg: prevParams && prevParams.newBgImg || [],
      festivalDate: prevParams &&  prevParams.festivalDate || '',
      name: prevParams && prevParams.name || '',
      typeName: prevParams && prevParams.typeName || '',
      sharingType: prevParams && String(prevParams.sharingType) || '',
      prevUrl: prevParams && prevParams.url || '',
      prePushText: prevParams && prevParams.pushText || '',
      prePerPushText: prevParams && prevParams.perPushText || '',
      prePushUrl: prevParams && prevParams.jumpLink || '',
      prePushTitle: prevParams && prevParams.pushTitle || '',
      uploading: false,
      previewVisible: false,
      imgVisible: false,
      bannerBase64: '',
      iconBase64: '',
      showUrlInput: '0'
    };
  }

  _goBack = () => {
    this.props.dispatch( routerRedux.goBack());
  }

  onRadioChange = (e) => {
    const that = this;
    that.props.form.setFieldsValue({
        sharingType: e.target.value,
    });
    this.setState({
        sharingType: e.target.value,
        showUrlInput: e.target.value,
    });
  }

  handleUpload = () => {
      const { modal_ios1,  modal_ios2, modal_ios3 ,modal_android1, modal_android2, new_modal_ios1,  new_modal_ios2, new_modal_ios3 ,new_modal_android1, new_modal_android2, } = this.state;
      this.setState({ uploading: true });
      let festivalArray = new Array();
      festivalArray.push(modal_ios1,modal_ios2,modal_ios3,modal_android1,modal_android2);
      let imgArray = new Array();
      imgArray.push(new_modal_ios1,new_modal_ios2,new_modal_ios3,new_modal_android1,new_modal_android2);
      this.props.dispatch({
          type: 'festivalManage/festivalUpload',
          payload: {
            id: this.state.id,
            icon: this.state.iconBase64,
            banner : this.state.bannerBase64,
            type: 'festival',
            sharingType: this.state.inputUrl || this.state.prevUrl   ? '1' : '0',
            url: this.state.inputUrl || this.state.prevUrl,
            festivalArray: festivalArray,
            imgArray: imgArray,
            name: this.state.name,
            pushText: this.state.pushText || this.state.prePushText,
            perPushText: this.state.perPushText || this.state.prePerPushText,
            jumpLink: this.state.jumpLink || this.state.prePushUrl,
            pushTitle: this.state.push_text || this.state.prePushTitle,
          },
          callback: (res) => {
              if(res) {
                if(res.code == '0'){
                    this.setState({ 
                        uploading: false,
                    });
                    message.success('保存成功');
                  }else{
                      this.setState({ uploading: false });
                      message.error(res.message || '服务器错误');
                  }
              }
          }
      });
  }

  goToUrl = () => {
      window.open(this.state.inputUrl || this.state.prevUrl );
  }

  normalizeAll = (value) => {
    this.setState({
        inputUrl: value,
    });
  }
  //html地址
  inputChange = (e) => {
    let inputUrl = this.refs.inputUrl.input.value
    this.setState({
        inputUrl: inputUrl,
        prevUrl: '',
    });
  }
  //推送标题更改
  inputPushTitleChange = (e) => {
    let inputPushTitle = this.refs.inputPushTitle.input.value
    this.setState({
        push_text: inputPushTitle,
    });
  }
  //提醒更改
  inputPushTextChange = (e) => {
    let inputPushText = this.refs.inputPushText.input.value
    this.setState({
        pushText: inputPushText,
    });
  }
  //预提醒更改
  inputPerPushTextChange = (e) => {
    let inputPerPushText = this.refs.inputPerPushText.input.value
    this.setState({
        perPushText: inputPerPushText,
    });
  }
  //提醒地址更改
  inputPushUrlChange = (e) => {
    let inputPushUrl = this.refs.inputPushUrl.input.value
    this.setState({
        jumpLink: inputPushUrl,
    });
  }

  handleCancel = () =>{
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
    });
  }

  render() {
    const { prePushTitle,prePushText,prePerPushText,prePushUrl,previewVisible, previewImage, uploading, fileListIcon, fileListBanner, 
        bgImg_ios1, bgImg_ios2, bgImg_ios3, bgImg_android1, bgImg_android2,new_bgImg_ios1, new_bgImg_ios2, new_bgImg_ios3, new_bgImg_android1, new_bgImg_android2
     } = this.state;
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
    const that = this;
    const propsIcon = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ fileListIcon }) => {
            const index = fileListIcon.indexOf(file);
            const newFileList = fileListIcon.slice();
            newFileList.splice(index, 1);
            return {
                fileListIcon: newFileList,
                iconBase64: '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ fileListIcon }) => ({
                fileListIcon: [...fileListIcon, file],
                iconBase64: '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    iconBase64: imgUrl.substring(imgUrl.indexOf(',')+1),
                    fileListIcon: info.fileList
                })
            });
        },
        fileList: this.state.fileListIcon,
        accept: "image/jpg,image/jpeg,image/png"
    };
   
    const propsBanner = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ fileListBanner }) => {
            const index = fileListBanner.indexOf(file);
            const newFileList = fileListBanner.slice();
            newFileList.splice(index, 1);
            return {
                fileListBanner: newFileList,
                bannerBase64: '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ fileListBanner }) => ({
                fileListBanner: [...fileListBanner, file],
                bannerBase64: '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    bannerBase64: imgUrl.substring(imgUrl.indexOf(',')+1),
                    fileListBanner: info.fileList
                })
            });
        },
        fileList: this.state.fileListBanner,
        accept: "image/jpg,image/jpeg,image/png"
    }
    const propsbgImg_ios1 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_ios1 }) => {
            const index = bgImg_ios1.indexOf(file);
            const newFileList = bgImg_ios1.slice();
            newFileList.splice(index, 1);
            return {
                bgImg_ios1: newFileList,
                modal_ios1: {size: 'ios_1', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_ios1 }) => ({
                bgImg_ios1: [...bgImg_ios1, file],
                modal_ios1: {size: 'ios_1', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_ios1: {size: 'ios_1', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg_ios1: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_ios1,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const propsbgImg_ios2 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_ios2 }) => {
            const index = bgImg_ios2.indexOf(file);
            const newFileList = bgImg_ios2.slice();
            newFileList.splice(index, 1);
            return {
                bgImg_ios2: newFileList,
                modal_ios2: {size: 'ios_2', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_ios2 }) => ({
                bgImg_ios2: [...bgImg_ios2, file],
                modal_ios2: {size: 'ios_2', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_ios2: {size: 'ios_2', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg_ios2: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_ios2,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const propsbgImg_ios3 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_ios3 }) => {
            const index = bgImg_ios3.indexOf(file);
            const newFileList = bgImg_ios3.slice();
            newFileList.splice(index, 1);
            return {
                bgImg_ios3: newFileList,
                modal_ios3: {size: 'ios_3', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_ios3 }) => ({
                bgImg_ios3: [...bgImg_ios3, file],
                modal_ios3: {size: 'ios_3', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_ios3: {size: 'ios_3', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg_ios3: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_ios3,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const propsbgImg_android1 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_android1 }) => {
            const index = bgImg_android1.indexOf(file);
            const newFileList = bgImg_android1.slice();
            newFileList.splice(index, 1);
            return {
                bgImg_android1: newFileList,
                modal_android1: {size: 'android_1', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_android1 }) => ({
                bgImg_android1: [...bgImg_android1, file],
                modal_android1: {size: 'android_1', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_android1: {size: 'android_1', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg_android1: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_android1,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const propsbgImg_android2 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_android2 }) => {
            const index = bgImg_android2.indexOf(file);
            const newFileList = bgImg_android2.slice();
            newFileList.splice(index, 1);
            return {
                bgImg_android2: newFileList,
                modal_android2: {size: 'android_2', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_android2 }) => ({
                bgImg_android2: [...bgImg_android2, file],
                modal_android2: {size: 'android_2', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_android2: {size: 'android_2', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg_android2: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_android2,
        accept: "image/jpg,image/jpeg,image/png"
    };

    const new_propsbgImg_ios1 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ new_bgImg_ios1 }) => {
            const index = new_bgImg_ios1.indexOf(file);
            const newFileList = new_bgImg_ios1.slice();
            newFileList.splice(index, 1);
            return {
                new_bgImg_ios1: newFileList,
                new_modal_ios1: {size: 'ios_1', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ new_bgImg_ios1 }) => ({
                new_bgImg_ios1: [...new_bgImg_ios1, file],
                new_modal_ios1: {size: 'ios_1', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    new_modal_ios1: {size: 'ios_1', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    new_bgImg_ios1: info.fileList
                })
            });
        },
        fileList: this.state.new_bgImg_ios1,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const new_propsbgImg_ios2 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ new_bgImg_ios2 }) => {
            const index = new_bgImg_ios2.indexOf(file);
            const newFileList = new_bgImg_ios2.slice();
            newFileList.splice(index, 1);
            return {
                new_bgImg_ios2: newFileList,
                new_modal_ios2: {size: 'ios_2', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ new_bgImg_ios2 }) => ({
                new_bgImg_ios2: [...new_bgImg_ios2, file],
                new_modal_ios2: {size: 'ios_2', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    new_modal_ios2: {size: 'ios_2', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    new_bgImg_ios2: info.fileList
                })
            });
        },
        fileList: this.state.new_bgImg_ios2,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const new_propsbgImg_ios3 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ new_bgImg_ios3 }) => {
            const index = new_bgImg_ios3.indexOf(file);
            const newFileList = new_bgImg_ios3.slice();
            newFileList.splice(index, 1);
            return {
                new_bgImg_ios3: newFileList,
                new_modal_ios3: {size: 'ios_3', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ new_bgImg_ios3 }) => ({
                new_bgImg_ios3: [...new_bgImg_ios3, file],
                new_modal_ios3: {size: 'ios_3', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    new_modal_ios3: {size: 'ios_3', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    new_bgImg_ios3: info.fileList
                })
            });
        },
        fileList: this.state.new_bgImg_ios3,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const new_propsbgImg_android1 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ new_bgImg_android1 }) => {
            const index = new_bgImg_android1.indexOf(file);
            const newFileList = new_bgImg_android1.slice();
            newFileList.splice(index, 1);
            return {
                new_bgImg_android1: newFileList,
                new_modal_android1: {size: 'android_1', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ new_bgImg_android1 }) => ({
                new_bgImg_android1: [...new_bgImg_android1, file],
                new_modal_android1: {size: 'android_1', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    new_modal_android1: {size: 'android_1', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    new_bgImg_android1: info.fileList
                })
            });
        },
        fileList: this.state.new_bgImg_android1,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const new_propsbgImg_android2 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ new_bgImg_android2 }) => {
            const index = new_bgImg_android2.indexOf(file);
            const newFileList = new_bgImg_android2.slice();
            newFileList.splice(index, 1);
            return {
                new_bgImg_android2: newFileList,
                new_modal_android2: {size: 'android_2', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ new_bgImg_android2 }) => ({
                new_bgImg_android2: [...new_bgImg_android2, file],
                new_modal_android2: {size: 'android_2', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    new_modal_android2: {size: 'android_2', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    new_bgImg_android2: info.fileList
                })
            });
        },
        fileList: this.state.new_bgImg_android2,
        accept: "image/jpg,image/jpeg,image/png"
    };
    
    const { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this._goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑节日节气</p>;
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日图标'>
                                <Upload {...propsIcon} onPreview={this.handlePreview}>
                                    {fileListIcon.length >= 1 ? null : 
                                        <div>
                                            <Icon type="upload" />
                                        </div>
                                    }
                                </Upload>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日名称'>
                              <p>{this.state.name}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日类型'>
                              <p>{this.state.typeName}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日日期'>
                              <p>{this.state.festivalDate}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='分享页类型'>
                                {getFieldDecorator('sharingType',{
                                    initialValue: 0,
                                })(
                                    <RadioGroup onChange={this.onRadioChange}>
                                        <Radio value={0}>图片</Radio>
                                        <Radio value={1}>Html5</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                       
                      </Row>
                      {
                            this.state.showUrlInput == 1 ?
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={12} sm={24}>
                                    <FormItem {...formItemLayout} label={[]} colon={false}>
                                        {getFieldDecorator('stateUrl',{
                                            // normalize: this.normalizeAll,
                                            // initialValue: 0,
                                        })(<div><Input ref='inputUrl' defaultValue={(this.state.prevUrl || this.state.inputUrl  ) ? (this.state.prevUrl || this.state.inputUrl) : "请输入地址"} onChange={this.inputChange}/><a href="javascript:;" onClick={() => this.goToUrl()}>点击预览</a></div>)
                                        }
                                    </FormItem>
                                </Col>
                            </Row>  : null
                        }
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='Banner图片'>
                                <Upload {...propsBanner} onPreview={this.handlePreview}>
                                    {fileListBanner.length >= 1 ? null : 
                                        <div>
                                            <Icon type="upload" />
                                        </div>
                                    }
                                </Upload>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='推送标题'>
                                {prePushTitle 
                                    ? 
                                    <Input ref='inputPushTitle' defaultValue={prePushTitle} onChange={this.inputPushTitleChange}/>
                                    :
                                    <Input ref='inputPushTitle' placeholder='请输入推送标题' onChange={this.inputPushTitleChange}/>
                                }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='预提醒'>
                                {prePerPushText 
                                    ? 
                                    <Input ref='inputPerPushText' defaultValue={prePerPushText} onChange={this.inputPerPushTextChange}/>
                                    :
                                    <Input ref='inputPerPushText' placeholder='请输入预先提醒' onChange={this.inputPerPushTextChange}/>
                                }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='提醒'>
                                {prePushText 
                                    ? 
                                    <Input ref='inputPushText' defaultValue={prePushText} onChange={this.inputPushTextChange}/>
                                    :
                                    <Input ref='inputPushText' placeholder='请输入提醒' onChange={this.inputPushTextChange}/>
                                }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='提醒地址'>
                                {prePushUrl 
                                    ? 
                                    <Input ref='inputPushUrl' defaultValue={prePushUrl} onChange={this.inputPushUrlChange}/>
                                    :
                                    <Input ref='inputPushUrl' placeholder='请输入提醒地址' onChange={this.inputPushUrlChange}/>
                                }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='上次分享图片详情'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...propsbgImg_ios1} onPreview={this.handlePreview}>
                                            {bgImg_ios1.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">640*1136px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhone5</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...propsbgImg_ios2} onPreview={this.handlePreview}>
                                            {bgImg_ios2.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1334px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhone6,7,8,Plus</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...propsbgImg_ios3} onPreview={this.handlePreview}>
                                            {bgImg_ios3.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1624px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhoneX</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...propsbgImg_android1} onPreview={this.handlePreview}>
                                            {bgImg_android1.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1334px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>Andriod非曲面屏</p>
                                    </div>
                                    <div>
                                        <Upload {...propsbgImg_android2} onPreview={this.handlePreview}>
                                            {bgImg_android2.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1500px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>Andriod曲面屏</p>
                                    </div>
                                </div>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='分享图片详情'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...new_propsbgImg_ios1} onPreview={this.handlePreview}>
                                            {new_bgImg_ios1.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">640*1136px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhone5</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...new_propsbgImg_ios2} onPreview={this.handlePreview}>
                                            {new_bgImg_ios2.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1334px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhone6,7,8,Plus</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...new_propsbgImg_ios3} onPreview={this.handlePreview}>
                                            {new_bgImg_ios3.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1624px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhoneX</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...new_propsbgImg_android1} onPreview={this.handlePreview}>
                                            {new_bgImg_android1.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1334px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>Andriod非曲面屏</p>
                                    </div>
                                    <div>
                                        <Upload {...new_propsbgImg_android2} onPreview={this.handlePreview}>
                                            {new_bgImg_android2.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1500px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>Andriod曲面屏</p>
                                    </div>
                                </div>
                            </FormItem>
                          </Col>
                      </Row>
                    </Form>
                    <Row style={{marginTop:150}}>
                        <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                            <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                            <Button  onClick={this._goBack}>取消</Button>
                        </Col>
                    </Row>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={300}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
