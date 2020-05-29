import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { 
  Card, 
  Form, 
  Input, 
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  Table,
} from 'antd';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './PromotionManage.less';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const _TYPE={
  '0':'单张小图',
  '1':'单张大图',
  '2':'多张小图',
  '3':'视频文字',
  '4':'大视频',
}
const _POSITION={
  '0':'头条',
  '1':'娱乐',
  '2':'笑话',
  '3':'国际',
  '4':'段子',
  '5':'问答',
  '6':'图片',
  '20':'视频',
}
const _MODE={
  '0':'CPA',
  '1':'CPS',
  '2':'CPC',
  '3':'CPM',
  '4':'CPD',
  '5':'CPT',
  '6':'CPI',
}
@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
}))
export default class PromotionManage extends PureComponent{
  
  state = {
    title:'', //标题
    viceTitle:'', //副标题
    type:'-1', //形式
    position:'-1', //位置
    mode:'-1', //模式
    range:'-1',  //范围
    status:'-1', //状态
    beginDay:null,   //开始时间
    endDay:null,   //结束时间
    index:0, //默认0 第一页
    size:20,  //每页默认20条
  }

  componentWillMount(){
    const history = JSON.parse(sessionStorage.getItem('searchData'));
    if(history){
      if(history.type == 'PromotionManage'){
        this.setState({
          ...history.data,
        });
      }
      sessionStorage.removeItem('searchData');
    }
   
  }

  componentDidMount(){
    // 读缓存每页条数
    let size = sizeType(this.state.size,this.props);
     this.props.dispatch({
       type:'platformManage/queryPromotion',
       payload:{
         ...this.state,
         size,
       },
     })
  }
  // 提交表单
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { index, size } = this.state;
      let beginDay = fieldsValue.time[0] ? fieldsValue.time[0].format('YYYY-MM-DD'):null;
      let endDay = fieldsValue.time[1] ? fieldsValue.time[1].format('YYYY-MM-DD'):null;
      
