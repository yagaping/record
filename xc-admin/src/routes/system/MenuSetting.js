import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Select, DatePicker, Row, Col,
  Checkbox, Menu, Icon, Dropdown,
  message,
  Divider,
  Modal  } from 'antd';
import MenuTable from '../../components/MenuTable';
import NumericInput from '../../components/NumericInput';
import styles from './MenuSetting.less';

const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@Form.create()
@connect(state => ({
  menuSetting: state.menuSetting,
}))
export default class MenuSetting extends PureComponent{
  state = {
    defaultValue:'',
    visible:false,
    doTitle:'',
    type:'', //1编辑 0新增 -1删除
    item:{
      name:'', 
      icon:'', 
      url:'', 
      orderBy:'1', 
      path:'', 
      menuType:'',
    },
  }
  componentDidMount(){
    this.projectList();
   
  }
  // 项目列表
  projectList = () => {
    const _this = this;
    this.props.dispatch({
      type:'menuSetting/queryProjectList',
      payload:{},
      callback:(res) => {
        const id = res[0].id;
        _this.setState({
          defaultValue:id,
        });
        _this.menuList(id);
      }
    })
  }
  // 菜单项列表
  menuList = (id) => {
    this.props.dispatch({
      type:'menuSetting/queryMenuList',
      payload:{
        projectId:id,
      },
    });
  }
  // 选择项目Dom
  selectProjectDom = () => {
    const { projectList } =  this.props.menuSetting;
    const options = [];
    for(let i=0;i<projectList.length;i++){
      options.push(
        <Option key={projectList[i].id} value={projectList[i].id}>{projectList[i].name}</Option>
      );
    }
    const defaultValue = this.state.defaultValue;
    if(defaultValue){
      return (
        <Select defaultValue={defaultValue} onChange={this.handleSelect} style={{ width: 120 }}>
          {options}
        </Select>
      );
    }
  }
  //选择项目方法
  handleSelect = (val) =>{
    this.setState({
      defaultValue:val,
    });
    this.menuList(val);
  }
  // 编辑菜单
  handleEdit = (row) => {
    let item = null;
    let addBtn = null;
    if(row.type != 2 ){
      addBtn = (
        <a
          style={{marginRight:8}}
          onClick={this.addItem.bind(this,row)}
        >
          新增
        </a>   
      );
    };
      item = (
        <Menu>
          <Menu.Item>
            <a
              onClick={this.removeItem.bind(this,row)}
            >
              删除
            </a>   
          </Menu.Item>
        </Menu>
      );
      return (
        <div>
          {addBtn}
           <a
              onClick={this.EditItem.bind(this,row)}
            >
              编辑
            </a> 
          <Divider type="vertical" />
          <Dropdown overlay={item}>
            <a className="ant-dropdown-link">
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      );
  }
  //编辑
  EditItem = (row) =>{
    const item = row;
    this.setState({
      visible:true,
      doTitle:row.name,
      type:1,
      item,
    })
  }
  // 新增
  addItem = (row) => {
    const item = row;
    this.setState({
      visible:true,
      doTitle:'新增',
      type:0,
      item,
    })
  }
  // 删除
  removeItem =(row) => {
    const item = row;
    this.setState({
      visible:true,
      doTitle:'删除',
      type:-1,
      item,
    })
  }
  // 输入框限数字
  onInputNumber = (value) => {
    const { item } = this.state;
    item.orderBy = value;
    this.setState({ item });
  }
  // 弹框内容
  alertHtml = () => {
    
    const { item, type } = this.state;
    const { getFieldDecorator } = this.props.form;
    if( item ){
      let { name, icon, url, orderBy, path, menuType  } = item;
      let itemTyep = item.type;
      let menuTypeFormItem = null;
      let readWrite ='可读';
      if(menuType){
        readWrite ='可写';
      }
    
      if ((itemTyep == 1 && type == 0) || (itemTyep == 2 && type == 1)) {
        menuTypeFormItem = (
        <FormItem
            label={'可读写'}
          >
            {getFieldDecorator('readWrite', {
                  initialValue:readWrite,
                })(
                  <Select>
                    <Option value='0'>可读</Option >
                    <Option value='1'>可写</Option >
                  </Select>
                )}
          </FormItem>
        );
      }
      let rank = orderBy;
      let html;
      if(type === 0){
        name='';
        icon='';
        url='';
        path='';
        rank= 1;
      }else if(type === -1){
        if(itemTyep == 0 || itemTyep == 1){
          html = (
            <div>确定删除「{name}」菜单及下面所有子菜单？</div>
          );
        }else{
          html = (
            <div>确定删除「{name}」菜单？</div>
          );
        }
        return html;
      }
      html = (
        <Form onSubmit={this.handleSubmit}>
          {menuTypeFormItem}
          <FormItem
            label={'菜单名'}
          >
            {getFieldDecorator('name', {
                  initialValue:name,
                  rules: [{
                    required: true,
                    message: '请输入菜单名！',
                  }],
                })(
                  <Input maxLength="20"/>
                )}
          </FormItem>
          <FormItem
            label={'菜单图标'}
          >
            {getFieldDecorator('icon', {
                  initialValue:icon,
                })(
                  <Input />
                )}
          </FormItem>
          <FormItem
            label={'路径'}
          >
            {getFieldDecorator('path', {
                  initialValue:path,
                })(
                  <Input />
                )}
          </FormItem>
          <FormItem
            label={'链接'}
          >
            {getFieldDecorator('url', {
                  initialValue:url,
                })(
                  <Input />
                )}
          </FormItem>
          <FormItem
            label={'排列'}
          >
            {getFieldDecorator('rank', {
                  initialValue:rank,
                })(
                  // <Input />
                  <NumericInput onChange={this.onInputNumber} />
                )}
          </FormItem>
        </Form>
       );
       return html;
    }
    return null;
    
  }
  // 新增根目录菜单
  handleAddMenu = () => {
    this.setState({
      visible:true,
      doTitle:'新增主菜单',
      // item:true,
      type:0,
    })
  }
  // 确认修改、新增、删除
  handleOk = () => {
    
    const { dispatch, form } = this.props;
    const { type, item, defaultValue } = this.state;
    let id = item.id;
    if(type != -1){ //新增、编辑
      form.validateFields((err, values) => {
        if (err) return;
          let itemType = '';
          let name = values.name;
          let pid = item.id;
          let url = values.url;
          let orderBy = values.rank || 0;
          let projectId = defaultValue;
          let icon = values.icon;
          let path = values.path;
          let menuType = 1;
          if((name==''||!name) && type!=-1){
            message.info('请输入菜单名！');
            return;
          }
          if(values.readWrite == '可读' || values.readWrite == 0){
             menuType = 0;
          }
        if( type === 0){  // 新增
  
          if(item.type == 0){
            itemType = 1;
          }else if(item.type == 1){
            itemType = 2;
          }
  
          dispatch({
            type:'menuSetting/addData',
            payload:{
              type:itemType,
              name,
              pid,
              url,
              orderBy,
              projectId,
              icon,
              path,
              menuType,
            },
            callback:()=>{
              this.setState({
                visible:false,
              });
              this.menuList(this.state.defaultValue);
            }
          });
        }else if(type === 1){ //编辑
          dispatch({
            type:'menuSetting/upadteData',
            payload:{
              type:item.type,
              name,
              pid:item.pid,
              id,
              url,
              orderBy,
              icon,
              projectId,
              path,
              menuType,
            },
            callback:() => {
              this.setState({
                visible:false,
              });
              this.menuList(this.state.defaultValue);
            }
          });
        }
      });
    }else{ //删除
        dispatch({
          type:'menuSetting/deleteData',
          payload:{
            id,
          },
          callback:() => {
            this.setState({
              visible:false,
            });
            this.menuList(this.state.defaultValue);
          }
        });
      
    }
   
  }
  // 取消弹框
  handleCancel = () => {
    this.setState({
      visible:false,
    })
  }
  render(){
    const { visible, doTitle } = this.state;
    const { menuList, loading } = this.props.menuSetting;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.menusetting}>
            <div className={styles.title}>菜单管理</div>
              <div className={styles.selProject}>
                <div className={styles.title}>选择项目：</div>
                {this.selectProjectDom()}
                <Button type="primary" className={styles.add} onClick={this.handleAddMenu}><Icon type='plus' />新增</Button>
              </div>
              <MenuTable 
                data={menuList}
                loading={loading}
                onEdit={this.handleEdit}
              />
              <Modal
              destroyOnClose={true}
              maskClosable={false}
              title={doTitle}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            {this.alertHtml()}
            </Modal>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
