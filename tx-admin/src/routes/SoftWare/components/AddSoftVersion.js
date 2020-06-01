import React, { PureComponent } from 'react';
import {
  Form,
  Input, 
  Select,
  Modal,
} from 'antd';
import { connect } from 'dva';
import styles from '../index.less';
const { Option } = Select;
const { TextArea } = Input;
const FORCE = [
  {
    key:0,
    name:'否'
  },{
    key:1,
    name:'是'
  }
]
@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class AddSoftVersion extends PureComponent{
  constructor(props){
    super(props);
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
  renderForm(){
    const { getFieldDecorator } = this.props.form;
    const {
      data:{
        versionName,
        note,
        versionId,
        updateFlag,
        updateDetail,
        fileSelect,
        files,
        selectProject,
        projectName,
      },
      slelectFile
    } = this.props;
    let fileName = files.name;
    let list = selectProject;
    let projectName2 = projectName ? projectName : selectProject.length ? selectProject[0].name : null;
    if(!fileSelect){
      let arr = files.name.split('/');
      fileName = arr[arr.length-1];
    }
    return  (<Form>
        <Form.Item label="版本名称">
          {getFieldDecorator('versionName', {
            initialValue:versionName,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="项目名称">
          {getFieldDecorator('projectName', {
            initialValue:projectName2,
          })(<Select>{
            list.map(item=><Option key={item.name} value={item.name}>{item.name}</Option>)
          }</Select>)}
        </Form.Item>
        <Form.Item label="版本号">
          {getFieldDecorator('versionId', {
              initialValue:versionId,
              rules:[{ required: true, message: '请输入版本号!' }]
            })(<Input />)}
        </Form.Item>
        
        <Form.Item label="强制更新">
          {getFieldDecorator('updateFlag',{
            initialValue:updateFlag
          })(  
           <Select>
             { FORCE.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)}
           </Select>
          )}
        </Form.Item>
        <Form.Item label="应用包">
          <div>
            <span className={styles.fileBtn}>
              请选择文件
              <Input type="file" onChange={slelectFile}/>
            </span>
            <span className={styles.label}>{fileName}</span>
          </div>
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('note', { 
            initialValue:note
             })(<Input />)}
        </Form.Item>
        <Form.Item label="更新详情">
          {getFieldDecorator('updateDetail', { 
            initialValue:updateDetail,
             })(<TextArea autosize={{ minRows: 6, maxRows: 8 }}/>)}
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
              maskClosable={false}
              destroyOnClose
            >
                { this.renderForm() }
            </Modal>
      );
  }
}
