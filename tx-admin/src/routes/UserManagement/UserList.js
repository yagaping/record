import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Table,
 Divider,
 Card,
 Form,
 Row,
 Col,
 Radio,
 Input,
 Button,
 DatePicker,
 message,
 Popconfirm,
 Badge,
 Modal
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const osType = ['','Android','iOS'];
const platformType = ['米橙相册','米橙','米橙浏览器'];
const _state = ['正常','禁用'];
const switch_ = ['禁用', '启用'];
const statusMap = ['success', 'default','processing', 'default' ];
@connect(({ userList, eventNotify, loading }) => ({
  userList,
  eventNotify,
  loading: loading.models.userList,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    startCreateDate: '',
    overCreateDate: '',
    page: 1,
    pageSize: 10,
    loading: false,
    modalVisible: false,
   
    pageNotify: 1,  
    pageSizeNotify: 10,
    totalNotify: 0, //通知总数
    dataNotify: [],  //通知列表
  };

  componentDidMount() {
    this.handleSearch();
  }
  //选择时间
  dateSelect = (date,dateString) => {
    this.setState({
      startCreateDate: dateString[0],
      overCreateDate: dateString[1],
    });
  }
  //搜索菜单
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
                <FormItem label="用户ID">
                {getFieldDecorator('id',{
                  initialValue: "",
                })(<Input placeholder="请输入用户id" />)}
                </FormItem>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="米橙号">
                {getFieldDecorator('uniqueNumber',{
                  initialValue: "",
                })(<Input placeholder="请输入米橙号" />)}
                </FormItem>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="用户手机">
                {getFieldDecorator('mobile',{
                  initialValue: "",
                })(<Input placeholder="请输入用户手机号码" />)}
                </FormItem>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="用户昵称">
                {getFieldDecorator('nickName',{
                  initialValue: "",
                })(<Input placeholder="请输入用户昵称" />)}
                </FormItem>
            </Col>
            
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24} >
                <FormItem label="状态">
                {getFieldDecorator('state',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangeState}>
                      <Radio value={""}>全选</Radio>
                      <Radio value={0}>正常</Radio>
                      <Radio value={1}>禁用</Radio>
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
            <Col md={6} sm={24} style={{display:'flex',justifyContent:'center'}}>
              <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
              <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.startCreateDate && this.state.overCreateDate) ? [moment(this.state.startCreateDate),moment(this.state.overCreateDate)] : ''}/>
            </Col>
            <Col md={6} sm={24}>
                <FormItem label="注册系统">
                {getFieldDecorator('osType',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangeOs}>
                        <Radio value={""}>全部</Radio>
                        <Radio value={1}>Android</Radio>
                        <Radio value={2}>iOS</Radio>
                        {/* <Radio value={3}>Web</Radio> */}
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
            <Col md={6} sm={24} style={{display:'flex',paddingLeft:24}}>
                <FormItem label="注册平台">
                {getFieldDecorator('platformType',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangePlat}>
                    <Radio value={""}>全部</Radio>
                    <Radio value={1}>米橙</Radio>
                    <Radio value={2}>米橙浏览器</Radio>
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
        </Row>
        
      </Form>
    );
  }

  validatecontactWay = (rule, value, callback) => {
    const tel = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
    const qq = /^[1-9]\d{4,9}$/; 
    const email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!(tel.test(value) || qq.test(value) || email.test(value))) return callback(rule.message);
    this.setState({
      searchOk: true,
    });
    // this.props.dispatch
  }
  //选择状态
  onRadioChangeState = (e) => {
    this.props.form.setFieldsValue({
      state: e.target.value,
    });
  }
  //选择系统
  onRadioChangeOs = (e) => {
    this.props.form.setFieldsValue({
      osType: e.target.value,
    });
  }
  //选择平台
  onRadioChangePlat = (e) => {
    this.props.form.setFieldsValue({
      platformType: e.target.value,
    });
  }
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      startCreateDate: '',
      overCreateDate: '',
      loading: true
    });
    dispatch({
      type: 'userList/queryUserList',
        payload: {
          page: 1,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.setState({
                pageSize: 10,
                page: 1,
                loading: false
              });
            }else{
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        }
    });
  }
  //搜索
  handleSearch = () => {
    this.setState({ loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startCreateDate: this.state.startCreateDate,
        overCreateDate: this.state.overCreateDate,
        mobile: fieldsValue.mobile,
        nickName: fieldsValue.nickName,
        state: fieldsValue.state, 
        osType: fieldsValue.osType, 
        platformType: fieldsValue.platformType,   
        uniqueNumber: fieldsValue.uniqueNumber,
        page: 1,
        pageSize: this.state.pageSize,
        id: fieldsValue.id
      };
      dispatch({
        type: 'userList/queryUserList',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({ page: 1, loading: false });  
            }else{
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
  };
  //pagination点击
  _onClick(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'userList/queryUserList',
        payload: {
          id: fieldsValue.id,
          startCreateDate: this.state.startCreateDate,
          overCreateDate: this.state.overCreateDate,
          mobile: fieldsValue.mobile,
          nickName: fieldsValue.nickName,
          state: fieldsValue.state, 
          osType: fieldsValue.osType, 
          platformType: fieldsValue.platformType,  
          page: current,
          pageSize: pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
           
            }else{
              message.error(res.message || '服务器错误')
            }
          }
          this.setState({ loading: false });
        },
      });
    });
  }
  //编辑跳转
  edit = (params) => {
    this.props.dispatch( routerRedux.push({
        pathname: '/usermanagement/user-edit',
        params: params,
      }
    ));
  }
  //状态更改
  editUserState = (userId, userState) => {
    this.props.dispatch({
      type: 'userList/editCustomerState',
      payload: {
        id: userId,
        state: userState,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.handleFormReset();
          }else {
            message.err(res.message || '服务器错误')
          }
        }
      }
    });
  }
  //删除
  showDeleteConfirm = (params) => {
    this.props.dispatch({
      type: 'userList/deleteCuster',
      payload: {
        id: params.id,
        headPicUrl: params.headPicUrl,
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            message.success('删除成功');
            this.handleFormReset();
          }else {
            message.error(res.message || '服务器错误');
          }
        }
      }
    });
  } 
  //打开通知
  _openNotice = (params) => {
    this.props.dispatch({
      type: 'eventNotify/findAll',
      payload: {
        id: params,
        phoneNumber: '',
        page: 1,
        pageSize: this.state.pageSizeNotify       
      },
      callback: (res) => {
          if(res) {
              if(res.code == '0') {
                  this.setState({
                      modalVisible: true,
                      dataNotify: res.data.dataList,
                      totalNotify: res.data.total,
                      userId: params,
                      pageNotify: 1
                  });
              }else {
                  message.error(res.message || '服务器错误');
              }
          }
      }
    });
  }
  //取消弹框
  handleCancel = () => {
    this.setState({ modalVisible: false });
  }

  _onClickNotify = (current, pageSize) => {
    this.setState({ pageNotify: current, pageSizeNotify: pageSize });
    this.props.dispatch({
        type: 'eventNotify/findAll',
        payload: {
          id: this.state.userId,
          phoneNumber: '',
          page: current,
          pageSize: pageSize       
        },
        callback: (res) => {
            if(res) {
                if(res.code == '0'){
                  this.setState({
                    dataNotify: res.data.dataList,
                    totalNotify: res.data.total,
                  });
                }else{
                    message.error(res.message || '服务器错误')
                }
            }
        },
    });
  }

  render() {
    let { dataList, total } = this.props.userList && this.props.userList.data;
    let { page, pageSize, loading, modalVisible, pageNotify, pageSizeNotify, totalNotify, dataNotify } = this.state;
    let pagination = {
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
    const that = this;
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{value ? value : '未绑定'}</span>
          </Fragment>
        )
      }
    }, {
      title: 'MemberId',
      dataIndex: 'memberId',
      key: 'memberId',
      render:key => key || '--'
      }, {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render:key => key || '--'
    },{
      title:'手机型号',
      dataIndex:'phoneModel',
      key:'phoneModel',
      render:key => key || '--'
    },{
      title: '注册日期',
      dataIndex: 'regTime',
      key: 'regTime',
    },{
      title: '注册系统',
      dataIndex: 'osType',
      key: 'osType',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{osType[value]}</span>
          </Fragment>
          )
      }
    },{
      title: '注册平台',
      dataIndex: 'platformType',
      key: 'platformType',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{platformType[value]}</span>
          </Fragment>
          )
      }
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render(value, row, index) {
        return <Badge status={statusMap[value]} text={_state[value]} />;
      },
    },{
      title: '通知详情',
      dataIndex: 'notice',
      key: 'notice',
      render(value, row, index) {
        return(
          <a key={index} href='javascript:;' onClick={() => that._openNotice(row.id)}>查看</a>
        )
      },
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width:180,
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.edit(row)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editUserState(row.id,row.state)} className={row.state == 1 ? null : styles.stateRed} >{switch_[row.state]}</a>
            <Divider type="vertical" />
            {/* <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" /> */}
          </Fragment>
          )
      }
    }];

    let paginationNotify = {
      total: totalNotify,
      defaultCurrent: pageNotify,
      current: pageNotify,
      pageSize: pageSizeNotify,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: totalNotify => `共 ${totalNotify} 条`,
      onShowSizeChange: (current, pageSize) => {
        this._onClickNotify(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this._onClickNotify(current, pageSize)
      },
    }

    const notify = [{
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (value, row, index) => {
          return(<span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>)
      }
    }, {
      title: '通知内容',
      dataIndex: 'sendText',
      key: 'sendText',
    },{
      title: '通知类型',
      dataIndex: 'type',
      key: 'type',
      render: (value, row, index) => {
          let valueText;
          switch (value) {
              case 1:
                  valueText = '手机通知';
                  break;
              case 2:
                  valueText = '微信通知';
                  break;
              case 3:
                  valueText = '自身短信通知';
                  break;
              case 4:
                  valueText = '语音通知';
                  break;
              case 5:
                  valueText = '短信通知';
                  break;
              default:
                  valueText = '';
                  break;
          }
          return(<span key={index} >{valueText}</span> )
      }
    }];
    return (
      <PageHeaderLayout title="用户列表">
        <div>
            <Card bordered={false}>
              <ModuleIntroduce text={'用户管理'} />
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={dataList} 
                  pagination={pagination}
                  loading={loading}
                  rowKey='id'
                />
              </div>
            </Card>
            <Modal 
                visible={modalVisible} 
                footer={null} 
                onCancel={this.handleCancel}
                title="通知详情"
                width={1050}
            >
                <Table 
                    columns={notify}
                    dataSource={dataNotify}
                    pagination={paginationNotify}
                    rowKey='id'
                />
            </Modal>
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
