import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { 
  Card, 
  Form, 
  Input , 
  Button, 
  Select, 
  DatePicker,
  Switch,
  Table, 
  Spin,
} from 'antd';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './SpeedMange.less';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const _LINE = {
  '0':'HK-HKT',
  '1':'HK-PCCW',
  '2':'HK-HKBN',
  '3':'HK-WTT',
  '4':'HK-CN2',
  '5':'MO-CTM',
  '6':'USA-CN2 GIA',
  '7':'USA-CN2 GT',
};
const _NETWORK = {
  '0':'2/3/4G',
  '1':'宽带',
};
const _NETWORKTYPE = {
  '0':'联通',
  '1':'电信',
  '2':'移动',
  '3':'其他',
};
const _NETWORKCONFIG = {
  '0':'全部',
  '1':'电信/电信',
  '2':'电信/联通',
  '3':'电信/移动',
};
const _LOAD = {
  '0':'推荐负载',
  '1':'负载',
};


@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
}))
export default class SpeedMange extends PureComponent{
  state = {
    formValus:{
      name:'', 
      line:'-1', 
      network:'-1', 
      networkConfig:'-1', 
      grade:'-1', 
      status:'-1',
      beginDay:null,
      endDay:null,
      index:0,
      size:20,
    }
  }
  componentWillMount(){
    const history = JSON.parse(sessionStorage.getItem('searchData'));
    if(history){
      if(history.type == 'speedManage'){
        this.setState({
          formValus:{...history.data}
        });
      }
      sessionStorage.removeItem('searchData');
    }
    const { dispatch } = this.props;
    //  查询开关
    dispatch({
      type:'platformManage/switchSpeed',
      payload:{},
      callback:(res)=>{
        let switchBool = null;
        if(res.networkSpeedSwitch==1){
         switchBool = true;
        }else{
         switchBool = false;
        }
         this.setState({
           switchBool,
         });
      }
    });
  }
  componentDidMount(){
     const { dispatch } = this.props;
       // 读缓存每页条数
       let size = sizeType(this.state.formValus.size,this.props);
    //  加速列表
     dispatch({
      type:'platformManage/submitForm',
      payload:{
        ...this.state.formValus,
        size,
      },
    })
  }
  // 加速开关控制
  handleSwitch = (e) => {
    const { dispatch } = this.props;
    let switchBool = e;
    let networkSpeedSwitch;
    if(switchBool){
      networkSpeedSwitch = 1;
    }else{
      networkSpeedSwitch = 0;
    }
    dispatch({
      type:'platformManage/updateSwitch',
      payload:{
        networkSpeedSwitch,
      },
      callback:(res)=>{
        this.setState({switchBool:e});
      }
    });

    
  }
  // 提交表单=>筛选
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { formValus:{index, size} } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      const beginDay = fieldsValue.time[0] ? fieldsValue.time[0].format('YYYY-MM-DD'):null;
      const endDay = fieldsValue.time[1] ? fieldsValue.time[1].format('YYYY-MM-DD'):null;
      const params = {
        name:fieldsValue.name,
        line:fieldsValue.line,
        network:fieldsValue.network,
        networkConfig:fieldsValue.networkConfig,
        grade:fieldsValue.grade,
        status:fieldsValue.status,
        beginDay,
        endDay,
        index,
        size,
      };
      this.setState({
        formValus:{...params},
      });
      dispatch({
        type:'platformManage/submitForm',
        payload:{
          ...params,
        },
      })
    })
  }
  // 表单Dom
  formDom = () => {
    const { getFieldDecorator } = this.props.form;
    const { name, line, network, networkConfig, grade, status, beginDay, endDay } = this.state.formValus;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const dateFormat = 'YYYY/MM/DD';
    const time1 = beginDay ? moment(beginDay, dateFormat):null;
    const time2 = endDay ? moment(endDay, dateFormat):null;
    
    return (
      <Form onSubmit={this.handleSearch}>
      <dl className={styles.search}>
        <dd style={{width:300}}>
          <FormItem
            label="名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            >
            {getFieldDecorator('name', {initialValue:name,})(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
            label="线路"
            {...formItemLayout}
            >
            {getFieldDecorator('line', {initialValue:line,})(
              <Select >
              <Option value="-1">全部</Option>
              <Option value="0">HK-HKT</Option>
              <Option value="1">HK-PCCW</Option>
              <Option value="2">HK-HKBN</Option>
              <Option value="3">HK-WTT</Option>
              <Option value="4">HK-CN2</Option>
              <Option value="5">MO-CTM</Option>
              <Option value="6">USA-CN2 GIA</Option>
              <Option value="7">USA-CN2 GT</Option>
            </Select>
            )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
            label="网络"
            {...formItemLayout}
            >
            {getFieldDecorator('network', {initialValue:network,})(
              <Select >
                <Option value="-1">全部</Option>
                <Option value="0">2/3/4G</Option>
                <Option value="1">宽带</Option>
              </Select>
            )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
              label="配置"
              {...formItemLayout}
              >
              {getFieldDecorator('networkConfig', {initialValue:networkConfig,})(
                <Select >
                  <Option value="-1">所有</Option>
                  <Option value="0">全部</Option>
                  <Option value="1">电信/电信</Option>
                  <Option value="2">电信/联通</Option>
                  <Option value="3">电信/移动</Option>
                </Select>
              )}
          </FormItem>
        </dd>
        <dd>
          <FormItem
            label="等级"
            {...formItemLayout}
            >
            {getFieldDecorator('grade', {initialValue:grade,})(
              <Select >
                <Option value="-1">全部</Option>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
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
            labelCol={{span:4}}
            wrapperCol= {{span:20}}
            >
            {getFieldDecorator('time', {initialValue:[time1, time2],})(
              <RangePicker
              format={dateFormat}
            />
            )}
          </FormItem>
        </dd>
        <dd style={{width:300,marginBottom:24}}>
            <Button type="primary" htmlType='submit'>查询</Button>
            <Button onClick={this.reset.bind(this)}>重置</Button>
            <Button type="primary" onClick={this.AddItem}>添加</Button>
        </dd>
      </dl>
  </Form>
    );
  }
  // 重置
  reset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    const params = {
      name:'', 
      line:'-1', 
      network:'-1', 
      networkConfig:'-1', 
      grade:'-1', 
      status:'-1',
      beginDay:null,
      endDay:null,
      index:0,
      size:20,
    };
    this.setState({
      formValus:{
        ...params,
      }
    })
     //  加速列表
     dispatch({
      type:'platformManage/submitForm',
      payload:{
        ...params,
      },
    })
  }
  // 添加
  AddItem = () => {
    const { formValus } = this.state;
    sessionStorage.setItem('searchData',JSON.stringify({data:{...formValus},type:'speedManage'}));
    this.props.history.push({
      pathname: '/platformManage/add-speed/0',
    });
  }
  // 分页
  handlePage = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { formValus } = this.state;
    sizeChange(pageSize, this.props);
    const params = {
      name:formValus.name,
      line:formValus.line,
      network:formValus.network,
      networkConfig:formValus.networkConfig,
      grade:formValus.grade,
      status:formValus.status,
      beginDay:formValus.beginDay,
      endDay:formValus.endDay,
      index:current-1,
      size:pageSize,
    };
    this.setState({
      formValus:{...params},
    });
    dispatch({
      type:'platformManage/submitForm',
      payload:{
        ...params,
      },
    })
  }
  // 编辑
  handleEdit = (row) => {
    const { formValus } = this.state;
    sessionStorage.setItem('searchData',JSON.stringify({data:{...formValus},type:'speedManage'}));
    this.props.history.push({
      pathname: '/platformManage/add-speed/'+row.id,
    });
  }
  render(){
    const { switchBool } = this.state;
    const { speedData, loading, loadingSpin, pagination } = this.props.platformManage;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns=[
      {
        key:'name',
        title:'名称',
        dataIndex:'name',
      },{
        key:'circuit',
        title:'线路',
        render:(index, row)=>{
          return <div>{_LINE[row.line]}</div>
        }
      },{
        key:'nework',
        title:'网络',
        render:(index, row)=>{
          return <div>{_NETWORK[row.network]}</div>
        }
      },{
        key:'configure',
        title:'配置',
        render:(index, row)=>{
          return <div>{_NETWORKCONFIG[row.networkConfig]}</div>
        }
      },{
        key:'laod',
        title:'负载',
        render:(index, row)=>{
          return <div>{_LOAD[row.load]}</div>
        }
      },{
        key:'level',
        title:'等级',
        dataIndex:'grade',
      },{
        key:'status',
        title:'状态',
        render:(index, row)=>{
          let text = null;
          const nowTime = parseInt(new Date().getTime());
          if(row.beginTime>nowTime){
            text = <span style={{color:'#23b929'}}>待投放</span>;
          }else if(row.endTime>nowTime && nowTime>row.beginTime){
            text = <span style={{color:'blue'}}>投放中</span>;
          }else if(nowTime>row.endTime){
            text = <span style={{color:'red'}}>已过期</span>;
          }
          return <div>{text}</div>
        }
      },{
        key:'time',
        title:'时间',
        render:(index, row)=>{
          let startTime = row.beginTime ? moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss') : null; 
          let endTime = row.endTime ? moment(row.endTime).format('YYYY-MM-DD HH:mm:ss') : null; 
          return <div>{startTime+' -- '+endTime}</div>
        }
      },{
        key:'todo',
        title:'操作',
        render:(index, row)=>{
          return <a href='javascript:void(0)' onClick={this.handleEdit.bind(this,row)}>编辑</a>
        }
      }
    ];
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.speed_top}>
            <div className={styles.box}>
              <Spin spinning={loadingSpin} style={{right:20}}>
                <span className={styles.text}>加速管理</span><Switch checkedChildren="开" unCheckedChildren="关" checked={switchBool} onChange={this.handleSwitch} />
              </Spin>
            </div>
          </div>
          <div className={styles.formDom}>
            {this.formDom()}
          </div>
          <div className={styles.table}>
            <Table 
              dataSource={speedData}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              onChange={this.handlePage}
            />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
