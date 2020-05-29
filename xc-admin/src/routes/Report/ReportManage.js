import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { 
  Card, 
  Form, 
  Modal, 
  Button, 
  Row,
  Col,
  Table, 
  Input, 
  message,
  Select,
  Badge,
  Spin, 
} from 'antd';
import AddReportAlert from '../../components/AddReportAlert';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './ReportManage.less';
const {Option} = Select;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
};
const formItemLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}
message.config({
  duration: 1,
  maxCount: 1,
});
const FormItem = Form.Item;
const NOCHILDCITY = [
  '北京市','上海市','天津市','重庆市'
];
const PAPERTYPE = [
  {
    key:'',
    name:'全部',
  },{
    key:'0',
    name:'省报',
  },{
    key:'1',
    name:'市报',
  },{
    key:'2',
    name:'县报',
  },{
    key:'3',
    name:'国报',
  }
];
@Form.create()
@connect(state => ({
  report: state.report,
}))
export default class ReportManage extends PureComponent{
  state = {
    size:10,
    index:0,
    formValue:{
      pageName:'',
      status:'',
      provinceNumber:'',
      cityNumber:'',
      paperType:'',
    },
    addData:{
      visible:false,
      row:{},
    },
    tryGet:{
      visible:false,
    },
  }
  componentDidMount(){
    this.queryList();
  }
  componentWillMount(){
    this.queryProvince();
  }
  
  // 查询列表
  queryList = () => {
    const { dispatch } = this.props;
    const {index, formValue} = this.state;
    const size = sizeType(this.state.size, this.props);
    dispatch({
      type:'report/ReportManage',
      payload:{
        index,
        size,
        ...formValue,
      },
    });
  }

  // 初始化省
  queryProvince = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'report/queryProvince',
      payload:{},
    });
  
  }

// 表格分页
handleTbale = (pagination, filters, sorter) => {
  const index = pagination.current-1;
  const size = pagination.pageSize;
  const { formValue } = this.state;
  sizeChange(size, this.props);
  this.setState({
    index,
    size,
  });
  this.props.dispatch({
    type:'report/ReportManage',
    payload:{
      index,
      size,
      ...formValue,
    },
  });
}
// 选择省
handleProvince = (e,arg) => {
  // 选择省，初始化市
  this.state.formValue.cityId = '';
  this.props.form.resetFields(['cityId']);
  const cityName = arg.props.children;
  const { dispatch } = this.props;
  if(e && NOCHILDCITY.indexOf(cityName) == -1){
    dispatch({
      type:'report/queryCity',
      payload:{
        proId:e,
      },
    });
  }else{
    dispatch({
      type:'report/removeCity',
      payload:{
        proId:e,
      },
    });
  }
}

