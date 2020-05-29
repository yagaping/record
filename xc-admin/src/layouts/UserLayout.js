import React from 'react';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '米橙相册';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 米橙相册`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/user/login">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>米橙相册</span>
              </Link>
            </div>
            {/* <div className={styles.desc}>米橙相册 是西湖区最具影响力的 Web 设计规范</div> */}
          </div>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
          {/* <GlobalFooter className={styles.footer} links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
