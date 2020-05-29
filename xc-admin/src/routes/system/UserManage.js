import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker, Modal, Checkbox, Radio,
  Cascader,Dropdown,Menu,Icon } from 'antd';
import moment from 'moment';
import UserListTable from '../../components/UserListTable';
import { sizeType, sizeChange } from '../../components/SizeSave';
import AlertTips from '../../components/AlertTips';
import styles from './UserManage.less';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const _DISABLED = 1;
const _ACTIVE = 2;
const _RESET_PWD = 3;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
@Form.create()
@connect(state => ({
  adminUserList: state.adminUserList,
  projectRole:state.projectRole,
}))
class UserManage extends PureComponent{
  state = {
      username:'',
      status:-1,
      index:0,
      size:10,
      titleBtn:'',
      modalVisible:false,
      disabled:false,
      user:{
        userId:'',
        account:'',
        name:'',
        project:0,
        phone:'',
        email:'',
        stateRadio:0,
        check1:true,
        check2:true,
        job:[],
      },
      alertTips:{
        visible:false,
        type:'',
        title:'',
        html:'',
      }
  }
  componentDidMount(){
    this.queryUserList();
    this.limitData();
  }

  // 查询用户列表
  queryUserList = () => {
      const { username, status, index} = this.state;
      let size = sizeType(this.state.size,this.props);
      this.props.dispatch({
        type:'adminUserList/query',
        payload:{
          username,
          status,
          index,
          size,
        }
      })
  }

  // 添加用户
  addAccount = () => {
    this.setState({
      titleBtn:'添加账号',
    })
    this.setState({ modalVisible:true });
  }

  // 关闭弹框
  setModalVisible = (modalVisible) => {
    this.setState({
      titleBtn:'添加账号',
      disabled:false,
      user:{
        userId:'',
        account:'',
        password:0,
        setPwd:'',
        name:'',
        phone:'',
        email:'',
        stateRadio:0,
        check1:true,
        check2:true,
        job:[],
      }
    })
    this.setState({ modalVisible });
  }

  // 提交信息
  handleSubmit = (e) => {
    if(e){
      e.preventDefault();
    }
    const { dispatch,form } = this.props;
    form.validateFields((err,filedsValue)=>{
    
      if(!err){
        const username = filedsValue.account;
        const realName = filedsValue.name;
        const phone = filedsValue.phone;
        const status = filedsValue.stateRadio;
        const projectId = filedsValue.job[0];
        const departmentId = filedsValue.job[1];
        const departmentLevelId = filedsValue.job[2];
        const mail = filedsValue.email;
        const id = this.state.user.userId;
        let isDataMail = 1;
        let isErrorMsg = 1;
        let url = 'adminUserList/addUser';
        if(!filedsValue.check1){
          isDataMail = 0;
        }
        if(!filedsValue.check2){
          isErrorMsg = 0;
        }
        if(this.state.disabled){
          url = 'adminUserList/updateUserInfo';
        }
        dispatch({
          type:url,
          payload:{
            id,
            username,
            realName,
            phone,
            status,
            projectId,
            departmentId,
            departmentLevelId,
            mail,
            isDataMail,
            isErrorMsg,
          },
          callback:(res) => {
            this.queryUserList();
            this.setModalVisible(false);
          }
        });
        
      }
    });
  }

   // 查询三级联动，选择职位
   limitData = () => {
    const { dispatch } = this.props;
    // 选择岗位
    dispatch({
      type:'projectRole/selectJob',
      payload:{
      },
    });
  }
 
