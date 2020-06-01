import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Table,
 Divider,
 Form,
 Row,
 Col,
 Input,
 Button,
 Select,
 message,
 Popconfirm,
 Modal,
 DatePicker
} from 'antd';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
import WangEditor from '../../components/WangEditor';
import UploadFile from '../../components/UploadFile';
import { setRichText } from '../../utils/toRichText';

const { Option } = Select;
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, btn, params,  content, richText, setFileList, fileList, getImgUrl } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      title={btn == "add" ? "新增故事" : "编辑故事"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={1050}
      keyboard={false}
      maskClosable={false}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
        <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入标题' }],
          initialValue: params ? params.title : '',
        })(<Input placeholder="请输入标题"  maxLength={200}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
        {form.getFieldDecorator('author', {
          // rules: [{ required: true, message: '请输入作者' }],
          initialValue: params ? params.author : '',
        })(<Input placeholder="请输入作者"  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本内容">
          <WangEditor richText={richText} content={content} modalVisible={modalVisible} replaceLabel={true}/>         
      </FormItem>
    </Modal>
  );
});

@connect(({ story, loading }) => ({
    story,
    loading: loading.models.story,
}))
@Form.create()

export default class Story extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        modalVisible: false,
        loading: false,
        content:[],
        imgUrl:'',
        fileList:[],
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        modalVisibleTime: false,
        showSort: false
    };

  componentDidMount() {
      this.getStory();
  }

  optionChange = (a, b) => {
    if(a == '1') {
      this.setState({ showSort: true });
    }else {
      this.setState({ showSort: false });
    }
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title',{
                initialValue: '',
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="发布状态">
              {getFieldDecorator('publishId',{
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.optionChange}>
                    <Option value="">全部</Option>
                    <Option value="0">待发布</Option>
                    <Option value="1">已发布</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {
            this.state.showSort ? 
            <Col md={4} sm={24}>
                <FormItem label="排序方式">
                    {getFieldDecorator('state', {
                        initialValue: '1',
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="1">发布时间</Option>
                            <Option value="2">收藏数</Option>
                            <Option value="3">分享数</Option>
                        </Select>
                    )}
                </FormItem>
            </Col> :
            null
          }
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.getStory}>
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
      fileList: params && params.img ? [{
        uid: -1,
        status: 'done',
        url: params.img
      }] : [],
      content: params ?  setRichText(params.content) : [],
      imgUrl: params ? params.img : null
    });
    this.refs.myform.resetFields();
  };
  //查询
  getStory = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        page: this.state.page,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'story/getStoryList',
        payload: values,
        callback: (res) => {
          if(res) {
            if(res.code == 0) {
  
            }else {
              message.error(res.message || "服务器错误")
            }
          }
        }
      });
    });
  }
  //新增
  handleAdd = fields => {
    const { imgUrl,content } = this.state;
    if(content == undefined) return message.error('文本与图片之间需回车换行');     
    this.props.dispatch({
      type: 'story/addStoryList',
      payload: {
        graspDailyArticle: {
          ...fields,
          img: imgUrl,
          content: content,
          publishId: 0
        }
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0') {
            this.getStory();
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
    const { imgUrl, content } = this.state;
    const { publishId, id } = this.state.params;
    if(content == undefined) return message.error('文本与图片之间需回车换行');    
    this.props.dispatch({
      type: 'story/updateStoryList',
      payload: {
        graspDailyArticle: {
          ...fields,
          img: imgUrl,
          content: content,
          publishId: publishId,
          id: id
        }
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.getStory();
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
    this.setState({ loading: true, showSort: false });
    form.resetFields();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        title: '',
        publishId: '',
        page: 1,
        pageSize: 10,
      };
      dispatch({
        type: 'story/getStoryList',
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
  //删除
  showDeleteConfirm = (params) => {
      const dispatch  = this.props.dispatch;
      dispatch({
        type: 'story/deleteStoryList',
        payload: {
          id: params.id,
          publishId: 0
        },
        callback: (res) => {
          if(res) {
            if(res.code == '0'){
              this.getStory();
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
        type: 'story/getStoryList',
        payload: {
          ...fieldsValue,
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

  
  // 获取富文本
  richText = (html) =>{
      this.setState({
          content:html
      })
  }

  // 设置图片
  setFileList = ( obj ) => {
      this.setState({
          fileList:obj
      })
  }

  // 获取上传图片base64
  getImgUrl = (url) => {
    this.setState({
      imgUrl:url,
    })
  }

   //发布时间弹框
  showTimeModal = (flag, params) => {
    this.canPublish = true;
    this.setState({
      modalVisibleTime: !!flag,
      params: params,
      // publishTime: new Date()
    })  
  }
  
  hideTimeModal = () => {
    this.showTimeModal();
  }
  //获取时间
  getDate = (publishTime, dateString) => {
    this.setState({
      publishTime: dateString
    })
  }

  publish = () => {
    const { publishTime, params } = this.state;
    if(!(!!publishTime)) return message.error('请选择发布时间');
    if(this.canPublish) {
      this.props.dispatch({
        type: 'story/addStoryList',
          payload: {
            id: params.id,
            publishId: 1,
            publishTime: publishTime
          },
          callback: (res) => {
            if(res) {
              if(res.code == '0'){
                this.getStory();
                message.success('发布成功')
              }else{
                message.error(res.message || '服务器错误')
              }
            }
            this.setState({ loading: false, modalVisibleTime: false  });
          },
      })
    }
    this.canPublish = false;
  }

  publishCancle = (params) => {
    this.props.dispatch({
      type: 'story/deleteStoryList',
      payload: {
        id: params.id,
        publishId: params.publishId,
        shareCount: params.shareCount
      },
      callback: (res) => {
        if(res) {
          if(res.code == '0'){
            this.getStory();
            message.success('取消成功');
            this.canPublish = true;
          }else{
            message.error(res.message || '服务器错误');
          }
        }
      }
    })
  }

  render() {
    let { dataList, total } = this.props.story.data && this.props.story.data.data || [];
    let { page, pageSize, loading, modalVisibleTime, publishTime} = this.state;
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '图片',
      dataIndex: 'img',
      key: 'img',
      render: (value, row, key) => {
        return (
          value ? <div style={{width:'100px',height:'60px'}}><img width="100" height="60" src={value}/></div> : null
        )
      }
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    }, {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
    },{
      title: '收藏数',
      dataIndex: 'collectCount',
      key: 'collectCount',
    },
    // {
    //   title: '内容',
    //   dataIndex: 'content',
    //   key: 'content',
    //   render: (value, row, index) => {
    //     return(<p style={{width: 600, overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{value}</p>)
    //   }
    // }, 
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (value, row, key) => {
          return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
      }
    }, {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      render: (value, row, key) => {
          return(<span>{value ? moment(value).format('YYYY-MM-DD') : null}</span>)
      }
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
              <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
              <Divider type="vertical" />
              {row.publishId == 0 ?
                  <a href="javascript:;" onClick={ () => this.showTimeModal(true,row) }>{'发布'}</a>
                :
                  <a href="javascript:;" style={{color:"#3bfc7b"}} >{'已发布'}</a>
              }
              <Divider type="vertical" />
              {row.publishId == 0 ?
                  <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
                    <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                  </Popconfirm>
                :
                  <a href="javascript:;" onClick={ () => this.publishCancle(row)}>{'取消发布'}</a>
              }
          </Fragment>
        )
      }
    }];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      richText: this.richText,
      getImgUrl: this.getImgUrl,
      setFileList: this.setFileList,
    };

    return (
        <div>
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
            <CreateForm {...parentMethods} {...this.state} ref="myform"/>
            {/* 发布时间 */}
            <Modal 
                visible={modalVisibleTime}
                onOk={this.publish}
                onCancel={this.hideTimeModal}
                title={"发布时间"}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布时间">
                    <DatePicker style={{width: '100%'}} value={publishTime ? moment(publishTime) : null} onChange={this.getDate} format="YYYY-MM-DD"  />
                </FormItem>   
            </Modal>
        </div>  
    );
  }
}
