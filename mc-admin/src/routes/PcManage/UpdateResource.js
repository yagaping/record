import React, { PureComponent } from 'react';
import {
  Form,
  Upload,
  Icon,
  Table,
  Input, 
  Card,
  Select,
  Button,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Uploadfile from './components/Uploadfile';
import moment from 'moment';
import styles from './UpdateResource.less';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ pcmanage, loading }) => ({
  pcmanage,
  loading: loading.models.pcmanage,
}))
@Form.create()
export default class UpdateResource extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    visible:false,
    operate:"",
    version:"",
    page:1,
    pageSize:10,
  };
  componentDidMount(){
     this.getData();
  }
  getData = () => {
    this.props.form.validateFields((err, values) => {
      const {  operate='', version } = values;
      const { page, pageSize } = this.state;
      this.props.dispatch({
        type:'pcmanage/query',
        payload:{
          operate:operate,
          version,
          page,
          pageSize
        }
      }) 
      
    });

    
  }
  reset = () => {
    this.props.form.resetFields();
    this.setState({
      operate:"",
      version:"",
      page:1,
      pageSize:10,
    },()=>{
      this.getData();
    })
  }
  onCancel = () => {
    this.setState({
      visible:false
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
  addItem = () => {
    this.setState({
      visible:true
    })
  }
  handleChange = (e) => {
    this.setState({
      operate:e
    })
    this.props.form.setFieldsValue({
      operate: e,
    });
  }
  searchForm(){
    const { getFieldDecorator } = this.props.form;
    const { operate, version } = this.state;
    const tailFormItemLayout = {
      wrapperCol: {
        span:16
      },
      labelCol:{
        span:6
      }
    };
   
    return (
      <Form layout="inline">
        <FormItem label="版本号"  {...tailFormItemLayout}>
            {getFieldDecorator('version',{
              initialValue:version
            })(<Input placeholder="请输入版本号" />)}
        </FormItem>
        <FormItem label="是否强制更新">
        {getFieldDecorator('operate',{
          initialValue:operate
        })(
            <Select placeholder="请选择" style={{width:150}} onChange={this.handleChange}>
                <Option value="">全部</Option>
                <Option value="0">否</Option>
                <Option value="1">是</Option>
            </Select>
        )}
        </FormItem>
        <FormItem>
            <span style={{ marginBottom: 24, marginLeft:50 }}>
                <Button type="primary" onClick={this.getData}>
                查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                重置
                </Button>
            </span>
        </FormItem>
      </Form>
    );
  }

  render() {
    const { loading, pcmanage } = this.props;
    const { data:{dataList = [], total = 0} } = pcmanage;
    const { visible, page, pageSize } = this.state;
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
        title:'版本号',
        key:'version',
        dataIndex:'version'
      },{
        title:'是否强制更新',
        key:'operate',
        dataIndex:'operate',
        render:key => key ? '是' : '否'
      },{
        title:'更新记录',
        key:'details',
        dataIndex:'details',
        render:key => key || '--'
      },{
        title:'文件地址',
        key:'address',
        dataIndex:'address',
        render:key => <a href={key} target="_blank">{key}</a>
      }
    ]
    const events = {
      onCancel:this.onCancel,
      getData:this.getData
    }
    return (
      <PageHeaderLayout title={'更新资源'}>
        <Card bordered={false}>
           { this.searchForm() }
           <div className={styles.addBtns}>
             <Button type="primary" icon="plus" onClick={this.addItem}>新增</Button>
           </div>
           <Table
            className={styles.myTable}
            style={{backgroundColor:'white',marginTop:16}}
            columns={columns} 
            dataSource={dataList} 
            pagination={pagination}
            loading={loading}
            rowKey='id'
            />
           <Uploadfile visible={visible} {...events} />
        </Card>
    </PageHeaderLayout>
    );
  }
}