  // 读写用户相关信息
  userHtml = () => {
    let {user:{ account, password, setPwd, name, project, phone,
    email, stateRadio, check1, check2, job }, disabled } = this.state;
    
    const { getFieldDecorator } = this.props.form;
    const { selectJobData } = this.props.projectRole;
    
    return (
      <Form>
        <FormItem 
          {...formItemLayout}
          label="账号">
          {getFieldDecorator('account', { 
            initialValue: account, 
            rules:[
              {required: true, message: '请输入你的账号!',},
            ],
          })(
            <Input placeholder="" disabled={disabled} maxLength="20"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="姓名"
        >
          {getFieldDecorator('name', { 
            initialValue: name,
            rules:[
              {required: true, message: '请输入你姓名!',}
            ],
           })(
             <Input placeholder="" maxLength="20"/>
          )}
        </FormItem>
          <FormItem
          {...formItemLayout}
          label="Level"
        >
          {getFieldDecorator('job', { 
            initialValue: job,
            rules: [{ type: 'array', required: true, message: '请选择职位！' }], 
          
          })(
             <Cascader options={selectJobData} changeOnSelect/>
          )}
          </FormItem>
        <FormItem 
          {...formItemLayout}
          label="电话">
          {getFieldDecorator('phone', { initialValue: phone })(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label="邮件">
          {getFieldDecorator('email', { initialValue: email })(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('stateRadio', { initialValue: stateRadio })(
            <RadioGroup>
              <Radio value={0}>正常</Radio>
              <Radio value={1}>禁用</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem style={{marginBottom:0}}
          {...formItemLayout}>
          {getFieldDecorator('check1', { valuePropName: 'checked',initialValue: check1 })(
            <Checkbox>每日、每周、每月数据通过邮件报告</Checkbox>
          )}
        </FormItem>
        <FormItem  style={{marginBottom:0}}
          {...formItemLayout}>
          {getFieldDecorator('check2', { valuePropName: 'checked',initialValue: check2 })(
             <Checkbox>宕机、异常短信通知</Checkbox>
          )}
        </FormItem>
      </Form>
    );
  }

  // 计算多少天前的日期
  historyDate(day){
    var date1 = new Date(),
    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+day);
    var month = (date2.getMonth()+1) > 9 ?(date2.getMonth()+1):'0'+(date2.getMonth()+1);
    var day = date2.getDate() > 9 ? date2.getDate() :'0' + date2.getDate();
    var time2 = date2.getFullYear()+"-"+month+"-"+day;
    return time2;
  }

  // 表格分页
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const index = (current - 1);
    const { username, status } = this.state;
    sizeChange(pageSize, this.props);
    this.setState({
      index,
      size:pageSize,
    });
    this.props.dispatch({
      type:'adminUserList/query',
      payload:{
        username,
        status,
        index,
        size:pageSize,
      }
    });
  }

  // 更多
  handleTabelMore = (row) => {

    const menu = (
      <Menu>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.handelModify.bind(this,row)}>修改</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.handleDisabled.bind(this,row)}>
          {row.status == 0 ?'禁用':'恢复'}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.handleActive.bind(this,row)}>解封冻结</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={this.handleResetPwd.bind(this,row)}>重置密码</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" href="JavaScript:void(0)">
          更多<Icon type="down" />
        </a>
      </Dropdown>
    );
  }
  
  // 修改
  handelModify = (row) => {
    let check1 = true;
    let check2 = true;
    let job = [row.projectId,row.departmentId,row.departmentLevelId];
    if(!row.isDataMail){
      check1 = false;
    }
    if(!row.isErrorMsg){
      check2 = false;
    }
    this.setState({
      titleBtn:'编辑账号',
      modalVisible:true,
      disabled:true,
      user:{
        userId:row.id,
        account:row.username,
        name:row.realName,
        project:row.projectType,
        phone:row.phone,
        email:row.mail,
        stateRadio:row.status,
        check1,
        check2,
        job,
      }
    })
  }

  // 禁用、恢复
  handleDisabled = (row) => {
    let status;
    let title;
    let html;
    if(row.status == 1){
      status = 0;
      title = '恢复账号';
      html = `是否恢复账号『${row.username}』？`;
    }else if(row.status == 0){
      status = 1;
      title = '禁用账号';
      html = `是否禁用账号『${row.username}』？`;
    }
    this.setState({
      alertTips:{
        visible:true,
        type:_DISABLED,
        title,
        id:row.id,
        status,
        html,
      }
    });
  }

  // 解封冻结
  handleActive = (row) => {
    this.setState({
      alertTips:{
        visible:true,
        type:_ACTIVE,
        title:'解封冻结',
        id:row.id,
        html:`是否解封账号『${row.username}』？`,
      }
    });
  }

  // 重置密码
  handleResetPwd = (row) => {
    this.setState({
      alertTips:{
        visible:true,
        type:_RESET_PWD,
        title:'重置密码',
        id:row.id,
        html:`是否将密码重置（123456）？`,
      }
    });
  }

  // 确定tips操作
  handleTipsOk = () => {

    const _this = this;
    const { alertTips:{type, id, status}} = this.state;
    const { dispatch } = this.props;
    let params = {};
    let url;
    if(type == 1){
      url = 'adminUserList/modifyStatus';
      params = {
        id,
        status,
      };
    }else if(type == 2){
      url = 'adminUserList/modifyUserByLoginStatus';
      params = {
        id,
      };
    }else if(type == 3){
      url = 'adminUserList/resetPwd';
      params = {
        id,
      };
    }
    dispatch({
      type:url,
      payload:params,
      callback:(res) => {
        if(res.code == 0){
          _this.setState({
            alertTips:{
              visible:false,
            }
          })
          _this.queryUserList();
        }else{
          message.error(res.message);
        }
      }
    });
  }

  //取消tips操作
  handleTipsNo = () => {
    this.setState({
      alertTips:{
        visible:false,
        title:'',
        html:'',
      }
    });
  } 
  


  // 添加账号DoM
  renderSimpleForm = () => {
    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY-MM-DD';
    return (
        <div className={styles.line}>
          <div className={styles.title}>账户管理</div>
          <div className={styles.addBtn}>
            <Button type="primary" onClick={this.addAccount}>添加账号</Button>
          </div>
        </div>
    );
  }
  render(){
    const { data, loading } = this.props.adminUserList;
    const { titleBtn, modalVisible, alertTips } = this.state;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <UserListTable 
              data={data}
              loading={loading}
              state={this.state}
              handleTabelMore={this.handleTabelMore}
              onTableChange={this.handleTableChange}
            />
          </div> 
          <Modal
          title={ titleBtn }
          wrapClassName="vertical-center-modal"
          visible={modalVisible}
          maskClosable={false}
          destroyOnClose={true}
          onOk={this.handleSubmit}
          onCancel={() => this.setModalVisible(false)}
        >
        {this.userHtml()}
        </Modal>
        <AlertTips
          alertTips={alertTips}
          onOk={this.handleTipsOk}
          onCancel={this.handleTipsNo}
        />
        </Card>
			</PageHeaderLayout>
    )
  }
}

export default UserManage;