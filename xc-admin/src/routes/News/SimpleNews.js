import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Select , Button, Table, DatePicker, message, Modal } from 'antd';
import moment from 'moment';
import { getTypeName } from '../../components/newsTypeName.js';
import styles from './SimpleNews.less';
const DateFormate = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
message.config({
  duration: 1,
  maxCount: 1,
});
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  simpleNews: state.simpleNews,
  newsList:state.newsList,
}))
export default class SimpleNews extends PureComponent{
  state = {
    index:1,
    size:10,
    newsTop:{
      title:'',
      visible:false,
      newsId:'',
      newsHot:'',
      startTime:'',
      endTime:'',
      bool:false,
    }
  }
  
  componentDidMount(){
    this.querySimpleNews();
  }
  // 查询列表
  querySimpleNews = () => {
    const { dispatch } = this.props;
    const { index, size } = this.state;
    dispatch({
      type:'simpleNews/querySimpleNews',
      payload:{
        index,
        size,
      },
    }); 
  }
  // 删除新闻
  deleteSimple = (row) => {
    const { dispatch } = this.props;
    const { newsId } = row;
    const _this = this;
    confirm({
      title: '删除当前头条?',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        dispatch({
          type:'simpleNews/deleteNews',
          payload:{
            newsId,
          },
          callback:(res)=>{
            if(res.code == 0){
              message.success('删除成功');
              _this.querySimpleNews();
            }else{
              message.error(res.message);
            }
          }
        });
      },
    });
  }
  // 表格翻页
  handleTable = (pagination) => {
    const { dispatch } = this.props;
    const { current,pageSize } = pagination;
    const size = pageSize;
    const index = current;
    this.setState({
      index,
      size,
    });
    dispatch({
      type:'simpleNews/querySimpleNews',
      payload:{
        index,
        size,
      },
    });
  }
   // 新闻置顶、取消置顶
   handleNewsTop = (row) => {
    const {newsTop} = this.state;
    const { newsId, newsHot } = row;
    newsTop.startTime = null;
    newsTop.endTime = null;
    let title;
    if(newsHot>0){
      title = '取消置顶';
    }else{
      title = '置顶';
    }
    this.setState({
      newsTop:{
        ...newsTop,
        newsId,
        newsHot,
        title,
        visible:true,
      },
      
    }); 
    
  }
    // 选择置顶时间
    handleNesTop = (e) => {
      const {newsTop} = this.state; 
      const startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:ss');
      const endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:ss');
      this.setState({
        newsTop:{
          ...newsTop,
          startTime,
          endTime,
          bool:false,
        }
      });
    }
  // 设置置顶时间，弹框内容
  newsToptips = () => {
    const  {newsTop:{newsId,newsHot,visible,bool}} = this.state;
    const _this = this;
    if( newsHot > 0 ){
      return <p>是否取消置顶？</p>
    }else{
      return (<div>
        <p style={{paddingBottom:15}}>选择置顶有效时间</p>
        <RangePicker onChange={this.handleNesTop} format='YYYY-MM-DD HH:mm' showTime={{ format: 'HH:mm' }}/>
        <p className={bool?styles.show:styles.hide}>请选择日期</p>
        </div>)
    }
  }
  // 确定、取消 置顶
  handleOk = () => {
    const { newsTop} = this.state;
    const { newsId, newsHot, startTime, endTime } = newsTop;
    const _this = this;
    const { dispatch } = this.props;
      if(newsHot>0){
        dispatch({
          type:'newsList/newsCancelTop',
          payload:{
            newsId,
            versionType:1,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.setState({
                newsTop:{
                  ...newsTop,
                visible:false,
               }
              });
              _this.querySimpleNews();
            }
          }
        })
      }else{
        if(!startTime || !endTime){
          _this.setState({
            newsTop:{
              ...newsTop,
              bool:true,
            }
          });
          return;
        }
        dispatch({
          type:'newsList/newsTop',
          payload:{
            newsId,
            startTime,
            endTime,
            versionType:1,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.setState({
                newsTop:{
                  ...newsTop,
                visible:false,
               }
              });
              _this.querySimpleNews();
            }else{
              message.info(res.message);
            }
          }
        })
      }  
  }
  // 取消置顶
  handleHide = () => {
    const {newsTop} = this.state;
    newsTop.startTime = null;
    newsTop.endTime = null;
      this.setState({
        newsTop:{
          ...newsTop,
          visible:false,
          bool:false,
        }
      });
    }
  render(){
   
    const { simpleNewsList,pagination, haveTop, loading } = this.props.simpleNews;
 
    const columns = [
      {
        title:'标题',
        key:'title',
        dataIndex:'title',
      },
      {
        title:'类型',
        key:'newsType',
        dataIndex:'newsType',
        width:110,
        render: (key, row) => {
          let newsTypeText = <small>{getTypeName(row.newsType)}</small>;
          return (
            <div>
              <div>{newsTypeText}</div>
            </div>
          );
        },
      },
      {
        title:'内容类型',
        key:'contentType',
        width:110,
        render: (key, row) => {
          let contentTypeText;
          if (row.contentType === 0) {
            contentTypeText = <small>图文</small>;
          } else if (row.contentType === 1) {
            contentTypeText = <small>大图新闻</small>;
          } else if (row.contentType === 2) {
            contentTypeText = <small>文字</small>;
          } else if (row.contentType === 20) {
            contentTypeText = <small>视频列表</small>;
          }
          return (
            <div>
              <div>{contentTypeText}</div>
            </div>
          );
        },
      },{
        title:'操作',
        key:'todo',
        width:160,
        render:(row)=>{
          let text = row.newsHot ? '取消置顶' : '置顶';
          return (
            <div className={styles.todo}>
              <a href="javascript:void(0)" onClick={this.deleteSimple.bind(this,row)}>删除</a>
              <a href="javascript:void(0)" style={{marginLeft:15}} onClick={this.handleNewsTop.bind(this,row)}>{text}</a>
            </div>
          );
        }
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            <div className={styles.simple}>
            
              <Table
                columns={columns}
                dataSource={simpleNewsList}
                rowKey='id'
                loading={loading}
                pagination={pagination}
                onChange={this.handleTable}
              />
              <Modal
              title={this.state.newsTop.title}
              visible={this.state.newsTop.visible}
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleHide}
              className={styles.hightData}
            >
            {this.newsToptips()||null}
            </Modal>
            </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
