import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Button,
 message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const sexArr = ['女','男'];
const stateArr = ['正常', '禁用'];
const _osType = ['','Android','iOS'];
const _platformType = ['','米橙','米橙浏览器'];
@connect(({ userEdit, loading }) => ({
  userEdit,
  loading: loading.models.userEdit,
}))
@Form.create()
export default class UserEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    let weixinOpenId = '';
    let weixinOpenType = '';
    let QQOpenId = '';
    let QQOpenType = '';
    let weiboOpenId = '';
    let weiboOpenType = '';
    let appleId = '';
    if(prevParams && prevParams.customerOpen){
      prevParams.customerOpen.forEach((val, index) => {
        if(val.openType == '1') {
          weixinOpenId = JSON.parse(val.extendJson).openid;
          weixinOpenType = val.openType;
        }else if(val.openType == '2') {
          QQOpenId = JSON.parse(val.extendJson).openid;
          QQOpenType = val.openType;
        }else if(val.openType == '4') {
          weiboOpenId = JSON.parse(val.extendJson).openid;
          weiboOpenType = val.openType;
        }else if(val.openType == '6'){
          appleId = '已绑定'
        }
      });
    }
   
    this.state = {
      weixinOpenId: weixinOpenId,
      weixinOpenType: weixinOpenType,
      QQOpenId,
      QQOpenType,
      weiboOpenId,
      weiboOpenType,
      appleId,
      mobile: prevParams && prevParams.mobile || '',
      nickName: prevParams && prevParams.nickName || '',
      regTime: prevParams && prevParams.regTime || '',
      osType: prevParams && prevParams.osType || '',
      platformType: prevParams && prevParams.platformType || '',
      _state: prevParams && String(prevParams.state) || '',  //将0转成成字符串
      area: prevParams && prevParams.area || '',
      birthday: prevParams && prevParams.birthday || '',
      headPicUrl: prevParams && prevParams.headPicUrl || '',
      sex: prevParams && String(prevParams.sex) || '',
      id: prevParams && prevParams.id || '',
      uploading: false,  //上传
      unBinding: false,   //手机解绑
      unBindWeixin: false,  //微信解绑
      unBindQQ: false,       //qq解绑
      unBindWeibo: false,     //微博解绑
      unBindThird: false,
      unBindApple:false,
      seconds: 10,
    };
  }

  _goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/customer-service/user-list',
    }));
  }
  //绑定手机
  bindMobile = () => {
    this.setState({ uploading: true });
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {this.setState({ uploading: false }); return;}
      this.props.dispatch({
        type: 'userEdit/bindMobile',
        payload: {
          id: this.state.id,//10069,//
          mobile: fieldsValue.mobile,
          // checkcode: fieldsValue.checkcode,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.setState({
                mobile: fieldsValue.mobile,
                uploading: false,
              });
              message.success('绑定成功');
            }else{
              this.setState({ uploading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
  }

  //解除手机绑定
  unbindTel = () => {
      this.setState({ unBinding: true });
      this.props.dispatch({
        type: 'userEdit/unBindMobile',
        payload: {
          id: this.state.id,//10069,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.setState({
                mobile: false,
                unBinding: false,
              });
              message.success('解绑成功');
            }else{
              this.setState({ unBinding: false });
              message.error(res.message || '服务器错误')
            }
          }
        },
      });
  }
