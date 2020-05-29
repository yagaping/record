import React, { Component} from 'react';
import { connect } from 'dva';
import {Card, Form, Input, Select, Modal, Button, Table, message,
  Tabs,Switch,
} from 'antd';
import styles from './NavManage.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NumericInput from '../../components/NumericInput';
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const MENU_CHINA = [
  {
    type:'',
    name:'无',
  },
  {
    type:'0',
    name:'头条',
  },{
    type:'1',
    name:'娱乐',
  },{
    type:'3',
    name:'笑话',
  },{
    type:'4',
    name:'国际',
  },{
    type:'5',
    name:'问答',
  },{
    type:'6',
    name:'图片',
  },{
    type:'7',
    name:'科技',
  },{
    type:'8',
    name:'体育',
  },{
    type:'9',
    name:'军事',
  },{
    type:'10',
    name:'财经',
  },{
    type:'20',
    name:'视频',
  },{
    type:'14',
    name:'汽车',
  },{
    type:'100',
    name:'关注',
  },{
    type:'101',
    name:'本地',
  }
];
const MENU_FOREIGN = [
  {
    type:'',
    name:'无',
  },
  {
    type:'11',
    name:'科技',
  },
  {
    type:'12',
    name:'体育',
  },
  {
    type:'13',
    name:'财经',
  }
];
const MENU_PAPER = [
  {
    type:'',
    name:'无',
  },
  {
    type:'2000',
    name:'人名日报',
  }
];
const LEVEL = [1,2,3];
const TAB_MENU = [
  {
    type:0,
    name:'国内栏目',
  }, {
    type:1,
    name:'全球栏目',
  }, {
    type:2,
    name:'报纸栏目',
  }

];
@Form.create()
@connect(state => ({
  navManage: state.navManage,
}))
class NavManage extends Component{

  state = {
    visible:false,
    title:'',
    tabKey:'0',
    index:1,
    size:10,
    data:{
      name:'',
      type:MENU_CHINA[0].type,
      sort:'',
      id:'',
      on_off:true,
    },
    deleted:{
      visible:false,
    },
  }

	componentDidMount() {
    this.queryNavList();
	}

  // 查询列表
  queryNavList = () => {
    const { index, size, tabKey } = this.state;
    this.props.dispatch({
      type:'navManage/queryNavList',
      payload:{
        index,
        size,
        tabsType:parseInt(tabKey),
      },
    });
  };
  

  // 新增
  addNew = () => {
    const { tabKey } = this.state;
    let type;
    if(tabKey == 0){
      type = MENU_CHINA[0].type;
    }else if(tabKey == 1){
      type = MENU_FOREIGN[0].type;
    }else if(tabKey == 2){
      type = MENU_PAPER[0].type;
    }
    this.setState({
      visible:true,
      title:'新增',
      data:{
        name:'',
        type,
        sort:'',
        id:'',
        tabsType:tabKey,
        on_off:true,
      },
    });
  }

  // 修改
  handleEdit = (row) => {
    const data = {
      name:row.name,
      type:row.newsType+'',
      sort:row.sort,
      tabsType:row.tabsType+'',
      id:row.id,
      level:row.level,
      on_off:row.hasDefault?true:false,
    };

    this.setState({
      visible:true,
      title:'修改',
      data:{...data},
    });
  }
  // 删除
  handleDelete = (row) => {
    const { deleted } = this.state;
    deleted.visible = true;
    deleted.name = row.name;
    deleted.id = row.id;
    this.setState({
      deleted,
    });
  }

  //确定新增、修改
  handleOk = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { name, type, sort, on_off, level} = fieldsValue;
      const {data:{id,tabsType}} = this.state;
      let url = 'navManage/addNew';
      const parame = {
        name:name,
        newsType:type,
        tabsType:parseInt(tabsType),
        sort,
        level,
      };
      let bool;
      if(on_off){
        bool = 1;
      }else{
        bool = 0;
      }
      parame.hasDefault = bool;
      
