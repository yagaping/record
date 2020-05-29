import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Table,
 Divider,
 Card,
 Form,
 Row,
 Col,
 Input,
 Button,
 Select,
 message,
 Popconfirm,
 Modal,
 Popover,
 Tabs
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import { CopyToClipboard } from 'react-copy-to-clipboard';   //复制粘贴
import ShortAddressGroup from './ShortAddressGroup';
import ModuleIntroduce from '../../components/ModuleIntroduce';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, groupList, btn, params} = props;
  const role = groupList.length > 0 ? groupList.map((item, i) => {
    return <Option value={item.id} key={i}>{item.name}</Option>
  }) : <Option value="-1"></Option>;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //下拉框不进行修改时  给下拉框进行id赋值
      if(btn == "edit") {
        if(fieldsValue.groupingId == params.grouping) {
          groupList.length > 0 && groupList.map((item, i) => {
            if(fieldsValue.groupingId == item.name) {
              fieldsValue.groupingId = item.id;
            }
          })
        }
      }
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      title={btn == "add" ? "新增短地址" : "编辑短地址"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分组">
        {form.getFieldDecorator('groupingId', {
          rules: [{ required: true, message: '请选择分组' }],
          initialValue: params ? params.grouping : '',
        })(
        <Select placeholder="请选择分组" style={{ width: '100%' }} >
          {role}
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转地址">
        {form.getFieldDecorator('url', {
          rules: [{ required: true, message: '请输入跳转地址' }],
          initialValue: params ? params.url : '',
        })(<Input placeholder="请输入跳转地址" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简介">
        {form.getFieldDecorator('intro', {
          rules: [{ required: true, message: '请输入简介' }],
          initialValue: params ? params.intro : '',
        })(<Input placeholder="请输入简介" />)}
      </FormItem>
      {
        btn == "add" ? 
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="关键词">
          {form.getFieldDecorator('keyword', {
            // rules: [{ required: true, message: '请输入关键词' }],
            initialValue: '',
          })(<Input placeholder="请输入关键词" />)}
        </FormItem> :
        null
      }
    </Modal>
  );
});

@connect(({ shortAddress, shortGroup, loading }) => ({
  shortAddress,
  shortGroup,
  loading: loading.models.shortAddress,
}))
@Form.create()

export default class ShortAddress extends PureComponent {
  state = {
    groupingId: '',
    intro: '',
    page: 1,
    pageSize: 10,
    modalVisible: false,
    value: '',
    copied: false,
    loading: false,
  };

  componentDidMount() {
      this.handleSearch();
      this.fetchGroupList();
  }
  //获取所有分组
  fetchGroupList() {
    this.props.dispatch({
      type: 'shortGroup/queryGroup',
      payload: {},
      callback: (res) => {
        if(res){
          if(res.code == '0') {
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props.shortGroup;
    const role = data.length > 0 ? data.map((item, i) => {
      return <Option value={item.id} key={i}>{item.name}</Option>
    }) : <Option value=""></Option>;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="分组">
              {getFieldDecorator('groupingId',{
                // initialValue: ''
              })(
              <Select style={{ width: '100%' }} placeholder={'请选择'}  >
                {role}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="简介">
              {getFieldDecorator('intro',{
                initialValue: '',
              })(<Input placeholder="请输入简介" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleModalVisible = (flag, btn, params) => {
    this.setState({
      modalVisible: !!flag,
      btn: btn ? btn : null,
      params: params ? params : null,
    });
    this.refs.myform.resetFields();
  };
  //新增
  handleAdd = fields => {
    this.props.dispatch({
      type: 'shortAddress/addShortUrl',
      payload: {
        ...fields
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleSearch();
            message.success('添加成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ modalVisible: false });
  }
  //编辑
  handleEdit = fields => {
    const that = this;
    this.props.dispatch({
      type: 'shortAddress/updateShortUrl',
      payload: {
        id: this.state.params.id,
        groupingId: fields.groupingId,
        url: fields.url,
        intro: fields.intro,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.handleSearch();
            message.success('修改成功');
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
    this.setState({ modalVisible: false });
  }
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        groupingId: fieldsValue.groupingId,
        intro: fieldsValue.intro,
        page: 1,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({
                page: 1,
                pageSize: 10,
                loading: false
              });
            }else{
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
  }
  //查询
  handleSearch = e => {
    const { dispatch, form } = this.props;
    this.setState({ loading: true });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        groupingId: fieldsValue.groupingId ? fieldsValue.groupingId : "",
        intro: fieldsValue.intro,
        page: this.state.page,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              // this.setState({
              //   data: res.data ? res.data.dataList : [],
              //   total: res.data.total ? res.data.total : '',
              // });
            }else{
              message.error(res.message || '服务器错误')
            }
          }
          this.setState({ loading: false });
        },
      });
    });
    
  };
  //删除
  showDeleteConfirm = (params) => {
      const dispatch  = this.props.dispatch;
      dispatch({
        type: 'shortAddress/deleteShortUrl',
        payload: {
          id: params.id,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.handleSearch();
              message.success('删除成功');
            }else{
              message.error(res.message || '服务器错误');
            }
          }
        }
      });
  }
  //pagination点击
  onClickPage(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: {
          groupingId: fieldsValue.groupingId,
          intro: fieldsValue.intro,
          page: current,
          pageSize: pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){

            }else{
              message.error(res.message || '服务器错误')
            }
          }
          this.setState({ loading: false });
        },
      });
    });
  }

  copy = () => {
    this.setState({copied: true})
    message.success('已复制到粘贴板');
  }

  content = (currentValue) => {
    return(
      <CopyToClipboard text={currentValue}
          onCopy={() => this.copy()}>
          <div style={{color:'#000',cursor: 'pointer'}}>复制</div>
      </CopyToClipboard>
    )
  }

  render() {
    let { dataList, total } = this.props.shortAddress && this.props.shortAddress.data;
    let { data } = this.props.shortGroup;
    let { page, pageSize, modalVisible, loading } = this.state;
    let pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this.onClickPage(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onClickPage(current, pageSize)
      },
    }
    const columns = [{
      title: '简介',
      dataIndex: 'intro',
      key: 'intro',
    }, {
      title: '短链接',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (value, row, index) => {
        return(
          <Popover content={this.content(value)} key={index}>
            <a href={value} target='_blank'>{value}</a>
          </Popover>
        )
      }
    }, {
      title: '跳转地址',
      dataIndex: 'url',
      key: 'url',
      render: (value, row, index) => {
        return(
          <Popover content={this.content(value)} key={index} >
            <a href={value} target='_blank'>{value}</a>
          </Popover>
        )
      }
    },{
      title: '分组',
      dataIndex: 'grouping',
      key: 'grouping',
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width:120,
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
              <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
              </Popconfirm>
          </Fragment>
        )
      }
    }];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="短地址管理">
          <Card bordered={false}>
            <Tabs
              defaultActiveKey='1' 
              tabBarGutter={10} 
              type="card"
            >
              <TabPane tab='短地址列表' key='1'>
                <ModuleIntroduce text={'短地址管理'} />
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                      添加
                    </Button>
                  </div>
                  <Table 
                    style={{backgroundColor:'white',marginTop:16}}
                    columns={columns} 
                    dataSource={dataList} 
                    pagination={pagination}
                    rowKey='id'
                    loading={loading}
                  />
                </div>
              </TabPane>
              <TabPane tab='短地址分组' key='2'>
                <ModuleIntroduce text={'短地址分组管理'} />
                <ShortAddressGroup />
              </TabPane>
            </Tabs>
          </Card>
          <CreateForm {...parentMethods} {...this.state} groupList={data} ref="myform"/>
      </PageHeaderLayout>
    );
  }
}
