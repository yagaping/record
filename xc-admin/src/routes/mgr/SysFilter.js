import React, { PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { 
    Card,
    Form, 
    Input , 
    Button, 
    Select, 
    Modal, 
    Spin, 
    Icon, 
    Row, 
    Col,
    Menu, 
    Dropdown,
    message,
    Upload,
    Popconfirm,
   } from 'antd';
import styles from './SysFilter.less';
import SysFilterTab from '../../components/SysFilterTab';
import { sizeType, sizeChange } from '../../components/SizeSave';
import { returnAtIndex } from 'lodash-decorators/utils';

const FormItem = Form.Item;
const { Option  } = Select;
const { TextArea } = Input;
@Form.create()
@connect(state => ({
  contentMgr: state.contentMgr,
}))
export default class SysFilter extends PureComponent{
  
  state = {
    visible:false,
    title:'',
    selectKey:'0',
    selectType:'0',
    selectWay:'0',
    disabled:false,
    selectBool:true,
    editModify:0,
    tips:null,
    tips_text:null,
    params:{
      type:'',
      keywords:'',
      index:1,
      size:10,
    },
  }
  componentDidMount(){
    this.querySysList();
    
  }

  // 查询列表
  querySysList = () => {
    const { dispatch } = this.props;
    const { params } = this.state;

    // 读缓存每页条数
    params.size = sizeType(params.size,this.props);
    dispatch({
      type:'contentMgr/querySysList',
      payload:{
       ...params,
      },
    });
  }

  // 搜索
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {index, size } = this.state.params;
    form.validateFields((err, values) => {
      if (!err) {
        const { type, content } = values;
        const params = {
          type,
          index:1,
          size,
          keywords:content,
        };
        this.setState({
          params,
        });
        dispatch({
          type:'contentMgr/querySysList',
          payload:{
           ...params,
          },
        });
      }
    });
  }
  // 重置
  reset = () => {
    this.props.form.resetFields();
    const { dispatch } = this.props;
    const  params = {
              type:'',
              keywords:'',
              index:1,
              size:10,
            };
    this.setState({
      params,
    })
    dispatch({
      type:'contentMgr/querySysList',
      payload:{
       ...params,
      },
    });
  }
  // 表格分页
  onTableChange = (pagination, filters, sorter) => {
    
    const { current, pageSize } = pagination;
    const index = current;
    const { params:{type, keywords} } = this.state;
    const params = {
      type,
      keywords,
      index,
      size:pageSize,
    };
    sizeChange(pageSize, this.props);
    this.setState({
      params,
    });
    this.props.dispatch({
      type:'contentMgr/querySysList',
      payload:{
        ...params,
      },
    });
  }

  // 新增
  addItem = () => {
   
    this.setState({
      editModify:0,
      visible:true,
      selectBool:true,
      title:'新增',
      selectKey:'0',
      selectType:'0',
      selectWay:'0',
      disabled:false,
      addKeyWork:'',
      replaceWord:'', 
      section:'',
    });
  }

  // 确定新增、编辑
  handleOk = () => {
    const _this = this;
    const {dispatch, form} = this.props;
    const {index, size } = this.state.params;
    form.validateFields((err, values) => {
      if (!err) {
        const params = {
          keywords:values.addKeyWork,
          replaceContent:values.replaceWord,
          description:values.section,
          validateType:values.selectKey,
          type:values.selectType,
          contentType:values.selectWay,
        };
        let isBank = params.keywords.replace(/(^\s*)|(\s*$)/g,'');
     
        if(!params.keywords||!isBank){
          this.setState({
            tips:'error',
            tips_text:'请输入关键字！',
          });
          return;
        }
        let url;
        if(!this.state.editModify){
          url = 'contentMgr/addSysItem';
        }else{
          url = 'contentMgr/modSysItem';
          params.id = this.state.id;
        }
        dispatch({
          type:url,
          payload:{
            ...params,
          },
          callback:(res) => {
            if(res.code ==0){
              _this.querySysList();
              _this.setState({
                visible:false,
              });
            }else{
              // message.error(res.message);
              _this.setState({
                tips:'error',
                tips_text:res.message,
              });
            }
          }
        });
        
      }
    });
    
  }

  // 取消新增、编辑
  handleCancel = (type) =>{
    this.setState({
      visible:false,
      tips:null,
      tips_text:null,
    });
  }
  // 操作更多
  handleMore = (row) =>{
    
    let text;
    if(row.status == 0){
      text = '取消激活';
    }else if(row.status == 1){
      text = '激活';
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <Popconfirm placement="top" title='是否删除？' onConfirm={this.delete.bind(this,row)}>
            <a href="javascript:void(0)">删除</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.modify.bind(this,row)}>修改</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.active.bind(this,row)}>{text}</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
      <a className="ant-dropdown-link" href="javascript:void(0)">
        更多<Icon type="down" />
      </a>
    </Dropdown>
    );
    
  }
  // 删除
  delete = (row) =>{
    const _this = this;
    this.props.dispatch({
      type:'contentMgr/deleteData',
      payload:{
        id:row.id,
      },
      callback:(res)=>{
        if(res.code ==0){
          message.info('删除成功！');
          _this.querySysList();
        }else{
          message.error(res.message);
        }
      }
    });
  }
  // 修改
  modify = (row) => {
    let selectBool = true;
    if(row.type == 1){
      selectBool = false;
    }
    this.setState({
      editModify:1,
      id:row.id,
      visible:true,
      selectBool,
      title:'修改',
      selectKey:row.validateType+'',
      selectType:row.type+'',
      addKeyWork:row.keywords,
      replaceWord:row.replaceContent, 
      section:row.description,
    });
  }
  // 激活、取消激活
  active = (row) => {
    const _this = this;
    const params = {
      id:row.id,
    };
    let text;
    if(row.status == 0){
      params.status = 1;
      text = '取消激活成功！';
    }else if(row.status == 1){
      params.status = 0;
      text = '激活成功！';
    }
    this.props.dispatch({
      type:'contentMgr/activeSysItem',
      payload:{
        ...params,
      },
      callback:(res) => {
        if(res.code ==0){
          message.info(text);
          _this.querySysList();
          _this.setState({
            visible:false,
          });
        }
      }
    });
  }
  // 新增，选择类型
  handleSelectType = (e) => {
    if(e == 1){
      this.setState({
        selectBool:false,
      });
    }else if(e == 0){
      this.setState({
        selectBool:true,
      });
    }
  }
  // 选择新闻来源
  handleWay = (e) => {
    let disabled = false;
    let selectType = '0';
    let selectBool = true;
    if(e==1){
      disabled = true;
      selectType = '1';
      selectBool = false;
    }
    if(e == 2){
      disabled = true;
      selectType = '0';
    }
    // 动态改变表单值
    this.props.form.setFieldsValue({
      selectType,
    })
    this.setState({
      disabled,
      selectBool,
      selectWay:e,
    })
  }
  handleFocus = (e) =>{
    this.setState({
      tips:null,
      tips_text:null,
    });
  }

  // 上传图片
  handleUpload = (info) => {
    let  addKeyWork = this.props.form.getFieldsValue().addKeyWork;
    const res = info.file;
    let text = addKeyWork;
    if(res.status == 'done' && res.response.code == 0){
      if(text){
        text +=`\n`+ res.response.result;
      }else{
        text +=  res.response.result;
      }
      this.props.form.setFieldsValue({
        addKeyWork:text,
      });
      this.setState({
        addKeyWork:text,
      })
    }
    // 删除
    if(res.status == "removed" && res.response.code == 0){
      text = text.replace(/(\r|\n)/g,'-').split('-');
      for(let i=0;i<text.length;i++){
        if(res.response.result == text[i]){
          text.splice(i,1);
          this.props.form.setFieldsValue({
            addKeyWork:text.join('\n'),
          });
          this.setState({
            addKeyWork:text.join('\n'),
          });
          break;
        }
      }
    }
   
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { 
      params:{type, keywords}, 
      visible, 
      title, 
      selectKey, 
      selectType, 
      selectBool,
      selectWay,
      disabled,
      replaceWord,
      section,
      tips,
      tips_text,
    } = this.state;
    let addKeyWork = this.state.addKeyWork;
    const { contentMgr } = this.props;
    const { sysFilterData } = contentMgr;
    let showUpload = selectWay == 2 ? 'block' : 'none';
 
    return ( 
      <PageHeaderLayout>
				<Card bordered={false}>
            <div className={styles.formSearch}>
              <Form onSubmit={this.handleSubmit}>
                <dl>
                  <dd>
                    <FormItem
                      label='搜索内容'
                      labelCol={{span:5}}
                      wrapperCol={{span:19}}
                    >
                      {getFieldDecorator('content', {
                       initialValue:keywords,
                      })(
                        <Input placeholder='请输入'/>
                      )}
                    </FormItem>
                  </dd>
                  <dd style={{width:160}}>
                  <FormItem
                      label='类型'
                      labelCol={{span:7}}
                      wrapperCol={{span:17}}
                    >
                      {getFieldDecorator('type', {
                       initialValue:type,
                      })(
                        <Select>
                          <Option value=''>全部</Option>
                          <Option value='0'>内容替换</Option>
                          <Option value='1'>关键字跳过</Option>
                        </Select>
                      )}
                    </FormItem>
                  </dd>
                  <dd>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                      >查询</Button>
                      <Button onClick={this.reset} style={{marginLeft:10}}>重置</Button>
                    </FormItem>
                  </dd>
                </dl>
              </Form>
            </div>
            <div className={styles.addNew}>
                <Button type="primary" onClick={this.addItem}><Icon type="plus" />新增</Button>
            </div>
            <div className={styles.tableData}>
                <SysFilterTab 
                  list={sysFilterData.list}
                  loading={contentMgr.loading}
                  pagination={sysFilterData.pagination}
                  onTableChange={this.onTableChange}
                  onMore={this.handleMore}
                />
            </div>
            <Modal
              visible={visible}
              title={title}
              width={600} 
              destroyOnClose={true}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
                <div className={styles.selectType}>
                  <Form >
                  <FormItem
                        label='内容类型'
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                      >
                        {getFieldDecorator('selectWay', {
                        initialValue:selectWay,
                        })(
                          <Select onChange={this.handleWay}>
                           <Option value='3'>标题</Option>
                            <Option value='0'>新闻内容</Option>
                            <Option value='1'>新闻来源</Option>
                            <Option value='2'>MD5</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        label='图片上传'
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                        style={{display:showUpload}}
                      >
                        <Upload
                          name='file'
                          action='/work-api/sysKeywords/upload'
                          onChange={this.handleUpload}
                        >
                          <Button>
                            <Icon type="upload" />上传
                          </Button>
                        </Upload>
                      </FormItem>
                    <FormItem
                        label='匹配类型'
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                      >
                        {getFieldDecorator('selectKey', {
                        initialValue:selectKey,
                        })(
                          <Select>
                            <Option value='0'>关键字</Option>
                            <Option value='1'>正则表达式</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        label='类型'
                        labelCol={{span:4}}
                        wrapperCol={{span:10}}
                      >
                        {getFieldDecorator('selectType', {
                        initialValue:selectType,
                        })(
                          <Select onChange={this.handleSelectType} disabled={disabled}>
                            <Option value='0'>关键字替换</Option>
                            <Option value='1'>关键字跳过</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem
                        label='关键字'
                        labelCol={{span:4}}
                        wrapperCol={{span:18}}
                        validateStatus={tips}
                        help={tips_text}
                      >
                        {getFieldDecorator('addKeyWork', {
                        initialValue:addKeyWork,
                        })(
                          <TextArea rows={4} placeholder='输入关键字，多个用回车键分隔' id='error' onFocus={this.handleFocus}/>
                        )}
                      </FormItem>
                      <FormItem
                        label='替换内容'
                        labelCol={{span:4}}
                        wrapperCol={{span:18}}
                        className={selectBool ? styles.show : styles.hide}
                      >
                        {getFieldDecorator('replaceWord', {
                        initialValue:replaceWord,
                        })(
                          <TextArea rows={4} placeholder='输入替换内容'/>
                        )}
                      </FormItem>
                      <FormItem
                        label='备注'
                        labelCol={{span:4}}
                        wrapperCol={{span:18}}
                      >
                        {getFieldDecorator('section', {
                        initialValue:section,
                        })(
                          <TextArea rows={4} placeholder='输入备注'/>
                        )}
                      </FormItem>
                    </Form>
                 </div>
            </Modal>
        </Card>
			</PageHeaderLayout>
    )
  }
}