      if(id){
        url = 'navManage/navEdit';
        parame.id = id;
      }
      this.props.dispatch({
        type:url,
        payload:{
          ...parame,
        },
        callback:(res) => {
          if(res.code == 0){
            this.setState({
              visible:false,
            })
            this.queryNavList();
          }else{
            message.error(res.message);
          }
        }
      });
    });
  }

  // 关闭弹框
  handleCancel = () => {
    this.setState({visible:false});
  }

  // 确定删除
  handleOkDelete = () =>{
    const { deleted, tabKey } = this.state;
    const _this = this;
    this.props.dispatch({
      type:'navManage/delete',
      payload:{
        id:deleted.id,
      },
      callback:(res)=>{
        if(res.code == 0){
          deleted.visible = false;
          _this.setState({
            deleted,
          });
          _this.queryNavList();
        }else{
          message.error(res.message);
        }
      },
    });
  }
  // 取消删除
  handleCancelDelete = () => {
    const { deleted } = this.state;
    deleted.visible = false;
    this.setState({
      deleted,
    });
  }
  // 输入框限数字
  onChange = (value) => {
    const { data } = this.state;
    data.sort = value;
    this.setState({ data });
  }
  // 翻页
  changePage = (pagination) => {
    const { tabKey } = this.state;
    const { current, pageSize} = pagination;
    this.props.dispatch({
      type:'navManage/queryNavList',
      payload:{
        index:current+1,
        size:pageSize,
        tabsType:parseInt(tabKey),
      },
    });
  }
  // 切换table
  handleTable = (e) => {
    const { size, data } = this.state;
    this.props.dispatch({
      type:'navManage/queryNavList',
      payload:{
        index:1,
        size,
        tabsType:parseInt(e),
      },
    });
   
    this.setState({
      data:{
        ...data,
        type:e,
      },
      tabKey:e,
    });
  }
	render(){
    const { navList:{list,pagination}, loading  } = this.props.navManage;
    const { getFieldDecorator } = this.props.form;
    const { data:{name, type, sort, on_off, level }, deleted, title, tabKey } = this.state;
    const columns = [{
      title:'导航菜单',
      key:'nav',
      dataIndex:'name',
    },{
      title:'操作',
      width:150,
      render:(key, row)=>{
        return (
          <div>
            <a href='javascript:void(0)' onClick={this.handleEdit.bind(this,row)}>修改</a>
            <a href='javascript:void(0)' style={{marginLeft:15}} onClick={this.handleDelete.bind(this,row)}>删除</a>
          </div>
        );
      }
    }];

    const addItem = (
    <div className={styles.newAdd}>
      <Button type='primary' onClick={this.addNew}>新增</Button>
    </div>
    );
    let menu;
    if(tabKey == 0){
      menu = MENU_CHINA.map(item=>{
        return <Option key={item.type} value={item.type}>{item.name}</Option>;
      });
    }else if(tabKey == 1){
      menu = MENU_FOREIGN.map(item=>{
        return <Option key={item.type} value={item.type}>{item.name}</Option>;
      })  
    }else if(tabKey == 2){
      menu = MENU_PAPER.map(item=>{
        return <Option key={item.type} value={item.type}>{item.name}</Option>;
      })  
    }
		return (
			<PageHeaderLayout>
					<Card bordered={false}>
              
              <Tabs activeKey={tabKey} animated={false} onChange={this.handleTable}>
               {
                 TAB_MENU.map( item => {
                   return (
                    <TabPane tab={item.name} key={item.type}>
                    {addItem}
                    <div className={styles.navList}>
                      <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={list}
                        loading={loading}
                        pagination={pagination}
                        onChange={this.changePage}
                      />
                    </div>
                  </TabPane>
                   );
                 })
               }
              </Tabs>
              <Modal
                title={title}
                visible={this.state.visible}
                destroyOnClose={true}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <form>
                  <FormItem
                    label='菜单名'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('name', {
                      initialValue:name,
                      rules: [{ required: true, message: '请输入菜单名' }],
                    })(
                    <Input placeholder=''/>
                    )}
                  </FormItem>
                  <FormItem
                    label='菜单类型'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('type', {
                      initialValue:type
                    })(
                      
                      <Select>
                        {menu}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label='等级'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('level', {
                      initialValue:level,
                      rules: [{ required: true, message: '请选择等级' }],
                    })(
                      
                      <Select>
                        {LEVEL.map(item=>{
                          return <Option key={item} value={item}>{item}</Option>;
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label='默认菜单'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('on_off', {
                      valuePropName: 'checked',
                      initialValue:on_off,
                    })(
                      <Switch />
                    )}
                  </FormItem>
                  {/* <FormItem
                    label='栏目类型'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('tabsType', {
                      initialValue:tabsType
                    })(
                      <Select>
                        <Option value='0'>国内</Option>
                        <Option value='1'>全球</Option>
                      </Select>
                    )}
                  </FormItem> */}
                  <FormItem
                    label='排序'
                    labelCol={{span:4}}
                    wrapperCol={{span:18}}
                  >
                    {getFieldDecorator('sort', {
                      initialValue:sort
                    })(
                    // <Input placeholder=''/>
                    <NumericInput onChange={this.onChange} />
                   )}
                  </FormItem>
                </form>
              </Modal>
              <Modal
                title='删除'
                visible={deleted.visible}
                destroyOnClose={true}
                maskClosable={false}
                onOk={this.handleOkDelete}
                onCancel={this.handleCancelDelete}
                >
                {'确定删除 ['+ deleted.name +'] 菜单吗？'}
              </Modal>
					</Card>
				</PageHeaderLayout>
			);
		}
};
export default NavManage;
