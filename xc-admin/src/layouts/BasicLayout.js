/* eslint-disable no-trailing-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, Link, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import { getCookieUserInfo } from "../utils/cookie-common";


/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);
const { Content } = Layout;
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
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
    marginLeft:80,
  }

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  componentWillMount() {
    // const { dispatch, loginStatus } = this.props;
    // debugger
    // // 检查 cookie 状态，存在就不跳 login
    // if (loginStatus === -1) {
    //   const cookieUserInfo = getCookieUserInfo();
    //   if (cookieUserInfo && cookieUserInfo.code === 0) {
    //     dispatch({
    //       type: 'login/changeLoginStatus',
    //       payload: cookieUserInfo,
    //     });
    //   }
    // }
  }

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
    this.setState({
      marginLeft:!this.props.collapsed ? 256 : 80
    })
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '米橙相册';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 米橙相册`;
    }
    return title;
  }
  handleStyle = (num) => {
    this.setState({
      marginLeft:num,
    });
  }
  render() {
    const {
       collapsed, fetchingNotices, notices,
      routerData, match, location, dispatch, loginStatus, history,
    } = this.props;
    const { marginLeft } = this.state;
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || this.props.currentUser;
    const layout = (
      <Layout>
        <SiderMenu
          collapsed={collapsed}
          location={location}
          dispatch={dispatch}
          isMobile={this.state.isMobile}
        />
        <Layout style={{ marginLeft: marginLeft }} ref="content">
          <GlobalHeader
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            dispatch={dispatch}
            isMobile={this.state.isMobile}
            loginStatus={loginStatus}
            history={history}
            modStyle={this.handleStyle}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                <Redirect exact from="/" to="/home" />
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              // links={[{
              //   title: 'Pro 首页',
              //   href: 'http://pro.ant.design',
              //   blankTarget: true,
              // }, {
              //   title: 'GitHub',
              //   href: 'https://github.com/ant-design/ant-design-pro',
              //   blankTarget: true,
              // }, {
              //   title: 'Ant Design',
              //   href: 'http://ant.design',
              //   blankTarget: true,
              // }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2019 米橙相册
                </div>
              }
            />
          </Content>
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

export default connect(state => ({
  menuConfig: state.login.menuConfig,
  loginStatus: state.login.status,
  currentUser: state.login.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
