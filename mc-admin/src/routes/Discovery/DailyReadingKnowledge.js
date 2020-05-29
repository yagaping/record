import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Button,
    Table, 
    Input,
    Modal,
    DatePicker,
    Select,
    Divider,
    Popover,
    Popconfirm 
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import WangEditor from '../../components/WangEditor';
import UploadFile from '../../components/UploadFile';
import styles from './DailyReadingKnowledge.less';
import { setRichText } from '../../utils/toRichText';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Select;

@connect(({ dailyReadingKnowledge, loading }) => ({
    dailyReadingKnowledge,
    loading: loading.models.dailyReadingKnowledge,
}))
@Form.create()
export default class DailyReadingKnowledge extends PureComponent {
    state = {
        searchTitle:'',
        searchPage:0,
        searchSize:10,
        previewVisible: false,
        previewImage: '',
        modalVisible:false,
        modalTitle:'添加',
        title:'',
        content:'',
        imgUrl:'',
        fileList:[],
        desc:'',
        type:'',
        publishId:'',
        getPublishId:0,
        publishTime:null,
        modifeOrAdd:0,
        sendVisible:false,
        showSort: false
    };

    componentDidMount() {
        this.queryData();
        this.queryType();
    }
    // 查询数据
    queryData = () => {
        const { dispatch } = this.props;
        const { searchTitle,searchPage,searchSize,publishId} = this.state;
        dispatch({
            type:'dailyReadingKnowledge/queryData',
            payload:{
              title:searchTitle,
              page:searchPage,
              publishId,
              pageSize:searchSize
            },
            callback:(res)=>{
               
            }
        })
    }
    // 获取分类数据
    queryType = () => {
        const { dispatch } = this.props;
        dispatch({
            type:'dailyReadingKnowledge/queryType',
            callback:(res)=>{
                if(res.code == 0){
                    this.setState({
                        type:res.data[0],
                    })
                }
            }
        })
    }

    optionChange = (a, b) => {
        if(a == '1') {
            this.setState({showSort: true})
        }else {
            this.setState({showSort: false})
        }
    }

