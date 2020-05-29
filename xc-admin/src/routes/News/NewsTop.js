import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Input, Select, Button, Modal, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewsTopTable from '../../components/NewsTopTable';
import styles from './NewsTop.less';
import { sizeType, sizeChange } from '../../components/SizeSave';

import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  newsList: state.newsList,
}))
@Form.create()
export default class NewsTop extends Component {
  
  state = {
    searchTitle:'',
    searchNewsGroup:-1,
    searchBeginDay:null,
    searchEndDay:null,
    index:0,
    size:10,
    disabled:true,
    newsTop:{
      visible:false,
      newsId:'',
      startTime:'',
      endTime:'',
    }
  };

  componentDidMount() {
    // 查询 job list
    this.queryNewsList();
    localStorage.setItem('newsUrl',this.props.match.url);
    
  }

  queryNewsList() {
    const { dispatch } = this.props;
    const { searchTitle, searchNewsGroup, searchBeginDay, searchEndDay, index} = this.state;
    const size = sizeType(this.state.size,this.props);
    dispatch({
      type:'newsList/newsTopList',
      payload:{
        title:searchTitle,
        newsGrop:searchNewsGroup,
        nowPage:index,
        pageSize:size,
        startTime:searchBeginDay,
        endTime:searchEndDay,
      }
    });
  }

  // 表格选择行
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'jobList/fetch',
      payload: params,
    });
  }

// 点击审核
  handleTableOperation = (row) => {
    return (
      <div>
        <a className="ant-dropdown-link" onClick={this.handleTableSeeClick.bind(this,row)}>审核</a>
        <a style={{marginLeft:10}} onClick={this.handleNewsTop.bind(this,row)}>取消置顶</a>
      </div>
    );
  }

  // 处理 table 查看点击，视频、新闻、问答、段子会有不同的预留
  // - 现在支持 新闻预留
  handleTableSeeClick = (row) => {
    const newsType = row.newsType;
    const newsGroup = row.newsGroup;
    const contentType = row.contentType;
    let path = '';

    localStorage.setItem('searchData',JSON.stringify(this.state));
    localStorage.setItem('newsType',newsType);
    localStorage.setItem('contentType',contentType);
    if(newsGroup != 5 && (contentType == 0 || contentType == 2 || contentType == 3)){//图文
      path = `/news/news-content-edit/${row.newsId}`;
    }else{ //问答、视频、多图
      path = `/news/news-content-view/${row.newsId}`;
   }
     
   this.props.history.push(path);

  }

 // 新闻置顶、取消置顶
 handleNewsTop = (row) => {
  const {newsTop} = this.state;
  const { newsId,versionType } = row;
  this.setState({
    newsTop:{
      ...newsTop,
      newsId,
      versionType,
      visible:true,
    },
    
  }); 
  
}

// 取消置顶
handleOk = () => {
  const _this = this;
  const { dispatch } = this.props;
  const { newsTop } = this.state;
  const { newsId, versionType } = newsTop;
  dispatch({
    type:'newsList/newsCancelTop',
    payload:{
      newsId,
      versionType,
    },
    callback:(res)=>{
      if(res.code == 0){
        _this.setState({
          newsTop:{
            ...newsTop,
          visible:false,
         }
        });
        _this.queryNewsList();
      }
    }
  })  
}
// 取消弹框
handleHide = () => {
 const {newsTop} = this.state;
  this.setState({
    newsTop:{
      ...newsTop,
      visible:false,
    }
  });
}

  // 查询
  handleSearch = (e,arg) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const { size } = this.state;
      const { searchTitle, searchNewsGroup, searchBeginDay, searchEndDay} = values;
      this.setState({
        searchTitle,
        searchNewsGroup,
        searchBeginDay,
        searchEndDay,
      });
      let startTime = searchBeginDay ? moment(searchBeginDay).format('YYYY-MM-DD HH:mm:ss') : null;
      let endTime = searchEndDay ? moment(searchEndDay).format('YYYY-MM-DD HH:mm:ss') : null;
      let index = 0;
      if(arg == -1){
        index = this.state.index;
      }
      dispatch({
        type: 'newsList/newsTopList',
        payload: {
          title:searchTitle,
          newsGrop:searchNewsGroup,
          nowPage:index,
          pageSize:size,
          startTime,
          endTime,
        },
      });
    });
  }

  // 表格分页
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { searchTitle, searchNewsGroup, searchBeginDay, searchEndDay} = this.state;
    const index = (current - 1);
    this.setState({
      index:index,
      size:pageSize,
    });
    sizeChange(pageSize, this.props);
    dispatch({
      type: 'newsList/newsTopList',
      payload: {
          title:searchTitle,
          newsGrop:searchNewsGroup,
          nowPage:index,
          pageSize,
          startTime:searchBeginDay,
          endTime:searchEndDay,
      },
    });
  };

  // 重置搜索
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
      searchTitle:'',
      searchNewsGroup:-1,
      searchBeginDay:null,
      searchEndDay:null,
    };
    this.setState(params);
    dispatch({
      type: 'newsList/newsTopList',
      payload: {
        title:'',
        newsGrop:-1,
        nowPage:0,
        pageSize:10,
        startTime:null,
        endTime:null,
      },
    });
  }
