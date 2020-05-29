import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Tabs, Table, DatePicker, Button, Modal, message } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { getTypeName } from '../../components/newsTypeName';
import styles from './ManageNews.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const TAB_NAV = [
  {
    name:'全部',
    type:'0',
  }, {
    name:'新闻',
    type:'1',
  }, {
    name:'图集',
    type:'2',
  }, {
    name:'草稿',
    type:'3',
  }
];
@Form.create()
@connect(state => ({
  manageNews: state.manageNews,
}))
export default class ManageNews extends PureComponent{
  
  state = {
    tabId:'0',
    nowPage:0,
    pageSize:10,
    title:'',
    addTime:null,
  }
  componentWillMount(){
    if(localStorage.getItem('searchData')){
      this.setState({
        ...JSON.parse(localStorage.getItem('searchData')),
      });
      localStorage.removeItem('searchData');
    }
  }
  componentDidMount(){
    this.querySendNews();
  }

  // 查询列表
  querySendNews = () => {
    const { dispatch } = this.props;
    
    const { tabId, nowPage, pageSize, title, addTime } = this.state;
    dispatch({
      type:'manageNews/querySendNews',
      payload:{
        type:tabId,
        nowPage,
        pageSize,
        title,
        addTime,
      },
    });
  } 

    // 搜索Dom结构
    searchData = () => {
      const { form } = this.props;
      const { title, addTime} = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
                <dd style={{width:'300px'}}>
                  <FormItem 
                  label="标题"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('title', { initialValue: title })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </dd>
             
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="创建日期"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  >
                    {getFieldDecorator('addTime', { initialValue:addTime })(
                      <DatePicker style={{width:'100%'}} />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'160px'}}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </dd>
            </dl>
          </Form>
      );
    }

    // 搜索
    handleSubmit = (e) => {
      if (e) e.preventDefault();
      const { form, dispatch } = this.props;
      form.validateFields((err, values) => {
        const formatTime = 'YYYY-MM-DD';
        const { tabId, pageSize, nowPage } = this.state;
        const { title } = values;
        const addTime =values.addTime ? moment(values.addTime).format(formatTime) : null;
        const params = {
          title,
          addTime,
        };
        this.setState({
            ...params,
        });
        dispatch({
          type:'manageNews/querySendNews',
          payload:{
            type:tabId,
            nowPage,
            pageSize,
            ...params,
          },
        });
      })
      
    }

    // 重置搜索
    handleFormReset = () => {
      const { dispatch, form } = this.props;
      const { tabId } = this.state;
      form.resetFields();
      this.setState({
        title:'',
        nowPage:0,
        pageSize:10,
        addTime:null,
      });
      dispatch({
        type:'manageNews/querySendNews',
        payload:{
          title:'',
          type:tabId,
          nowPage:0,
          pageSize:10,
          addTime:null,
        },
      });
    }
    
    // 切换菜单
  changeTab = (e) => {

    const { dispatch, form } = this.props;
    form.resetFields();
    this.setState({
      tabId:e,
      nowPage:0,
      pageSize:10,
      title:'',
      addTime:null,
    });
   
    dispatch({
      type:'manageNews/querySendNews',
      payload:{
        type:e,
        nowPage:0,
        pageSize:10,
        title:'',
        addTime:null,
      },
    });
  }
  // 新闻信息
  content = ( row ) => {
    let contentText;
    if(row.contentType == 0){
      contentText = '新闻';
    }else if(row.contentType == 1){
      contentText = '图集'
    }
    return (
      <div className={styles.tabRow}>
        <div className={styles.titImg}><img src={eval(row.imageUrl)[0]} /></div>
        <div className={styles.text}>
          <h3>{row.title}</h3>
          <h4>
            <span>{moment(row.addTime).format('YYYY-MM-DD')}</span>
            {contentText?(<span>{contentText}</span>):''}
            <span>{getTypeName(row.newsType)}</span>
            <span>{row.status===2?'草稿':''}</span>
          </h4>
          <p>{row.status!==2?'浏览数：'+row.accessCount :''}</p>
        </div>
      </div>
    );
  }
  // 编辑草稿
  editNews = (dataKey) => {
    const { dispatch } = this.props;
    dispatch({
      type:'manageNews/querySomeNews',
      payload:{
        dataKey,
      },
      callback:(res)=>{
        if(res.code == 0){
          localStorage.setItem('someNews',JSON.stringify(res.result));
          localStorage.setItem('searchData',JSON.stringify(this.state));
          this.props.history.push('/newsEdit/send-news');
        }
      }
    });
  }
  // 刪除新闻
  deleteNews = ( row ) =>{
    const { dispatch } = this.props;
    const _this =this;
  
    confirm({
      title: '确定删除新闻?',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        dispatch({
          type:'manageNews/deleteNews',
          payload:{
            dataKey:row.dataKey,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.querySendNews();
              message.success('删除成功');
            }else{
              message.error(res.message);
            }
          }
        });
      },
    });
    
  }
    // 表格分页
    handleTable = (pagination) => {
      const { dispatch } = this.props;
      const { tabId, title, addTime } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
        nowPage:current-1,
        pageSize:pageSize,
      });
      dispatch({
        type:'manageNews/querySendNews',
        payload:{
          type:tabId,
          nowPage:current-1,
          pageSize:pageSize,
          title,
          addTime,
        },
      });
    }
  render(){
    const { queryList, pagination, loading } = this.props.manageNews;
    const { tabId } = this.state;
    const columns = [
      {
        title:'标题',
        key:'title',
        colSpan:0,
        render:(row)=>{
          return this.content(row);
        }
      },
      {
        title:'操作',
        key:'todo',
        colSpan:0,
        align:'right',
        width:120,
        render:(row)=>{
          
          return (
            <div>
              <a href="javascript:void(0)" onClick={this.editNews.bind(this,row.dataKey)} style={{marginRight:15,display:row.status == 2 ? 'inline-block' : 'none'}}>编辑</a>
              <a href="javascript:void(0)" onClick={this.deleteNews.bind(this,row)}>删除</a>
            </div>
          )
        }
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.table}>
            <div>
              {this.searchData()}
            </div>
            <Tabs animated={false} activeKey={tabId} onChange={this.changeTab}>
              {
                TAB_NAV.map( item => {
                  return (
                    <TabPane tab={item.name} key={item.type}>
                      <Table 
                        columns={columns}
                        dataSource={queryList}
                        rowKey="dataKey"
                        pagination={pagination}
                        loading={loading}
                        onChange={this.handleTable}
                      /> 
                    </TabPane>
                  );
                })
              }
            </Tabs>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
