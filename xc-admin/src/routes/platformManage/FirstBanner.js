import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { History  } from 'react-router';
import moment from 'moment';
import { connect } from 'dva';
import { 
  Card,
  Form, 
  Input, 
  Button,
  Row,
  Col,
  Icon,
  message,
  Select,
  Badge, 
  Table,
  Spin,
  Popover,
} from 'antd';
import styles from './FirstBanner.less';
import AddOrUpdateBanner from '../../components/AddOrUpdateBanner';
import AlertTips from '../../components/AlertTips';
import { sizeType, sizeChange } from '../../components/SizeSave';

message.config({
  top: 100,
  duration: 1,
  maxCount: 1,

});
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
   span:8
  },
  wrapperCol: {
   span:16
  },
};
const format = 'YYYY-MM-DD HH:mm:ss';
@Form.create()
@connect(state => ({
  firstBanner: state.firstBanner,
}))
export default class FirstBanner extends Component{
  
  state = {
    productType:'',
    status:'',
    index:1,
    size:10,
    selectRow:[],
    device:'2',
    data:{
      title:'',
      visible:false,
      device:'2',
      label:false,
      banner:{item1:[],item2:[],item3:[]},
    },
    alertTips:{
      title:'删除',
      visible:false,
      html:'',
    },
    value:'',
  };

  componentDidMount(){
      this.queryList();
      this.queryProduct();
  }
 
