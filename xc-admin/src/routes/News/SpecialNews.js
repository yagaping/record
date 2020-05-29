import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Input , Button, 
  DatePicker, Select, Table, Modal, message, Tooltip, Tabs, Popover, Badge, Upload, Icon } from 'antd';
import styles from './SpecialNews.less';
import NewsType from '../../components/NewsType';
import moment from 'moment';
import { getTypeName } from '../../components/newsTypeName.js';
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane  } = Tabs;
const confirm = Modal.confirm;
message.config({
  duration: 1,
  maxCount: 1,
});
@Form.create()
@connect(state => ({
  specialNews: state.specialNews,
}))
export default class SpecialNews extends PureComponent{
  
  state = {
   title:'',
   order:1,
   newsType:-1,
   startTime:null,
   endTime:null,
   size:10,
   index:1,
   status:1, //1线上专题， 2线下专题
   tabId:'1',
   modifeData:{
     visible:false,
     showImg:[],
   },
  }

  componentDidMount(){
    this.querySpecial();
  }

  // 查询专题新闻
  querySpecial = () => {
    const { dispatch } = this.props;
    const { index, size, title, newsType, startTime, endTime, order, status  } = this.state;
   
    dispatch({
      type:'specialNews/querySpecial',
      payload:{
        index,
        size,
        title,
        order,
        newsType,
        startTime,
        status,
        endTime,
      }
    });
  }

