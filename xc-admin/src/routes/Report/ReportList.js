import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Modal , Button, Table, Input, message, Upload, Icon } from 'antd';
import moment from 'moment';
import { sizeType, sizeChange } from '../../components/SizeSave';
import styles from './ReportList.less';
import TextArea from '../../../node_modules/antd/lib/input/TextArea';
const DateFormate = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
message.config({
  duration: 1,
  maxCount: 1,
});
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  report: state.report,
}))
export default class ReportList extends PureComponent{
  state = {
    size:10,
    index:0,
    title:'',
    paperName:'',
    loading:false,
    visible:false,
    formVals:{
    },
  }
  componentDidMount(){
    this.queryList();
  }
  // 查询列表
  queryList = () => {
    const { dispatch } = this.props;
    const {index, paperName } = this.state;
    const size = sizeType(this.state.size, this.props);
    dispatch({
      type:'report/queryDataList',
      payload:{
        index,
        size,
        paperName,
      },
    });
  }
  // 搜索结构
  searchDom = () =>{
    const { getFieldDecorator } = this.props.form;
    const { paperName } = this.state;
    return (
      <Form onSubmit={this.handleSearch}>
        <dl>
          <dd style={{width:360}}>
            <FormItem
              label="报纸分类名"
              labelCol={{span:6}}
              wrapperCol={{span:18}}
            >
              {getFieldDecorator('paperName', {
                initialValue:paperName,
              })(
                <Input  placeholder="输入报纸分类名"/>
              )}
            </FormItem>
          </dd>
          <dd>
              <Button type='primary' htmlType="submit">查询</Button>
          </dd>  
        </dl>
    </Form>
    );
  }
// 列表搜索
handleSearch = (e) => {
  e.preventDefault();
  const { dispatch, form } = this.props;
  form.validateFields((err, values) => {
    const { size, index } = this.state;
    const { paperName } = values;
    this.setState({
      paperName,
    });
    dispatch({
      type:'report/queryDataList',
      payload:{
        index,
        size,
        paperName,
      },
    });
  })
}

// 表格分页
handleTbale = (pagination, filters, sorter) => {
  const index = pagination.current-1;
  const size = pagination.pageSize;
  sizeChange(size,this.props);
  this.setState({
    index,
    size,
  });
  this.props.dispatch({
    type:'report/queryDataList',
    payload:{
      index,
      size,
    },
  });
}

// 添加报纸按钮
AddReport = () => {
  this.setState({
    title:'添加报纸',
    visible:true,
    formVals:{},
  });
}


handleChange = (info) => {
  const { formVals } = this.state;
  if (info.file.status === 'uploading') {
    this.setState({ loading: true });
    return;
  }
  if (info.file.status === 'done') {
    this.setState({
      formVals:{
        ...formVals,
        logoUrl:info.file.response.result,
      },
      loading: false,
    })
  }
}

// 添加报纸内容
openHtml = () => {
  const { getFieldDecorator } = this.props.form;
  const { visible,formVals:{typeName, introduce, logoUrl } } = this.state;
  const uploadButton = (
    <div>
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    </div>
  );
  return (
    <Form onSubmit={this.handleSubmit}>
      <FormItem
        label="报纸分类"
        {...formItemLayout}
      >
        {getFieldDecorator('typeName', {
          initialValue:typeName,
          rules: [{ required: visible, message: '请输入报纸分类!' }],
        })(
          <Input  placeholder="输入报纸分类"/>
        )}
      </FormItem>
      <FormItem
        label="LOGO"
        {...formItemLayout}
      >
        {getFieldDecorator('logoUrl', {
          initialValue:logoUrl,
        })(
          <Upload
          action="/work-api/work/uploadImg"
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          accept=".jpg,.png,.gif"
          name="file"
          data={{type:4}}
          showUploadList={false}
          onChange={this.handleChange}
        >
        {logoUrl ? <img src={logoUrl} alt="avatar" width="150" /> : uploadButton}
        </Upload>
        )}
      </FormItem>
      <FormItem
        label="描述"
        {...formItemLayout}
      >
        {getFieldDecorator('introduce', {
          initialValue:introduce,
        })(
          <TextArea placeholder="请输入报纸描述" row={6} style={{resize:'none'}}/>
        )}
      </FormItem>
  </Form>
  );
}
// 确认添加、修改
handleSubmit = (e) =>{
  e.preventDefault();
  const {dispatch} = this.props;
  const {formVals:{id, logoUrl}, loading} = this.state;
  const _this = this;
  if(loading){
    message.info('请等待图片上传完');
    return;
  }
  this.props.form.validateFields((err, values) => {
    
    if (!err) { 
      const { typeName, introduce } = values;
     
      // this.setState({formVals});
      dispatch({
        type:'report/addReport',
        payload:{
          logo:logoUrl,
          introduce,
          paperName:typeName,
          id,
        },
        callback:(res)=>{
          if(res.code == 0){
            message.success('添加成功！');
            _this.queryList();
            _this.handleCancel();
          }else{
            message.error(res.message);
          }
        }
      });
    }
  });
}
// 取消弹框
handleCancel = () =>{
  this.setState({
    visible:false,
  });
}
// 修改分类名按钮
modifyName = (row) => {
  this.props.form.resetFields(['typeName']);
  const formVals = {
    typeName:row.paperName,
    id:row.id,
    introduce:row.introduce,
    logoUrl: row.logo,
  };
  this.setState({
    title:'修改分类',
    visible:true,
    formVals,
  })
}
  render(){
   
    const { list, pagination, loading } = this.props.report;
    const columns = [{
      title:'id',
      key:'id',
      minWidth:100,
      dataIndex:'id',
    },{
      title:'名字',
      key:'paperName',
      dataIndex:'paperName',
    },{
      title:'LOGO',
      key:'logo',
      dataIndex:'logo',
      render:(key)=>{
      let url = key ? <img src={key} width="100%"/> : '--';
        return <div style={{width:150,height:150,overflow:'hidden'}}>{ url }</div>
      }
    },{
      title:'描述',
      key:'introduce',
      dataIndex:'introduce',
      render:(key)=>{
        return <div>{key||'--'}</div>
      }
    },{
      title:'时间',
      key:'createTime',
      dataIndex:'createTime',
      minWidth:180,
      render:(key,row)=>{
        return <div>{moment(key).format(DateFormate)}</div>;
      }
    },{
      title:'操作',
      key:'todo',
      width:80,
      render:(key,row)=>{
        const aDom = <a href="javascript:void(0)" onClick={this.modifyName.bind(this,row)}>修改</a>;
        return aDom;
      }
    }];
  
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
            <div className={styles.report}>
                <div className={styles.top}>
                  {/* <Button type="primary" onClick={this.AddReport}>添加分类</Button> */}
                  {this.searchDom()}
                </div>
                <div className={styles.table}>
                  <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={list}
                    loading={loading}
                    onChange={this.handleTbale}
                    pagination={pagination}
                  />
                </div>
            </div>
            <Modal
              title={this.state.title}
              visible={this.state.visible}
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.handleSubmit}
              onCancel={this.handleCancel}
            >
              {this.openHtml()}
            </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