// 返回时间格式
  handleSelectDates(key, dates) {
    let value;
    if (dates !== null) {
      value = dates.format('YYYY-MM-DD HH:mm:ss');
    }
  
    this.setState({
      [key]: value,
    });
  }
// 点击刷新按钮
  handleRefresh(nun){
    this.handleSearch('',nun);
  }
  // 表单内容
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { query } = this.props.location;
    const format = 'YYYY-MM-DD HH:mm:ss';
    if (query !== undefined) {
      this.state.searchTitle = query.title;
      this.state.searchNewsGroup = query.newsGroup;
      this.state.searchBeginDay = query.beginDay;
      this.state.searchEndDay = query.endDay;
      this.props.location.query = undefined;
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <dl className={styles.searchLayout}>
              <dd style={{width:'300px'}}>
                <FormItem label="标题">
                  {getFieldDecorator('searchTitle', { initialValue: this.state.searchTitle })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'210px'}}>
                <FormItem
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 2 }}
                  label="新闻分组"
                >
                  {getFieldDecorator('searchNewsGroup', { initialValue: this.state.searchNewsGroup })(
                    <Select>
                      <Option value={-1}>全部</Option>
                      <Option value={0}>头条</Option>
                      <Option value={20}>视频</Option>
                      <Option value={1}>娱乐</Option>
                      <Option value={5}>问答</Option>
                      <Option value={4}>段子</Option>
                      <Option value={7}>科技</Option>
                      <Option value={8}>体育</Option>
                    </Select>
                  )}
                  </FormItem>
              </dd>
              <dd style={{width:'280px'}}>
                <FormItem label="开始日期">
                  {getFieldDecorator('searchBeginDay', { initialValue:this.state.searchBeginDay && moment(this.state.searchBeginDay,format) })(
                    <DatePicker showTime format={format} style={{width:'100%'}} onChange={this.handleSelectDates.bind(this, 'searchBeginDay')} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'280px'}}>
                <FormItem label="结束日期">
                  {getFieldDecorator('searchEndDay', { initialValue: this.state.searchEndDay&&moment(this.state.searchEndDay, format) })(
                    <DatePicker showTime format={format} style={{width:'100%'}} onChange={this.handleSelectDates.bind(this, 'searchEndDay')} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'150px'}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </dd>
              <dd className={styles.refresh}>
                <a href="javascript:void(0)" onClick={this.handleRefresh.bind(this,-1)}>刷新</a>
              </dd>
          </dl>
      </Form>
    );
  }

  // 表单内容
  renderForm() {
    return this.renderSimpleForm();
  }
  componentWillMount(){
    const searchData = JSON.parse(localStorage.getItem('searchData'));
    const mark = localStorage.getItem('mark')
    if(searchData && mark){
      this.setState({
        ...searchData
      });
      localStorage.removeItem('mark');
      localStorage.removeItem('searchData');
    }
  }
  render() {
    const { newsList } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType, searchNewsGroup } = this.state;
    const { newsModifyData, newsAddData } = this.state;
    return (  
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <NewsTopTable
              selectedRows={selectedRows}
              loading={newsList.loading}
              data={newsList.newsTopData}
              state={this.state}
              history = {this.props.history}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              operation={this.handleTableOperation}
              onTableChange={this.handleTableChange}
              query={this.state}
            />
            <Modal
              title='取消置顶'
              visible={this.state.newsTop.visible}
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleHide}
            >
            <p>是否取消置顶？</p>
          </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
