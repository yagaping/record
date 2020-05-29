import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
// import { getMenuData } from '../common/menu';
import { Home, Heart, Find, XiaoCheng, User, Operate, System } from '../components/Icon';
import logo from '../assets/logo.png';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
// const getRedirect = item => {
//   if (item && item.children) {
//     if (item.children[0] && item.children[0].path) {
//       redirectData.push({
//         from: `${item.path}`,
//         to: `${item.children[0].path}`,
//       });
//       item.children.forEach(children => {
//         getRedirect(children);
//       });
//     }
//   }
// };
// getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData, menuData  } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
    };
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.getMenu();
  }

  //获取菜单
  getMenu = () => {
    this.props.dispatch({
      type: 'user/getMenu',
      payload: {
        // id: localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : '-1',
      },
      callback: (res) => {
        if(res && res.code == '0') {

        }else{
          message.error(res && res.message || '服务器错误')
        }
      }
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '米橙后台管理系统';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    // if (currRouterData && currRouterData.name) {
    //   title = `${currRouterData.name} - Ant Design Pro`;
    // }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'changePwd') {
      this.props.dispatch(routerRedux.push('/systemManagement/change-pwd'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
        payload: {},
      });
    }
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  getRedirect = item => {
    const me = this
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          me.getRedirect(children);
        });
      }
    }
  };
  render() {
    const {
      menuData,
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    menuData && menuData.forEach(this.getRedirect);
	  // if(menuData.length){
    //   menuData[0].icon = [<Home key='home'/>]
    //   menuData[1].icon = [<Heart key='Heart' />]
    //   menuData[2].icon = [<Find key='Find' />]
    //   menuData[3].icon = [<XiaoCheng key='XiaoCheng' />]
    //   menuData[4].icon = [<User key='User' />]
    //   menuData[5].icon = [<Operate key='Operate' />]
    //   menuData[6].icon = [<System key='System' />]
    // }
    let currentYear = new Date().getFullYear();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser ? currentUser : JSON.parse(localStorage.getItem('realName'))}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
              //   {
              //     key: 'Pro 首页',
              //     title: 'Pro 首页',
              //     href: 'http://pro.ant.design',
              //     blankTarget: true,
              //   },
              //   {
              //     key: 'github',
              //     title: <Icon type="github" />,
              //     href: 'https://github.com/ant-design/ant-design-pro',
              //     blankTarget: true,
              //   },
              //   {
              //     key: 'Ant Design',
              //     title: 'Ant Design',
              //     href: 'http://ant.design',
              //     blankTarget: true,
              //   },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> {currentYear} 米橙
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({login, user, global, loading }) => ({
  menuData: user.menuData,
  currentUser: login.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