    // 搜索内容
    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="标题">
                        {getFieldDecorator('searchTitle', {
                            initialValue: '',
                        })(
                            <Input placeholder="输入标题" />
                        )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                        {getFieldDecorator('publishId', {
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
                        <Button type="primary" onClick={this.findData}>
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.findReset}>
                            重置
                        </Button>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }
    // 搜索查询
    findData = () => {
        const { dispatch } = this.props;
        const { searchPage, searchSize } = this.state;
        this.props.form.validateFields((err, fieldsValue) => {
            const { searchTitle,publishId,state } = fieldsValue;
            this.setState({
                searchTitle,
                publishId,
            })
            dispatch({
                type:'dailyReadingKnowledge/queryData',
                payload:{
                  state:state,
                  page:searchPage,
                  publishId,
                  pageSize:searchSize,
                  title: searchTitle,
                }
            })
          });
    }
    // 重置搜索
    findReset = () => {
        const { searchSize } = this.state;
        this.props.form.resetFields();
        this.setState({
            searchPage:0,
            searchTitle:'',
            publishId:'',
            showSort: false,
            state: '1'
        })
        this.props.dispatch({
            type:'dailyReadingKnowledge/queryData',
            payload:{
              title:'',
              publishId:'',
              page:0,
              state: '1',
              pageSize:searchSize
            },
            callback:(res)=>{
               
            }
        })
    }
    // 显示编辑弹框
    handleModalVisible = (key) => {
        const { typeData } = this.props.dailyReadingKnowledge;
        this.props.form.resetFields(['title']);
        let params = {
            title:'',
            imgUrl:'',
            content:'',
            publishTime:null,
            type:typeData[0],
            desc:'',
            getPublishId:0,
            fileList:[],
            modalVisible:true,
            modifeOrAdd:0,
        };
        if(key){
            params = {
                title:key.title,
                imgUrl:key.img,
                content:setRichText(key.content),
                publishTime:moment(key.updateTime),
                type:key.type,
                desc:key.desc,
                getPublishId:key.publishId,
                id:key.id,
                fileList:key.img ? [
                    {
                        uid:-1,
                        status:'done',
                        url:key.img,
                    }
                ] : [],
                modalVisible:true,
                modifeOrAdd:1,
            };
        }
        this.setState(params)

    }
    // 确定弹框
    okHandle = () => {
        const _this = this;
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        _this.handleEdit(fieldsValue);
      });
    }
    // 提交新增、编辑
    handleEdit = (data) => {
        const { dispatch } = this.props;
        const { imgUrl,content, id, modifeOrAdd,getPublishId } = this.state;
        const { title,publishTime,type,desc} = data;
        if(content == undefined) return message.error('文本与图片之间需回车换行');  
        let time =  publishTime ? moment(publishTime).format('YYYY-MM-DD') : null;
        const params = {
            title,
            desc,
            type,
            img:imgUrl,
            content,
            publishId:getPublishId,
        }
        let url = modifeOrAdd ? 'dailyReadingKnowledge/modifeData':'dailyReadingKnowledge/addData';
        if(modifeOrAdd){
            params.id = id;
        }
        dispatch({
            type:url,
            payload:{
                graspColdKnowledge:params
            },
            callback:(res)=>{
                if(res.code == 0){
                    this.setState({
                        modalVisible:false,
                    })
                    if(params.id){
                        message.success('修改成功');
                    }else{
                        message.success('添加成功');
                    }
                    this.queryData();
                }else {
                    message.error(res.message || '服务器错误');
                }
                this.handleCancel();
            }
        })
      
    }
    // 发布
    handleSend = (key) => {
        const { publishId, id } = key;
        const {dispatch} = this.props;
        const _this = this;
        if(publishId == 0){
            this.canPublish = true;  //打开发布框  设置标识
            this.setState({
                sendVisible:true,
                id,
            })
        }else{
            dispatch({
                type:'dailyReadingKnowledge/deleteData',
                payload:{
                    id:id,
                    publishId:publishId,
                    shareCount: key.shareCount
                },
                callback:(res)=>{
                    if(res.code == 0){
                        message.success('取消成功')
                        _this.queryData();
                        this.canPublish = true;    //本条数据取消发布成功  更改标识
                    }else{
                        message.error(res.message || '服务器错误')

                    }
                }
            })
        }
    }
    // 确定发布
    sendOk = () => {
        const { id } = this.state;
        if(this.canPublish) {
            this.props.form.validateFields((err,values)=>{
                const { sendTime } = values;
                if(!sendTime) return message.error('请选择发布时间');
                this.props.dispatch({
                    type:'dailyReadingKnowledge/addData',
                    payload:{
                        id,
                        publishTime:sendTime?moment(sendTime).format('YYYY-MM-DD'):null,
                        publishId:1,
                    },
                    callback:(res)=>{
                        if(res.code == 0){
                            message.success('发布成功');
                            this.queryData();
                            this.sendCancel();
                        }else {
                            message.error(res.message || '服务器错误')
                        }
                        this.sendCancel();
                    }
                })
            })
        }
        this.canPublish = false ;   
    }
    // 取消发布弹框
    sendCancel = () => {
        this.setState({
            sendVisible:false,
        })
    }
    
    // 删除
    handleDelete = (key) => {
        const { dispatch } = this.props;
        const { id } = key;
        const _this = this;
        dispatch({
            type:'dailyReadingKnowledge/deleteData',
            payload:{
                id,
                publishId:0,
            },
            callback:(res)=>{
                message.success('删除成功');
                _this.queryData();
            }
        })
    }
    // 取消编辑弹框
    handleCancel = () => {
      this.setState({
        modalVisible:false,
      })
      this.props.form.resetFields(['title','desc','type','publishTime']);
    }
    // 获取上传图片base64
    getImgUrl = (url) => {
      this.setState({
        imgUrl:url,
      })
    }
    // 获取富文本
    richText = (html) =>{
      this.setState({
        content:html
      })
    }
    // 分页改变
    onPageChange = (pagination) => {
        const { dispatch } = this.props;
        const { searchTitle, publishId } = this.state;
        const { current, pageSize } = pagination;
        this.setState({
            searchPage:current,
            searchSize:pageSize,
        });
        dispatch({
            type:'dailyReadingKnowledge/queryData',
            payload:{
                title:searchTitle,
                page:current,
                publishId,
                pageSize:pageSize                
            },
        })
    }
   
