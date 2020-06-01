import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Popover,
  Table,
  Input, 
  Card,
  Select,
  Button,
  Row,
  Col,
  Divider,
  Popconfirm,
  DatePicker,
  message 
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import AddSoft from './components/AddSoft';
import styles from './index.less';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const PLATFORM = [
  {
    key:'',
    name:'全部'
  },
  {
    key:1,
    name:'iOS'
  },{
    key:2,
    name:'Android'
  },{
    key:3,
    name:'Windows'
  }
]
const FORCE = [
  {
    key:'',
    name:'全部'
  },{
    key:'0',
    name:'否'
  },{
    key:'1',
    name:'是'
  }
]
@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class Soft extends PureComponent{
  constructor(props){
    super(props);
    this.platform = '';
  }
  state = {
    page:1,
    pageSize:10,
    number:'',
    projectName:'',
    group:'',
    platform:'',
    versionName:'', 
    version:'', 
    force:'', 
    remark:'', 
    detail:'', 
    updateTime:null,
    rank:'',
    subtitle:'',
    appUni:'',
    
    modalData:{
      visible:false,
      edition:0,
      title:'新增',
    }
  };
  componentDidMount(){
     this.getData();
  }
  getData = () => {
    this.props.form.validateFields((err, values) => {
      const { page, pageSize } = this.state;
      const {
          number,
          projectName,
          group,
          platform,
          versionName, 
          version, 
          force, 
          remark, 
          detail, 
          updateTime,
          rank,
          subtitle,
          appUni
      } = values;
      let startTime=null,endTime=null;
      if(updateTime && updateTime.length){
        startTime =  moment(updateTime[0]).format('YYYY-MM-DD HH:mm:ss');
        endTime = moment(updateTime[1]).format('YYYY-MM-DD HH:mm:ss');
      }
      this.props.dispatch({
        type:'softWare/querySoft',
        payload:{
          page,
          pageSize,
          id:number,
          lastVersion:versionName,
          projectName,
          platform,
          uId:platform==1 ? appUni : null,
          subtitle:platform==1 ? subtitle : '',
          lastVersionid:version,
          startTime,
          endTime,
          updateFlag:force
        }
      }) 
    });

    
  }
  reset = () => {
    this.props.form.resetFields();
    this.setState({
      page:1,
      pageSize:10,
      number:'',
      projectName:'',
      group:'',
      platform:'',
      versionName:'', 
      version:'', 
      force:'', 
      remark:'', 
      detail:'', 
      updateTime:null,
      rank:'',
      subtitle:'',
      appUni:''
    },()=>{
      this.platform = '';
      this.getData();
    })
  }
  onCancel = () => {
    this.setState({
      modalData:{...this.state.modalData,visible:false}
    })
  }
  onClick = (size, page) => {
    this.setState({
      pageSize:page,
      page:size
    },()=>{
      this.getData();
    })
  }

  // 选择平台
  handlePlatform = ( val )=>{
    this.platform = val;
  }
  searchForm(){
    const { getFieldDecorator } = this.props.form;
    const { 
      number,
      projectName,
      group,
      platform,
      versionName, 
      version, 
      force, 
      remark, 
      detail, 
      updateTime,
      rank,
      subtitle,
      appUni 
    } = this.state;
    const tailFormItemLayout = {
      wrapperCol: {
        span:16
      },
      labelCol:{
        span:5
      }
    };
   
    return (
      <Form>
      <Row>
        <Col xl={8} lg={12}>
          <FormItem label="编号"  {...tailFormItemLayout}>
              {getFieldDecorator('number',{
                initialValue:number
              })(<Input placeholder="请输入编号" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="项目名称"  {...tailFormItemLayout}>
              {getFieldDecorator('projectName',{
                initialValue:projectName
              })(<Input placeholder="请输入项目名称" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="平台"  {...tailFormItemLayout}>
              {getFieldDecorator('platform',{
                initialValue:platform
              })(<Select placeholder="请选择平台" onChange={this.handlePlatform}>
                {
                  PLATFORM.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)
                }
              </Select>)}
          </FormItem>
        </Col>
        {
          this.platform == 1 && (
            <Fragment>
              <Col xl={8} lg={12}>
                <FormItem label="应用唯一标识"  {...tailFormItemLayout}>
                    {getFieldDecorator('appUni',{
                      initialValue:appUni
                    })(<Input placeholder="请输入应用唯一标识" />)}
                </FormItem>
              </Col>
              <Col xl={8} lg={12}>
                <FormItem label="SUBTITLE"  {...tailFormItemLayout}>
                    {getFieldDecorator('subtitle',{
                      initialValue:subtitle
                    })(<Input placeholder="请输SUBTITLE" />)}
                </FormItem>
              </Col>
            </Fragment>
          )
        }
        <Col xl={8} lg={12}>
          <FormItem label="排序"  {...tailFormItemLayout}>
              {getFieldDecorator('rank',{
                initialValue:rank
              })(<Input placeholder="请输排序" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="分组"  {...tailFormItemLayout}>
              {getFieldDecorator('group',{
                initialValue:group
              })(<Input placeholder="请输分组" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="最新版本名称"  {...tailFormItemLayout}>
              {getFieldDecorator('versionName',{
                initialValue:versionName
              })(<Input placeholder="请输入最新版本名称" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="最新版本号"  {...tailFormItemLayout}>
              {getFieldDecorator('version',{
                initialValue:version
              })(<Input placeholder="请输入最新版本号" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="更新时间"  {...tailFormItemLayout}>
              {getFieldDecorator('updateTime',{
                initialValue:updateTime
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  style={{width:'100%'}}
                />
              )}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="强制更新"  {...tailFormItemLayout}>
              {getFieldDecorator('force',{
                initialValue:force
              })(<Select placeholder="请选择更新类型">
                {FORCE.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)}
              </Select>)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="备注"  {...tailFormItemLayout}>
              {getFieldDecorator('remark',{
                initialValue:remark
              })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Col>
        <Col xl={8} lg={12}>
          <FormItem label="更新详情"  {...tailFormItemLayout}>
              {getFieldDecorator('detail',{
                initialValue:detail
              })(<Input placeholder="请输入更新详情" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col xl={8} lg={12}>
          <FormItem  wrapperCol={{offset:5}}>
            <span style={{ marginBottom: 24 }}  {...tailFormItemLayout}>
                <Button type="primary" onClick={this.getData}>
                查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                重置
                </Button>
            </span>
          </FormItem>
        </Col>
      </Row>
      </Form>
    );
  }

 conver(limit){
    var size = "";
    if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B"; 	
    }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";			
    }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    }else{ //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    return size;
    var sizestr = size + ""; 
    var len = sizestr.indexOf("\.");
    var dec = sizestr.substr(len + 1, 2);
    if(dec == "00"){//当小数点后为00时 去掉小数部分
      return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
    }
  }
  // 删除
  deleteItem = (row) =>{
    const { id } = row;
    this.props.dispatch({
      type:'softWare/deleteSoftItem',
      payload:{
        id
      },
      callback:res=>{
        if(res.code == 0){
          message.success('删除成功');
          this.getData();
        }else{
          message.error(res.message)
        }
      }
    })
  }
  // 新增、编辑
  addIEditor = (row) => {
    this.setState({
      modalData:{
        ...this.state.modalData,
        title: row ? '编辑' : '新增',
        visible:true,
        projectName:row ? row.projectName : '',
        platform:row ? row.platform : 1,
        appUin:row ? row.uid : '',
        subtitle:row ? row.subtitle : '',
        logoUrl:row ? row.logo : '',
        rank:row ? row.rank : 0,
        group:row ? row.group : '',
        edition:row ? row.edition : 0,
        selectPlatform:row ? row.platform:1,
        fileList:row && row.logo ? [{
            uid:-1,
            status:'done',
            url:row.logo
          }
        ] : [],
        id:row ? row.id : null, 
        nameId:row ? row.nameId : null,
        projectId:row ? row.projectId: null 
      }
    })
  }
  editorOk = (values) => {
    const { modalData:{ title, id, nameId, logoUrl, projectId }} = this.state;
    const {
      projectName,
      platform,
      appUin,
      subtitle,
      rank,
      edition,
      group
    } = values;
    if(!logoUrl){
      message.error('请上传LOGO');
      return;
    }
    let url = 'softWare/addSoftItem',
        params={
          projectName,
          platform,
          group,
          edition,
          logo:logoUrl
        };
    if(title == '编辑'){
      url = 'softWare/updateSoftItem';
      params.Id = id;
      params.nameId = nameId;
      params.projectId = projectId;
    }
    if(platform == 1){
      params.uId = appUin;
      params.subtitle = subtitle;
    }
    this.props.dispatch({
      type:url,
      payload:{
        mcProject:{
          ...params
        }
      },
      callback:res=>{
        if(res.code == 0){
          let text = title == '编辑' ? '更新成功' : '新增成功';
          message.success(text);
          this.getData();
        }else{
          let text = title == '编辑' ? '更新失败' : '新增失败';
          message.error(res.message || text)
        }
        this.onCancel();
      }
    })
  }
  // 新增、修改，选择平台
  modalPlatform = (val)=>{
    this.setState({
      modalData:{
        ...this.state.modalData,
        selectPlatform:val,
      }
    })
  }
  // 获取上传图标base64
  getThumbnailUrl = (url) => {
      this.setState({
        modalData:{
          ...this.state.modalData,
          logoUrl:url,
        }
      })
  }
  // 设置图标
  setThumbnailFileList = ( obj ) => {
    this.setState({
      modalData:{
        ...this.state.modalData,
        fileList:obj
      }
    })
  }
  render() {
    const { loading, softWare } = this.props;
    const { data:{dataList = [], total = 0} } = softWare;
    const { page, pageSize } = this.state;
    const events = {
      onCancel:this.onCancel,
      editorOk:this.editorOk,
      getThumbnailUrl:this.getThumbnailUrl,
      setThumbnailFileList:this.setThumbnailFileList,
      modalPlatform:this.modalPlatform
    }
    const pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this.onClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onClick(current, pageSize)
      },
    };
    const columns = [
      {
        title:'编号',
        key:'id',
        dataIndex:'id',
        width:100,
        fixed:'left',
      },{
        title:'项目名称',
        key:'projectName',
        dataIndex:'projectName'
      },{
        title:'平台',
        key:'platform',
        dataIndex:'platform',
        render:key=>{
          let text = PLATFORM.filter(item=>item.key == key)
          return text.length && text[0].name
        }
      },{
        title:'应用唯一标识',
        key:'uid',
        dataIndex:'uid',
        render:key=> key || '--'
      },{
        title:'SUBTITLE',
        key:'subtitle',
        dataIndex:'subtitle',
        render:key=> key || '--'
      },{
        title:'LOGO',
        key:'logo',
        dataIndex:'logo',
        render:key=>{
          let text = key ? (<Popover  placement="right" content={<img width="150" src={key} alt=""/>}><img style={{maxWidth:30}} src={key} alt=""/></Popover>) : '--';
          return text;
        }
      },{
        title:'排序',
        key:'rank',
        dataIndex:'rank',
        render:key=> key||'--'
      },{
        title:'分组',
        key:'group',
        dataIndex:'group'
      },{
        title:'最新版本名称',
        key:'lastVersion',
        dataIndex:'lastVersion',
        render:key => key || '--'
      },{
        title:'最新版本号',
        key:'lastVersionid',
        dataIndex:'lastVersionid',
        render:key => key || '--'
      },{
        title:'更新时间',
        key:'updateTime',
        dataIndex:'updateTime',
        width:170,
        render:key=>{
          return moment(key).format('YYYY-MM-DD HH:mm:ss')
        }
      },{
        title:'强制更新',
        key:'updateFlag',
        dataIndex:'updateFlag',
        render:key=>{
          let text = FORCE.filter(item=>item.key == key);
          text = text.length ? text[0].name : '未知';
          return text;
        }
      },{
        title:'应用包',
        key:'appUrl',
        dataIndex:'appUrl',
        render:key=>{
          return <a href={key}>点击下载</a>
        }
      },{
        title:'应用包大小',
        key:'packageSize',
        dataIndex:'packageSize',
        render:key=>{
          let text = key ? this.conver(key) : key; 
          return  text||'--';
        }
      },{
        title:'plist文件',
        key:'plist',
        dataIndex:'plist',
        render:key=>{
          return  key ? <a href={key} target="_blank">点击下载</a> : '无';
        }
      },{
        title:'操作',
        key:'todo',
        width:120,
        fixed:'right',
        render:row=>{
          return  (<div>
            <a href="javascript:void(0)" onClick={this.addIEditor.bind(this,row)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除？"  onConfirm={this.deleteItem.bind(this,row)} okText="确定" cancelText="取消">
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>
          </div>);
        }
      }
    ]
 
    return (
      <PageHeaderLayout title={'项目'}>
        <Card bordered={false}>
           { this.searchForm() }
           <div className={styles.addBtns}>
             <Button type="primary" icon="plus" onClick={this.addIEditor.bind(this,null)}>新增</Button>
           </div>
           <Table
            className={styles.myTable}
            style={{backgroundColor:'white',marginTop:16}}
            columns={columns} 
            dataSource={dataList} 
            pagination={pagination}
            loading={loading}
            rowKey='id'
            scroll={{ x : 1770}}
            />
            <AddSoft width={800} data={{...this.state.modalData,loading}} {...events}/>
        </Card>
    </PageHeaderLayout>
    );
  }
}
