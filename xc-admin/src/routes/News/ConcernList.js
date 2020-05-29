import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Input, Select, Button, Table, DatePicker, 
  message, Tabs, Modal, Badge, Popover, Upload, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ConcernList.less';
import { sizeType, sizeChange } from '../../components/SizeSave';
import AlertTips from '../../components/AlertTips';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { TabPane  } = Tabs;

const TAB_NAV = [
  {
    name:'关注事件',
    type:'1',
  },
  {
    name:'标记关注',
    type:'2',
  }
];
// 配置提示信息
message.config({
  duration:1,
  maxCount:1
});
@connect(state => ({
  concernList: state.concernList,
}))
@Form.create()
export default class ConcernList extends Component {
  state = {
    title:'',
    eventTime:null,
    createTime:null,
    index:1,
    size:10,
    tabId:'1',
    selectedRowKeys:[],
    selectData:[],
    gz_visible:false,
    modifeData:{
      visible:false,
      showImg:[],
    },
    alertTips:{
      title:'删除关注',
      visible:false,
      html:'',
    },
  };
  componentDidMount() {
    this.queryConcern(this.state);
  }

  // 查询关注数据列表
  queryConcern = (parmas) =>{
    const { dispatch } = this.props;
    const { size } = this.state;
    const { title, eventTime, createTime, tabId, index } = parmas;
    let url;
    if(tabId == '1'){
      url = 'concernList/queryConcern';
    }else if(tabId == '2'){
      url = 'concernList/queryStayConcern';
    }
    dispatch({
      type:url,
      payload:{
        title,
        eventTime,
        createTime,
        index,
        size,
      },
    });
  }
  // 搜索Dom结构
  searchData = () => {
    const { form } = this.props;
    const { title, eventTime, createTime } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
            <dl className={styles.searchLayout}>
              <dd style={{width:'300px'}}>
                <FormItem 
                label="标题"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('title', { initialValue: title })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem label="新闻日期">
                  {getFieldDecorator('eventTime', { initialValue:eventTime })(
                    <DatePicker style={{width:'100%'}} />
                  )}
                </FormItem>
              </dd>
              <dd style={{width:'220px'}}>
                <FormItem label="创建日期">
                  {getFieldDecorator('createTime', { initialValue:createTime })(
                    <DatePicker style={{width:'100%'}} />
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

  // 查询列表
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { index, size, tabId } = this.state; 
    form.validateFields((err, values) => {
        
        const { title } = values;
        const eventTime = values.eventTime ? moment(values.eventTime).format('YYYY-MM-DD') : null;
        const createTime = values.createTime ? moment(values.createTime).format('YYYY-MM-DD') : null;
        const params = {
          title,
          eventTime,
          createTime,
        };
        console.log(typeof moment(values.eventTime).format('YYYY-MM-DD'));
        this.setState({
          ...params,
        });
        let url;
        if(tabId == '1'){
          url = 'concernList/queryConcern';
        }else if(tabId == '2'){
          url = 'concernList/queryStayConcern';
        }
        dispatch({
          type:url,
          payload:{
            ...params,
            index,
            size,
          },
        });
      })
  }

  // 重置查询
  handleFormReset = () => {

    const { size, tabId } = this.state;
    const { dispatch, form } = this.props;
    let url;
    form.resetFields();
    const params = {
      title:'',
      eventTime:null,
      createTime:null,
      index:1,
    };
    this.setState({
      ...params,
    });
    if(tabId == '1'){
      url ='concernList/queryConcern';
    }else if(tabId == '2'){
      url = 'concernList/queryStayConcern'; 
    }
    dispatch({
      type:url,
      payload:{
        ...params,
        size,
      },
    });
  }
  // 表格分页
  changePage = (page)=>{
    const { dispatch } = this.props;
    const { title, eventTime, createTime, tabId } = this.state;
    const { current, pageSize, total } = page;
    this.setState({
      index:current,
      size:pageSize
    });
    let url;
    if(tabId == '1'){
      url ='concernList/queryConcern';
    }else if(tabId == '2'){
      url = 'concernList/queryStayConcern'; 
    }
    dispatch({
      type:url,
      payload:{
        title,
        eventTime,
        createTime,
        index:current,
        size:pageSize,
      },
    });
  }

  // 点击删除按钮
  onDelete = (row) => {
    this.setState({
      alertTips:{
        title:'删除关注',
        visible:true,
        html:`确定删除 [${row.title}] 栏目?`,
        id:row.id,
        newsId:row.newsId,
      },
    });
  }

  // 确认删除
  handleDelete = () => {
    const{ dispatch } = this.props;
    const { alertTips:{id, newsId}} = this.state;
    dispatch({
      type:'concernList/delete',
      payload:{
        id,
        newsId,
      },
      callback:(res)=>{
        if(res.code == 0){
          this.queryConcern(this.state);
          this.cancelDelete();
        }else{
          message.error(res.message);
        }
      }
    });
  }
  // 取消删除
  cancelDelete = () => {
    const { alertTips } = this.state;
    this.setState({
      alertTips:{
        ...alertTips,
        visible:false,
      }
    });
  }
 // 修改关注
 handleModife = (row) => {
  const { id,title,imgUrl,viceTitle } = row;
  const { modifeData } = this.state;
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
      showImg,
      id,
      title,
      imgUrl,
      viceTitle,
      visible:true,
    },
  });
  
 }