// 提交表单
handleSubmit = (e) => {
  e.preventDefault();
  const _this = this;
  const { dispatch } = this.props;
  const {size } = this.state;
  this.props.form.validateFields((err, values) => {
   
    if (!err) { 
      const { pageName, status, paperType, provinceNumber, cityNumber } = values;
      this.setState({
        index:0,
        formValue:{
          ...values,
        }
      });
      dispatch({
        type:'report/ReportManage',
        payload:{
          index:0,
          size,
          pageName,
          provinceNumber,
          cityNumber,
          paperType,
          status,
        },
      });
    }
  });
}
// 重置表单
handleFormReset = () => {
  const { form, dispatch } = this.props;
  form.resetFields();
  const formValue = {
    pageName:'',
    status:'',
    paperType:'',
    provinceNumber:'',
    cityNumber:'',
  };
  this.setState({
    index:0,
    size:10,
    formValue,
  });
  dispatch({
    type:'report/ReportManage',
    payload:{
      index:0,
      size:10,
      ...formValue,
    },
  });
}
// 搜索表单
formHtml = () => {
  const { provinceData, cityData, typeData } = this.props.report;
  const { formValue:{pageName, provinceNumber, cityNumber, status, paperType}} = this.state;
  const { getFieldDecorator } = this.props.form;

  let provinceOption = []; //省下拉数据
  let cityOption = [];  //市下拉数据
  let typeOption = []; //分类下拉数据
  provinceOption.push(<Option key='-1' value=''>全部</Option>);
  cityOption.push(<Option key='-1' value=''>全部</Option>);
 
  if(provinceData){
    for(let i=0;i<provinceData.length;i++){
      provinceOption.push(<Option key={provinceData[i].provinceNumber} value={provinceData[i].provinceNumber}>{provinceData[i].province}</Option>);
    }
  }
  if(cityData){
    for(let i=0;i<cityData.length;i++){
      cityOption.push(<Option key={cityData[i].cityNumber} value={cityData[i].cityNumber}>{cityData[i].city}</Option>);
    }
  }
  if(PAPERTYPE){
    for(let i=0;i<PAPERTYPE.length;i++){
      typeOption.push(<Option key={PAPERTYPE[i].key} value={PAPERTYPE[i].key}>{PAPERTYPE[i].name}</Option>);
    }
  }
  return (
    <Form onSubmit={this.handleSubmit}>
      <dl className={styles.search}>
          <dd style={{width:300}}>
              <FormItem
                label="名称"
                {...formItemLayout}
              >
                {getFieldDecorator('pageName', {
                  initialValue:pageName,
                })(
                  <Input  placeholder="输入名称"/>
                )}
              </FormItem>
          </dd>
          <dd style={{width:240}}>
              <FormItem
                label="选择省"
                {...formItemLayout2}
              >
                {getFieldDecorator('provinceNumber', {
                  initialValue:provinceNumber,
                })(
                  <Select onChange={this.handleProvince}>
                    {provinceOption}
                  </Select>
                )}
              </FormItem>
          </dd>
          <dd style={{width:240}}>
              <FormItem
                label="选择市"
                {...formItemLayout2}
              >
                {getFieldDecorator('cityNumber', {
                  initialValue:cityNumber,
                })(
                  <Select onChange={this.handleCity}>
                    {cityOption}
                  </Select>
                )}
              </FormItem>
          </dd>
          <dd>
              <FormItem
                label="分类"
                {...formItemLayout2}
              >
                {getFieldDecorator('paperType', {
                  initialValue:paperType,
                })(
                  <Select>
                    {typeOption}
                  </Select>
                )}
              </FormItem>
          </dd>
          <dd>
              <FormItem
                label="状态"
                {...formItemLayout2}
              >
                {getFieldDecorator('status', {
                  initialValue:status,
                })(
                  <Select>
                    <Option value=''>全部</Option>
                    <Option value='0'>正常</Option>
                    <Option value='1'>链接失败</Option>
                    <Option value='2'>待抓取</Option>
                  </Select>
                )}
              </FormItem>
          </dd>
          {/* <dd style={{width:210}}>
              <FormItem
                label="抓取状态"
                labelCol={{span:8}}
                wrapperCol={{span:14}}
              >
                {getFieldDecorator('grabStatus', {
                  initialValue:grabStatus,
                })(
                  <Select>
                  <Option value='-1'>全部</Option>
                  <Option value='0'>正常</Option>
                  <Option value='1'>失败</Option>
                </Select>
                )}
              </FormItem>
          </dd> */}
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

// 选择省
selectProvince = (id) =>{
  
  const { dispatch } = this.props;
  dispatch({
    type:'report/selectCity',
    payload:{
      proId:id,
    },
  });  
}
// 选择市
selectCity = (id) => {
  const { dispatch } = this.props;
  dispatch({
    type:'report/selectCity',
    payload:{
      proId:id,
    },
  });
}

// 修改按钮
modifyData = (row) => {
  this.setState({
    addData:{
      title:'修改数据',
      visible:true,
      row:{
        ...row
      }
    }
  });
  this.selectCity(row.proId);
}
// 试抓取按钮
tryGet = (row) => {
  const { dispatch } = this.props;
  const { tryGet } = this.state;
  const _this = this;
  dispatch({
    type:'report/queryTryGet',
    payload:{
      paperId:row.id,
    },
    callback:(res)=>{
      if(res.code == 0){
        _this.setState({
          tryGet:{
            ...tryGet,
            visible:true,
          }
        });
      }else{
        message.error(res.message);
      }
    }
  });

}
// 抓取弹框内容
tyrGetHtml = () =>{
  const { tryGetData } = this.props.report;
 
  return (
    tryGetData ?
    <Row className={styles.content}>
      <Col className={styles.item}><span>content:</span><p>{tryGetData.content+''||'--'}</p></Col>
      <Col className={styles.item}><span>message:</span><p>{tryGetData.message+''||'--'}</p></Col>
      <Col className={styles.item}><span>url:</span><p>{tryGetData.url+''||'--'}</p></Col>
    </Row> :
    null
  );
}
// 关闭抓取按钮
closeTryGet = () => {
  const { tryGet } = this.state;
  this.setState({
    tryGet:{
      ...tryGet,
      visible:false,
    }
  });
}
// 添加数据按钮
AddReport = () => {
  this.setState({
    addData:{
      title:'添加数据',
      visible:true,
      row:{},
    }
  });
}
// 确定添加、修改数据
handleOk = (data,id) => {
  const _this = this;
  const {  dispatch } = this.props;
  const {
    name,
    domain,
    proId,
    cityId,
    paperTypeId,
    note,
    type,
    encoding,
    pageMatcher,
    titleMatcher,
    contentMatcher,
    status,
  } = data;
  let text = '添加成功！';
  if(id){
    text = '修改成功！';
  }

 if(name && domain && type && status){
  dispatch({
    type:'report/addModItem',
    payload:{
      name,
      domain,
      proId,
      cityId,
      paperTypeId,
      note,
      type,
      encoding,
      pageMatcher,
      titleMatcher,
      contentMatcher,
      status,
      id,
    },
    callback:(res)=>{
      if(res.code == 0){
        _this.queryList();
        _this.handleCancel();
        message.success(text);
      }else{
        message.error(res.message);
      }
    }
  });
 }else{
   message.info('请完善信息再提交！');
 }
}
// 取消添加
handleCancel =() =>{
  this.setState({
    addData:{
      visible:false,
      row:{},
    }
  });
}
  render(){
    const { manageData, pagination, provinceData, selectCityData, typeData, loading } = this.props.report;
    const { tryGet:{visible}} = this.state;
    const columns = [{
      title:'ID',
      key:'id',
      dataIndex:'id',
      width:186,
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'名称',
      key:'pageName',
      dataIndex:'pageName',
      width:100,
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'网站地址',
      key:'pageUrl',
      dataIndex:'pageUrl',
      render:(key)=>{
        let aLink = <a href={key} target='_blank'>{key||'--'}</a>;
        return <div>{aLink}</div>;
      }
    },{
      title:'版面匹配正则',
      key:'pageListXpath',
      dataIndex:'pageListXpath',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'新闻列表匹配正则',
      key:'newsListXpath',
      dataIndex:'newsListXpath',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'标题匹配正则',
      key:'newsTitleXpath',
      dataIndex:'newsTitleXpath',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'内容匹配正则',
      key:'contentXpath',
      dataIndex:'contentXpath',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'省',
      width:140,
      key:'province',
      dataIndex:'province',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'市',
      width:140,
      key:'city',
      dataIndex:'city',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'分类',
      width:80,
      key:'paperTypeName',
      dataIndex:'paperTypeName',
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title:'状态',
      key:'status',
      width:100,
      dataIndex:'status',
      render:(key)=>{
        let text;
        if(key == 0){
          text = <Badge status="success" text="正常" />
        }else if(key == 1){
          text = <Badge status="error" text="连接失败" />
        }else if(key == 2){
          text = <Badge status="warning" text="待抓取" />
        }
        return <div>{text||'--'}</div>;
      }
    }];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            <div className={styles.report}>
                { this.formHtml() }
                <div className={styles.table}>
                  <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={manageData}
                    loading={loading}
                    scroll={{x:1600}}
                    onChange={this.handleTbale}
                    pagination={pagination}
                  />
                </div>
            </div>
           <AddReportAlert 
            data={this.state.addData}
            provinceData={provinceData}
            cityData={selectCityData}
            typeData={typeData}
            selectProvince={this.selectProvince}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
           />
           <Modal
            visible={visible}
            destroyOnClose={true}
            maskClosable={false}
            onCancel={this.closeTryGet}
            footer={null}
           >
            {this.tyrGetHtml()}
            <p style={{textAlign:'center'}}>
              <Button type='primary' onClick={this.closeTryGet}>关闭</Button>
            </p>
           </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