  // 选择分组
  handleChange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({'newsType':e})

  }
  // 搜索Dom结构
  searchData = () => {
    const { form } = this.props;
    const { title, order, newsType, startTime, endTime } = this.state;
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
              <dd style={{width:'160px'}}>
                <FormItem 
                label="排序"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator('order', { initialValue:order })(
                    <Select>
                      <Option value={0}>浏览</Option>
                      <Option value={1}>时间</Option>
                      <Option value={2}>评论</Option>
                      <Option value={3}>转发</Option>
                    </Select>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'200px'}}>
                <FormItem 
                label="专题分组"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator('newsType', { initialValue:newsType })(
                      <NewsType onChange={this.handleChange}/>
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem 
                label="开始日期"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator('startTime', { initialValue:startTime })(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem 
                label="结束日期"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator('endTime', { initialValue:endTime})(
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
  // 按条件查询
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      const formatTime = 'YYYY-MM-DD';
      const { size, index, status } = this.state;
      const { title, newsType, order } = values;
      const startTime =values.startTime ? moment(values.startTime).format(formatTime) : null;
      const endTime = values.endTime ? moment(values.endTime).format(formatTime) : null;
      const params = {
        title,
        newsType,
        order,
        startTime,
        status,
        endTime,
      };
      this.setState({
          ...params,
      });
      dispatch({
        type:'specialNews/querySpecial',
        payload:{
          ...params,
          size,
          index,
        },
      });
    })
  }
  // 重置查询
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const { size } = this.state;
    const params = {
      title:'',
      order:1,
      newsType:-1,
      startTime:null,
      endTime:null,
      size,
      index:1,
    };
    this.setState({...params});
    dispatch({
      type:'specialNews/querySpecial',
      payload:{
        ...params,
      },
    });
  }
  // 表格分页
  handleTable = (pagination) => {
    const { dispatch } = this.props;
    const { title, newsType, startTime, endTime, order  } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      size:pageSize,
      index:current,
    });
    dispatch({
      type:'specialNews/querySpecial',
      payload:{
        size:pageSize,
        index:current,
        title,
        newsType,
        startTime,
        endTime,
        order,
      },
    });
  }

  // 上下线专题
  ifOnline = (row, type) => {
    const { id } = row;
    const { dispatch } = this.props;
    const _this = this;
    let title;
    if(type == '2'){
      title = '确定下线专题？';
    }else{
      title = '确定上线专题？';
    }
    confirm({
      title,
      okText:'确定',
      cancelText:'取消',
      onOk() {
        dispatch({
          type:'specialNews/updateSpecial',
          payload:{
            id,
            status:type,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.querySpecial();
            }else{
              message.error(res.message);
            }
          }
        });
      }
    });
    
  }

  // 下线专题
  handleDelete = (row) => {
    this.ifOnline(row,2);
  }
  //恢复专题
  handleRecovery = (row) => {
   this.ifOnline(row,1);
  }
  // 修改专题
  handleModife = ( row ) => {
    const { modifeData } = this.state;
    const { id,title,viceTitle,imgUrl } = row;
    let showImg = [];
    if(imgUrl){
      showImg.push({
        uid:1,
        status:'done',
        url:imgUrl,
        response:{
          result:imgUrl,
          code:0,
        },
      });
    }
    this.setState({
      modifeData:{
        ...modifeData,
        id,
        title,
        viceTitle,
        showImg,
        visible:true,
      }
    });
  }
  normFile = (e) => {
    const { modifeData } = this.state;
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      modifeData:{
        ...modifeData,
        showImg:e && e.fileList
      }
    });
    return e && e.fileList;
  }
  // 修改dom
  modifeDom = () => {
    const { form:{getFieldDecorator} } = this.props;
    const { modifeData } = this.state;
    const { showImg, title, viceTitle  } = modifeData;
   
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Form onSubmit={this.modifeYes}>
              <FormItem
                label='关注名'
              >
              {getFieldDecorator('specialName', {
                 initialValue:title,
                 rules: [{ required: true, message: `请输入关注名`, whitespace: true }],
              })(
                <Input placeholder='请输入关注名'/>
              )}
              </FormItem>
              <FormItem
                label='副标题'
              >
              {getFieldDecorator('viceTitle', {
                 initialValue:viceTitle,
              })(
                <Input placeholder="输入副标题"/>
              )}
              </FormItem>
             
              <FormItem
                label='主图'
              >
              {getFieldDecorator('showImg', {
                 valuePropName: 'fileList',
                 getValueFromEvent: this.normFile,
                 initialValue:showImg,
                 rules: [{ type:'array',required: true, message: '请上传主图' }],
              })(
                <Upload
                  action="/work-api/work/uploadImg"
                  name="file"
                  data={{type:4}}
                  listType="picture-card"
                  showUploadList={{showPreviewIcon:false}}
                >
                  {showImg.length >= 1 ? null : uploadButton}
                </Upload>
              )}
              </FormItem>
            </Form>
    );
  }

  // 确定修改
  modifeYes = (e) => {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if(!err){
        const { dispatch } = this.props;
        const { modifeData:{id} } = this.state;
        const { specialName,viceTitle,showImg } = values;

          // 上传图片失败
        if(showImg[0].response.code!=0){
          this.props.form.setFields({
            showImg:{
              value:showImg,
              errors:[new Error(showImg[0].response.message)]
            },
          });
          return;
        }
        dispatch({
          type:'specialNews/modifieData',
          payload:{
            id,
            title:specialName,
            viceTitle,
            imgUrl:showImg[0].response.result,
          },
          callback:(res)=>{
            if(res.code == 0){
              _this.modifeNo();
              _this.querySpecial();
            }else{
              message.error(res.message);
            }
            
          }
        });
      }
    })
  }

  // 取消修改
  modifeNo = () => {
    const { modifeData } = this.state;
    this.setState({
      modifeData:{
        ...modifeData,
        visible:false,
      },
    });
  }

    // 切换表格栏目
    changeTab = (e) => {
      const { dispatch, form } = this.props;
      form.resetFields();
      const params = {
        title:'',
        order:1,
        newsType:-1,
        startTime:null,
        endTime:null,
        size:10,
        index:1,
        status:parseInt(e), //1线上专题， 2线下专题
      }
    dispatch({
      type:'specialNews/querySpecial',
      payload:{
        ...params,
      }
    });
      this.setState({
        tabId:e,
        ...params,
      })
    }
  render(){
    const { speicalData, pagination, loading } = this.props.specialNews;
    const { tabId, modifeData } = this.state;
    const columns=[
      {
        title:'标题',
        key:'title',
        dataIndex:'title',
        render:(key,row)=>{
          return (
            <div className={styles.newsTitle}>
              <span>
                <Link to={{ pathname: `/news/special-detail/${row.id}` }}>
                  <Tooltip placement="top" title={row.title}>{row.title}</Tooltip>
                </Link>
              </span>
              <span style={{marginLeft:8,color:'orange'}}>[{`浏览数：${row.accessCount}`}]</span>
            </div>
          );
        }
      },
      {
        title:'主图',
        key:'imgUrl',
        dataIndex:'imgUrl',
        render:(key)=>{
          let dom = key ? <Popover placement="left" content={<img src={key}/>}>
          <div className={styles.bgImg} style={{backgroundImage:`url(${key})`}}></div>
        </Popover> :<Badge status="default" text="暂无图片"/>;
          return <div>{ dom }</div>;
        }
      },
      {
        title:'创建日期',
        key:'createTime',
        dataIndex:'createTime',
        render:(key)=>{
          let text = key ? moment(key).format('YYYY-MM-DD') : '--';
          return <div>{text}</div>;
        }
      },
      {
        title:'类型',
        key:'newsType',
        dataIndex:'newsType',
        render:(key) =>{
          return <div>{getTypeName(key)}</div>;
        }
      },
      {
        title:'操作',
        key:'todo',
        width:150,
        render:(row) => {
          let btn; 
          if(tabId == '1'){
            btn = <a href="javascript:void(0)" onClick={this.handleDelete.bind(this,row)}>删除</a>;
          }else{
            btn = <a href="javascript:void(0)" onClick={this.handleRecovery.bind(this,row)}>恢复专题</a>;
          }
          return (
            <div>
              {btn}
              <a href="javascript:void(0)" style={{marginLeft:'15px'}} onClick={this.handleModife.bind(this,row)}>修改</a>
            </div>
        )
        }
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.special}>
            <Tabs animated={false} activeKey={tabId} onChange={this.changeTab}>
              <TabPane tab="当前专题" key={1}>
              {this.searchData()}
              <div className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={speicalData}
                  rowKey="id"
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTable}
                />
              </div>
              </TabPane>
              <TabPane tab="历史专题" key={2}>
                {this.searchData()}
               <div className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={speicalData}
                  rowKey="id"
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTable}
                />
              </div>
              </TabPane>
            </Tabs>
          </div>
          <Modal
          title="修改"
          visible={modifeData.visible}
          onOk={this.modifeYes}
          onCancel={this.modifeNo}
          maskClosable={false}
          destroyOnClose={true}
        >
        {this.modifeDom()}
        </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
