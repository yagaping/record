import React, { PureComponent,createClass} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Spin, DatePicker,Card, Form, Select, Input } from 'antd';
import moment from 'moment';
import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select; 
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const _TYPE = [{
  type:-1,
  name:'全部'
},{
  type:1,
  name:'Android'
},{
  type:2,
  name:'Ios',
}];
@Form.create()
@connect(state => ({
  userFeedback: state.userFeedback,
}))
export default class FeedbackDetail extends PureComponent{

  state = {
    data:{}
  };
  componentDidMount(){
    const { dispatch, match:{params} } = this.props; 
    const _this = this;
    dispatch({
      type:'userFeedback/queryDetail',
      payload:{
        id:params.id
      },
      callback:(res)=>{
        if(res.code == 0){
          _this.setState({
            data:res.result
          })
        }
      }
    })
  }
  detailsHtml = () =>{
    const { data } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    let text;
    let contentType;
    if(data.phonePlatform){
      for(let k in _TYPE){
        if(_TYPE[k].type == data.phonePlatform){
          text = _TYPE[k].name;
        }
      }
    }
    switch( parseInt(data.contactMethod) ){
      case 1:
        contentType = '微信';
        break;
      case 2:
        contentType = '手机';
        break;
      case 3:
        contentType = '邮箱';
        break;
    }
    return (
      <Form>
        <FormItem label="反馈ID" { ...formItemLayout }>
          <span>{data.id||'--'}</span>
        </FormItem>
        <FormItem label="用户ID" { ...formItemLayout }> 
          <span>{data.userId||'--'}</span>
        </FormItem>
        <FormItem label="联系方式" { ...formItemLayout }>
          <span>{contentType||'--'}</span>
        </FormItem>
        <FormItem label="联系账号" { ...formItemLayout }>
          <span>{data.contactAccount||'--'}</span>
        </FormItem>
        <FormItem label="用户设备版本" { ...formItemLayout }>
          <span>{data.equipmentModel||'--'}</span>
        </FormItem>
        <FormItem label="用户客户端版本" { ...formItemLayout }>
          <span>{data.clientVersion||'--'}</span>
        </FormItem>
        <FormItem label="内容" { ...formItemLayout }>
          <span>{data.content||'--'}</span>
        </FormItem>
        <FormItem label="平台" { ...formItemLayout }>
          <span>
          { text ||'--'}
          </span>
        </FormItem> 
        <FormItem label="创建时间" { ...formItemLayout }>
          <span>{data.createAt||'--'}</span>
        </FormItem>
        {/* <FormItem label="更新时间" { ...formItemLayout }>
          <span>{data.updateAt||'--'}</span>
        </FormItem> */}
      </Form>
    )
  }
  render(){
    const { loading } = this.props.userFeedback;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
           <div className={styles.details}>
              <Spin spinning={loading}>
                {this.detailsHtml()}
              </Spin>
           </div>
           <div style={{textAlign:'center'}}>
             <Button onClick={() => this.props.history.goBack()} type="primary">返回</Button>
           </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
