import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker, Row, Col,
  Checkbox, Cascader, Modal  } from 'antd';
import moment from 'moment';
import styles from './UserLimit.less';
import UserLimitTable from '../../components/UserLimitTable';

const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@Form.create()
@connect(state => ({
  userLimit: state.userLimit,
}))
export default class UserLimit extends PureComponent{
  state = {
    id:null,
    userId:0,
    selectVal:[],
  }
  componentDidMount(){
    this.queryLimt();
  }

  // 查询职位
 queryLimt = (pId,dId=0,uId) => {
    const { dispatch } = this.props;
    dispatch({
      type:'userLimit/queryLimt',
      payload:{},
      callback:(res) => {
        const id = dId; //部门ID
        const projectId = pId || res[0].value; //项目ID
        const userId = uId || 0;
         if(id){
          // 查询角色
          dispatch({
            type:'userLimit/queryRole',
            payload:{
              id,
              size:100,
            },
          });
         }
        // 权限列表
        dispatch({
          type:'userLimit/queryItemList',
          payload:{
            projectId,
            userId,
          },
        });
      }
    });
 }
   
  
//  选择职位
onChange = (e) => {
  if(e.length>=2){
    this.setState({
      id:e[1],
      userId:e[2],
    });
  }else{
    this.setState({
      id:null,
    });
  }
  this.queryLimt(e[0],e[1],e[2]);
  this.setState({
    jobId:e[2]||null,
  })
}
// 选择岗位
onHandleRole = (e) => {
  const { dispatch } = this.props;
  const { selectVal } = this.state;
  if(selectVal.length > e.length){
    let cancelSel = [];
    if(e.length>0){
      for(let i=0;i<selectVal.length;i++){
        let mark = false;
        for(let j=0;j<e.length;j++){
          if(selectVal[i] == e[j]){
            mark = true;
          }
        }
        if(!mark){
          cancelSel.push(selectVal[i]);
        }
      }
    }else{
      cancelSel = [...selectVal];
    }
    
    // 获取取消选择岗位的数据
    dispatch({
        type:'userLimit/listByRoleId',
        payload:{
          departmentLevelId:[...cancelSel],  
        },
        callback:(res)=>{
          dispatch({
            type:'userLimit/cancelLimitData',
            payload:res,
          });
        },
      });
      // 获取选择岗位的数据
      dispatch({
        type:'userLimit/listByRoleId',
        payload:{
          departmentLevelId:[...e],  
        },
        callback:(res)=>{
          dispatch({
            type:'userLimit/updataLimitData',
            payload:res,
          });
        },
      });     
  }else{
    // 获取选择岗位的数据=>增加选项，不存在取消选项时
    dispatch({
        type:'userLimit/listByRoleId',
        payload:{
          departmentLevelId:[...e],  
        },
        callback:(res)=>{
          dispatch({
            type:'userLimit/updataLimitData',
            payload:res,
          });
        },
      });
  }
  this.setState({
    selectVal:[...e],
  })
  
}
 // 选择项目Dom
 formHtml = () => {
  const { selectJobData } = this.props.userLimit;
  if(selectJobData.length>0){
       return (
          <div className={styles.cascader}>
              <label>用户：</label>
              <Cascader className={styles.cascader_content} 
              options={selectJobData}
              defaultValue={[selectJobData[0].value]} 
              onChange={this.onChange} 
              changeOnSelect
              placeholder="Please select" />
              <Button type="primary" onClick={this.handleSave}>保存</Button>
          </div>
      );
  }
}
// 保存操作
handleSave = () => {
  const { selectTypeData } = this.props.userLimit;
  const { jobId } = this.state;
  if(!jobId){
    Modal.info({
      title: '请选择用户',
      content: (
        <div>
          <p>你还没选择相应用户</p>
        </div>
      ),
      onOk() {},
    });
  return;
  }
  let array = [];
  for(let i=0;i<selectTypeData.length;i++){
    let obj = {};
    obj.userId = jobId;
    obj.functionId = selectTypeData[i].id;
    obj.isRead = selectTypeData[i].isRead;
    obj.isWrite = selectTypeData[i].isWrite;
    obj.type = selectTypeData[i].type;
    array.push(obj);
    let child = selectTypeData[i].children;
    if(child && child.length>0){
      for(let j=0;j<child.length;j++){
        obj = {};
        obj.userId = jobId;
        obj.functionId = child[j].id;
        obj.isRead = child[j].isRead;
        obj.isWrite = child[j].isWrite;
        obj.type = child[j].type;
        array.push(obj);
      }
      
    }
  }
  this.props.dispatch({
    type:'userLimit/limitSave',
    payload:{
      userId:jobId,
      userList:array,
    },
  });
}
// 选择岗位Dom
roleHtml = () => {
  const { roleList } = this.props.userLimit;
  if(roleList.length>0){
    let plainOptions = [];
    for(let i=0;i<roleList.length;i++){
      let obj = {};
      obj.label = roleList[i].name;
      obj.value = roleList[i].id;
      plainOptions.push(obj);
    }
    return (
      <div>
        <label>岗位：</label>
        <CheckboxGroup options={plainOptions} onChange={this.onHandleRole} />
      </div>
    );
  }
}
  render(){
    const { userLimit } = this.props;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.limit}>
            <div className={styles.title}>权限管理</div>
            <div className={styles.number}>
               {this.formHtml()}
            </div>
            <div className={styles.role}>
             {this.roleHtml()}
            </div>
            <UserLimitTable
              data={userLimit.selectTypeData}
              loading={userLimit.loading}
              select={userLimit.topSelect}
            />
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
