import React, { PureComponent, Fragment } from 'react';
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
 Select,
 DatePicker,
 message,
 Icon,
 Popconfirm,
 Carousel,
 Modal,
 Badge,
 Upload,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const adverType = ['应用内','应用外'];
const statusMap = ['processing','success', 'warning', 'default' ];
const status = ['未开始','使用中','已结束','禁用'];
const switch_ = ['禁用','禁用','禁用', '启用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, props_ios, props_android, props_routine, bgImg_ios, bgImg_android, bgImg_routine } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(Date.parse(fieldsValue.startTime) > Date.parse(fieldsValue.endTime)) {
        message.error('开始时间不能大于结束时间');
        return;
      }
      fieldsValue.startTime = moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss');
      fieldsValue.endTime = moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss');
      handleAdd(fieldsValue,form);
    });
  };
  const onRadioChange =  (e) => {
    form.setFieldsValue({
      type: e.target.value,
    });
  };
  
  const  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('hour');
  }
  return (
    <Modal
      title="新建广告"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields();handleModalVisible()}}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告位名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入广告位名称' }],
        })(<Input placeholder="请输入广告位名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告源类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: 0,
        })(
          <RadioGroup onChange={onRadioChange} >
            <Radio value={0}>应用内</Radio>
            <Radio value={1}>应用外</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告URL">
        {form.getFieldDecorator('url', {
          rules: [{ message: '请输入广告URL' }],
        })(<Input placeholder="请输入广告URL" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告标签">
        {form.getFieldDecorator('tag', {
          rules: [{ message: '请输入广告标签' }],
        })(<Input placeholder="请输入广告标签" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告时间(s)">
        {form.getFieldDecorator('second', {
          rules: [{ message: '请输入广告时间(s)' }],
        })(<Input placeholder="请输入广告时间(s)" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
       {form.getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请选择开始时间' }],
       })(<DatePicker
           style={{width: '100%'}}
           format="YYYY-MM-DD HH:mm:ss"
           disabledDate={disabledDate}
           showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
           />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束时间">
        {form.getFieldDecorator('endTime', {
            rules: [{ required: true, message: '请选择结束时间' }],
        })(<DatePicker
           style={{width: '100%'}}
           format="YYYY-MM-DD HH:mm:ss"
           disabledDate={disabledDate}
           showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
           />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告资源">
        {form.getFieldDecorator('content', {
          // rules: [{ required: true, message: '请上传' }],
        })(
          <div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col  md={8} sm={24}>
                <Upload {...props_ios}>
                  {bgImg_ios.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">750*1340px</div>
                        </div>
                  }
                </Upload>
              </Col>
              <Col  md={8} sm={24} offset={4}>
                <Upload {...props_android}>
                  {bgImg_android.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">720*1224px</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col  md={8} sm={24}>
                <Upload {...props_routine}>
                  {bgImg_routine.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">750*1118px</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row> 
          </div>
        )}
      </FormItem>
     
      
    </Modal>
  );
});

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ advertise, loading }) => ({
  advertise,
  loading: loading.models.advertise,
}))
@Form.create()
export default class AdvertiseList extends PureComponent {
  state = {
    modalVisible: false,
    startTime: '',
    endTime: '',
    imgVisible: false,
    imgArray: [],
    page: 1,
    pageSize: 10,
    loading: false,
    bgImg_ios: [],
    bgImg_routine: [],
    bgImg_android: [],
    modal_ios: {size: 'ios', content : ''},           //iphone X XR XMax  Xs(750*1340)
    modal_android: {size: 'android', content : ''},      //android全面屏（720*1224）
    modal_routine: {size: 'routine', content : ''},     //ipone android系列（750*1118）
  };

  componentDidMount() {
    this.handleSearch();
  }

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      startTime: '',
      endTime: '',
      loading: true
    });
    dispatch({
      type: 'advertise/queryAdList',
        payload: {
            page: 1,
            pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({
                page: 1,
                pageSize: 10,
                loading: false
              });
            }else {
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        }
    });
  }
  //点击分页
  onClickPage(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'advertise/queryAdList',
        payload: {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            state: fieldsValue.state ? fieldsValue.state : "",
            page: current,
            pageSize: pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {

            }else {
              message.error(res.message || '服务器错误');
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
      pathname: '/advertisement/advertisement-edit',
      params: params,
    }));
  }
  //预览图片
  seeImg = (imgArray,imgUrl) => {
    this.setState({
      imgArray: imgArray,
      imgVisible: true,
      imgUrl: imgUrl,
    });
  }   
  //点击图片跳转
  gotoImgUrl = () => {
    window.open(this.state.imgUrl)
  }

  imgCancel = () =>{
    this.setState({ imgVisible: false })
  }

  //编辑状态  禁用启用
  editAdverState = (row) => {
    this.props.dispatch({
        type: 'advertise/modifyState',
        payload: {
          advert: {
            id: row.id,
            state: row.state,
            startTime: row.state == 3 ? row.startTime : '',
            endTime: row.state == 3 ? row.endTime : '',
          }
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.handleSearch();
            }else{
              message.error(res.message || '服务器错误');
            }
          }
        }
    });
  }

  //删除当前行
  showDeleteConfirm = (params) => {
    let imgUrl1340 = '', imgUrl1224 = '', imgUrl1118 = '';
    params && params.content.forEach((value,index,array) => {
      if(value.indexOf('/ios') >= 0) {
          imgUrl1340 = value.substring(value.indexOf('advert'),value.indexOf('.jpg'));
      }
      if(value.indexOf('/android') >= 0) {
          imgUrl1224 = value.substring(value.indexOf('advert'),value.indexOf('.jpg'));
      }
      if(value.indexOf('/routine') >= 0) {
          imgUrl1118 = value.substring(value.indexOf('advert'),value.indexOf('.jpg'));
      }
    })
    this.props.dispatch({
      type: 'advertise/removeAdvert',
      payload: {
        id: params.id,
        name: params.name,
        sizeArray: [imgUrl1340,imgUrl1224,imgUrl1118],
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
  //modal显示隐藏
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      bgImg_ios: [],
      bgImg_android: [],
      bgImg_routine: [],   //打开弹框  清空图片
    });
  }

  //新增广告
  handleAdd = (fields, form) => {
    const { modal_ios, modal_android, modal_routine } = this.state;
    if(modal_ios.content == '' || modal_android.content == '' || modal_routine.content == '') {
      message.error('必须上传3张图片');
      return;
    }
    form.resetFields();
    let sizeArray = [];
    sizeArray.push(modal_ios, modal_android, modal_routine)
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'advertise/addAdvert',
      payload: {
        advert: {
          ...fields,
          sizeArray: sizeArray,
        }
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

  dateSelect = (date,dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }
 //搜索广告
  handleSearch = e => {
    const { dispatch, form } = this.props;
    this.setState({ loading: true });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.startTime = this.state.startTime ? this.state.startTime : '';
      fieldsValue.endTime = this.state.endTime ? this.state.endTime : '';
      dispatch({
        type: 'advertise/queryAdList',
        payload: {
          ...fieldsValue,
          page: this.state.page,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({
                loading: false,
                page: 1
              });
            }else {
              this.setState({ loading: false });
              message.error(res.message || '服务器错误');
            }
          }
        },
      });
    });
  };

 
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="广告位名称">
              {getFieldDecorator('name',{
                initialValue: "",
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{display:'flex',justifyContent:'center'}}>
            <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18, marginTop:5}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
            <RangePicker onChange={this.dateSelect} style={{flex:1}} value={(this.state.startTime && this.state.endTime) ? [moment(this.state.startTime),moment(this.state.endTime)] : ''}/>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状 态">
              {getFieldDecorator('state',{
                initialValue: "",
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">未开始</Option>
                  <Option value="1">使用中</Option>
                  <Option value="2">已结束</Option>
                  <Option value="3">禁用</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
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

  render() {
    // const { bgImg_ios } = this.state;
    const { dataList, total } = this.props.advertise &&  this.props.advertise.data;
    const that = this;
    let { page, pageSize, loading } = this.state;
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
      title: '广告位名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },{
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },{
      title: '广告标签',
      dataIndex: 'tag',
      key: 'tag',
    },{
      title: '广告时间',
      dataIndex: 'second',
      key: 'second',
      render: (value, row, index) => {
        return(
            <span key={index}>{value ? value+ 's' : ''}</span>
        )
      },
    },{
      title: '广告资源类型',
      dataIndex: 'type',
      key: 'type',
      render: (value, row, index) => {
        return(
            <span key={index}>{adverType[value]}</span>
        )
      },
    },{
      title: '广告资源',
      dataIndex: 'content',
      key: 'content',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
              <a href="javascript:;" onClick={() => this.seeImg(row.content, row.url)}>图片</a>
          </Fragment>
        )
      }
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (value, row, index) => {
        return <Badge key={index} status={statusMap[row.state]} text={status[row.state]} />;
      },
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width:180,
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <a href="javascript:void(0);" onClick={() => this.edit(row)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editAdverState(row)} className={row.state == 3 ? null : styles.stateRed}>{switch_[row.state]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Fragment>
          )
      }
    }];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const props_ios = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg_ios }) => {
          const index = bgImg_ios.indexOf(file);
          const newFileList = bgImg_ios.slice();
          newFileList.splice(index, 1);
          return {
            bgImg_ios: newFileList,
            modal_ios: {size: 'ios', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg_ios }) => ({
            bgImg_ios: [...bgImg_ios, file],
            modal_ios: {size: 'ios', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_ios: {size: 'ios', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg_ios: info.fileList
              })
          });
      },
      fileList: this.state.bgImg_ios,
      accept: "image/jpg,image/jpeg,image/png"
    };
    const props_android = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg_android }) => {
          const index = bgImg_android.indexOf(file);
          const newFileList = bgImg_android.slice();
          newFileList.splice(index, 1);
          return {
            bgImg_android: newFileList,
            modal_android: {size: 'android', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg_android }) => ({
            bgImg_android: [...bgImg_android, file],
            modal_android: {size: 'android', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_android: {size: 'android', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg_android: info.fileList
              })
          });
      },
      fileList: this.state.bgImg_android,
      accept: "image/jpg,image/jpeg,image/png"
    };
    const props_routine = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg_routine }) => {
          const index = bgImg_routine.indexOf(file);
          const newFileList = bgImg_routine.slice();
          newFileList.splice(index, 1);
          return {
            bgImg_routine: newFileList,
            modal_routine: {size: 'routine', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg_routine }) => ({
            bgImg_routine: [...bgImg_routine, file],
            modal_routine: {size: 'routine', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_routine: {size: 'routine', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg_routine: info.fileList
              })
          });
      },
      fileList: this.state.bgImg_routine,
      accept: "image/jpg,image/jpeg,image/png"
    };

    return (
      <PageHeaderLayout title="广告位列表">
          <Card bordered={false}>
            <ModuleIntroduce text={'APP启动广告编辑'} />
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} >
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
            <Modal visible={this.state.imgVisible} footer={null} onCancel={this.imgCancel} width={360}>
                <Carousel autoplay>
                  {this.state.imgArray.length > 0  && this.state.imgArray.map((item, i) => {
                    return <div onClick={this.gotoImgUrl} key={i}><img alt={i} src={item}  width='320' /></div>
                  })}
                </Carousel>
            </Modal>
            <CreateForm {...parentMethods} modalVisible={this.state.modalVisible} {...this.state}   props_ios={props_ios} props_android={props_android} props_routine={props_routine} />
          </Card>
        
      </PageHeaderLayout>
    );
  }
}
