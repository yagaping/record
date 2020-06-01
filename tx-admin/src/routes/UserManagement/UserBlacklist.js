import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Form,
 Card,
 Table,
 Input,
 Row,
 Col,
 Button,
 message,
 Switch,
 Modal,
 Badge,
 Divider,
 Popconfirm 
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import moment from 'moment';
const FormItem = Form.Item;

const CreateForm = Form.create()( props => {
  const { 
    form, visible, m_uniqueNumber,modalTitle, handleOk, handleCancel
  } =  props;
  const { getFieldDecorator } = form;
  const handleYes = () => {
    form.validateFields((err, values) => {
      if (err) return;
      handleOk(values,form);
    });
  }
  const handleNo = () => {
    handleCancel(form);
  } 
  return (
    <Modal
      visible={visible}
      title={modalTitle}
      onOk={handleYes}
      onCancel={handleNo}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="米橙号">
        {getFieldDecorator('m_uniqueNumber', {
          initialValue:m_uniqueNumber,
          rules: [{ required: true, message: '请输入米橙号' }],
        })(<Input placeholder="请输入米橙号" />)}
      </FormItem>
    </Modal>
  )
})

@connect(({ userOnline, loading }) => ({
  userOnline,
  loading: loading.models.userOnline,
}))
@Form.create()
export default class UserBlacklist extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSize:20,
      page:1,

      visible:false,
      modalTitle:'新增',
      mainSwitch:false,
      sendSms:false,
      sendPhone:false,
      sendWx:false,
      sendApp:false,
    }
  }
  componentDidMount(){
    this.handleSearch();
  }
   //搜索
   handleSearch = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const { pageSize, page} = this.state;
      const { uniqueNumber } = values;
      dispatch({
        type: 'userOnline/queryBlackList',
        payload: {
          uniqueNumber,
          pageSize,
          page
        }
      });
    });
  };
   //重置
   handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      page: 1,
      pageSize: 20,
    },()=>{
      this.handleSearch();
    });
   
  }
  //搜索菜单
  searchRender() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
                <FormItem label="米橙号">
                {getFieldDecorator('uniqueNumber',{
                  initialValue: "",
                })(<Input placeholder="请输入米橙号" />)}
                </FormItem>
            </Col>
            <Col>
              <div style={{ overflow: 'hidden' }}>
                  <span style={{ marginBottom: 24 }}>
                      <Button type="primary" onClick={this.handleSearch}>
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
   //pagination分页
   _onClick(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize},() => this.handleSearch());   
  }
  // 新增、编辑
  addItem = (row) => {
 
    this.setState({
      visible:true,
      modalTitle:row ? '编辑' : '新增',
      mcId:row ? row.id : null,
      m_uniqueNumber:row ? row.uniqueNumber : '' 
    })
  }
  // 保存
  handleOk = (values,form) => {
    const { dispatch } = this.props;
    const {
      modalTitle,
      mcId
    } = this.state;
    let mark = '';
    const { m_uniqueNumber } = values;
    let url = modalTitle == '新增' ? 'addBlack' : 'modBlack';
    let params = {
      uniqueNumber:m_uniqueNumber
    }
    url = 'userOnline/' + url;
    if(mcId){
      params.id = mcId
    }
    dispatch({
      type: url,
      payload:{
        ...params
      },
      callback:res=>{
        if(res.code == 0){
          message.success(`${modalTitle}成功`);
          this.handleSearch();
        }else{
          message.success(res.message || `${modalTitle}失败`);
        }
        this.handleCancel(form)
      }
    })
  }
  // 删除
  delete = ( row ) => {
    const { dispatch } = this.props;
    const { userId, id } = row;
    dispatch({
      type:'userOnline/deleteBlack',
      payload:{
        id,
        userId
      },
      callback:res=>{
        if(res.code == 0){
          message.success('删除成功')
          this.handleSearch()
        }else{
          message.success(res.message || '删除失败')
        }
      }
    })
  }
  // 取消
  handleCancel = (form) => {
    form.resetFields();
    this.setState({
      visible:false
    })
  }

  render() {
    const { page, pageSize } = this.state;
    const { userOnline, loading } = this.props;
    const { data:{ dataList, total } } = userOnline;
    const pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this._onClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this._onClick(current, pageSize)
      },
    }
    const evnets = {
      handleOk:this.handleOk,
      handleCancel:this.handleCancel
    }
    const columns = [
      {
        title:'用户ID',
        key:'userId',
        dataIndex:'userId'
      },
      {
        title:'米称号',
        key:'uniqueNumber',
        dataIndex:'uniqueNumber',
        render:key=> key || '--'
      },
      {
        title:'用户昵称',
        key:'nickName',
        dataIndex:'nickName',
        render:key=> key || '--'
      },{
        title:'手机号码',
        key:'mobile',
        dataIndex:'mobile',
        render:key=> key || '--'
      },{
        title:'注册时间',
        key:'regTime',
        dataIndex:'regTime',
        render:key=> moment(key).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title:'操作',
        key:'todo',
        width:120,
        render:row=>{
          return (
          <Fragment>
            <a href="javascript:void(0)" onClick={this.addItem.bind(this,row)}>修改</a>
            <Divider type="vertical"/>
            <Popconfirm onConfirm={this.delete.bind(this,row)} title={'确定要删除？'}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>
          </Fragment>
          )
        }
      }
    ];
    return (
      <PageHeaderLayout title={'群发黑名单'}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableListForm}>{this.searchRender()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.addItem()} >
                    添加
                  </Button>
                </div>
                <div className={styles.tableList}>
                  <Table 
                    style={{backgroundColor:'white',marginTop:16}}
                    columns={columns} 
                    dataSource={dataList} 
                    pagination={pagination}
                    loading={loading}
                    rowKey='userId'
                  />
                </div> 
                <CreateForm {...this.state} { ...evnets }/>
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
