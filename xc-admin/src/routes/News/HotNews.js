import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input, Modal, Table, Tabs , Button, message, Tooltip, Icon, Upload } from 'antd';
import NewsType from '../../components/NewsType';
import { getTypeName } from '../../components/newsTypeName.js';
import moment from 'moment';
import styles from './HotNews.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
@connect(state => ({
  newsList: state.newsList,
}))
export default class HotNews extends PureComponent {
  state = {
    index: 1,
    size: 10,
    title: '',
    newsId: '',
    newsType: -1,
    startTime: null,
    endTime: null,
    tabKey:'1',
    visible:false,
    iconName:'',
    iconUrl:[],
    status:0,
  };

  componentDidMount = () => {
    this.queryHotNews();
    this.queryIconList();
  };

  // 查询热门新闻列表
  queryHotNews = () => {
 
    const { dispatch } = this.props;
    const {
      index,
      size,
      title,
      newsId,
      newsType,
      startTime,
      endTime,
      status,
    } = this.state;
    dispatch({
      type: 'newsList/queryHotNews',
      payload: {
        index,
        size,
        title,
        newsId,
        newsType,
        startTime,
        endTime,
        status,
      },
    });
    
  };

  // 查询标识列表
  queryIconList = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'newsList/iconList',
      payload:{},
    });
  }
  
  // 选择分组
  handleChange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ newsType: e });
  };

  // 开始日期限制
  disabledStartDate = (startValue) => {
    const endValue = this.state.endTime;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  // 结束日期限制
  disabledEndDate = (endValue) => {
    const startValue = this.state.startTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startTime', value);
  };

  onEndChange = (value) => {
    this.onChange('endTime', value);
  };

  // 搜索Dom结构
  searchData = () => {
    const { form } = this.props;
    const { title, newsId, newsType, startTime, endTime } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <dl className={styles.searchLayout}>
          <dd style={{ width: '300px' }}>
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
          <dd style={{ width: '260px' }}>
            <FormItem
              label="新闻ID"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {getFieldDecorator('newsId', { initialValue: newsId })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </dd>
          <dd style={{ width: '200px' }}>
            <FormItem
              label="新闻分组"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('newsType', { initialValue: newsType })(
                <NewsType onChange={this.handleChange} />
              )}
            </FormItem>
          </dd>
          <dd style={{ width: '160px' }}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </dd>
        </dl>
      </Form>
    );
  };
  // 按条件查询
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      const formatTime = 'YYYY-MM-DD';
      const { size, index, status } = this.state;
      const { title, newsId, newsType } = values;
      const startTime = values.startTime ? moment(values.startTime).format(formatTime) : null;
      const endTime = values.endTime ? moment(values.endTime).format(formatTime) : null;
      const params = {
        title,
        newsId,
        newsType,
        status,
        startTime,
        endTime,
      };
      this.setState({
        ...params,
      });
      dispatch({
        type: 'newsList/queryHotNews',
        payload: {
          ...params,
          size,
          index,
        },
      });
    });
  };
  // 重置查询
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const { size, status } = this.state;
    const params = {
      title: '',
      newsId: '',
      newsType: -1,
      startTime: null,
      hotNewsType: -1,
      endTime: null,
      size,
      status,
      index: 1,
    };
    this.setState({ ...params });
    dispatch({
      type: 'newsList/queryHotNews',
      payload: {
        ...params,
      },
    });
  };
  // 表格分页
  handleTable = (pagination) => {
    const { dispatch } = this.props;
    const {
      title,
      newsId,
      newsType,
      startTime,
      endTime,
      status,
    } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      size: pageSize,
      index: current,
    });
    dispatch({
      type: 'newsList/queryHotNews',
      payload: {
        size: pageSize,
        index: current,
        title,
        startTime,
        endTime,
        status,
        newsId,
        newsType,
      },
    });
  };
  // 删除
  handleDelete = (row) => {
    const { dispatch } = this.props;
    const _this = this;
    confirm({
      title: '确定删除热门新闻?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'newsList/deleteHot',
          payload: {
            id: row.id,
          },
          callback: (res) => {
            if (res.code == 0) {
              message.success('删除成功');
              _this.queryHotNews();
            } else {
              message.error(res.message);
            }
          },
        });
      },
    });
  };
  // 推送
  handlePush = (row) => {
    const { newsId, newsType, contentType, title, newsAbstract } = row;

    this.props.history.push({
      pathname: `/platformManage/Add-news/${newsId}`,
      state: { newsId, newsType, contentType, title, newsAbstract, attention: 0 },
    });
  };

  // 切换tab
  handleTabs = (e) => {
    let status;
    if(e=='1'){
      status = 0;
    }else{
      status = 1;
    }
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
      index: 1,
      size: 10,
      title: '',
      newsId: '',
      newsType: -1,
      startTime: null,
      endTime: null,
      status,
    };
    dispatch({
      type: 'newsList/queryHotNews',
      payload: {
        ...params,
      },
    });   
    this.setState({
      tabKey:e,
      ...params,
    }); 
  }
  // 标识dom
  hotIconDom = () => {
    const { form:{getFieldDecorator} } = this.props;
    const { iconUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Form onSubmit={this.handleYes}>
              <FormItem
                label='标签名'
              >
              {getFieldDecorator('iconName', {
                 initialValue:'',
                 rules: [{ required: true, message: `请输入标签名`, whitespace: true }],
              })(
                <Input placeholder='请输入标签名'/>
              )}
              </FormItem>
              <FormItem
                label='标签图'
              >
              {getFieldDecorator('iconUrl', {
                 valuePropName: 'fileList',
                 getValueFromEvent: this.normFile,
                 rules: [{ type:'array',required: true, message: '请上传标签图' }],
              })(
                <Upload
                  action="/work-api/newsHotLabel/uploadFile"
                  name="file"
                  listType="picture-card"
                  showUploadList={{showPreviewIcon:false}}
                >
                  {iconUrl.length >= 1 ? null : uploadButton}
                </Upload>
              )}
              </FormItem>
            </Form>
    );
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      iconUrl:e && e.fileList
    });
    return e && e.fileList;
  }
  // 添加标签弹框
  addIconBtn = () => {
    this.setState({
      visible:true,
      iconUrl:[],
    });
  }
  // 确定新增
  handleYes = (e) => {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      
      if(!err){
        const { dispatch } = this.props;
        const { iconName, iconUrl } = values;
       
        dispatch({
          type:'newsList/saveIcon',
          payload:{
            image:iconUrl[0].response.result,
            label:iconName,
          },
          callback:(res)=>{
            if(res.code == 0){
              message.success('添加成功');
              _this.handleNo();
              _this.queryIconList();
            }else{
              message.error(res.message);
            }
            
          }
        });
      }
    })
  }
  // 取消新增
  handleNo = () => {
    this.setState({
      visible:false,
    });
  }
  // 删除标识
  handleDeleteIcon = ( row ) => {
    const { dispatch } = this.props;
    const { id } = row;
    const _this = this;
    confirm({
      title: '确定删除热门标识?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type:'newsList/deleteIcon',
          payload:{
            id,
          },
          callback:(res)=>{
            if(res.code == 0){
              message.success('删除成功');
              _this.queryIconList();
              _this.handleNo();
            }else{
              message.error(res.message);
            }
          }
        });
      },
    });
    
  }
  render() {
    const { hotData, pagination, loading, iconList } = this.props.newsList;
    const { tabKey, visible } = this.state;
    
    // 新闻列表
    const columns = [
      {
        title: '标题',
        key: 'title',
        dataIndex: 'title',
        render: (key, row) => {
          return (
            <div className={styles.newsTitle}>
              <span><Tooltip placement="top" title={row.title}>{row.title}</Tooltip></span>
              <img src={row.label}  height="16" style={{marginLeft:5}}/>
              <span style={{ marginLeft: 8, color: 'orange' }}>[{`浏览数：${row.accessCount}`}]</span>
              <span style={{ marginLeft: 8, color: 'orange' }}>[{`评论数${row.commentCount}`}]</span>
              <span style={{ marginLeft: 8, color: 'orange' }}>[{`转发数：${row.shareCount}`}]</span>
            </div>
          );
        },
      },
      {
        title: '类型',
        key: 'newsType',
        dataIndex: 'newsType',
        render: (key, row) => {
          return (
            <div>
              {getTypeName(key)}
            </div>
          );
        },
      },
      {
        title: '内容类型',
        key: 'contentType',
        dataIndex: 'contentType',
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
              {contentTypeText}
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'todo',
        width: 120,
        render: (row) => {
          let dom = tabKey == '1' ? (
            <div>
              <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, row)}>删除</a>
              <a href="javascript:void(0)" style={{ marginLeft: 15 }} onClick={this.handlePush.bind(this, row)}>推送</a>
            </div>
          ):'--';
          return dom;
        },
      },
    ];
    // 标签标识
    const columnsTag = [
      {
        title: '序号',
        key: 'number',
        dataIndex: 'number',
        render: (key, row) => {
          return (
            <div>
              {key||'--'}
            </div>
          );
        },
      },
      {
        title: '标签名',
        key: 'label',
        dataIndex: 'label',
        render: (key, row) => {
          return (
            <div>
              {key||'--'}
            </div>
          );
        },
      },
      {
        title: '标签图',
        key: 'image',
        dataIndex: 'image',
        render: (key, row) => {
          let icon = key ? <div className={styles.icon} style={{backgroundImage:`url(${key})`}}></div> : '无';
          return (
            <div>
              {icon}
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'todo',
        width:100,
        render: (key, row) => {
          return (
            <div>
              <a hfer="javascript:void(0)" onClick={this.handleDeleteIcon.bind(this,row)}>删除</a>
            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.hotNews}>
          <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabs}>
            <TabPane tab='当前热门' key='1'>
              {this.searchData()}
              <div className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={hotData}
                  loading={loading}
                  rowKey="id"
                  pagination={pagination}
                  onChange={this.handleTable}
                />
              </div>
              </TabPane>
              <TabPane tab='历史热门' key='2'>
              {this.searchData()}
              <div className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={hotData}
                  loading={loading}
                  rowKey="id"
                  pagination={pagination}
                  onChange={this.handleTable}
                />
              </div>
              </TabPane>
              <TabPane tab='热门标签' key='3'>
                <Button type="primary" style={{marginBottom:16}} onClick={this.addIconBtn}>添加</Button>
                <Table
                  columns={columnsTag}
                  dataSource={iconList}
                  loading={loading}
                  rowKey='id'
                />
              </TabPane>
            </Tabs>
          </div>
          <Modal
          title="添加热门标签"
          visible={visible}
          onOk={this.handleYes}
          onCancel={this.handleNo}
          maskClosable={false}
          destroyOnClose={true}
          >
          {this.hotIconDom()}
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
