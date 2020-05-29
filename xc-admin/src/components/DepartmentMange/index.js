import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Button, Icon  } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const number = ['一','二','三','四','五','六','七','八','九','十'];
const { Option } = Select;
@Form.create()
class DepartmentMange extends PureComponent {
    state = {
        addDom:[],
        projectId:'',
    };
    // 新增部门
    htmlData = () => {
        const { projectData, departmentData } = this.props.data;
        const { addDom } = this.state;
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
              return ;
            } 
            let item = [];
            let list = [];
            if(addDom.length+departmentData.length<10){
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

    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
              return ;
            } 
            const { projectId } = values;
            const { onSave } = this.props;
            const { projectData, departmentData, selectProject } = this.props.data;
            const { addDom } = this.state;
            const newData = [...departmentData,...addDom];
            let i = 0; 
            for(let item in values){
                if(item == 'projectId'){
                    continue;
                }
              newData[i].name = values[item];
              newData[i].projectId = projectId;
              i++;
            }
            this.setState({
              addDom:[],
            });
            onSave(newData);
          }); 
    }
    // 选择项目
    selectProject = () => {
        const { getFieldDecorator } = this.props.form;
        const { projectData, selectProject } = this.props.data;
        const options = projectData.map((item,index) => {
            return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
            );
        });
        const select = (
            <FormItem
            style={{height:40,marginBottom:10}}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="项目名称"
          >
           {getFieldDecorator('projectId', { initialValue: selectProject })(
                <Select style={{ width: '100%' }} onChange={this.handleChange}>
                    { options }
                </Select>
            )}
          </FormItem>
        );
        return select;
    } 
    // 选择项目事件
    handleChange = (val) => {
        const { onSelect } = this.props;
        this.setState({
            addDom:[],
          });
        onSelect(val);
    }
    render(){
        const { projectData, departmentData } = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const { addDom } = this.state;
        const newData = [...departmentData,...addDom];
        const html = newData.map((item,index) => {
            let sub = index;
            return (
                <div key={index}>
                    <FormItem
                        style={{height:40,marginBottom:10}}
                        label={`部门${number[sub]}`}
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
        });
        return (
            <div className={styles.project+' '+styles.department}>
                <Form onSubmit={this.handleSubmit} style={{width:300}} >
                    { this.selectProject() }
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
export default DepartmentMange;