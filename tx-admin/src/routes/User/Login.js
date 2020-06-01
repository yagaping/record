import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Form, Input, Button, Row, Col, message} from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;
const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.countDown = 60;
  }
  state = {
    type: 'account',
    status: 'error',
    autoLogin: true,
    message: '',
    code:'获取验证码'
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, status } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          status,
        },
        callback: (res) => {
          if(res && res.code == '-1'){
            if(res.message == '用户名或密码错误') {
              this.setState({
                submitting: false,
                message: res.message,
              });
            }else{
              this.setState({
                message: res && res.message,
                passWord:values.passWord,
              });
            }
          }else{
            this.setState({
              passWord:values.passWord
            });
          }
        }
      });
    }
  };
  getCode = () => {
    const { login:{userName} } = this.props;
    const _this = this;
    this.props.dispatch({
      type:'login/getCode',
      payload:{
        userName
      },
      callback:res=>{
        if(res.code == 0){
          sessionStorage.setItem('getCodeTime',(new Date()).getTime()+5*60*1000);
          this.countDown = 60;
          _this.setState({
            code:this.countDown + 's'
          }) 
          clearInterval(this.timer);
          _this.timer = setInterval(function(){
            _this.countDown -= 1;
            _this.setState({
              code:_this.countDown + 's'
            }) 
            if( _this.countDown < 0 ){
              _this.setState({
                code:'获取验证码'
              }) 
              clearInterval(_this.timer);
            }
          },1000)
        }else{
          message.error(res.message||'获取验证码失败')
        }
      }
    })
  }
  codeLogin = () => {
    this.props.form.validateFields((err, values) => {
      if(err) return;
      const { code } = values;
      const { login:{userName } } = this.props;
      const { passWord } = this.state;
      let nowTime = (new Date()).getTime();
      let oldTime = parseInt(sessionStorage.getItem('getCodeTime'));
      if( nowTime > oldTime ){
        message.info('验证码已失效，请重新获取');
        return;
      }
      this.props.dispatch({
        type:'login/codeLogin',
        payload:{
          userName,
          passWord,
          codetemp:code
        },
        callback:res=>{
          if(res.code == 0){

          }else{
            message.error(res.message||'验证码错误')
          }
        }
      })
    })
  }
  renderCode = () => {
    const { getFieldDecorator } = this.props.form;
    const { code } = this.state;
    return (
      <Row>
        <Col span={14}>
          <FormItem>
              {getFieldDecorator('code',{
                rules: [{ required: true, message: '请输入验证码' }],
            })(<Input placeholder="请输入验证码" className={styles.codeInput} />)}
          </FormItem>
        </Col>
        <Col span={8} offset={2}>
          <Button style={{height:40,width:'100%'}} disabled={code=="获取验证码"?false:true} onClick={this.getCode.bind(this)}>{code}</Button>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={this.codeLogin} className={styles.codeLogin}>登录</Button>
        </Col>
      </Row>
    )
  }
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login } = this.props;
    const { submitting } = this.state;
    const { type } = this.state;
    
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <h3 style={{ color: '#1D66A2', fontSize: 24, fontFamily: 'Helvetica', marginBottom: 24}}>米橙后台管理登录</h3>
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(this.state.message)}
          <UserName name="userName" placeholder="请输入账号" />
          <Password name="passWord" placeholder="请输入密码" />
          {login.isChange == 1 ? this.renderCode() : (<Submit loading={submitting}>登录</Submit>)}
        </Login>
        
      </div>
    );
  }
}
