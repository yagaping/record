import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Popconfirm,
  Popover,
  Table,
  Input,
  Card,
  Button,
  Row,
  Col,
  Divider,
  message
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import moment from 'moment';
import ModalEditor from './components/ModalEditor.js';
const FormItem = Form.Item;

@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
}))
@Form.create()
export default class List extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    title: '',
    id: null,
    page:1,
    pageSize:10,
    modalData:{
      btn:'add',
      modifyTitle:'',
      modifyNote:'',
      modifLabel:'',
      modalVisible:false,
      content:'',
      fileList:[],
    }
  };
  componentDidMount(){
     this.getData();
  }
  getData = () => {
    this.props.form.validateFields((err, values) => {
      const {  title, id } = values;
      const { page, pageSize } = this.state;
      this.props.dispatch({
        type:'article/query',
        payload:{
          title,
          id,
          page,
          pageSize
        }
      })
    });
  }
  reset = () => {
    this.props.form.resetFields();
    this.setState({
      title:"",
      id:null,
      page:1,
      pageSize:10,
    },()=>{
      this.getData();
    })
  }
  onCancel = () => {
    this.setState({
      modalData:{
        ...this.state.modalData,
        modalVisible:false
      }

    })
  }
  onClick = (size, page) => {
    this.setState({
      pageSize:page,
      page:size
    },()=>{
      this.getData();
    })
  }

  saveData(rows){
    let btn = rows ? 'editor' : 'add';
    let params = {
          btn,
          id:rows?rows.id:null,
          modalVisible:true,
          modifyTitle:rows ? rows.title : '',
          modifyNote:rows ? rows.note : '',
          modifLabel:rows ? rows.label : '',
          content:rows ? rows.content : '',
          imgUrl:rows ? rows.imgUrl : null,
          fileList:rows && rows.imgUrl ? [{
            uid: -1,
            status: 'done',
            url: rows.imgUrl || '',
        }] : [],
    };
    this.setState({
      modalData:{
        ...this.state.modalData,
        ...params,
      }
    })
  }

  searchForm(){
    const { getFieldDecorator } = this.props.form;
    const { title, id } = this.state;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="ID">
                {getFieldDecorator('id',{
                  initialValue:id
                })(<Input placeholder="请输入查询ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标题">
                {getFieldDecorator('title',{
                  initialValue:title
                })(<Input placeholder="请输入查询标题" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem>
                <span style={{ marginBottom: 24 }}>
                    <Button type="primary" onClick={this.getData}>
                    查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                    重置
                    </Button>
                </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  // 删除
  delete(row){
    const { id } = row;
    this.props.dispatch({
      type:'article/delete',
      payload:{id},
      callback:res=>{
        if(res.code == 0){
          this.getData();
          message.success('删除成功');
        }else{
          message.success(res.message||'删除失败')
        }
      }
    })
  }
  // 设置富文本
  richText = (html) => {
    this.setState({
      modalData:{
        ...this.state.modalData,
        content:html
      }
    })
  }
   // 设置图片
   setFileList = ( obj ) => {
      this.setState({
          modalData:{
            ...this.state.modalData,
            fileList:obj
          }

      })
   }

    // 获取上传图片base64
    getImgUrl = (url) => {
        this.setState({
            modalData:{
              ...this.state.modalData,
              imgUrl:url,
            }
        })
    }
  // 保存
  okHandle = (values, form) => {
    const { dispatch } = this.props;
    const { modalData:{ content, imgUrl, btn, id } } = this.state;
    const { modifyTitle, modifyNote, modifLabel } = values;
    let url,
    params = {
      title:modifyTitle,
      note:modifyNote,
      LabelId: modifLabel||'',
      imgUrl
    }
    if(!imgUrl){
      message.info('请上传图片');
      return;
    }
    if(btn == 'add'){
      url = 'addArticle'
    }else{
      url = 'modifyArticle';
      params.id = id;
    }
    dispatch({
      type:`article/${url}`,
      payload:{
        news:{
          ...params
        },
        content,
      },
      callback:res=>{
        if(res.code == 0){
          let text = btn == 'add' ? '新增成功' : '修改成功';
          this.getData();
          message.success(text)
        }else{
          let text = btn == 'add' ? '新增失败' : '修改失败';
          message.error(res.message || text);
        }
        form.resetFields();
        this.onCancel();
      }
    })

  }
  render() {
    const { loading, article } = this.props;
    const { data:{dataList = [], total = 0} } = article;
    const { page, pageSize } = this.state;
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
    const columns = [
      {
        title:'ID',
        width:100,
        key:'id',
        dataIndex:'id',
      },
      {
        title:'标题',
        key:'title',
        width:300,
        render:row => {
          return <a target="_blank" href={'https://www.mc.cn/news/'+row.id+'.html'}>{row.title}</a>
        }
      },{
        title:'图片',
        key:'imgUrl',
        dataIndex:'imgUrl',
        render:key => {
          return key ? (
            <Popover placement="right" content={<img width={300} src={key}/>}>
              <img width={120} src={key}/>
            </Popover> ) : '--';
          
        }
      },{
        title:'标签',
        key:'label',
        dataIndex:'label',
        width:150,
        render:key => {
          let text = key || '--';
          return <div style={{minWidth:50}}>{text}</div>
        }
      },{
        title:'浏览数',
        key:'viewCount',
        dataIndex:'viewCount',
        width:100,
        render:key => {
          let text = key || '--';
          return <div>{text}</div>
        }
      },{
        title:'描述',
        key:'note',
        dataIndex:'note',
        render:key=> key || '--'
      },{
        title:'创建时间',
        width:180,
        key:'createTime',
        dataIndex:'createTime',
        render:key=> key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : '--'
      },{
        title:'操作',
        width:110,
        key:'todo',
        render:row => {
          return (
            <Fragment>
              <a href="javascript:void(0)" onClick={()=>this.saveData(row)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定删除？"
                onConfirm={()=>this.delete(row)}
              >
              <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </Fragment>
          )
        }
      }
    ]
    const events = {
      okHandle:this.okHandle,
      onCancel:this.onCancel,
      richText:this.richText,
      getData:this.getData,
      getImgUrl:this.getImgUrl,
      setFileList:this.setFileList
    }
    return (
      <PageHeaderLayout title={'文章列表'}>
        <Card bordered={false}>
           <div className={styles.search}>{ this.searchForm() }</div>
           <div className={styles.addBtns}>
             <Button type="primary" icon="plus" onClick={this.saveData.bind(this,null)}>新增</Button>
           </div>
           <Table
            className={styles.myTable}
            style={{backgroundColor:'white',marginTop:16}}
            columns={columns}
            dataSource={dataList}
            pagination={pagination}
            loading={loading}
            rowKey='id'
            scroll={{ x : 1770}}
            />
            <ModalEditor { ...this.state.modalData } { ...events }/>
        </Card>
    </PageHeaderLayout>
    );
  }
}
