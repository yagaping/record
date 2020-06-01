import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
 Table,
 Card,
 Form,
 Row,
 Col,
 Radio,
 Input,
 Button,
 DatePicker,
 message,
 Select,
 Spin
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import CarouselSelf from '../../components/CarouselSelf';
import ModuleIntroduce from '../../components/ModuleIntroduce';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;
const modularName = { 
  1 :'事件提醒',
  2 :'生日提醒',
  3 : '规律生活',
  4 :'记账',
  5 :'美记',
  6 :'代办',
  7 :'天气',
  8 :'万年历',
  9 :'涨知识',
  10 :'新股',
  11 :'彩票',
  12 :'经期管家',
  13 :'位置提醒',
  14 :'用户',
  15 :'速记',
  16 :'便签',
  17 :'WiFi提醒',
  18 :'通讯录',
  19 :'美听'
};
@connect(({ feedback, module_Name, loading }) => ({
  feedback,
  module_Name,
  loading: loading.models.feedback,
}))
@Form.create()
export default class FeedBackList extends PureComponent {
  state = {
    startCreateDate: '',
    overCreateDate: '',
    page: 1,
    pageSize: 10,
    imgArray: [],
    modalVisible: false,
    expand: false
  };

  componentDidMount() {
    this.handleSearch();
    // this.getModuleNameList();
  }

  dateSelect = (date,dateString) => {
    this.setState({
      startCreateDate: dateString[0],
      overCreateDate: dateString[1],
    });
  }

