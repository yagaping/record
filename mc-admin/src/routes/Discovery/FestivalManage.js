import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Table,
 Divider,
 Form,
 Row,
 Col,
 Radio,
 Input,
 Button,
 Select,
 message,
 Carousel,
 Modal,
} from 'antd';
import styles from '../SystemManagement/TableList.less';
import "./styles.less";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(({ festivalManage, loading }) => ({
  festivalManage,
  loading: loading.models.festivalManage,
}))
@Form.create()
export default class FestivalList extends Component {
  state = {
    previewVisible: false,
    imgVisible: false,
    previewImage: '',
    imgArray: [],
    loading: false,
    page: 1,
    pageSize: 10
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = e => {
    const { dispatch, form } = this.props;
    this.setState({ loading: true });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        name: fieldsValue.name,
        type: fieldsValue.type,
        sharingType: fieldsValue.sharingType,
        page: this.state.page,
        pageSize: this.state.pageSize,
        number: 0     //新版节日节气传1   旧版传0
      };
      dispatch({
        type: 'festivalManage/queryFestival',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == '0') {
              this.setState({
                data: res.data ? res.data.dataList : {},
                total: res.data.total ? res.data.total : '',
                page: 1,
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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节日类型">
                {getFieldDecorator('type', {
                // rules: [{ required: true, message: '请选择节日' }],
                  initialValue: ''
                })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="">全部</Option>
                    <Option value="1">中国节日</Option>
                    <Option value="2">世界节日</Option>
                    <Option value="3">节气</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分享页类型">
              {getFieldDecorator('sharingType',{
                initialValue: '',
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value="">全选</Radio>
                  <Radio value="0">图片</Radio>
                  <Radio value="1">Html5</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
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
  //类型选择
  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      clientSystem: e.target.value,
    });
  }
  //重置
  handleFormReset = () => {
    this.setState({ loading: true });
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'festivalManage/queryFestival',
        payload: {
          page: 1,
          pageSize: 10,
          name: "",
          type: "",
          sharingType: "",
          number: 0
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
        type: 'festivalManage/queryFestival',
        payload: {
          name: fieldsValue.name,
          type: fieldsValue.type,
          sharingType: fieldsValue.sharingType,
          page: current,
          pageSize: pageSize,
          number: 0
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
        pathname: '/discover/festival-edit',
        params: params,
      }
    ));
  }
  //banner预览
  seeBanner = (params) => {
    if(params) {
      this.setState({
        previewVisible: true,
        previewImage: params,
      });
    }else{
      message.warn('未上传')
    }
  }

  handleCancel = () =>{
    this.setState({ previewVisible: false, previewVisibleNight: false })
  }

  imgCancel = () =>{
    this.setState({ imgVisible: false })
  }

  seeImg = (imgArray) => {
      this.setState({
        imgArray: imgArray,
        imgVisible: true,
      });
  }

  toNext = () => {
    Carousel.prev();
  }

  render() {
    const { total, dataList } = this.props.festivalManage &&  this.props.festivalManage.data;
    let { page, pageSize, previewVisible, previewImage, loading } = this.state;
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
      title: '节日图标',
      dataIndex: 'icon',
      key: 'icon',
      width:100,
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            {value ? <img src={value} style={{width:40,height:40}}/> : <p>未上传</p>}
          </Fragment>
          )
      }
    }, {
      title: '节日名',
      dataIndex: 'name',
      key: 'name',
      width:100,
    }, {
      title: '节日类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width:100,
    }, {
      title: '日期',
      dataIndex: 'festivalDate',
      key: 'festivalDate',
      width:100,
    }, {
      title: '推送标题',
      dataIndex: 'pushTitle',
      key: 'pushTitle',
      width:150,
    }, {
      title: '预提醒',
      dataIndex: 'perPushText',
      key: 'perPushText',
      width:150,
      render: (value, row, index) => {
        return(<a key={index} href={row.jumpLink ? row.jumpLink : 'javascript:;'} target='blank'>{value ? value : '暂无'}</a>)
      }
    }, {
      title: '提醒',
      dataIndex: 'pushText',
      key: 'pushText',
      render: (value, row, index) => {
        return(<a key={index} href={row.jumpLink ? row.jumpLink : 'javascript:;'} target='blank'>{value ? value : '暂无'}</a>)
      }
    }, {
      title: '分享页类型',
      dataIndex: 'bgImg',
      key: 'bgImg',
      width:150,
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            {
              row.sharingType == '0' 
              ?
              <a href="javascript:;" onClick={() => this.seeImg(row.bgImg)}>图片</a>
              :
              <a href={row.url} target='blank'>Html5</a>
            }
          </Fragment>
          )
      }
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
            <a href="javascript:;" onClick={() => this.seeBanner(row.banner)} >Banner预览</a>
            <Divider type="vertical" />
          </Fragment>
          )
      }
    }];
    return (
      <div>
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
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Modal visible={this.state.imgVisible} footer={null} onCancel={this.imgCancel} width={360} style={{position:'relative'}}>
            <Carousel beforeChange={this._change} autoplay>
              {this.state.imgArray.length > 0  && this.state.imgArray.map((item, i) => {
                return <div><img alt={i} src={item}  width='320' /></div>
              })}
            </Carousel>
          </Modal>
        </div>
      </div>   
    );
  }
}
