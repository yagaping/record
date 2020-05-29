import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Button, Icon  } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const number = ['一','二','三','四','五','六','七','八','九','十'];
const { Option } = Select;
@Form.create()
class PostMange extends PureComponent {
    state = {
        addDom:[],
        defaultSelect:'',
        visible:false,
        departmentId:'',
    };
    
    // 选择部门
    selectProject = () => {
        const { getFieldDecorator } = this.props.form;
        const { departmentData } = this.props.data;
        let defaultSelect = '';
        if( departmentData.length>0 ){
            this.setState({
                visible:true,
            });
            const options = departmentData.map((item,index) => {
                if(index==0){
                    defaultSelect = item.projectName+'/'+item.name
                }
                return (
                    <Option key={item.id} value={item.id}>{item.projectName}/{item.name}</Option>
                );
            });
            const projectName = localStorage.getItem('projectName');
            const projectId = localStorage.getItem('projectId'); 
            const select = (
                <FormItem
                style={{height:40,marginBottom:10}}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="项目/部门"
            >
            {getFieldDecorator('jobId', { initialValue: defaultSelect })(
                    <Select style={{ width: '100%' }} onChange={this.handleChange}>
                        { options }
                    </Select>
                )}
            </FormItem>
            );
            return select;
        }else{
            this.setState({
                visible:false,
            });
            return <p>此项目暂未添加部门</p>;
        }
        
    } 
    // 选择项目部门
    handleChange = (val) => {
        this.setState({
            departmentId:val,
        });
        const { onSelect } = this.props;
        this.setState({
            addDom:[],
          });
        onSelect(val);
    }
    // 添加条目
    htmlData = () => {
        const { jobData } = this.props.data;
        const { addDom } = this.state;
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
              return ;
            } 
            let item = [];
            let list = [];
            if(addDom.length+jobData.length<10){
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
    //提交数据
    handleSubmit = () => {
        const { form, data } = this.props;
        const { departmentData } = data;
        const departmentId = this.state.departmentId || departmentData[0].id;
        form.validateFields((err, values) => {
            if (err) {
              return ;
            } 
            const { projectId } = values;
            const { onSave } = this.props;
            const { jobData } = this.props.data;
            const { addDom } = this.state;
            const newData = [...jobData,...addDom];
            let i = 0; 
            for(let item in values){
                if(item == 'jobId'){
                    continue;
                }
              newData[i].name = values[item];
              newData[i].departmentId = departmentId;
              i++;
            }
            this.setState({
              addDom:[],
            });
            console.log(newData);
            onSave(newData);
          }); 
    }
  
    render(){
        const { visible, addDom } = this.state;
        const { jobData } = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const newData = [...jobData,...addDom];
        const html = newData.map((item,index) => {
            let sub = index;
            return (
                <div key={index}>
                    <FormItem
                        style={{height:40,marginBottom:10}}
                        label={`岗位${number[sub]}`}
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
                <Button type="primary" className={visible ? styles.save : styles.hidden} htmlType="submit">保存</Button>
                </div>
                </Form>
                <div className={visible ? styles.addItem : styles.hidden}>
                    <Button type="primary" onClick={this.htmlData}><Icon type="plus" />添加项目</Button>
                </div>
            </div>
        )
    }
};
export default PostMange;