import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Form, Modal , Button, Table, Input, message, Badge } from 'antd';
import ContentEditor from '../../components/ContentEditor/ContentEditor';
import PhoneSimulator from '../../components/PhoneSimulator/index';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';

import styles from './ReportNewsDetail.less';
const DateFormate = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
message.config({
  duration: 1,
  maxCount: 1,
});
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  report: state.report,
}))
export default class ReportNewsDetail extends Component{
  state = {
    contentEditData:'请输入内容...',
  }
  componentWillMount(){
    const { state } = this.props.location;
    if(state){
      sessionStorage.setItem('reportSearch',JSON.stringify(state));
    }
  }
  componentDidMount(){
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const _this = this;
    dispatch({
      type:'report/queryDetail',
      payload:{
        id
      },
      callback:(res)=>{
        if(res.code == 0){
          _this.setState({
            contentEditData:res.result.content,
          });
        } 
      }
    });
  }
  componentWillUnmount(){
    sessionStorage.removeItem('reportSearch');
  }
  handleContentEditorChange = (html) =>{
   
  }
  render(){
    const { dispatch } = this.props;
    const { phoneSimulator, loading} = this.props.report;
    const { contentEditData } = this.state;
    const reportSearch = sessionStorage.getItem('reportSearch');
    const state  = JSON.parse(reportSearch);
    return (
      <PageHeaderLayout>
          <Spin spinning={loading}>
            <ContentEditor
              className={styles.contentEditor}
              htmlData={contentEditData}
              dispatch={dispatch}
              onChange={this.handleContentEditorChange}
            />
            <PhoneSimulator className={styles.phoneSimulator} {...phoneSimulator}>modal</PhoneSimulator>
          </Spin>
          <div className={styles.newsDetail}>
            <Button >
              <Link to={{
                pathname:`/report/report-news`,
                state,
              }}>
                返回
              </Link>
            </Button>
          </div>
			</PageHeaderLayout>
    )
  }
}