   //获取modlue name
  getModuleNameList = () => {
    this.props.dispatch({
        type: 'module_Name/getModuleName',
        payload: {},
        callback: (res) => {
            if(res) {
                if(res.code == '0') {
                    // message.success("1111");
                }else{
                    message.error(res.message || '服务器错误')
                }
            }
        }          
    });
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props.module_Name && this.props.module_Name.data;
    const moduleName = data.length > 0 ? data.map((item, i) => {
      return <Option value={item.id} key={i}>{item.name}</Option>
    }) : <Option value=""></Option>;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用&nbsp;&nbsp;户&nbsp;&nbsp;ID">
              {getFieldDecorator('userId',{
                initialValue: "",
              })(<Input placeholder="请输入用户ID" />)}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="米橙账号">
              {getFieldDecorator('uniqueNumber',{
                initialValue: "",
              })(<Input placeholder="请输入米橙账号" />)}
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <FormItem label="提交平台">
              {getFieldDecorator('submitMode',{
                  initialValue: '',
              })(
                  <Select placeholder="请选择事件类型">
                      <Option value='' >{'请选择'}</Option>
                      <Option value='1' >{'APP'}</Option>
                      <Option value='2' >{'官网'}</Option>
                      <Option value='3' >{'米橙客服'}</Option>
                  </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}  style={{display:'flex',justifyContent:'center'}}>
            <FormItem label="客户端系统">
              {getFieldDecorator('clientSystem',{
                initialValue: "",
              })(
                <RadioGroup onChange={this.onRadioChange} initialValue={1}>
                  <Radio value={""}>全选</Radio>
                  <Radio value={2}>iOS</Radio>
                  <Radio value={1}>Android</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('contactWay',{
                // rules: [{
                //   message: '联系方式不正确',
                //   validator: this.validatecontactWay,
                // }],
                // validateTrigger: 'onBlur',
                initialValue: "",
              })(<Input placeholder="请输入手机号,QQ或邮箱" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24} style={{display:'flex',alignItems:'center'}}>
              <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
              <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.startCreateDate && this.state.overCreateDate) ? [moment(this.state.startCreateDate),moment(this.state.overCreateDate)] : ''} />
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="模块名称">
              {getFieldDecorator('modularId',{
                initialValue: "",
              })(
                <Select style={{ width: '100%' }}  placeholder="请选择模块">
                    <Option value='' >{'请选择'}</Option>
                    <Option value='1' >{'事件提醒'}</Option>
                    <Option value='2' >{'生日提醒'}</Option>
                    <Option value='3' >{'规律生活'}</Option>
                    <Option value='4' >{'记账'}</Option>
                    <Option value='5' >{'美记'}</Option>
                    <Option value='6' >{'清单'}</Option>
                    <Option value='7' >{'天气'}</Option>
                    <Option value='8' >{'万年历'}</Option>
                    <Option value='9' >{'涨知识'}</Option>
                    <Option value='10' >{'新股'}</Option>
                    <Option value='11' >{'彩票'}</Option>
                    <Option value='12' >{'经期管家'}</Option>
                    <Option value='13' >{'位置提醒'}</Option>
                    <Option value='14' >{'用户'}</Option>
                    <Option value='15' >{'速记'}</Option>
                    <Option value='16' >{'便签'}</Option>
                    <Option value='17' >{'WiFi提醒'}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="版本号">
              {getFieldDecorator('appVersion',{
                initialValue: "",
              })(<Input placeholder="请输入版本号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>  
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
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

  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      clientSystem: e.target.value,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    this.setState({
      formValues: {},
      startCreateDate: '',
      overCreateDate: '',
    });
    dispatch({
      type: 'feedback/queryFeedbackList',
        payload: {
          page: 1,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
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

  handleSearch = () => {
    this.setState({ loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        startCreateDate: this.state.startCreateDate,
        overCreateDate: this.state.overCreateDate,
        contactWay: fieldsValue.contactWay,
        clientSystem: fieldsValue.clientSystem,
        appVersion: fieldsValue.appVersion,
        submitMode: fieldsValue.submitMode,
        modularId: fieldsValue.modularId,
        userId: fieldsValue.userId,
        page: 1,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'feedback/queryFeedbackList',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.setState({ loading: false, page: 1 });
            }else{
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
    
  };

  onClickPage(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'feedback/queryFeedbackList',
        payload: {
          startCreateDate: this.state.startCreateDate,
          overCreateDate: this.state.overCreateDate,
          contactWay: fieldsValue.contactWay ? fieldsValue.contactWay : "",
          clientSystem: fieldsValue.clientSystem ? fieldsValue.clientSystem : "",
          appVersion: fieldsValue.appVersion ? fieldsValue.appVersion : "",
          submitMode: fieldsValue.submitMode ? fieldsValue.submitMode : "",
          modularId: fieldsValue.modularId ? fieldsValue.modularId : "",
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
    // 打开预览
    openFile = (row) => {
      const { dispatch } = this.props;
      const { itemId, mark } = this.state;
      const { id } = row;
      if(itemId == id && mark){
        this.show(true, mark);
        return;
      }
      dispatch({
        type:'feedback/queryUploadFile',
        payload:{ id },
        callback: res => {
          if(res && res.code == 0){
            const { data } = res;
          this.show(true,data);
          this.setState({
            itemId:id,
            mark:data
          })
        }else{
          message.error('服务器出错');
        }
        }
      })
    }
   //图片预览弹框
  show = (flag,row) => {
      this.setState({
          modalVisible: !!flag,
          imgArray: row && row.imageUrls
      })
  }

  _expand = () => {
    this.setState({
      expand: true
    })
  }

  _unExpand = () => {
    this.setState({
      expand: false
    })
  }

  render() {
    const { dataList, total } =  this.props.feedback &&  this.props.feedback.data;//
    let { page, pageSize, loading, imgArray, modalVisible, expand } = this.state;
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
      title: '用户ID',
      dataIndex: 'userId',
      width:100,
      key: 'userId'
    },
    // {
    //   title: '米橙账号',
    //   dataIndex: 'uniqueNumber',
    //   key: 'uniqueNumber'
    // },
    {
      title: '模块',
      dataIndex: 'modularId',
      width:100,
      key: 'modularId',
      render: key => key ? modularName[key] : '--'
    },{
      title: '反馈时间',
      dataIndex: 'createDate',
      width:180,
      key: 'createDate',
    }, {
      title: '联系方式',
      dataIndex: 'contactWay',
      width:150,
      key: 'contactWay',
      render:key=> key || '--'
    }, {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      render: value => {
        if(value && value.length > 120) {
          if(expand) {
            return(<p>{value}<a onClick={() => this._unExpand()}>~收起</a></p>)
          }else {
            return(
              <p>{value.substring(0, 120)}<a onClick={() => this._expand()}>~展开</a></p>
            )
          }
        }else {
          return(
            <p>{value || '--'}</p>
          )
        }
      }
    }, {
      title: '反馈文件',
      dataIndex: 'imageUrls',
      width:100,
      key: 'imageUrls',
      render: (value, row) => {
        return (value ? <a href='javascript:void(0)' onClick={() => this.openFile(row)}>文件</a> : '无')
      }
    }, {
      title: '文件数量',
      width:100,
      dataIndex: 'imageUrlsNum',
      key: 'imageUrlsNum',
      render: (value, row, key) => {
        return <span>{row.imageUrls ? row.imageUrls.length : 0}</span>
      }
    },{
      title: '客户端系统',
      dataIndex: 'clientSystem',
      width:120,
      key: 'clientSystem',
      render: (value, row, index) => {
        let sys = "";
        if(row.clientSystem == '1') {
          sys = 'Android';
        }else if(row.clientSystem == '2') {
          sys = 'iOS';
        }
        return(
          <span>{sys}</span>
        )
      },
    },{
      title: '版本号',
      dataIndex: 'appVersion',
      width:160,
      key: 'appVersion',
    },{
      title: '提交平台',
      dataIndex: 'submitMode',
      width:100,
      key: 'submitMode',
      render: (value, row, index) => {
        var plat = ''
        switch(value) {
          case 1:
           plat = 'APP';
           break;
          case 2: 
            plat = '官网';
            break;
          case 3: 
            plat = '米橙客服';
            break
          default: 
            plat = '';
            break
        }
        return(<span>{plat}</span>)
      }
    }];
    return (
      <PageHeaderLayout title="反馈列表">
          <Card bordered={false}>
            <ModuleIntroduce text={'用户反馈列表'} />
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <Table 
                style={{backgroundColor:'white',marginTop:16}}
                columns={columns} 
                dataSource={dataList} 
                pagination={pagination}
                rowKey="key"
                loading={loading}
              />
            </div>
            
          </Card>
          <CarouselSelf  imgArray={imgArray}   modalVisible={modalVisible} show={this.show} />
      </PageHeaderLayout>
    );
  }
}
