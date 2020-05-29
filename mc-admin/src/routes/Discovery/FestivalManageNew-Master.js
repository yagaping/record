import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import {
 Table,
 Card,
 Form,
 Row,
 Col,
 Radio,
 Input,
 Button,
 message,
 Modal,
 Popover,
 Upload,
 DatePicker,
 Tabs
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import FestivalManage from './FestivalManage';
import FestivalManageNew from './FestivalManageNew';
import moment from 'moment';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const { TabPane } = Tabs;
const CreateForm = Form.create()(props => {
  const { editVisibile, form, handleEdit, edit, params, clickFestival, chnageTime } = props;
  const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          handleEdit(fieldsValue);
      });
  }
 
  return(
      <Modal 
          visible={editVisibile}
          onOk={okHandle}
          onCancel={() => edit()}
          title={'编辑'}
          width={600}
          keyboard={false}
          maskClosable={false}
      >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节日名称">
              {params ? params.name : ''}             
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节日类型">
              {params ? (params.festivalType === 1 ? '中国节日' : params.festivalType === 2 ? '世界节日' : '二十四节气') : '' }    
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节日日期">
              {params ? (params.LunarCalendar+'('+params.LunarCalendar+')') : ''}             
          </FormItem>
          {
            clickFestival == '3' && (<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
              {form.getFieldDecorator('detailedTime', {
                  rules: [{ required: true, message: '请选择时间' }],
                  initialValue: params ? moment(moment().format('YYYY-MM-DD')+' '+params.detailedTime) : null,
                })(
                  <DatePicker onChange={chnageTime} mode="time" showTime format={'HH:mm:ss'} />
                )}           
            </FormItem>)
          }
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推送标题">
              {form.getFieldDecorator('pushTitle', {
                  // rules: [{ required: true, message: '请输入推送标题' }],
                  initialValue: params ?params.pushTitle : '',
              })(<Input placeholder="请输入推送标题" />)}             
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推送内容">
                {form.getFieldDecorator('pushText', {
                  // rules: [{ required: true, message: '请输入推送内容' }],
                  initialValue: params ? params.pushText : '',
                })(<TextArea placeholder="请输入推送内容" rows={4}/>)}      
          </FormItem>
      </Modal>
  )
})
const selfStyle = {
  color: '#fff', 
  backgroundColor: '#1890ff',
  border: '1px solid #1890ff'
};
@connect(({ festivalManageNew, loading }) => ({
  festivalManageNew,
  loading: loading.models.festivalManageNew,
}))
@Form.create()
export default class FestivalListNew extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    loading: false,
    page: 1,
    pageSize: 10,
    clickYear: new Date().getFullYear(),
    clickFestival: '',
    list: [],
    editVisibile: false,
    activeKey: '3'
  };
  timer = null;

  componentDidMount() {
    this.handleSearch(this.state.page);
  }

  handleSearch = (page) => {
    const { dispatch, form } = this.props;
    const { clickYear, clickFestival, pageSize } = this.state;
    this.setState({ loading: true });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        name: fieldsValue.name,
        type: clickFestival,
        year: clickYear,
        page: page,
        pageSize: pageSize,
      };
      dispatch({
        type: 'festivalManageNew/queryFestival',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({page: page})
            }else{
              message.error(res.message || '服务器错误');
            }
            this.setState({ loading: false });
          }
        },
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="节日名">
                {getFieldDecorator('name',{
                  initialValue: '',
                })(<Input placeholder="请输入节日名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={() => this.handleSearch(1)}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop: 20}}>  
          <Col md={4} sm={24}>
            <span>{this.generateRadio()}</span>
          </Col>
          <Col md={4} sm={24}>
            <span style={{marginLeft:20}}>{this.generateFestival()}</span>
          </Col>
        </Row>
      </Form>
    );
  }

  //重置
  handleFormReset = () => {
    const that = this;
    this.setState({ loading: true, clickYear: new Date().getFullYear(), clickFestival: '' });
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'festivalManageNew/queryFestival',
        payload: {
          page: 0,
          pageSize: 10,
          name: "",
          type: "",
          year: new Date().getFullYear()
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({
                page: 1,
                pageSize: 10
              });
            }else {
              message.error(res.message || '服务器错误');
            }
          }
          this.setState({ loading: false });
        }
    });
  }

  onPageClick(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'festivalManageNew/queryFestival',
        payload: {
          name: fieldsValue.name,
          type: this.state.clickFestival,
          year: this.state.clickYear,
          page: current,
          pageSize: pageSize,
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              // this.setState({
              //   list: res.data ? res.data.list : [],
              //   total: res.data.total ? res.data.total : '',
              //   loading: false
              // });
            }else {
              message.error(res.message || '服务器错误');
            }
          }
          this.setState({ loading: false });
        },
      });
    });
    
  }

  //根据当前年份生成radio  取4年
  generateRadio = () => {
    const currentYear = new Date().getFullYear();
    let eleArr = [];
    for(let i = currentYear - 2; i <= currentYear + 1; i ++) {
      let ele = <RadioButton value={i} key={i} name={i} style={this.state.clickYear == i ? selfStyle : null}>{i}</RadioButton>;
      eleArr.push(ele)
    }
    return (
      <RadioGroup onChange={this.yearChange}  value={this.state.clickYear}>
        {eleArr}
      </RadioGroup>
    )
  }
  //年份切换
  yearChange = (e) => {
    this.setState({ 
      clickYear: e.target.value
    },() => {
      this.handleSearch(1);
    } 
    );
  }

  //生成节日节气radio
  generateFestival = () => {
    return(
      <RadioGroup onChange={this.festivalChange} value={this.state.clickFestival}>
        <RadioButton value='' style={this.state.clickFestival == '' ? selfStyle : null}>全部</RadioButton>
        <RadioButton value='1' style={this.state.clickFestival == '1' ? selfStyle : null}>中国节日</RadioButton>
        <RadioButton value='2' style={this.state.clickFestival == '2' ? selfStyle : null}>世界节日</RadioButton>
        <RadioButton value='3' style={this.state.clickFestival == '3' ? selfStyle : null}>节气</RadioButton>
      </RadioGroup>
    )
  }
  //节日节气切换
  festivalChange = e => {
    this.setState({ 
      clickFestival: e.target.value
    },() => {
      this.handleSearch(1);
    } 
    );
  }

  //图片上传
  upload = (iconBase64, bannerBase64, bgImgBase64, params) => {
    this.props.dispatch({
      type: 'festivalManageNew/festivalUpLoad',
      payload: {
        type: 'festival',
        name: params.name,
        year: this.state.clickYear,
        icon: iconBase64,
        banner: bannerBase64,
        bgImg: bgImgBase64,
        id: params.id
      },
      callback: res => {
        if(res) {
          if(res.code === 0) {
            message.success('上传成功')
          }else {
            message.error(res.message || '服务器错误');
          }
        }
      }
    })
  }

  /***上传准备 */
  getBase64 = (img, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  iconChange = (row, info) => {
    const that = this;
    that.getBase64(info.fileList[0].originFileObj, (imgUrl) => {
        info.fileList[0].url = imgUrl;
        //转化后的base64
        const iconBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
        that.upload(iconBase64,'','',row);
        setTimeout(() => {
          this.handleSearch(that.state.page)
        },100)
    });
  }
  bannerChange = (row, info) => {
    const that = this;
    that.getBase64(info.fileList[0].originFileObj, (imgUrl) => {
        info.fileList[0].url = imgUrl;
        //转化后的base64
        const bannerBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
        that.upload('',bannerBase64,'',row);
        setTimeout(() => {
          this.handleSearch(that.state.page)
        },100)
    });
  }
  bgImgChange = (row, info) => {
    const that = this;
    that.getBase64(info.fileList[0].originFileObj, (imgUrl) => {
        info.fileList[0].url = imgUrl;
        //转化后的base64
        const bgImgBase64 = imgUrl.substring(imgUrl.indexOf(',')+1);
        that.upload('','',bgImgBase64,row);
        setTimeout(() => {
          this.handleSearch(that.state.page)
        },100)
    });
  }
  /**上传结束 */

  /**编辑 */
  edit = (flag, row) => {
    this.setState({
      params: row,
      editVisibile: !!flag
    })
  }

  handleEdit = fields => {
    const { params, page } = this.state;
    this.props.dispatch({
        type: 'festivalManageNew/festivalUpDate',
        payload: {
          id: params.id,
          ...fields,
          detailedTime:params.detailedTime
        },
        callback: (res) => {
            if(res) {
              if(res.code == '0'){
                message.success('编辑成功');
                this.handleSearch(page);
              }else{
                  message.error(res.message || '服务器错误');
              }
              this.edit(false)
            }
        }
    });
  }

  // checkImage(imgPath) {
  //   const imgObj = new Image();
  //   imgObj.src = imgPath;
  //   imgObj.addEventListener('load',(e) => {
  //     if(e.path[0].width > 0) {
  //       return true
  //     }else {
  //       return false
  //     }
  //   });
  //   imgObj.addEventListener('error',(e) => {
  //     return false
  //   })
  // }

  checkImage = imgPath => {
    fetch(imgPath, {
      method: "GET",
      mode: "no-cors",      //可以在这设置跨域
    })
    .then((res) => {
      console.log("Response succeeded?", JSON.stringify(res.ok));
      console.log(JSON.stringify(res));
    }).catch((e) => {
      console.log("fetch fail", JSON.stringify(params));
    })
  }

  tabChange = e => {
    this.setState({ 
      activeKey: e,
      // clickFestival: '',
      // clickYear: new Date().getFullYear()
    })
  }
  // 选择时间
  chnageTime = (e) => {
    const { params } = this.state;
    this.setState({
      params:{
        ...params,
        detailedTime:moment(e).format('HH:mm:ss')
      }
    })
  }
  render() {
    const { page, pageSize, loading, activeKey, clickFestival } = this.state;
    const { dataList, total } = this.props.festivalManageNew && this.props.festivalManageNew.data;
    let pagination = {
      total: total,
      defaultCurrent: page,
      pageSize: pageSize,
      current: page,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this.onPageClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onPageClick(current, pageSize)
      },
    }
    const columns = [{
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      render: (value, row, index) => {
        return(<span key={index}>{(index + 1) + ( page - 1 ) * pageSize}</span>)
      }
    }, {
      title: '节日名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '节日类型',
      dataIndex: 'festivalType',
      key: 'festivalType',
      render: (value, row, index) => {
        return(<span>{value === 1 ? '中国节日' : value === 2 ? '世界节日' : '二十四节气'}</span>)
      }
    }, {
      title: '日期',
      dataIndex: 'LunarCalendar',
      key: 'LunarCalendar',
      // width: 100,
      render: (value, row, index) => {
        return(<span>{value+'（'+row.gregorianCalendar+'）'}</span>)
      }
    }, {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (value, row, index) => {
        const content = (<img src={value} />);
        if(value) {
          return(
            <Fragment key={index}>
              <Popover placement='rightTop' key={index} content={content}>
                <div style={{width: 40}}>
                  <Upload
                    beforeUpload={() => {return false}}
                    showUploadList={false}
                    accept= "image/jpg,image/jpeg,image/png"
                    onChange={this.iconChange.bind(this,row)}
                  >
                    <img src={value} style={{width:40,height:40}} />
                  </Upload>
                </div>
              </Popover>
            </Fragment>
          )
        }else {
          return(
            <Fragment key={index}>
              <Upload
                beforeUpload={() => {return false}}
                showUploadList={false}
                accept= "image/jpg,image/jpeg,image/png"
                onChange={this.iconChange.bind(this,row)}
              >
                <p style={{color: 'red', cursor: 'pointer'}}>立即上传</p>
              </Upload>
            </Fragment>
          )
        }
      }
    }, {
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      render: (value, row, index) => {
        const content = (<img src={value} width={600}/>);
        return(
          <Fragment key={index}>
            {value ? 
              <Popover placement='rightTop' key={index} content={content}>
                <div style={{width: 100}}>
                  <Upload
                    beforeUpload={() => {return false}}
                    showUploadList={false}
                    accept= "image/jpg,image/jpeg,image/png"
                    onChange={this.bannerChange.bind(this,row)}
                  >
                    <img src={value} style={{width:100}} />
                  </Upload>
                </div>
              </Popover>
               : 
              <Upload
                beforeUpload={() => {return false}}
                showUploadList={false}
                accept= "image/jpg,image/jpeg,image/png"
                onChange={this.bannerChange.bind(this,row)}
              >
                <p style={{color: 'red', cursor: 'pointer'}}>立即上传</p>
              </Upload>
            }
          </Fragment>
        )
      }
    }, {
      title: '海报',
      dataIndex: 'bgImg',
      key: 'bgImg',
      width:100,
      render: (value, row, index) => {
        const content = (<img src={value} height={600}/>);
        return(
          <Fragment key={index}>
            {value ? 
              <Popover placement='rightTop' key={index} content={content}>
                <div style={{width: 100}}>
                  <Upload
                    beforeUpload={() => {return false}}
                    showUploadList={false}
                    accept= "image/jpg,image/jpeg,image/png"
                    onChange={this.bgImgChange.bind(this,row)}
                  >
                    <img src={value} style={{width:100}} />
                  </Upload>
                </div>
              </Popover>
               : 
              <Upload
                beforeUpload={() => {return false}}
                showUploadList={false}
                accept= "image/jpg,image/jpeg,image/png"
                onChange={this.bgImgChange.bind(this,row)}
              >
                <p style={{color: 'red', cursor: 'pointer'}}>立即上传</p>
              </Upload>
            }
          </Fragment>
        )
      }
    }, 
    {
      title: '推送标题',
      dataIndex: 'pushTitle',
      key: 'pushTitle',
    },{
      title: '推送内容',
      dataIndex: 'pushText',
      key: 'pushText',
      width: 350
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.edit(true, row)}>编辑</a>
          </Fragment>
          )
      }
    }];
    if(clickFestival == '3'){
      columns.splice(4,0,{
        title: '时间',
        dataIndex: 'detailedTime',
        key: 'detailedTime',
        width: 100,
        render:key => key || '--'
      })
    }
    const parentMethods = {
      handleEdit: this.handleEdit,
      edit: this.edit,
      chnageTime:this.chnageTime
    }
   
    return (
      <PageHeaderLayout title="万年历">
            <Card bordered={false}>
              <Tabs
                activeKey={activeKey}
                tabBarGutter={10} 
                type='card'
                onChange={this.tabChange}
              >
                <TabPane tab={'节日节气旧版'} key='1'>
                  <ModuleIntroduce text={'万年历节日节气节日LOGO，图片设置，兼容旧版'} />
                  <FestivalManage tabChange={this.tabChange} />
                </TabPane>
                {/* <TabPane tab={'节日节气新版'} key='2'>
                  <ModuleIntroduce text={'万年历节日节气节日LOGO，图片设置，现用版'} />
                  <FestivalManageNew tabChange={this.tabChange}/>
                </TabPane> */}
                <TabPane tab={'节日节气新版'} key='3'>
                  <ModuleIntroduce text={'万年历节日节气节日LOGO，图片设置，最终版'} />
                  <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <Table 
                      style={{backgroundColor:'white',marginTop:16}}
                      columns={columns} 
                      rowKey="id"
                      dataSource={dataList} 
                      pagination={pagination}
                      loading={loading}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
            <CreateForm {...this.state} {...parentMethods} ref="myform"/>
      </PageHeaderLayout>
    );
  }
}
