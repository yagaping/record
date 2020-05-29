import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
  Divider,
  message,
  Tabs,
  Form,
  Input, 
  Select,
  Button,
  Row,
  Col,
  DatePicker,
  Popconfirm,
} from 'antd';
import AddSoftVersion from './AddSoftVersion';
import moment from 'moment';
import styles from '../index.less';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const FORCE = [
  {
    key:-1,
    name:'全部'
  },
  {
    key:0,
    name:'否'
  },{
    key:1,
    name:'是'
  }
]
@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class VersionList extends PureComponent {
  state = {
    page:1,
    pageSize:10,
    updateTime:null,
    updateFlag:-1,
    editionList:[{name:''}],
    modalData:{
      visible:false,
      title:'新增',
      versionName:'',
      updateFlag:0,
      force:0,
      note:'',
      detail:'',
      files:{name:''}
    }
  };
  componentDidMount() {
    const { onRef, _platform, _group, dispatch } = this.props;
   
    const _this = this;
    onRef && onRef(this);
    dispatch({
      type:'softWare/queryTabMenu',
      payload:{
        page:1,
        pageSize:10,
        platform:_platform,
        group:_group
      },
      callback:res=>{
        if(res.data.code == 0){
          const { editionList = [] } = res.data.data;
          _this.setState({
            editionList
          },()=>{
            _this.getData();
          })
        }
      }
    })
  }
  getData = () => {
    this.props.form.validateFields((err, values) => {
      const {
        id, 
        versionName, 
        versionId, 
        updateFlag, 
        note, 
        updateDetail, 
        updateTime, 
      } = values;
      let startTime=null,endTime=null;
      if( updateTime && updateTime.length ){
        startTime = moment(updateTime[0]).format('YYYY-MM-DD HH:mm:ss');
        endTime = moment(updateTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const { page, pageSize, edition, tabName, editionList} = this.state;
      const { _platform, onRef, menuName, softWare, _group } = this.props;
      const { version:{list} } = softWare;
      let projectName='',
          editionVal=null,
          platform = null,
          group = '',
          item = [];
      if(onRef){
        projectName = menuName == '-1' ? '' : menuName;
        item = list.filter(key => key.name == menuName)
        if(item.length){
          editionVal = item[0].edition || 0;
          platform = item[0].platform;
          group = item[0].group;
        }
      }else{
        projectName = tabName ? tabName : editionList[0].name;
        editionVal = edition ? edition : editionList[0].edition;
        platform = _platform;
        group = _group;
      }
      this.props.dispatch({
        type:'softWare/querySoftVersion',
        payload:{
          page,
          pageSize,
          id: id ? parseInt(id) : null,
          versionName,
          projectName,
          platform,
          note,
          versionId,
          updateFlag: updateFlag == -1 ? null : updateFlag,
          updateDetail,
          startTime,
          endTime,
          group,
          edition:editionVal
        },
      }) 
    })
  }
  reset = () => {
    this.props.form.resetFields();
    this.setState({
      page:1,
      pageSize:10,
      projectName:''
    },()=>{
      this.getData();
    })
  }
  onCancel = () => {
    this.setState({
      modalData:{
        ...this.state.modalData,
        visible:false
      }
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

  searchForm(){
    const { getFieldDecorator } = this.props.form;
    const { 
        id, 
        versionName, 
        versionId, 
        updateFlag, 
        note, 
        updateDetail, 
        updateTime,
      } = this.state;
    const tailFormItemLayout = {
      wrapperCol: {
        span:16
      },
      labelCol:{
        span:5
      }
    };
   const { onRef } = this.props;
   let span = 6;
   if(onRef){
    span = 8;
   }
    return (
      <Form>
      <Row>
        <Col xl={span} lg={12}>
          <FormItem label="ID"  {...tailFormItemLayout}>
              {getFieldDecorator('id',{
                initialValue:id
              })(<Input placeholder="请输入ID" />)}
          </FormItem>
        </Col>
        <Col xl={span} lg={12}>
          <FormItem label="版本名称"  {...tailFormItemLayout}>
              {getFieldDecorator('versionName',{
                initialValue:versionName
              })(<Input placeholder="请输入版本名称" />)}
          </FormItem>
        </Col>
        <Col xl={span} lg={12}>
          <FormItem label="版本号"  {...tailFormItemLayout}>
              {getFieldDecorator('versionId',{
                initialValue:versionId
              })(<Input placeholder="请输入版本号" />)}
          </FormItem>
        </Col>

        <Col xl={span} lg={12}>
          <FormItem label="强制更新"  {...tailFormItemLayout}>
              {getFieldDecorator('updateFlag',{
                initialValue:updateFlag
              })(
                <Select>
                  {FORCE.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)}
                </Select>
              )}
          </FormItem>
        </Col>
        <Col xl={span} lg={12}>
          <FormItem label="备注"  {...tailFormItemLayout}>
              {getFieldDecorator('note',{
                initialValue:note
              })(<Input placeholder="请输入备注" />)}
          </FormItem>
        </Col>
        <Col xl={span} lg={12}>
          <FormItem label="更新详情"  {...tailFormItemLayout}>
              {getFieldDecorator('updateDetail',{
                initialValue:updateDetail
              })(<Input placeholder="请输入更新详情" />)}
          </FormItem>
        </Col>
        <Col xl={span} lg={12}>
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
      </Row>
      <Row>
        <Col xl={span} lg={12}>
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

  // 文件大小格式
 conver(limit){
    var size = "";
    if(limit){
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      return size
    } 
    return limit;
  }
  // 选择上传的文件
  slelectFile = ( e ) => {
    const files = e.target.files[0];
    this.setState({
      modalData:{
        ...this.state.modalData,
        files
      }
    })
  }
  //新增、编辑
  addIEditor = ( row ) => {
    const {  onRef, menuName, softWare } = this.props;
    const { version:{ list } } = softWare;
    const { tabName, editionList } = this.state;
    let projectName='';
    if( onRef ){
      projectName = menuName == -1 ? '' : list.filter(item=>menuName == item.name)[0].name;
    }else{
      projectName = row ? row.projectName : (tabName ? tabName : editionList[0].name);
    }
    this.setState({
      modalData:{
        ...this.state.modalData,
        visible:true,
        title:row ? '编辑' : '新增',
        versionName:row ? row.versionName : '',
        projectName,
        versionId:row ? row.versionId : '',
        updateFlag:row ? row.updateFlag : 0,
        note:row ? row.note : '',
        updateDetail:row ? row.updateDetail : '',
        files:{name:row ? row.appUrl:''},
        packageSize:row ? row.packageSize : 0,
        id: row ? row.id : null
      }
    })
  }
  editorOk = ( values ) =>{
    const {  _platform, onRef, softWare } = this.props;
    const { version:{ list }} = softWare;
    const _this = this;
    const {
        versionName,
        note,
        projectName,
        versionId,
        updateFlag,
        updateDetail,
    } = values;
    const { modalData:{files, title, packageSize,id}, editionList} = this.state;
    let edition,platform = _platform, data = null;
    if( onRef ){
      data = list;
    }else{
      data = editionList;
    }
    for(let i = 0; i < data.length; i++){
      if(data[i].name == projectName){
        edition = data[i].edition;
        if( onRef ) platform = data[i].platform;
        break;
      }
    }
    let params = {
      versionName,
      note,
      projectName,
      platform,
      versionId,
      edition,
      updateFlag,
      updateDetail,
      packageSize
    }
    if(title == '新增'){
      if(Object.keys(files).length == 1){
        message.error('请选择上传文件')
        return;
      }
      const formData = new FormData();
      let size = files.size;
      formData.append('packageFile',files);
      formData.append('platform',platform);
      this.props.dispatch({
        type:'softWare/uploadFile',
        payload:formData,
        callback:res=>{
          if(res.code == 0){
            params.appUrl = res.message;
            params.packageSize = size;
            _this.submitVersion(params)
          }else{
            message.error(res.message||`${title}提交失败`);
          }
        }
      })
    }else{
      params.id = id;
      if( Object.keys(files).length != 1 ){
        const formData = new FormData();
        let size = files.size;
        formData.append('packageFile',files);
        formData.append('platform',platform);
       
        this.props.dispatch({
          type:'softWare/uploadFile',
          payload:formData,
          callback:res=>{
            if(res.code == 0){
              params.appUrl = res.message;
              params.packageSize = size;
              _this.submitVersion(params)
            }else{
              message.error(res.message||`${title}提交失败`);
            }
          }
        })
      }else{
        params.appUrl = files.name;
        _this.submitVersion(params);
      }
      
    }
      
  }
  // 提交新增、修改
  submitVersion = ( params ) => {
    const { modalData:{title}} = this.state;
    let apiUrl = title == '新增' ? 'softWare/AddSoftVersionItem' : 'softWare/modlSoftVersionItem';
    this.props.dispatch({
      type:apiUrl,
      payload:{
        mcProjectVersion:{
          ...params
        }
      },
      callback:res=>{
        if(res.code == 0){
          message.success(`${title}成功`);
          this.getData();
          this.onCancel();
        }else{
          message.error(res.message||`${title}失败`);
        }
      }
    })
  }
  // 删除
  deleteItem = ( row ) => {
    const { id } = row;
    this.props.dispatch({
      type:'softWare/deleteSoftVersion',
      payload:{
        id
      },
      callback:res=>{
        if(res.code == 0){
          message.success('删除成功')
          this.getData();
        }else{
          message.error(res.message || '删除失败')
        }
      }
    })
  }
  // 切换Tab
  handleTab = (key) => {
    const { editionList } = this.state;
    let item = editionList.filter(item=>item.edition == key);
    this.setState({
      edition:item[0].edition,
      tabName:item[0].name
    },()=>{ this.reset() })
  }
  render() {
    const { loading, softWare, onRef } = this.props;
    const { version:{list=[],pageList:{ total = 0,dataList=[]}} } = softWare;
    const {  page, pageSize, editionList } = this.state;
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
    const events = {
      onCancel:this.onCancel,
      editorOk:this.editorOk,
      slelectFile:this.slelectFile
    }

    let selectProject = onRef ? list : editionList;
    
    const columns = [
      {
        title:'编号',
        key:'id',
        width:100,
        dataIndex:'id',
        fixed: 'left',
      },{
        title:'项目',
        key:'projectName',
        dataIndex:'projectName'
      },{
        title:'版本名称',
        key:'versionName',
        dataIndex:'versionName'
      },{
        title:'版本号',
        key:'versionId',
        dataIndex:'versionId',
      },{
        title:'强制更新',
        key:'updateFlag',
        dataIndex:'updateFlag',
        render:key=>{
          let text = key == 0 ? '否' : (key == 1 ? '是' : '未知');
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
          return  key ? <a href={key}>点击下载</a> : '无';
        }
      },{
        title:'备注',
        key:'note',
        dataIndex:'note',
        width:200,
        render:key=>key||'--'
      },{
        title:'更新详情',
        width:300,
        key:'updateDetail',
        dataIndex:'updateDetail',
        render:key=> key||'--'
      },{
        title:'更新时间',
        key:'updateTime',
        dataIndex:'updateTime',
        width:170,
        render:key=>{
          return moment(key).format('YYYY-MM-DD HH:mm:ss')
        }
      },{
        title:'操作',
        key:'todo',
        width:120,
        fixed: 'right',
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
        <div>
          {
            onRef ? (<div>
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
                scroll={{ x: 1720 }}
              />
              </div>
            ) : (
                  <Tabs 
                      defaultActiveKey={editionList[0].name} 
                      tabBarGutter={10} 
                      type='card'
                      onChange={this.handleTab}
                  >                        
                    {
                      editionList.map(item=>{
                        return (
                          <TabPane tab={item.name} key={item.edition}>
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
                              scroll={{ x: 1660 }}
                            />
                          
                          </TabPane>
                        )
                      })
                    }
                  </Tabs>)
              }
          <AddSoftVersion width={800} data={{...this.state.modalData,loading, selectProject}} {...events}/>
        </div>
    );
  }
}
