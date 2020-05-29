import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Upload,
 Modal,
 Button,
 Radio,
 DatePicker,
 message,
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

@connect(({ advertise, loading }) => ({
  advertise,
  loading: loading.models.advertise,
}))
@Form.create()
export default class AdverEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    let bgImg_ios = [];
    let bgImg_android = [];
    let bgImg_routine = [];
    let imgUrl_ios = '';
    let imgUrl_android = '';
    let imgUrl_routine = '';
    prevParams && prevParams.content && prevParams.content.forEach((value,index,array) => {
        if(value.indexOf('/ios') >= 0) {
            let obj = {};
            obj.uid = -1*Math.random();
            obj.url = value;
            bgImg_ios.push(obj);
            //    value.substring(value.indexOf('/20')+1,value.indexOf('.jpg')) 指从2018开始截取到.jpg前面
            imgUrl_ios = value.indexOf('.jpg') >= 0 ? value.substring(value.indexOf('/20')+1,value.indexOf('.jpg')) : '';
        }
        if(value.indexOf('/android') >= 0) {
            let obj1 = {};
            obj1.uid = -1*Math.random();
            obj1.url = value;
            bgImg_android.push(obj1);
            imgUrl_android = value.indexOf('.jpg') >= 0 ? value.substring(value.indexOf('/20')+1,value.indexOf('.jpg')) : '';
        }
        if(value.indexOf('/routine') >= 0) {
            let obj2 = {};
            obj2.uid = -1*Math.random();
            obj2.url = value;
            bgImg_routine.push(obj2);
            imgUrl_routine = value.indexOf('.jpg') >= 0 ? value.substring(value.indexOf('/20')+1,value.indexOf('.jpg')) : '';
        }
    });
    this.state = {
        bgImg_ios: bgImg_ios,
        bgImg_android: bgImg_android,
        bgImg_routine: bgImg_routine,
        imgUrl_ios: imgUrl_ios,
        imgUrl_android: imgUrl_android,
        imgUrl_routine: imgUrl_routine,
        modal_ios: { imgUrl: imgUrl_ios, content : ''},
        modal_android: { imgUrl: imgUrl_android, content : ''},
        modal_routine: { imgUrl: imgUrl_routine, content : ''},
        prevUrl: prevParams && prevParams.url || '', 
        prevTag: prevParams && prevParams.tag || '',
        prevSecond: prevParams && prevParams.second + '' || '',
        prevType: prevParams && String(prevParams.type) || '',
        prevName: prevParams && prevParams.name || '',  
        prevStartTime: prevParams && prevParams.startTime || '', 
        prevEndTime: prevParams && prevParams.endTime || '', 
        prevId: prevParams && prevParams.id || '', 
        uploading: false,
        previewVisible: false,
        imgVisible: false,
    };
  }
  
  goBack = () => {
    this.props.dispatch( routerRedux.goBack());
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  
  handleCancel = () => {
    this.setState({ previewVisible: false });
  }

  handleUpload = () => {
    const { modal_ios, modal_android, modal_routine} = this.state;
    this.setState({ uploading: true });
    let sizeArray = [];
    sizeArray.push(modal_ios, modal_android, modal_routine);
    this.props.form.validateFields((err, fieldsValue) => {
        if (err) {this.setState({ uploading: false }); return;}
        if(Date.parse(fieldsValue.startTime) > Date.parse(fieldsValue.endTime)) {
            message.error('开始时间不能大于结束时间');
            this.setState({ uploading: false, });
            return;
        }
        fieldsValue.startTime = moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.endTime = moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss');
        this.props.dispatch({
            type: 'advertise/modifyAdvert',
            payload: {
                advert: {
                    ...fieldsValue,
                    sizeArray: sizeArray,
                    id: this.state.prevId,
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({ 
                            uploading: false,
                        });
                        message.success('保存成功');
                    }else{
                        this.setState({ 
                            uploading: false,
                        });
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    });
  }

  _goBack = () => {
      this.props.dispatch(
          routerRedux.goBack()
      );
  }

  onRadioChange =  (e) => {
    this.props.form.setFieldsValue({
      type: e.target.value,
    });
  };

  //图片详情
  handlePreview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
    });
  }

  render() {
    const { previewVisible, previewImage,  bgImg_ios, bgImg_android, bgImg_routine,imgUrl_ios, imgUrl_android, imgUrl_routine } = this.state;
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
    const props_ios = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_ios }) => {
            const index = bgImg_ios.indexOf(file);
            const newFileList = bgImg_ios.slice();
            newFileList.splice(index, 1);
            return {
              bgImg_ios: newFileList,
              modal_ios: { imgUrl: imgUrl_ios, content : '', size: 'ios'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_ios }) => ({
              bgImg_ios: [...bgImg_ios, file],
              modal_ios: { imgUrl: imgUrl_ios, content : '', size: 'ios'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_ios: {imgUrl: imgUrl_ios, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: 'ios'},
                    bgImg_ios: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_ios,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const props_android = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_android }) => {
            const index = bgImg_android.indexOf(file);
            const newFileList = bgImg_android.slice();
            newFileList.splice(index, 1);
            return {
              bgImg_android: newFileList,
              modal_android: {imgUrl: imgUrl_android, content : '', size: 'android'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_android }) => ({
              bgImg_android: [...bgImg_android, file],
              modal_android: {imgUrl: imgUrl_android, content : '', size: 'android'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_android: {imgUrl: imgUrl_android, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: 'android'},
                    bgImg_android: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_android,
        accept: "image/jpg,image/jpeg,image/png"
    };
    const props_routine = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg_routine }) => {
            const index = bgImg_routine.indexOf(file);
            const newFileList = bgImg_routine.slice();
            newFileList.splice(index, 1);
            return {
              bgImg_routine: newFileList,
              modal_routine: {imgUrl: imgUrl_routine, content : '', size: 'routine'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg_routine }) => ({
              bgImg_routine: [...bgImg_routine, file],
              modal_routine: {imgUrl: imgUrl_routine, content : '', size: 'routine'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_routine: {imgUrl: imgUrl_routine, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: 'routine'},
                    bgImg_routine: info.fileList
                })
            });
        },
        fileList: this.state.bgImg_routine,
        accept: "image/jpg,image/jpeg,image/png"
    };
    let { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this.goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑广告</p>;
    const  disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('hour');
    }
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告位名称'>
                                {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入广告位名称' }],
                                initialValue: this.state.prevName,
                                })(<Input placeholder={"请输入广告位名称"} />)}
                            </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告资源类型' >
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: '请选择' }],
                                    initialValue: this.state.prevType,
                                    })(
                                    <RadioGroup onChange={(e) => this.onRadioChange(e)}>
                                        <Radio value={'0'}>应用内</Radio>
                                        <Radio value={'1'}>应用外</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='开始时间'>
                                {getFieldDecorator('startTime', {
                                    rules: [{ required: true, message: '请选择开始时间' }],
                                    initialValue: moment(this.state.prevStartTime),
                                })(<DatePicker style={{width: '100%'}} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='结束时间'>
                            {getFieldDecorator('endTime', {
                                rules: [{ required: true, message: '请选择结束时间' }],
                                initialValue: moment(this.state.prevEndTime),
                            })(<DatePicker style={{width: '100%'}} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告URL'>
                                {getFieldDecorator('url', {
                                    rules: [{ required: true, message: '请输入广告URL' }],
                                    initialValue: this.state.prevUrl,
                                    })(<Input placeholder={"请输入广告URL"} />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label="广告标签">
                                {getFieldDecorator('tag', {
                                    rules: [{ message: '请输入广告标签' }],
                                    initialValue: this.state.prevTag,
                                })(<Input placeholder="请输入广告标签" />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label="广告时间(s)">
                                {getFieldDecorator('second', {
                                    rules: [{ message: '请输入广告时间(s)' }],
                                    initialValue: this.state.prevSecond,
                                })(<Input placeholder="请输入广告时间(s)" />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告资源'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...props_ios} onPreview={this.handlePreview}>
                                            {bgImg_ios.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1340px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign: 'center'}}>X，XR，XMax，Xs</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...props_android} onPreview={this.handlePreview}>
                                            {bgImg_android.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">720*1224px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign: 'center'}}>安卓全面屏</p>
                                    </div>
                                    <div style={{marginRight: 20}}>
                                        <Upload {...props_routine} onPreview={this.handlePreview}>
                                            {bgImg_routine.length >= 1 ? null : 
                                                <div>
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">750*1118px</div>
                                                </div>
                                            }
                                        </Upload>
                                        <p style={{textAlign: 'center'}}>iPhone，安卓系列</p>
                                    </div>
                                </div>    
                                
                            </FormItem>
                          </Col>
                      </Row>
                    </Form>
                    <Row style={{marginTop:150}}>
                        <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                            <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={this.state.uploading}>保存</Button>
                            <Button  onClick={() => this._goBack()}>取消</Button>
                        </Col>
                    </Row>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
