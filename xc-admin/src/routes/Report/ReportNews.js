import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Select , Button, Table, Input, message, Badge } from 'antd';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';
const { Option } = Select;
import styles from './ReportNews.less';
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
export default class ReportNews extends PureComponent{
  state = {
    index:0,
    size:10,
    title:'',
    status:'',
    paperId:'',
  }
  componentWillMount(){
    const { state } = this.props.location;
    if(state){
      this.setState({
        ...state,
      });
    }
    
  }
  componentDidMount(){
    this.queryNews();
  }
  // 查询新闻列表
  queryNews = () => {
    const { dispatch } = this.props;
    const { index, title, paperId } = this.state;
    const size = sizeType(this.state.size,this.props);
    dispatch({
      type:'report/queryNews',
      payload:{
        index,
        size,
        title,
        paperId,
      },
    });
  }
  // 查询按钮
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { size } = this.state;
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) { 
        const { title, paperId} = values;
        _this.setState({
          index:0,
          size,
          title,
          paperId:paperId||'',
        });
        dispatch({
          type:'report/queryNews',
          payload:{
            index:0,
            size,
            title,
            paperId:paperId||'',
          },
        });
      }
    });
  }
  // 重置查询按钮
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { size } = this.state;
    form.resetFields();
    this.setState({
        index:0,
        size,
        title:'',
        status:'',
        paperId:'',
    });
    dispatch({
      type:'report/queryNews',
      payload:{
        index:0,
        size,
        title:'',
        status:'',
        paperId:'',
      },
    });
  }
  // 表格分页
  handleCancel = (pagination, filters, sorter) => {
    const index = pagination.current-1;
    const size = pagination.pageSize;
    const { title, paperId } = this.state;
    sizeChange(size,this.props);
    this.setState({
      index,
      size,
    });
    this.props.dispatch({
      type:'report/queryNews',
      payload:{
        index,
        size,
        title,
        paperId,
      },
    });
  }

  // 搜索结构
  formHtml = () => {
    const { title, status  } = this.state;
    const { getFieldDecorator } = this.props.form;
    let paperId;
    if(this.state.paperId == '-1'){
      paperId = '';
    }else{
      paperId = this.state.paperId;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
      <dl className={styles.search}>
          <dd style={{width:300}}>
              <FormItem
                label="名称"
                {...formItemLayout}
              >
                {getFieldDecorator('title', {
                  initialValue:title,
                })(
                  <Input  placeholder="输入名称"/>
                )}
              </FormItem>
          </dd>
          <dd style={{width:260}}>
              <FormItem
                label="报纸ID"
                labelCol={ {span: 5} }
                wrapperCol={{span:18}}
              >
                {getFieldDecorator('paperId', {
                  initialValue:paperId,
                })(
                  <Input  placeholder="输入报纸ID"/>
                )}
              </FormItem>
          </dd>
          <dd style={{width:'150px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </dd>
      </dl>
  </Form>
    );
  }

  render(){
    const { newsData, pagination, loading } = this.props.report;
   
    const columns = [{
      title:'名称',
      key:'title',
      dataIndex:'title',
      render:(key,row)=>{
        return <Link to={
          {
            pathname:`/report/report-news-detail/${row.id}`,
            state:this.state,
          }
          }>   
          {key||'--'}
        </Link>
      }
    },{
      title:'ID',
      key:'id',
      dataIndex:'id',
      width:186,
      render:(key)=>{
        return <div>{key||'--'}</div>
      }
    },{
      title:'排序',
      key:'sort',
      dataIndex:'sort',
      render:(key)=>{
        return <div>{key||'--'}</div>
      }
    },{
      title:'报纸名字',
      key:'pageName',
      dataIndex:'pageName',
      render:(key)=>{
        return <div>{key||'--'}</div>
      }
    },{
      title:'抓取地址',
      key:'sourceUrl',
      dataIndex:'sourceUrl',
      render:(key)=>{
        let aLink = <a href={key} target='_blank'>{key||'--'}</a>
        return <div>{aLink}</div>
      }
    },{
      title:'时间',
      key:'createTime',
      dataIndex:'createTime',
      render:(key,row)=>{
        return <div>{moment(key).format(DateFormate)||'--'}</div>
      }
    },{
      title:'状态',
      key:'status',
      dataIndex:'status',
      render:(key,row)=>{
        let text = '--';
        if(key == 0){
          text = <Badge status="success" text="正常" />;
        }else if(key == 1){
          text =  <Badge status="default" text="待审核" />;
        }else if(key == 2){
          text =  <Badge status="error" text="图片失效" />;
        }
        return <div>{text}</div>
      }
    },{
      title:'操作',
      key:'todo',
      width:80,
      render:(key,row)=>{
      return <Link to={
        {
          pathname:`/report/report-news-detail/${row.id}`,
          state:this.state,
        }
        }>   
        查看  
      </Link>
      },
    }];

    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            <div className={styles.reportNews}>
              {this.formHtml()}
              <Table
                columns={columns}
                dataSource={newsData}
                rowKey='id'
                loading={loading}
                pagination={pagination}
                onChange={this.handleCancel}
              />
            </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
