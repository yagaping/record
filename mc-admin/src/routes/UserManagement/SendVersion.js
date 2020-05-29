import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Table,
 Card,
 Form,
 Row,
 Col,
 Input,
 Button,
 Popconfirm,
 Select,
 message,
 Modal,
 Tabs,
 Popover,
} from 'antd';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UploadFile from '../../components/UploadFile';
import Ueditor from '../../components/Ueditor';
import SelectModal from './components/SelectModal';
import FixedVersion from './FixedVersion';
import styles from '../SystemManagement/TableList.less';
import css from './index.less';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const _TYPE = {
  1:'文本',
  2:'图文',
}
const _SYSTEM = {
  0:'全部系统',
  1:'Android',
  2:'iOS',
}
@connect(({ userStatistics, loading }) => ({
  userStatistics,
  loading: loading.models.userStatistics,
}))
@Form.create()
export default class SendVersion extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      pageSize: 10,
      loading: false,
      modalVisible: false,
      modalSelectVisible:false,
      time:null,
      type:'',
      modaltype:1,
      title:'',
      addOrEditor:'',
      contentTitle:'',
      pushContent:'',
      base64:'',
      fileList:[],
    };
    this.text = '';
    this.waitLoading=false;
    this.userName = localStorage.getItem('realName') || '';
    this.userId = localStorage.getItem('userId') || '';
  }
  
  componentDidMount() {
   this.querySendVersion();
  }

  querySendVersion = () => {
    const { dispatch, form } = this.props;
    const { page, pageSize } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { type, title } = fieldsValue;
      dispatch({
        type:'userStatistics/querySendVersion',
        payload:{
          page,
          pageSize,
          type,
          title
        }
      })
    });
    
  }
  changePage = (page,pageSize) => {
    this.setState({
      page,
      pageSize
    },()=>{ this.querySendVersion(); })
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      page:1,
      pageSize:10,
      type:'',
      title:''
    },()=>{ this.querySendVersion() })

  }
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { addOrEditor, modalid, base64, fileList, modalText } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err) return;
   
      const { modaltitle, modaltype, startVersion, endVersion,contentTitle, pushContent, isUrl, modalUrl, system } = fieldsValue;
      const params = {
        systemNewsSend:{
          title:modaltitle,
          type:modaltype,
          content:modalText,
          startVersion,
          contentTitle,
          pushContent,
          endVersion,
          system:system != 0 ? system : '',
          isUrl:isUrl || 0
        }
      }
      if(isUrl) params.systemNewsSend.content = modalUrl;
      if(modaltype == 2){
        if( !base64 && !fileList.length ){
          return message.error('请先上传图片');
        }
        params.systemNewsSend.img = base64 || null;
      }
      this.waitLoading = true;
      let url = 'userStatistics/saveVersion';
      if( addOrEditor == '编辑'){
        url = 'userStatistics/modifyVersion';
        params.systemNewsSend.id = modalid;
      }
      dispatch({
        type:url,
        payload:{
            ...params,
        },
        callback:res=>{
          this.waitLoading = false;
          if(res.code == 0){
            message.success(`${addOrEditor}成功`);
            this.querySendVersion();
            this.handleCancel();
          }else{
            message.success(res.message||`${addOrEditor}失败`);
          }
        }
      })
    });
  }
  handleCancel = () => {
    this.setState({
      modalVisible:!this.state.modalVisible
    })
  }

 // 设置富文本
 richText = (html) => {
  this.setState({
    modalText:html
  })
}
  // 编辑
  editor = row => {
    const { form } = this.props;
    form.resetFields();
    const params = {
      addOrEditor:row ? '编辑' : '新增',
      modalid:row ? row.id : null,
      modaltitle:row ? row.title : '',
      startVersion:row ? row.startVersion : '',
      endVersion:row ? row.endVersion : '',
      modalText:row ? (row.content||'') : '',
      modalUrl:row ? (row.content||'') : '',
      modaltype:row ? row.type : 1,
      pushContent: row ? row.pushContent : '',
      contentTitle: row ? row.contentTitle : '',
      isUrl: row ? row.isUrl : 0,
      system: row ? row.system : 0,
      base64:null,
      fileList:row && row.img ? [{
        uid: -1,
        status: 'done',
        url: row.img
      }] : [],
      modalVisible:true,
    }
    if(row && row.isUrl){
      params.modalText = '';
    }else{
      params.modalUrl = '';
    }
    this.setState({
      ...params
    })
  }
  // 选择类型
  changeType = ( e ) => {
    this.setState({
      modaltype:e
    })
  }
  // 选择系统
  changeSystem = ( e ) => {
    this.setState({
      system:e
    })
  }
  // 是否是url
  changeUrl = (e) => {
    this.setState({
      isUrl:e
    })
  }
  renderSearch = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
                <FormItem label="标题">
                {getFieldDecorator('title',{
                  initialValue: "",
                })(<Input placeholder="请输入标题" />)}
                </FormItem>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="类型">
                {getFieldDecorator('type',{
                  initialValue: "",
                })(
                <Select>
                  <Option key='' value=''>全部</Option>
                  {
                    Object.keys(_TYPE).map(item => <Option key={item} value={item}>{_TYPE[item]}</Option>)
                  }
                </Select>
              )}
                </FormItem>
            </Col>
            <Col>
            <div style={{ overflow: 'hidden' }}>
                <span style={{ marginBottom: 24 }}>
                    <Button type="primary" onClick={this.querySendVersion}>
                     查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                    </Button>
                </span>
            </div>
            </Col>
        </Row>
      </Form>
    );
  }
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, 
      modaltitle, 
      modaltype, 
      modalText, 
      fileList, 
      startVersion, 
      endVersion, 
      contentTitle, 
      pushContent,
      modalUrl,
      isUrl,
      system
    } = this.state;
    return (
      <Form>
        <FormItem label="系统">
          {getFieldDecorator('system',{
            initialValue: system || '0'
          })(
            <Select>
              {
                Object.keys(_SYSTEM).map(item => <Option key={item} value={item}>{_SYSTEM[item]}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="类型">
          {getFieldDecorator('modaltype',{
            initialValue: modaltype+'' || '1'
          })(
            <Select onChange={this.changeType}>
              {
                Object.keys(_TYPE).map(item => <Option key={item} value={item}>{_TYPE[item]}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="标题">
        {getFieldDecorator('modaltitle',{
          initialValue:modaltitle,
          rules:[{ required: true, message: '请输入标题' }]
        })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem label="顶部标题">
        {getFieldDecorator('contentTitle',{
          initialValue:contentTitle,
        })(<Input placeholder="请输入标题内容标题" />)}
        </FormItem>
        <FormItem label="推送内容">
        {getFieldDecorator('pushContent',{
          initialValue:pushContent,
          rules:[{ required: true, message: '请输入推送内容' }]
        })(<TextArea placeholder="请输入推送内容" onChange={this.inputText} autosize={{ minRows: 3, maxRows: 5 }}/>)}
        </FormItem>
        <FormItem label="开始版本号">
          {getFieldDecorator('startVersion',{
            initialValue: startVersion,
            rules:[{ required: true, message: '请输入开始版本号' }]
          })(
            <Input placeholder="请输入开始版本号" />
          )}
          </FormItem>
          <FormItem label="结束始版本号">
          {getFieldDecorator('endVersion',{
            initialValue: endVersion,
            rules:[{ required: true, message: '请输入结束始版本号' }]
          })(
            <Input placeholder="请输入结束始版本号" />
          )}
          </FormItem>
          <FormItem label="是否是URL">
          {getFieldDecorator('isUrl',{
            initialValue: isUrl || 0
          })(
            <Select onChange={this.changeUrl.bind(this)}>
              <Option key="0" value={0}>否</Option>
              <Option key="1" value={1}>是</Option>
            </Select>
          )}
        </FormItem>
        {
          isUrl ? (
            <FormItem label="URL">
                 {getFieldDecorator('modalUrl',{
                  initialValue: modalUrl,
                })(
                  <Input placeholder="请输入URL" />
                )}
            </FormItem>
          ) : null
        }
        <div style={{display:isUrl ? 'none':'block'}}>
              <FormItem label="内容（图片宽1280）" style={{marginBottom:0}}></FormItem>
              <Ueditor id='ueditor_2' isShow={isUrl} richText={this.richText} content={modalText} modalVisible={modalVisible} />
        </div>
        {
          modaltype == 2 && (
            <FormItem label="视频封面图（1280*720）">
              <UploadFile getImgUrl={this.getImgBase64} fileList={fileList||[]} setFileList={this.setFileList} />
            </FormItem>
          )
        }
      </Form>
    );
  }
   // 获取上传图标base64
   getImgBase64 = ( base64 ) => {
    this.setState({
      base64,
    })
  }
   // 设置图片
   setFileList = ( imgObj ) => {
      this.setState({
        fileList:imgObj
      })
  }
  // 删除
  delete = ( row ) => {
    this.props.dispatch({
      type:'userStatistics/deleteVersion',
      payload:{
        id:row.id
      },
      callback:res=>{
        if(res.code == 0){
          this.querySendVersion();
          message.success('删除成功');
        }else{
          message.error(res.message||'删除失败');
        }
      }
    })
  }
  // 发送
  sendVersionItem = ( row ) => {
    this.props.dispatch({
      type:'userStatistics/sendVersionItem',
      payload:{
        systemNewsSend:{
          ...row
        },
        callback:res=>{
          if(res.code == 0){
            message.success('发送成功');
          }else{
            message.error('发送失败');
          }
        }
      }
    })
  }
  // 选择手机号码发送
  sendPhone = ( rows ) => {
    this.setState({
      rows,
      modalSelectVisible:true
    })
  }
  sendSpecifyOk = ( phoneArr ) => {
    const { dispatch } = this.props;
    const { rows } = this.state;
    this.setState({waitLoading:true});
    dispatch({
      type:'userStatistics/sendVersionItem',
      payload:{
        mobiles:phoneArr,
        systemNewsSend:{
          ...rows
        }
      },
      callback:res => {
        this.setState({waitLoading:false});
        if(res.code == 0){
          message.success('发送成功');
          this.sendSpecifyNo();
          this.querySendVersion();
        }else{
          message.error(res.message);
        }
      }
    })
  }
  sendSpecifyNo = () => {
    this.setState({
      modalSelectVisible:false,
      waitLoading:false
    })
  }

  render() {
    const { loading, versionData:{ dataList, total, pageNum, pageSize } } = this.props.userStatistics;
    const { modalVisible, addOrEditor, modalSelectVisible } = this.state;
    const columns = [
      {
        title:'ID',
        key:'id',
        width:50,
        dataIndex:'id'
      },{
        title:'系统',
        key:'system',
        width:100,
        dataIndex:'system',
        render:key=> key ? _SYSTEM[key] : '--'
      },{
        title:'类型',
        key:'type',
        width:80,
        dataIndex:'type',
        render:key => <span>{_TYPE[key]}</span>
      },{
        title:'开始版本号',
        key:'startVersion',
        width:150,
        dataIndex:'startVersion',
      },{
        title:'结束版本号',
        width:150,
        key:'endVersion',
        dataIndex:'endVersion',
      },
      {
        title:'标题',
        key:'title',
        width:250,
        dataIndex:'title'
      },
      {
        title:'顶部标题',
        key:'contentTitle',
        width:250,
        dataIndex:'contentTitle'
      },
      {
        title:'推送内容',
        key:'pushContent',
        dataIndex:'pushContent'
      },{
        title:'封面',
        key:'img',
        dataIndex:'img',
        render:(key, row) => {
          let text = '--';
          if( row.type == 2 ){
            let img = <img src={key} width="600" />;
            text = (<Popover  placement="leftTop" content={img}>
            <img src={key} width="120" height="80" style={{objectFit: 'cover'}} />
          </Popover>)
          }
          return text;
        }
      },{
        title:'操作',
        key:'todo',
        width:320,
        render:row => {
          return (<Fragment>
            <Button type="primary" style={{marginRight:10}} onClick={this.editor.bind(this,row)}>编辑</Button>
            <Popconfirm title="确定发送？" onConfirm={this.sendVersionItem.bind(this,row)}>
              <Button type="primary" style={{marginRight:10}}>群发</Button>
            </Popconfirm>
            <Button type="primary" style={{marginRight:10}} onClick={this.sendPhone.bind(this,row)}>发送</Button>
           <Popconfirm title="确定删除？" onConfirm={this.delete.bind(this,row)}>
            <Button type="danger" >删除</Button>
           </Popconfirm>
           </Fragment>)
        
          
        }
      }
    ];
    let events = {
      sendSpecifyOk:this.sendSpecifyOk,
      sendSpecifyNo:this.sendSpecifyNo
    }
    let pagination = {
      total: total,
      current: pageNum,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (page, pageSize) => {
        this.changePage(page, pageSize)
      },
      onChange:(page, pageSize) => {
          this.changePage(page, pageSize)
      },
    }
    return (
      <PageHeaderLayout title="用户列表">
            <Card bordered={false}>
            <Tabs 
                defaultActiveKey='1' 
                tabBarGutter={10} 
                type='card'
            >
              <TabPane tab='手动' key='1'>
                <ModuleIntroduce text={'手动版本号群发'} />
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>
                    { this.renderSearch() }
                  </div>
                  <div style={{paddingBottom:20}}><Button type="primary" icon="plus" onClick={()=>this.editor()}>添加</Button></div>
                  <Table 
                      columns={columns}
                      dataSource={dataList}
                      pagination={pagination}
                      rowKey='id'
                      loading={loading}
                      scroll={{ x : 1770}}
                  />
                </div>
              </TabPane> 
              <TabPane tab='固定' key='2'>
                  <ModuleIntroduce text={'固定版本号'} />
                  <FixedVersion/>
              </TabPane>
            </Tabs>
              
              <Modal
                width={1020}
                visible={modalVisible} 
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title={addOrEditor}
                confirmLoading={this.waitLoading}
              
              >
                { this.renderModal() }
              </Modal>
              <SelectModal
                visible={modalSelectVisible}
                loading={this.waitLoading}
                { ...events }
              />
            </Card>
      </PageHeaderLayout>
    );
  }
}
