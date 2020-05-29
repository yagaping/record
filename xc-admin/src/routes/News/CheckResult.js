import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Badge, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CheckResult.less';
import { sizeType, sizeChange } from '../../components/SizeSave';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  checkResult: state.checkResult,
}))
@Form.create()
export default class CheckResult extends Component {
  
  componentDidMount() {
    this.queryResult();
    localStorage.setItem('mark','true');
  }

  queryResult() {
    const { newsId } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type:'checkResult/queryResult',
      payload:{
        newsId,
      },
    });
  }
  // 点击返回按钮事件
  handleGoBack = () => {
    const path = localStorage.getItem('newsUrl');
    this.props.history.push(path);
    // history.back();
  };
  render() {
    const { checkResultData, loading } = this.props.checkResult;
    
    const columns = [{
      title:'审核结果',
      key:'result',
      dataIndex:'result',
      render:(key)=>{
        let text;
        if(key == 0){
          text = <Badge status="success" text="审核成功" />
        }else if(key == 1 ){
          text =  <Badge status="error" text="审核失败" />
        }
        return <div>{text}</div>;
      }
    },
    {
      title:'审核时间',
      key:'time',
      dataIndex:'checkingTime',
      render:(key)=>{
        return <div>{moment(key).format('YYYY-MM-DD HH:mm:ss')}</div>;
      }
    },
    {
      title:'审核图片路径',
      key:'imageUrl',
      dataIndex:'imageUrl',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },
    {
      title:'类型',
      key:'type',
      dataIndex:'type',
      render:(key)=>{
        let text;
        if(key == 0){
          text = '图片';
        }else if(key == 1 ){
          text = '视频';
        }else if(key == 2){
          text = '关键词过滤';
        }
        return <div>{text}</div>;
      }
    },
    {
      title:'关键词',
      key:'keyword',
      dataIndex:'resultObject',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    }];
    return (  
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.goBack}>
            <Button type='paramy' onClick={this.handleGoBack}>返回</Button>
          </div>
          <Table 
          dataSource={checkResultData} 
          columns={columns} 
          rowKey='id'
          pagination={false}
          loading={loading}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