  // 查询产品接口
  queryProduct = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'firstBanner/queryProduct',
      payload:{
      },
    });
  }

  // 查询广告列表
  queryList = () => {
    const { dispatch } = this.props;
    const { productType, status, device, index } = this.state;
    const size = sizeType(this.state.size, this.props);
    let status_int;
    // 状态传整型
    if(!status){
      status_int = null; 
    }else{
      status_int = parseInt(status);
    }
    dispatch({
      type:'firstBanner/queryList',
      payload:{
        product:productType,
        status:status_int,
        range:parseInt(device),
        index,
        size,
      },
    });
  }

  // 查询列表内容
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { size, index } = this.state;
        const { productType, status, device} = values;
        let status_int;
        // 状态传整型
        if(!status){
          status_int = null; 
        }else{
          status_int = parseInt(status);
        }
        dispatch({
          type:'firstBanner/queryList',
          payload:{
            product:productType,
            status:status_int,
            range:parseInt(device),
            index,
            size,
          },
          callback:(res)=>{
            if(res.code == 0){
              this.setState({
                product:productType,
                status:status_int,
                range:device,
              });
            }else{
              message.error(res.message);
            }
          }
        });
      }
    });
  }

  // 搜索内容
  formHtml = () => {
    const { getFieldDecorator } = this.props.form;
    const { productType, status, device } = this.state;
    const { productData } = this.props.firstBanner;
    const porductOption = [];
    porductOption.push(
      <Option key='-1' value=''>全部</Option>
    );
   
    if(productData && productData.length){
      for(let i=0;i<productData.length;i++){
        porductOption.push(
          <Option key={i} value={productData[i]}>{productData[i]}</Option>
        );
      }
    }
   
    return (
      <Form onSubmit={this.handleSubmit}>
        <dl className={styles.form}>
          <dd>
              <FormItem
                label='所属产品'
                {...formItemLayout}
              >
              {getFieldDecorator('productType', {
                initialValue:productType,
              })(
                <Select>
                  {porductOption}
                </Select>
              )}
            </FormItem>
            </dd>
            <dd>
              <FormItem
                label="状态"
                {...formItemLayout}
              >
              {getFieldDecorator('status', {
                initialValue:status,
              })(
                <Select>
                  <Option value=''>全部</Option>
                  <Option value='0'>已生效</Option>
                  <Option value='1'>待生效</Option>
                </Select>
              )}
            </FormItem>
            </dd>
            <dd>
              <FormItem
                label="设备"
                {...formItemLayout}
              >
              {getFieldDecorator('device', {
                initialValue:device,
              })(
                <Select>
                  <Option value='2'>全部</Option>
                  <Option value='0'>IOS</Option>
                  <Option value='1'>Android</Option>
                </Select>
              )}
            </FormItem>
            </dd>
            <dd style={{marginLeft:30}}>
              <Button style={{marginTop:4}}  type="primary" htmlType="submit">查询</Button>
            </dd>
          </dl>
        </Form>
    );
  }
  // 添加数据
  handleAddData = () => {
    const { data } = this.state;
    this.setState({
      data:{
        ...data,
        title:'添加',
        visible:true,
        date:null,
        productType:'',
        type:'',
        banner:{item1:[],item2:[],item3:[]},
        url:'',
        id:'',
        device:'2',
        label:false,
        countDown:'',
      }
    });
  }
  // 确认添加、修改
  addNewsItem = (values,fileUrl) => {

    const { dispatch } = this.props;
    const { data } = this.state;
    const { date, productType, type, url, id, device, label, countDown } = values;
    let ifSwitch;
    let imageType;
    if(label){
      ifSwitch = 1;
    }else{
      ifSwitch = 0;
    }
    // type 0 iphoneX  1 iphone/android系列 2 android全面屏
    if(device == 2){
      imageType = '1,0,2'
    }else if(device == 0){
      imageType = '1,0';
    }else if(device == 1){
      imageType = '1,2';
    }
    // id为空，添加；id有值，修改
    let params = {
      startTime:moment(date[0]).format(format),
      endTime:moment(date[1]).format(format),
      product:productType,
      type:parseInt(type),
      linkUrl:url,
      image:fileUrl,
      range:parseInt(device),
      label:ifSwitch,
      countdown:parseInt(countDown),
      imageType,
    };
    let requestUrl;
    if(id){
      params.id = id;
      requestUrl = 'firstBanner/modifyItem';
    }else{
      requestUrl = 'firstBanner/addItem';
    }
    dispatch({
      type:requestUrl,
      payload:params,
      callback:(res)=>{
        if(res.code == 0){
          this.queryList();
          this.queryProduct();
          this.setState({
            data:{
              ...data,
              visible:false,
            }
          });
        }else{
          message.error(res.message);
        }
      }
    });
  }

  // 修改弹框
  handleModify = (row) => {
    const { data } = this.state;
    const { banner } = data;
    const urlArr = row.image.split(',');
    banner['item1'][0] =  {
      status:'done',
      uid:'001',
      url:urlArr[0]||'',
      response:{
        code:0,
        result:urlArr[0]||''
      }
    };
    banner['item2'][0] =  {
      status:'done',
      uid:'002',
      url:urlArr[1]||'',
      response:{
        code:0,
        result:urlArr[1]||''
      }
    };
    banner['item3'][0] =  {
      status:'done',
      uid:'003',
      url:urlArr[2]||'',
      response:{
        code:0,
        result:urlArr[2]||''
      }
    };
    if(row.range == 0){
      banner['item2'][0] =  {
        status:'done',
        uid:'004',
        url:urlArr[1]||'',
        response:{
          code:0,
          result:urlArr[1]||''
        }
      };
    }else if(row.range == 1){
      banner['item3'][0] =  {
        status:'done',
        uid:'005',
        url:urlArr[1]||'',
        response:{
          code:0,
          result:urlArr[1]||''
        }
      };
    }
    
    
    this.setState({
      data:{
        ...data,
        title:'修改',
        visible:true,
        date:[moment(row.startTime),moment(row.endTime)],
        productType:row.product,
        type:row.type+'',
        banner:{...banner},
        url:row.linkUrl,
        id:row.id,
        device:row.range+'',
        label:row.label,
        countDown:row.countdown,
      }
    });
  }

  // 删除内容
  handleDelete = () => {
    const { selectRow } = this.state;
    if(selectRow && !selectRow.length){
      message.info('请选择要删除的数据');
    }else{
      this.setState({
        alertTips:{
          visible:true,
          title:'删除',
          html:'是否删除选中？',
        }
      });
    }
   
  }
  //确定删除
  onOk = () => {
    const { dispatch } = this.props;
    const { selectRow } = this.state;
    dispatch({
      type:'firstBanner/deleteItem',
      payload:{
        id:selectRow.join(',')
      },
      callback:(res)=>{
        if(res.code == 0){
          message.success('删除成功');
          this.setState({
            selectRow:[],
          });
          this.queryList();
          this.onCancel();
        }else{
          message.error(res.message);
        }
      }
    });
  }

  // 取消删除
  onCancel = () => {
    this.setState({
      alertTips:{
        visible:false,
      },
    });
  }
  
  // 取消添加，修改
  handleCancel = () => {
    const { data } = this.state;
    this.setState({
      data:{
        ...data,
        visible:false,
        banner:{
          item1:[],
          item2:[],
          item3:[],
        }
      }
    });
  }
  // 表格分页
  handleChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { dispatch } = this.props;
    const { productType, status, device} = this.state;
    let status_int;
    sizeChange(pageSize,this.props);
    this.setState({
      size:pageSize,
      index:current,
    });
    // 状态传整型
    if(!status){
      status_int = null; 
    }else{
      status_int = parseInt(status);
    }
    dispatch({
      type:'firstBanner/queryList',
      payload:{
        product:productType,
        status:status_int,
        range:parseInt(device),
        index:current,
        size:pageSize,
      },
    });
  }
  // 选择删除的数据
  onSelectChange = (e) => {
    this.setState({
      selectRow:e,
    });
  }

  // 图片集
  imgDom = (key) => {
    const img = key.split(',');
    let imgdom = [];
    for(let i=0;i<img.length;i++){
      let imgDiv = <img src={img[i]} width='100%' />;
      imgdom.push(
        <div key={i+1} className={styles.imgArr}>
          <Popover placement="bottom" content={imgDiv}>
            {imgDiv}
          </Popover>
        </div>
      );
    }
    return imgdom;
  }

  render(){
    const { loading, listData, pagination  } = this.props.firstBanner;
    const { alertTips } = this.state;
    const columns = [{
      title: '编号',
      key:'number',
      width:100,
      dataIndex:'number',
    },{
      title: '所属产品',
      key:'product',
      width:200,
      dataIndex:'product',
    },{
      title: '启动页图片',
      key:'activeImg',
      dataIndex:'image',
      width:236,
      render:(key)=>{
        return <div className={styles.imgClean}>{this.imgDom(key)}</div>
      }
    },{
      title: '类型',
      key:'type',
      dataIndex:'type',
      width:100,
      render:(key)=>{
        let text;
        if(key == 0){
          text = '网页类型';
        }else if(key == 1){
          text = '应用类型';
        }
        return <div>{text}</div>;
      }
    },{
      title: '设备',
      key:'device',
      dataIndex:'range',
      width:120,
      render:(key)=>{
        let text;
        if(key == 0){
          text = 'IOS';
        }else if(key == 1){
          text = 'Android';
        }else if(key == 2){
          text = '全部';
        }
        return <div>{text}</div>;
      }
    },{
      title: '跳转',
      key:'linkUrl',
      dataIndex:'linkUrl',
      render:(key)=>{
        return <a href={'http://'+key} target="_blank">{key}</a>;
      }
    },{
      title: '日期',
      key:'time',
      width:200,
      render:(row)=>{
        return <div>{moment(row.startTime).format('YYYY/MM/DD')} - {moment(row.endTime).format('YYYY/MM/DD')}</div>;
      }
    },{
      title: '标签',
      key:'label',
      dataIndex:'label',
      width:100,
      render:(key)=>{
        return <div>{key||'--'}</div>;
      }
    },{
      title: '倒计时',
      key:'countdown',
      dataIndex:'countdown',
      width:100,
      render:(key)=>{
        return <div>{key}</div>;
      }
    },{
      title: '状态',
      key:'status',
      dataIndex:'status',
      width:100,
      render:(key)=>{
        let text;
        if(key == 0){
          text = <Badge status="success" text="已生效" />;
        }else if(key == 1){
          text = <Badge status="processing" text="待生效" />;
        }else if(key == 2){
          text = <Badge status="default" text="已过期" />;
        }
        return <div>{text}</div>;
      }
    },{
      title: '操作',
      key:'todo',
      width:80,
      render:(row)=>{
        return (<div>
          <a href="javascript:void(0)" onClick={this.handleModify.bind(this,row)}>修改</a>
        </div>);
      }
    }];
    const  rowSelection={
      key:'id',
      onChange: this.onSelectChange,
    };
  
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <Row>
            <Col className={styles.left}>
              {this.formHtml()}
            </Col>
            <Col className={styles.right}>
              <Button type="primary" onClick={this.handleAddData}><Icon type="plus" />添加启动页</Button>
            </Col>
          </Row>
          <div className={styles.table}>
            <Table 
              dataSource={listData}
              columns={columns}
              rowKey='id'
              loading={loading}
              pagination={pagination}
              onChange={this.handleChange}
              rowSelection={rowSelection}
              scroll={{y:800,x:1500}}
            />
            <Button type="primary" className={listData.length?styles.delete:styles.hide} onClick={this.handleDelete}>删除</Button>
          </div>
          
          <AlertTips
            alertTips={alertTips}
            onOk={this.onOk}
            onCancel={this.onCancel}
          />
          <AddOrUpdateBanner
            data={this.state.data}
            onCancel={this.handleCancel}
            addNewsItem={this.addNewsItem}
            />
        </Card>
			</PageHeaderLayout>
    )
  }
}
