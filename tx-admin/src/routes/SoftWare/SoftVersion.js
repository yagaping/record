import React, { PureComponent } from 'react';
import {
  Form,
  Menu,
  Layout
} from 'antd';
const { Sider, Content } = Layout;
import { connect } from 'dva';
import ohter from './ohter.less';
import VersionList from './components/VersionList';

@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class SoftVersion extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    menuName:'-1',
  };
  componentDidMount(){
  
  }
  // 点击菜单
  handleMenu = (obj) => {
    const { key } = obj;
    this.setState({
      menuName:key
    },()=>{
      this.child.reset();
    })
  }
  // 运行子组件方法
  onRef = (el) => {
      this.child = el;
  }

  render() {
    const { softWare } = this.props;
    const { version:{ list = [] } } = softWare;
    const { menuName } = this.state;
    const GROUP = list;
    return (
        <Layout className={ohter.layout}>
          <Sider className={ohter.sider}>
          <Menu
          defaultSelectedKeys={[menuName]}
          mode="inline"
          theme="light"
          onClick={this.handleMenu}
          className={ohter.menu}
        >
        <Menu.Item key="-1">
            <span>项目版本</span>
          </Menu.Item>
          {
            list.map(item=>(
            <Menu.Item key={item.name}>
              <span>{item.name}</span>
            </Menu.Item>)
            )
          }
          </Menu>
          </Sider>
          <Content className={ohter.content}>
            <VersionList 
              GROUP={GROUP}
              onRef={this.onRef}
              menuName={menuName}
              ref='versionlist'
            />
          </Content>
        </Layout>
    );
  }
}