      const prames = {
        title:fieldsValue.title,
        viceTitle:fieldsValue.viceTitle, 
        type:fieldsValue.type, 
        position:fieldsValue.position, 
        mode:fieldsValue.mode,
        range:fieldsValue.range, 
        status:fieldsValue.status, 
        beginDay,  
        endDay, 
        index,
        size,
      };
      this.setState({
        ...prames,
      });
      dispatch({
        type:'platformManage/queryPromotion',
        payload:{
          ...prames,
        },
      });
    })
  }
  //重置查询
  reset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    const prames = {
      title:'', 
      viceTitle:'', 
      type:'-1', 
      position:'-1',
      mode:'-1', 
      range:'-1',
      status:'-1',
      beginDay:null, 
      endDay:null,
      index:0,
      size:20, 
    };
    this.setState({
      ...prames,
    })
    dispatch({
      type:'platformManage/queryPromotion',
      payload:{
        ...prames,
      },
    })
  } 
  // 添加
  AddItem = () => {
    const params = { ...this.state };
    sessionStorage.setItem('searchData',JSON.stringify({data:{...params},type:'PromotionManage'}));
    this.props.history.push({
      pathname: '/platformManage/add-promotion/0'
    });
  }
  // 查询表单Dom
  renderSearchForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { title, viceTitle, type, position, mode, range, status, beginDay, endDay,
      index, size} = this.state;
    const dateFormat = "YYYY-MM-DD";
    const time1 = beginDay ? moment(beginDay, dateFormat) : null;
    const time2 = endDay ? moment(endDay, dateFormat) : null;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    return (
      <Form onSubmit={this.handleSearch}>
          <dl className={styles.search}>
            <dd style={{width:300}}>
              <FormItem
                label="标题"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                >
                {getFieldDecorator('title', {initialValue:title,})(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </dd>
            <dd style={{width:300}}>
              <FormItem
                label="副标题"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                >
                {getFieldDecorator('viceTitle', {initialValue:viceTitle,})(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                label="形式"
                {...formItemLayout}
                >
                {getFieldDecorator('type', {initialValue:type,})(
                  <Select >
                    <Option value="-1">全部</Option>
                    <Option value="0">图片文字</Option>
                    <Option value="1">单张大图</Option>
                    <Option value="2">多张大图</Option>
                    <Option value="3">视频文字</Option>
                    <Option value="4">大视频</Option>
                  </Select>
                )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                  label="位置"
                  {...formItemLayout}
                  >
                  {getFieldDecorator('position', {initialValue:position,})(
                    <Select >
                      <Option value="-1">全部</Option>
                      <Option value="0">头条</Option>
                      <Option value="1">娱乐</Option>
                      <Option value="2">笑话</Option>
                      <Option value="3">国际</Option>
                      <Option value="4">段子</Option>
                      <Option value="5">问答</Option>
                      <Option value="6">图片</Option>
                      <Option value="20">视频</Option>
                    </Select>
                  )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                label="模式"
                {...formItemLayout}
                >
                {getFieldDecorator('mode', {initialValue:mode,})(
                  <Select >
                    <Option value="-1">全部</Option>
                    <Option value="0">CPA</Option>
                    <Option value="1">CPS</Option>
                    <Option value="2">CPC</Option>
                    <Option value="3">CPM</Option>
                    <Option value="4">CPD</Option>
                    <Option value="5">CPT</Option>
                    <Option value="6">CPI</Option>
                  </Select>
                )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                label="范围"
                {...formItemLayout}
                >
                {getFieldDecorator('range', {initialValue:range,})(
                  <Select >
                    <Option value="-1">所有</Option>
                    <Option value="0">IOS</Option>
                    <Option value="1">Android</Option>
                    <Option value="2">全部</Option>
                  </Select>
                )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                label="状态"
                {...formItemLayout}
                >
                {getFieldDecorator('status', {initialValue:status,})(
                  <Select >
                    <Option value="-1">全部</Option>
                    <Option value="0">待投放</Option>
                    <Option value="1">投放中</Option>
                    <Option value="2">已过期</Option>
                  </Select>
                )}
              </FormItem>
            </dd>
            <dd style={{width:300}}>
              <FormItem
                label="时间"
                labelCol={{span:3}}
                wrapperCol={{span:21}}
                >
                {getFieldDecorator('time', {initialValue:[time1,time2],})(
                  <RangePicker
                    format={dateFormat}
                  />
                )}
              </FormItem>
            </dd>
            {/* <dd>
              <FormItem
                label="开始时间"
                labelCol={{span:8}}
                wrapperCol={{span:16}}
                >
                {getFieldDecorator('beginDay', {initialValue:beginDay,})(
                  <DatePicker />
                )}
              </FormItem>
            </dd>
            <dd>
              <FormItem
                label="结束时间"
                labelCol={{span:8}}
                wrapperCol={{span:16}}
                >
                {getFieldDecorator('endDay', {initialValue:endDay,})(
                  <DatePicker />
                )}
              </FormItem>
            </dd> */}
            <dd style={{width:300}}>
                <Button type="primary" htmlType='submit'>查询</Button>
                <Button onClick={this.reset.bind(this)}>重置</Button>
                <Button type="primary" onClick={this.AddItem}>添加</Button>
            </dd>
          </dl>
      </Form>
    );
  }

  // 编辑
  edit = (row) => {
    const params = { ...this.state };
    sessionStorage.setItem('searchData',JSON.stringify({data:{...params},type:'PromotionManage'}));
    this.props.history.push({
      pathname: '/platformManage/add-promotion/'+row.id,
    });
  }
  // 分页
  handlePage = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    sizeChange(pageSize, this.props);
    const params = {
      ...this.state,
      index:current-1,
      size:pageSize,
    };
    this.setState(params);
    dispatch({
      type:'platformManage/queryPromotion',
      payload:{
        ...params,
      },
    })
  }
  render(){
    const { promotionData, loading, pagination } = this.props.platformManage;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns=[
      {
        key:'title',
        title:'标题',
        dataIndex:'title',
        width:500,
      },{
        key:'type',
        title:'形式',
        width:100,
        render:(key,row)=>{
          return <div>{_TYPE[row.type]}</div>
        },
      },{
        key:'mode',
        title:'模式',
        width:80,
        render:(key,row)=>{
          return <div>{_MODE[row.mode]}</div>
        },
      },{
        key:'position-rank',
        title:'位置/排序',
        width:106,
        render:(key,row)=>{
          return <div>{_POSITION[row.position]+'/'+row.sort}</div>;
        }
      },{
        key:'link',
        title:'广告链接',
        render:(key,row)=>{
          let aLink = row.link ? `http://${row.link}` : `javascript:void(0)`;
          return <div><a href={aLink} target='_blank'>{row.link||'--'}</a></div>;
        }
      },{
        key:'status',
        title:'状态',
        width:80,
        render:(key,row)=>{
          let text = null;
          const nowTime = parseInt(new Date().getTime());
          if(row.startTime>nowTime){
            text = <span style={{color:'#23b929'}}>待投放</span>;
          }else if(row.endTime>nowTime && nowTime>row.startTime){
            text = <span style={{color:'blue'}}>投放中</span>;
          }else if(nowTime>row.endTime){
            text = <span style={{color:'red'}}>已过期</span>;
          }
          return <div>{text}</div>
        },
      },{
        key:'time',
        title:'时间',
        width:320,
        render:(key,row)=>{
          let startTime = row.startTime ? moment(row.startTime).format(dateFormat) : '';
          let endTime = row.endTime ? moment(row.endTime).format(dateFormat) : '';
          return (
            <div>
              {startTime}
              <span>&nbsp;-&nbsp;</span>
              {endTime}
            </div>
          );
        },
      },{
        key:'edit',
        title:'操作',
        width:80,
        render:(key,row)=>{
          return (
            <div>
              <a href="javascript:void(0)" onClick={this.edit.bind(this,row)}>编辑</a>
            </div>
          );
        }
      },
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          {this.renderSearchForm()}
          <div className={styles.table}>
              <Table 
                rowKey="id"
                loading={loading}
                dataSource={promotionData}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handlePage}
                scroll={{x:1600}}
              />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
