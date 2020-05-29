import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, Icon } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const number = ['一','二','三','四','五','六','七','八','九','十'];
@Form.create()
class ProjectMange extends Component {
  state = {
    addDom:[],
  }
 
  // 新增条目
  htmlData = () => {
    const { data } = this.props;
    const { addDom } = this.state;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return ;
      } 
      let item = [];
      let list = [];
      if(addDom.length+data.length<10){
        item.push({
          id:'',
          name:'',
        });
        list = [...addDom,...item];
        this.setState({
          addDom:list,
        })
      }
    });  
  }

  // 提交数据
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return ;
      } 
      const { data, onSave } = this.props;
      const { addDom } = this.state;
      const newData = [...data,...addDom];
      let i = 0; 
      for(let item in values){
        newData[i].name = values[item];
        i++;
      }
      this.setState({
        addDom:[],
      });
      onSave(newData);
    }); 
  }
 
  render(){
      const { data } = this.props;
      const { addDom } = this.state;
      const { getFieldDecorator } = this.props.form;
      let socuse = data;
      if(addDom){
        socuse = [...data,...addDom];
      }
      const html = socuse.map((item,index) => {
        let sub = index;
        return (
          <div key={index}>
            <FormItem
              style={{height:40,marginBottom:10}}
              label={`项目${number[sub]}`}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {getFieldDecorator(`value${sub+1}`, {
              initialValue: item.name})(
              <Input placeholder="" />
            )}
            </FormItem>
          </div>
        );
      })
      return (
        <div className={styles.project}>
          <Form onSubmit={this.handleSubmit} style={{width:300}} >
            { html }
            <div>
              <Button type="primary" className={styles.save} htmlType="submit">保存</Button>
            </div>
          </Form>
          <div className={styles.addItem}>
              <Button type="primary" onClick={this.htmlData}><Icon type="plus" />添加项目</Button>
          </div>
        </div>
      )
  }
};
export default ProjectMange;