import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker, Row, Col,
  Checkbox, Menu, Icon, Spin  } from 'antd';
import styles from './ProjectRole.less';

import ProjectMange from '../../components/ProjectMange';
import DepartmentMange from '../../components/DepartmentMange';
import PostMange from '../../components/PostMange';
import LimitMange from '../../components/LimitMange';
import { POINT_CONVERSION_HYBRID } from 'constants';

const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@Form.create()
@connect(state => ({
  projectRole: state.projectRole,
}))
export default class ProjectRole extends PureComponent{
  state = {
    key:'1',
    selectProjectId:'',
  }
  componentDidMount(){
    this.projectData();
  }
  // 查询项目管理数据
  projectData = () => {
    this.props.dispatch({
      type:'projectRole/queryProjectRole',
      payload:{},
    });
  }
  // 查询部门管理数据
  departmentData = (pId) => {
    const { projectData,selectProject } = this.props.projectRole;
    const { dispatch } = this.props;
    let projectId = selectProject ? selectProject:projectData[0].id;
    if(pId){
      projectId = pId;
    }
    
    dispatch({
      type:'projectRole/queryProjectRole',
      payload:{},
      callback:() => {
        dispatch({
          type:'projectRole/queryDpartment',
          payload:{
            projectId,
          },
        });
      },
    });
  }
  // 查询岗位管理数据
  postData = (dId) => {
    const { dispatch } = this.props;
    const projectId = localStorage.getItem('projectId');
      dispatch({
        type:'projectRole/queryDpartment',
        payload:{
          projectId,
        },
        callback:(res) => {
          let jobId;
          if(dId || res.result.length>0){
            jobId = dId || res.result[0].id;
          }
          dispatch({
            type:'projectRole/queryJobList',
            payload:{
              id:jobId,
              size:100,
            },
          })
        }
      });
      
  }
  // 查询岗位权限管理数据
  limitData = () => {
    const { dispatch } = this.props;
    // 选择岗位
    dispatch({
      type:'projectRole/selectJob',
      payload:{
      },
      callback:(res)=>{
        // 查询权限选择数据
        dispatch({
          type:'projectRole/limitSelect',
          payload:{
            projectId:res[0].value,
            departmentLevelId:0,
          },
        });
      }
    });
  }
  // 查询权限菜单数据
  queryLimitList = (data) => {
    const {  projectId, jobId } = data;
    const { dispatch } = this.props;
    // 查询权限选择数据
    dispatch({
      type:'projectRole/limitSelect',
      payload:{
        projectId:projectId,
        departmentLevelId:jobId||0,
      },
    });
  }

  // 选中的key
  handleClick = (e) => {
    this.setState({
      key:e.key
    })
    switch(e.key){
      case '1':
        this.projectData();
        break;
      case '2':
        this.departmentData();
        break;
      case '3':
        this.postData();
        break;
      case '4':
        this.limitData();
        break;
    }
  }
  // 项目管理=>保存
  projectSave = (data) => {
    const { projectRole } = this.props;
    for(let i=0;i<data.length;i++){
      if(data[i].name==''&&projectRole.selectProject==data[i].id){
        projectRole.selectProject = '';
      }
    }
    const _this = this;
    this.props.dispatch({
      type:'projectRole/projectSave',
      payload:data,
      callback:() => {
        _this.projectData();
      }
    });
  }
  // 部门管理=>保存
  departmentSave = (data) => {
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type:'projectRole/departmentSave',
      payload:data,
      callback:() => {
        _this.departmentData();
      }
    })

  }
  //岗位管理=>保存
  postSave = (data) => {
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type:'projectRole/postSave',
      payload:data,
      callback:() => {
        _this.postData(this.state.departmentId);
      },
    });
  }

  // 权限选择 => 保存
  limitSave = (data) => {
     this.props.dispatch({
            type:'projectRole/jobLimitSave',
            payload:data,
        });
  }
  // 选择项目
  handleSelectProject = (pId) => {
    const { dispatch } = this.props;
    const _this = this;
    dispatch({
      type:'projectRole/modifySelectProject',
      payload:pId,
    });
    _this.departmentData(pId);
  }

  //选择项目部门
  handleSelectDepartment = (dId) => {
    this.setState({
      departmentId:dId,
    });
    this.postData(dId);
  }

  // 菜单内容
  itemHtml = () => {
    const { key } = this.state;
    const { projectRole } = this.props;
    const { projectData, departmentData, selectProject } = projectRole;
    if(key == '1'){
      return <ProjectMange data={ projectData } onSave={this.projectSave} />;
    }else if(key == '2'){
      return <DepartmentMange data={ projectRole } onSave={this.departmentSave} onSelect={this.handleSelectProject}/>;
    }else if( key == '3'){
      return <PostMange data={ projectRole } onSave={this.postSave} onSelect={this.handleSelectDepartment} />;
    }else if(key == '4'){
      return <LimitMange data={ projectRole } onSave={this.limitSave} onLimitList={this.queryLimitList}
      select={projectRole.topSelect}
      />;
    }
  }
  render(){
    const { key } = this.state;
    const { loading } = this.props.projectRole;
    return (
      <PageHeaderLayout>
				<Card bordered={false} className={styles.warps}>
          <div className={styles.projectRole}>
            
              <Menu
                onClick={this.handleClick}
                style={{ width: 256 }}
                className={styles.menu}
                defaultSelectedKeys={[this.state.key]}
                defaultOpenKeys={['sub1']}
                mode="inline"
              >
                <SubMenu key="sub1" title={<span><Icon type="home" /><span>项目角色导航</span></span>}>
                  <Menu.Item key="1">项目管理</Menu.Item>
                  <Menu.Item key="2">部门管理</Menu.Item>
                  <Menu.Item key="3">岗位管理</Menu.Item>
                  <Menu.Item key="4">岗位权限</Menu.Item>
                </SubMenu>
              </Menu>
                <div className={styles.item}>
                  <Spin spinning={loading}>
                    {this.itemHtml()}
                  </Spin>
                </div>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