// 确定修改
modifeYes = (e) => {
  e.preventDefault();
  const _this = this;
  this.props.form.validateFields((err, values) => {

    if(!err){
      const { dispatch } = this.props;
      const { modifeData:{id} } = this.state;
      const { attentionName,viceTitle,showImg } = values;

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
        type:'concernList/modifieData',
        payload:{
          id,
          title:attentionName,
          viceTitle,
          imgUrl:showImg[0].response.result,
        },
        callback:(res)=>{
          if(res.code == 0){
            _this.modifeNo();
            _this.queryConcern(_this.state);
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
  const { modifeData } =  this.state;
  this.setState({
    modifeData:{
      ...modifeData,
      visible:false,
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
// 修改元素结构
modifeDom = () => {
  const { form:{getFieldDecorator} } = this.props;
  const { modifeData } = this.state;
  const { showImg, imgUrl, title, viceTitle  } = modifeData;
 
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
            {getFieldDecorator('attentionName', {
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
// 切换列表
changeTab = (e) => {
  const { form } = this.props;
  form.resetFields();
  const params = {
    createTime: null,
    eventTime: null,
    title: "",
    index:1,
    tabId:e,
  }
  this.setState({
    ...params,
  });
  this.queryConcern(params);
}
// 选择表格中行数据
onSelectChange = (selectedRowKeys,e) =>{
  this.setState({ 
    selectedRowKeys,
    selectData:e,
  });
}

  // 排序方法
  compare = (prop) => {
    return function (obj1, obj2) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}

// 添加关注
addAttentions = () => {
  const { dispatch } = this.props;
  const { selectData } = this.state;
  if(!selectData.length){
    message.warning('请选择要添加关注的数据');
    return;
  }
  this.setState({
    gz_visible:true,
  });
  dispatch({
    type:'concernList/concernType',
  });
}

// 关注弹框dom
gz_dom = () => {
  const { form, concernList } = this.props;
  const { concernTypeData } = concernList;
  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={this.gz_Submit}>
            <FormItem
              label='关注事件名'
            >
            {getFieldDecorator('attentionName', {
               initialValue:'',
               rules: [{ required: true, message: '请输选择事件名'}],
            })(
              <Select>
               {
                 concernTypeData.map(item => {
                    return <Option key={item.id} value={item.id}>{item.title}</Option>;
                  })
                }
              </Select>
            )}
            </FormItem>
          </Form>
  );
}

// 提交批量关注
gz_Submit = (e) => {
  e.preventDefault();
  this.props.form.validateFields((err, values) => {
    if(err) return;
    const { dispatch } = this.props;
    const { selectData } = this.state;
    const { attentionName } = values;
    const list = selectData.sort(this.compare('eventTime'));
    const _this = this;
    const attrList = [];
    for(let i=0;i<list.length;i++){
      let item = list[i];
      let obj = {
        attentionId:attentionName,
        id:attentionName,
        newsId:item.newsId,
        title:item.title,
        eventTime:moment(item.eventTime).format('YYYY-MM-DD HH:mm:ss'),
        newsAbstract:item.newsAbstract,
        newsType:item.newsType,
        contentType:item.contentType,
        newsTitle:item.title,
      }
      attrList.push(obj);
    }
  
    if(_this.submitAgain){
      return;
    }
    _this.submitAgain = true;
   
    dispatch({
      type:'concernList/addConcern',
      payload:{
        attrList,
      },
      callback:(res)=>{
        setTimeout(()=>{
          _this.submitAgain = false;
        },300);
        if(res.code == 0){
          message.success('批量关注成功');
          _this.ga_Cancel();
          _this.state.selectedRowKeys = [];
          _this.queryConcern(_this.state);
        }else{
          message.error(res.message);
        }
      }
    });
    
  })
}

// 取消关注弹框
ga_Cancel = () => {
  this.setState({
    gz_visible:false,
  });
}

// 删除待关注
DeleteStay = ( row ) => {
  
  const { dispatch } = this.props;
  const { id } = row;
  const _this = this;
  confirm({
    title: '确定删除本条关注标记?',
    content: row.title,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      dispatch({
        type:'concernList/deleteStay',
        payload:{
          id,
        },
        callback:(res)=>{
          if(res.code == 0){
            message.success('删除成功');
            _this.queryConcern(_this.state);
          }else{
            message.error(res.message);
          }
        }
      })
    },
    onCancel() {
      
    },
  });
} 
// 批量删除
DeleteStayMore = () => {
  const { dispatch } = this.props;
  const { selectData } = this.state;
  const _this = this;
  if(selectData.length){
    confirm({
      title: '确定删除所选关注事件?',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        const ids = [];
        for(let i=0;i<selectData.length;i++){
          ids.push(selectData[i].id);
        };
        dispatch({
          type:'concernList/deleteStay',
          payload:{
            id:ids.join(','),
          },
          callback:(res)=>{
            if(res.code == 0){
              message.success('批量删除成功');
              _this.queryConcern(_this.state);
            }else{
              message.error(res.message);
            }
          }
        })
      },
      onCancel() {
      },
    });
    
  }else{
    message.warning('请选择要删除的数据');
  }
}
  render() {
    const { concernList, pagination, loading } = this.props.concernList;
    const { alertTips, selectedRowKeys, tabId, gz_visible, modifeData} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let columns = tabId == '1' ? [{
      title:'标题',
      key:'title',
      render:(row)=>{
        return (
          <div>
            <Link to={{ pathname: `/news/concern-detail-list/${row.id}` }}>
                {row.title}
            </Link>
            <span style={{marginLeft:8,color:'orange'}}>[{`浏览数：${row.accessCount}`}]</span>
           </div>
        );
      }
    },{
      title:'主图',
      key:'imgUrl',
      dataIndex:'imgUrl',
      render:(key)=>{
        let dom = key ?<Popover placement="left" content={<img src={key}/>}>
          <div className={styles.bgImg} style={{backgroundImage:`url(${key})`}}></div>
          </Popover>:<Badge status="default" text="暂无图片"/>;
        return <div>{ dom }</div>;
      }
    },{
      title:'新闻日期',
      key:'eventTime',
      dataIndex:'eventTime',
      width:120,
      render:(key)=>{
        return <div>{key?moment(key).format('YYYY-MM-DD'):'--'}</div>;
      }
    },{
      title:'创建日期',
      key:'createTime',
      dataIndex:'createTime',
      width:120,
      render:(key)=>{
        return <div>{key?moment(key).format('YYYY-MM-DD'):'--'}</div>;
      }
    },{
      title:'关注人数',
      key:'count',
      dataIndex:'count',
      width:110,
    },{
      title:'操作',
      key:'todo',
      width:110,
      render:(row)=>{
        return (
          <div>
            <a href='javascript:void(0)' onClick={this.onDelete.bind(this,row)}>删除</a>
            <a style={{marginLeft:10}} href='javascript:void(0)' onClick={this.handleModife.bind(this,row)}>修改</a>
          </div>
            );
      }
    }]:[
      {
        title:'标题',
        key:'title',
        dataIndex:'title',
      },
      {
        title:'操作',
        key:'todo',
        width:80,
        render:(row)=>{
          return <a href="javascript:void(0)" onClick={this.DeleteStay.bind(this,row)}>删除</a>;
        },
      }
    ];
    return (  
      <PageHeaderLayout>
        <Card bordered={false}>
        <div className={styles.concern}>
          <Tabs animated={false} activeKey={tabId} onChange={this.changeTab}>
            
            {
              TAB_NAV.map( item => {
                return (
                  <TabPane tab={item.name} key={item.type} disabled={item.type=='2'?true:false}>
                      <div className={styles.tableListForm}>
                        {this.searchData()}
                      </div>
                      <Table 
                        columns={columns}
                        dataSource={concernList}
                        pagination={pagination}
                        onChange={this.changePage}
                        loading={loading}
                        rowSelection={rowSelection}
                        rowKey='id'
                      />
                </TabPane>
                );
              })
            }
            
          </Tabs>
          <AlertTips 
            alertTips={alertTips}
            onOk={this.handleDelete}
            onCancel={this.cancelDelete}
          />
          <div className={styles.addAndDelet} style={{display:tabId=='1'?'none':'block'}}>
            <Button type="primary" onClick={this.addAttentions} style={{marginRight:15}}>添加关注</Button>
            <Button type="default" onClick={this.DeleteStayMore.bind(this)}>删除</Button>
          </div>
        </div>
        <Modal 
          title='添加至关注'
          visible={gz_visible}
          onOk={this.gz_Submit}
          onCancel={this.ga_Cancel}
          maskClosable={false}
          destroyOnClose={true}
        >
        {this.gz_dom()}
        </Modal>
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
    );
  }
}