    // 设置图片
    setFileList = ( obj ) => {
        this.setState({
            fileList:obj
        })
    }
    render() {
      const { data:{list},pagination,loading,typeData} = this.props.dailyReadingKnowledge;
      const {
        modalVisible,
        modalTitle,
        content,
        title,
        desc,
        type,
        fileList,
        publishTime, } = this.state;
        const { getFieldDecorator } = this.props.form;
       const columns = [
            {
            title:'列表图片',
            dataIndex:'img',
            width:120,
            render:(key)=>{
                if(key) {
                    const content = <img src={key} style={{width:'400px',height:'240px',display:'block'}}/>;
                    return (
                        <Popover content={content} trigger="hover">
                        <div style={{width:'100px',height:'60px'}}><img width="100" height="60" src={key}/></div>
                        </Popover>
                    )
                }else {
                    return null;
                }
            }
           },
           {
            title:'标题',
            dataIndex:'title',
            width:200,
           },
           {
            title:'描述',
            dataIndex:'desc',
           },
           {
            title:'类型',
            dataIndex:'type',
            width:80,
           },{
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
            width:160,
          },{
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
            width:160,
          },
           {
            title:'更新时间',
            dataIndex:'updateTime',
            width:200,
            render:(value)=>{
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
            }
           },
           {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            width:120,
            render: (value, row, key) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD') : null}</span>)
            }
           },
           {
            title:'操作',
            key:'todo',
            width:200,
            render:(value, row, index)=>{
                return(
                    <Fragment key={index}>
                        <a href="javascript:;" onClick={this.handleModalVisible.bind(this,row)}>编辑</a>
                        <Divider type="vertical" />
                        {row.publishId == 0 ?
                            <a href="javascript:;" onClick={this.handleSend.bind(this,row)}>{'发布'}</a>
                          :
                            <a href="javascript:;" style={{color:"#3bfc7b"}} >{'已发布'}</a>
                        }
                        <Divider type="vertical" />
                        {row.publishId == 0 ?
                            <Popconfirm title="确定删除本条记录?" onConfirm={this.handleDelete.bind(this,row)}>
                              <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                            </Popconfirm>
                          :
                            <a href="javascript:;" onClick={this.handleSend.bind(this,row)}>{'取消发布'}</a>
                        }
                    </Fragment>
                )
            }
           },
       ]
        return(
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible()} >
                            添加
                        </Button>
                    </div>
                    <Table 
                        className={styles.myTable}
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={list} 
                        onChange={this.onPageChange}
                        pagination={pagination}
                        rowKey="id"
                        loading={loading}
                    />
                </div>
                <Modal 
                    visible={modalVisible} 
                    onOk={this.okHandle}
                    onCancel={this.handleCancel}
                //   maskClosable={false}
                    title={modalTitle}
                    width={1050}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入标题' }],
                            initialValue: title,
                        })(<Input placeholder='请输入标题' maxLength={200}/>)}
                    </FormItem>
                    <Row style={{paddingBottom:20}}>
                        <Col span={5} className={styles.tips}>上传图片：</Col>
                        <Col span={15}>
                        <UploadFile getImgUrl={this.getImgUrl} fileList={fileList} setFileList={this.setFileList}/>
                        </Col>
                    </Row>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                        {getFieldDecorator('desc', {
                            initialValue: desc,
                        })(
                        <TextArea 
                            rows={4}
                        />
                        )}
                    </FormItem>
                    <Row style={{paddingBottom:20}}>
                    <Col span={5} className={styles.tips}>内容：</Col>
                    <Col span={15}>
                        <WangEditor richText={this.richText} content={content} modalVisible={modalVisible} replaceLabel={true}/>
                    </Col>
                    </Row>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                        {getFieldDecorator('type', {
                            initialValue: type,
                        })(
                            <Select style={{width: '100%'}}>
                            {
                                typeData.length?typeData.map((item)=>{
                                    return  <Option key={item} value={item}>{item}</Option>
                                }):<Option>无</Option>
                            }
                            </Select> 
                        )}
                    </FormItem>
                </Modal>
                <Modal
                visible={this.state.sendVisible} 
                onOk={this.sendOk}
                onCancel={this.sendCancel}
                title='发布'
                width={360}
                keyboard={false}
                maskClosable={false}
                >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
                        {getFieldDecorator('sendTime', {
                            initialValue: moment(new Date()),
                        })(
                            <DatePicker  style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Modal>
            </div>
        )
    }
}