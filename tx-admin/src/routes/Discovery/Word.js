import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Icon,
    Button,
    Table, 
    Modal,
    Select,
    Popconfirm,
    DatePicker,
    Input,
    Divider
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
import UploadFile from '../../components/UploadFile';
import UploadVideo from '../../components/UploadVideo';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params, getImgUrl, fileList, setFileList, changePath, upload, src, cancleUpload, success, loading } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          if(success) form.resetFields();
          btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    };
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "新增单词" : "编辑单词"}
            width={800}
            keyboard={false}
            maskClosable={false}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单词">
                {form.getFieldDecorator('word', {
                    rules: [{ required: true, message: '请输入单词' }],
                    initialValue: params ? params.word : '',
                })(<Input placeholder="请输入单词"  />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="汉语释义">
                {form.getFieldDecorator('definition', {
                    initialValue: params ? params.definition : '',
                })(<TextArea placeholder="请输入汉语释义"  rows={4}/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
                <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
            </FormItem>
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频地址">
                {form.getFieldDecorator('videoUrl', {
                    initialValue: params ? params.videoUrl : '',
                })(<Input placeholder="请输入视频"  />)}
            </FormItem> */}
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频地址">
                <UploadVideo changePath={changePath} upload={upload} src={src} cancleUpload={cancleUpload} loading={loading}/>
            </FormItem>
        </Modal>
    )
})
@connect(({ word, uploadVideo, loading }) => ({
    word,
    uploadVideo,
    loading: loading.models.word,
}))
@Form.create()
export default class Word extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        publishLoading: false,
        modalVisible: false,
        publishTime: moment(new Date().getTime()).format('YYYY-MM-DD'),
        modalVisibleTime: false,
        imgUrl:'',
        fileList:[],
        showSort: false,
        name: '',
        path: '',
        preview: null,
        data: null,
        success: false,
        videoUrl: '',
        videoVisible:false,
        videoPlayUrl:null,
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'word/getWord',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    ...fieldsValue,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {

                        }else {
                            message.error(res.message || '服务器错误');
                            
                        }
                        this.setState({ loading: false })
                    }
                }
            });
        });
    }

    reset = () => {
        this.setState({ loading: true, showSort: false });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'word/getWord',
            payload: {
                page: 1,
                pageSize: 10,
                word: '',
                publishId: ''
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({ page: 1, pageSize: 10, loading: false })
                    }else {
                        message.error(res.message || '服务器错误');
                        this.setState({ loading: false })
                    }
                }
            }
        });
    }

    optionChange = (a) => {
        if(a == '1') {
            this.setState({ showSort: true });
        }else {
            this.setState({ showSort: false });
        }
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="单词">
                        {getFieldDecorator('word',{
                            initialValue: '',
                        })(<Input placeholder="请输入单词" />)}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="发布状态">
                    {getFieldDecorator('publishId',{
                        initialValue: '',
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.optionChange} >
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
                <Col md={4} sm={24} >
                    <span style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                        重置
                        </Button>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }
    
    //pagination 点击分页
    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'word/getWord',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            fileList: params && params.imageUrl ? [{
                uid: -1,
                status: 'done',
                url: params.imageUrl
              }] : [],
            imgUrl: params ? params.imageUrl : null,
            src: params ? params.videoUrl : ''
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        const { success, videoUrl, imgUrl } = this.state;
        if( !success ) return message.error('请先上传视频');
        this.props.dispatch({
            type: 'word/addWord',
            payload: {
                graspWord: {
                    ...fields,
                    videoUrl: videoUrl,
                    imageUrl: imgUrl,
                    publishId: 0
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
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
    handleEdit = (fields) => {
        const { success, videoUrl, imgUrl } = this.state;
        // if( !success ) return message.error('请先上传视频');
        const { publishId, id } = this.state.params;
        this.props.dispatch({
            type: 'word/updateWord',
            payload: {
                graspWord: {
                    ...fields,
                    videoUrl: videoUrl,
                    imageUrl: imgUrl,
                    publishId: publishId,
                    id: id
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('编辑成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
            });
            this.setState({ modalVisible: false });
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
    //更改视频地址
    changePath = (e) => {
        const file = e.target.files[0];
        this.setState({ success: false })   //取消上传  
        if( !file ) return;
        let src,type = file.type;
        // 匹配类型为video/开头的字符串
        if (/^video\/\S+$/.test(type)) {
            src = URL.createObjectURL(file)
        }
        this.setState({ data: file, src: src, success: false })   //覆盖新视频
        
    }

    cancleUpload = () => {
        this.setState({ preview: null, path: '' })
    }

    // 上传文件
    upload = () => {
        const data = this.state.data;
        if (!data) {
            message.error('未选择文件');
            return;
        }
        this.setState({loading: true})
        const formData = new FormData();
        formData.append("videoFile", data);
        this.props.dispatch({
            type: 'uploadVideo/upload',
            payload: formData,
            callback: (res) => {
                if(res.code == 0) {
                    this.setState({
                        videoUrl: res.message,
                        success: true,
                        loading: false
                    });
                    message.success('视频上传成功')
                }else {
                    this.setState({
                        videoUrl: '',
                        success: false,
                        loading: false
                    });
                    message.error('服务器错误')
                }
            }
        })
    }

    publish = () => {
        this.setState({ publishLoading: true });
        const { publishTime, params } = this.state;
        if(!(!!publishTime)) return message.error('请选择发布时间');
        if(this.canPublish) {
            this.props.dispatch({
                type: 'word/addWord',
                payload: {
                    id: params.id,
                    publishId: 1,
                    publishTime: publishTime
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0'){
                            this.setState({ publishLoading: false });
                            this.getData();
                            message.success('发布成功')
                        }else{
                            this.setState({ publishLoading: false });
                            message.error(res.message || '服务器错误')
                        }
                    }
                    this.setState({ loading: false, modalVisibleTime: false, publishLoading: false });
                },
            })
        } 
        this.canPublish = false;
    }

    publishCancle = (params) => {
        this.props.dispatch({
            type: 'word/deleteWord',
            payload: {
                id: params.id,
                publishId: params.publishId,
                shareCount: params.shareCount
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('取消成功');
                        this.canPublish = true;
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

      //删除
    showDeleteConfirm = (params) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'word/deleteWord',
            payload: {
                id: params.id,
                publishId: 0
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    // 播放音频
    audioClick = ( url ) => {
        const _this = this;
        if(!url){
            _this.refs.audio.pause();
        }
        this.setState({
            audioUrl:url,
        },()=>{
            _this.refs.audio.onended = function(){
               _this.setState({
                    audioUrl:null
               })
            }
        })
    }
    // 播放视频
    videoPlay = ( url ) => {
        this.setState({
            videoVisible:true,
            videoPlayUrl:url
        })
        // 关闭音频
        this.audioClick(null);
    }
    // 关闭视频
    closeVideo = () => {
        this.setState({
            videoVisible:false,
            videoPlayUrl:null
        })
    }
    render() {
        const { dataList, total } = this.props.word.data && this.props.word.data.data || [];
        const  { page, pageSize, loading, modalVisibleTime, publishTime, publishLoading, audioUrl, videoVisible, videoPlayUrl } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '图片',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (value, row, key) => {
                return (
                  value ? <div style={{width:'100px',height:'60px'}}><img width="100" height="60" src={value}/></div> : null
                )
            }
          },{
            title: '单词',
            dataIndex: 'word',
            key: 'word',
          }, {
            title: '释义',
            dataIndex: 'definition',
            key: 'definition',
            width: 300
          }, {
            title: '音频',
            dataIndex: 'audioUrl',
            key: 'audioUrl',
            render: (value) => {
                let bool = false;
                if(audioUrl == value){
                    bool = true;
                }
                return(
                    <div>
                        {bool ? <Icon className={styles.audioBtn}  onClick={this.audioClick.bind(this,null)} type="pause-circle" /> 
                        :
                        <Icon className={styles.audioBtn} onClick={this.audioClick.bind(this,value)} type="play-circle" />
                        }
                    </div>
                )
            }
          }, {
            title: '视频',
            dataIndex: 'videoUrl',
            key: 'videoUrl',
            render: (value,row) => {
                return (
                    <div className={styles.videoCan} onClick={this.videoPlay.bind(this,value)}>
                        <img src={row.imageUrl} width="120" height="80" />
                        <Icon type="play-circle" className={styles.videoBtn}/>
                    </div>
                )
            }
          }, {
            title: '分享数',
            dataIndex: 'shareCount',
            key: 'shareCount',
          }, {
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount',
          }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null}</span>)
            }
          }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD') : null}</span>)
            }
          }, {
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
        const pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
              this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        };

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
            getImgUrl: this.getImgUrl,
            setFileList: this.setFileList,
            changePath: this.changePath,
            cancleUpload: this.cancleUpload,
            upload: this.upload
        };

        return(
            <div id="yagaping">
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
                    <div className={styles.tableListOperator}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                            添加
                        </Button>
                    </div>
                    <Table 
                        className={styles.myTable}
                        style={{backgroundColor:'white',marginTop:16}}
                        columns={columns} 
                        dataSource={dataList} 
                        pagination={pagination}
                        loading={loading}
                        rowKey='id'
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
                  {/* 发布时间 */}
                <Modal 
                    visible={modalVisibleTime}
                    onOk={this.publish}
                    onCancel={this.hideTimeModal}
                    title={"发布时间"}
                    footer={[
                        <Button key="back" onClick={this.hideTimeModal}>
                          取消
                        </Button>,
                        <Button key="submit" type="primary" loading={publishLoading} onClick={this.publish}>
                          确定
                        </Button>,
                      ]}
                >
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布时间">
                        <DatePicker style={{width: '100%'}} value={publishTime ?  moment(publishTime) : null} onChange={this.getDate} format="YYYY-MM-DD"  />
                    </FormItem>   
                </Modal>
                {/* 音频 */}
                <audio ref='audio' autoPlay={true} src={audioUrl} />
                {/* 视频 */}
                <Modal
                    visible={videoVisible}
                    width={560}
                    maskClosable={true}
                    footer={null}
                    destroyOnClose={true}
                    onCancel={this.closeVideo}
                >
                    <video src={videoPlayUrl} autoPlay={true} width="500" controls></video>
                </Modal>
            </div>
        )
    }
}