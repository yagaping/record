import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import fetch from 'dva/fetch';
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
    if(prevParams && typeof prevParams.bgImg == 'string') {
        let obj0 = {};  
        obj0.url = prevParams.bgImg;
        obj0.uid = -1*Math.random();
        bgImg_ios1.push(obj0);
    }
    let newBgImg_ios1 = [];
    if(prevParams && typeof prevParams.newBgImg == 'string') {
        let obj1 = {};  
        obj1.url = prevParams.newBgImg;
        obj1.uid = -1*Math.random();
        newBgImg_ios1.push(obj1);
    }
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
        newBgImg_ios1: newBgImg_ios1,
        id: prevParams && prevParams.id || '',
        banner: prevParams && prevParams.banner || '',
        bgImg: '',
        newBgImg: '',
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
      const { modal_ios1 } = this.state;
      this.setState({ uploading: true });
      let festivalArray = new Array();
      this.props.dispatch({
          type: 'festivalManage/festivalUpload',
          payload: {
            id: this.state.id,
            icon: this.state.iconBase64,
            banner : this.state.bannerBase64,
            type: 'festival',
            sharingType: this.state.inputUrl || this.state.prevUrl   ? '1' : '0',
            url: this.state.inputUrl || this.state.prevUrl,
            name: this.state.name,
            pushText: this.state.pushText || this.state.prePushText,
            perPushText: this.state.perPushText || this.state.prePerPushText,
            jumpLink: this.state.jumpLink || this.state.prePushUrl,
            pushTitle: this.state.push_text || this.state.prePushTitle,
            bgImg: this.state.bgImg,
            newBgImg: this.state.newBgImg,
            number: 1
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
    const { prePushTitle,prePushText,prePerPushText,prePushUrl,previewVisible, previewImage, uploading, fileListIcon, fileListBanner, bgImg_ios1, newBgImg_ios1 } = this.state;
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
                bgImg : '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_ios1 }) => ({
                bgImg_ios1: [...bgImg_ios1, file],
                bgImg : '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    bgImg : imgUrl.substring(imgUrl.indexOf(',')+1),
                    bgImg_ios1: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_ios1,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const propsNewBgImg_ios1 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ newBgImg_ios1 }) => {
            const index = newBgImg_ios1.indexOf(file);
            const newFileList = newBgImg_ios1.slice();
            newFileList.splice(index, 1);
            return {
                newBgImg_ios1: newFileList,
                newBgImg : '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ newBgImg_ios1 }) => ({
                newBgImg_ios1: [...newBgImg_ios1, file],
                newBgImg : '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    newBgImg : imgUrl.substring(imgUrl.indexOf(',')+1),
                    newBgImg_ios1: info.fileList
                })
            });
        },
        fileList: this.state.newBgImg_ios1,
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
                            <FormItem {...formItemLayout} label='分享图片详情'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...propsbgImg_ios1} onPreview={this.handlePreview}>
                                            {bgImg_ios1.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">1080*1920px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign:'center'}}>iPhone5</p>
                                    </div>
                                </div>
                            </FormItem>
                          </Col>
                      </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={12} sm={24}>
                                <FormItem {...formItemLayout} label='下次分享图片详情'>
                                    <div style={{display:'flex',flexDirection:'row'}}>
                                        <div style={{marginRight: 20}}>
                                            <Upload {...propsNewBgImg_ios1} onPreview={this.handlePreview}>
                                                {newBgImg_ios1.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">1080*1920px</div>
                                                    </div>
                                                }
                                            </Upload>
                                            <p style={{textAlign:'center'}}>iPhone5</p>
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