//第三方解绑
unBindThirdLogin = (type) => {
    switch(type) {
      case '1':
        this.setState({ unBindWeixin: true });
        break;  
      case '2':
        this.setState({ unBindQQ: true });
        break;
      case '4':
        this.setState({ unBindWeibo: true });
        break;
      case '6':
        this.setState({ unBindApple: true });
        break;
    }
    this.props.dispatch({
      type: 'userEdit/unBindThirdLogin',
      payload: {
        id: this.state.id,//10069,
        openType: type,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            let currentId;
            if(type == '1') {
              //微信
              this.setState({
                unBindWeixin: false,
                weixinOpenId: false,
              });
            }else if(type == '2') {
              //QQ
              this.setState({
                unBindQQ: false,
                QQOpenId: false,
              });
            }else if(type == '4'){
              //微博
              this.setState({
                unBindWeibo: false,
                weiboOpenId: false,
              });
            } else if(type == '6'){
              //苹果
              this.setState({
                appleId: false,
                unBindApple: false,
              });
            }  
            message.success('解绑成功');
          }else{
            this.setState({ unBindWeixin: false, unBindQQ: false, unBindWeibo: false,weiboOpenId:false });
            message.error(res.message || '服务器错误')
          }
        }
      },
    });
  }
  //获取验证码
  getIdentifyingCode = () => {
    if(!this.state.inputTel) return;
    this.timer = setInterval(() => {  
      this.setState({  
        seconds: (this.state.seconds - 1),  
      },() => {
        if (this.state.seconds == 0) {
            clearInterval(this.timer);
            this.setState({
              seconds: 10,
            });
        }
      });  
    }, 1000);  
    this.props.dispatch({
      type: 'userEdit/sendCheckcode',
      payload: {
        mobile: this.state.inputTel,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            // message.success('服务器错误')
          }else{
            message.error(res.message || '服务器错误')
          }
        }
      }
    });
  }

  validatecontactWay = (rule, value, callback) => {
    const tel = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9]|19[0-9])[0-9]{8}$/;
    if( !value) {
      callback('手机号不能为空');
      this.setState({
        inputTel: '',
      });
      return;
    }else if( !tel.test(value) ) {
      callback('手机号格式不对');
      this.setState({
        inputTel: '',
      });
      return;
    }else{
      callback();
      this.setState({
        inputTel: value,
      });
    }
  }

  render() {
    const { unBindWeixin, unBindQQ, unBindWeibo, unBinding, uploading, mobile, nickName, regTime, osType, platformType, _state, area, birthday, weixinOpenId, weixinOpenType, QQOpenId, QQOpenType, weiboOpenId, weiboOpenType, headPicUrl, sex,appleId,unBindApple } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12, offset: 1 },
      },
    };
    let { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this._goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑</p>;
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='用户手机'>
                              {mobile ?
                                <p>{mobile}<Button type="primary" onClick={() => this.unbindTel()} style={{marginLeft:20}} loading={unBinding}>解除绑定</Button></p>
                                :
                                <div>
                                  {getFieldDecorator('mobile', {
                                    // onChange: this.validatecontactWay,
                                    rules: [{ 
                                      required: true, 
                                      // message: '请输入手机号',
                                      validator: this.validatecontactWay,
                                    }],
                                    // normalize: this.normalizeAll,
                                    // validateTrigger: 'onBlur',
                                  })(<div  style={{display: 'flex',flexDirection:'row'}} >
                                        <Input placeholder="请输入手机号" />
                                        {/* <Button type="primary" disabled={this.state.seconds == 10 ? false : true} style={{marginLeft:10}} onClick={() => this.getIdentifyingCode()}>{this.state.seconds == 10 ? '发送验证码' : this.state.seconds+'s' }</Button> */}
                                      </div>)}
                                </div>
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      {/* {
                        mobile 
                        ?
                        null
                        :
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={12} sm={24}>
                              <FormItem {...formItemLayout} label='手机验证码'>
                                  {getFieldDecorator('checkcode', {
                                    rules: [{ required: true, message: '请输入手机验证码' }],
                                  })(<Input placeholder="请输入手机验证码" />)}
                              </FormItem>
                            </Col>
                        </Row>
                      } */}
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='用户名称'>
                              <p>用户名称</p>
                            </FormItem>
                          </Col>
                      </Row> */}
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='微信OpenID'>
                              {
                                weixinOpenId
                                ? 
                                <p>{weixinOpenId}<Button type="primary" onClick={() => this.unBindThirdLogin(weixinOpenType)} style={{marginLeft:20}} loading={unBindWeixin}>解除绑定</Button></p> 
                                : null 
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='QQ OpenID'>
                              {
                                QQOpenId
                                ? 
                                <p>{QQOpenId}<Button type="primary" onClick={() => this.unBindThirdLogin(QQOpenType)} style={{marginLeft:20}} loading={unBindQQ}>解除绑定</Button></p> 
                                : null 
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='微博OpenID'>
                              {
                                weiboOpenId
                                ? 
                                <p>{weiboOpenId}<Button type="primary" onClick={() => this.unBindThirdLogin(weiboOpenType)} style={{marginLeft:20}} loading={unBindWeibo}>解除绑定</Button></p> 
                                : null 
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='苹果ID'>
                              {
                                appleId
                                ? 
                                <p>已绑定<Button type="primary" onClick={() => this.unBindThirdLogin(6)} style={{marginLeft:20}} loading={unBindApple}>解除绑定</Button></p> 
                                : null 
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='QQOpenID'>
                              <p>gjiGGBNo761bibfsuf9bi9h9ahYUHBbaohhaopqh<a>解除绑定</a></p>
                            </FormItem>
                          </Col>
                      </Row> */}
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册日期'>
                              <p>{regTime}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册来源-系统'>
                              <p>{_osType[osType]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册来源-平台'>
                              <p>{_platformType[platformType]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='头像'>
                              {headPicUrl ? <img alt="pic" src={headPicUrl} width="60"/> : null}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='昵称'>
                              <p>{nickName}</p>  
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='性别'>
                              <p>{sexArr[sex]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='生日'>
                              <p>{birthday}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='地区'>
                              <p>{area}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='状态'>
                              <p>{stateArr[_state]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='备注'>
                              <TextArea rows={4}/>
                            </FormItem>
                          </Col>
                      </Row> */}
                    </Form>
                    <Row style={{marginTop:150}}>
                        <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                            {mobile ? null : <Button type="primary" onClick={this.bindMobile} style={{marginRight:20}} loading={uploading}>保存</Button>}
                            <Button  onClick={this._goBack}>取消</Button>
                        </Col>
                    </Row>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
