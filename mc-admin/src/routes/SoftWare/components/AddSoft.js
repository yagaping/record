import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input, 
  Select,
  Modal,
} from 'antd';
import { connect } from 'dva';
import UploadFile from '../../../components/UploadFile';
const { Option } = Select;
const PLATFORM = [
  {
    key:1,
    name:'iOS'
  },{
    key:2,
    name:'Android'
  },{
    key:3,
    name:'Windows'
  }
]
const EDITION = [
  {
    key:0,
    name:'不区分'
  },{
    key:1,
    name:'开发版'
  },{
    key:2,
    name:'生产版'
  },{
    key:3,
    name:'预生产版'
  }
]
@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class AddSoft extends PureComponent{
  constructor(props){
    super(props);
    this.platform = 1;
  }
  state = {
    version:'',
    describe:'',
    type:false,
  };
  handleOk = () => {
    const _this = this;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      _this.props.editorOk(values);
    });

  }
  // 选择平台
  modalPlatform = (val) => {
    this.platform = val;
  }
  renderForm(){
    const { getFieldDecorator } = this.props.form;
    const {
      data:{
        projectName,
        platform,
        appUin,
        edition,
        subtitle,
        rank,
        group,
        selectPlatform,
        fileList
      },
      getThumbnailUrl,
      setThumbnailFileList,
      modalPlatform
    } = this.props;
    return  (<Form>
        <Form.Item label="项目名称">
          {getFieldDecorator('projectName', {
            initialValue:projectName,
            rules:[{ required: true, message: '请输入项目名称!' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="平台">
          {getFieldDecorator('platform',{
            initialValue:platform
          })(  
            <Select onChange={modalPlatform}>
              {
                PLATFORM.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)
              }
            </Select>
          )}
        </Form.Item>
        {
          selectPlatform == 1 && (
            <Fragment>
               <Form.Item label="应用唯一标识">
                {getFieldDecorator('appUin', { 
                  initialValue:appUin,
                  rules:[{ required: true, message: '请输入应用唯一标识!' }]
                  })(<Input placeholder='请输入应用唯一标识' />)}
              </Form.Item>
              <Form.Item label="SUBTITLE">
                {getFieldDecorator('subtitle', { 
                  initialValue:subtitle,
                  rules:[{ required: true, message: '请输入SUBTITLE!' }]
                  })(<Input />)}
              </Form.Item>
          </Fragment>
          )
        }
        <Form.Item label="运行环境">
                {getFieldDecorator('edition', { 
                  initialValue:edition,
                  })(<Select>
                    {
                      EDITION.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)
                    }
                  </Select>)}
              </Form.Item>
        <Form.Item label="LOGO">
          <UploadFile getImgUrl={getThumbnailUrl} fileList={fileList} setFileList={setThumbnailFileList} />
        </Form.Item>
        <Form.Item label="排序">
          {getFieldDecorator('rank', { 
            initialValue:rank||'0',
            rules:[{ required: true, message: '请输入排序!' }]
             })(<Input />)}
        </Form.Item>
        <Form.Item label="分组">
          {getFieldDecorator('group', { 
            initialValue:group,
            rules:[{ required: true, message: '请输入分组!' }]
             })(<Input />)}
        </Form.Item>
      </Form>);
  }
  render() {
    const { data:{visible,title,loading}, width } = this.props;
    return (
            <Modal
              confirmLoading={loading}
              width={width}
              title={title}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.props.onCancel}
              destroyOnClose
              maskClosable={false}
            >
                { this.renderForm() }
            </Modal>
      );
  }
}
