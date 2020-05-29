import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import NewsQuestionAnswerImageList from "../routes/News/NewsQuestionAnswerImageList";

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      exact: true,
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    // 异常页面
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/home': {
      component: dynamicWrapper(app, [], () => import('../routes/Home')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // 系统管理
    '/system/admin/menu-setting': {
      name: '系统管理-菜单管理',
      component: dynamicWrapper(app, ['menu-setting'], () => import('../routes/system/MenuSetting')),
    },
    '/system/admin/user-list': {
      name: '系统管理-用户列表',
      component: dynamicWrapper(app, ['admin-user-list'], () => import('../routes/system/SystemList')),
    },
    '/system/admin/user-limit': {
      name: '系统管理-权限管理',
      component: dynamicWrapper(app, ['user-limit'], () => import('../routes/system/UserLimit')),
    },
    '/system/admin/user-manage': {
      name: '系统管理-账户管理',
      component: dynamicWrapper(app, ['admin-user-list','project-role'], () => import('../routes/system/UserManage')),
    },
    '/system/admin/project-role': {
      name: '系统管理-项目角色',
      component: dynamicWrapper(app, ['project-role'], () => import('../routes/system/ProjectRole')),
    },
    '/system/admin/login-log': {
      name: '系统管理-登录日志',
      component: dynamicWrapper(app, ['admin-user-list'], () => import('../routes/system/LoginLogList')),
    },
    '/system/admin/user-setPwd': {
      name: '系统管理-修改密码',
      component: dynamicWrapper(app, ['admin-user-list'], () => import('../routes/system/SetPwd')),
    },
    '/system/admin/do-log': {
      name: '系统管理-操作日志',
      component: dynamicWrapper(app, ['admin-user-list'], () => import('../routes/system/DoLog')),
    },
    // 相册管理
    '/photoManage/pay-list':{
      name:'相册管理-支付记录',
      component: dynamicWrapper(app, ['pay-list'], () => import('../routes/PhotoManage/PayList')),
    },
    '/photoManage/friend-list':{
      name:'相册管理-亲友列表',
      component: dynamicWrapper(app, ['friend-list'], () => import('../routes/PhotoManage/FriendList')),
    },
    '/photoManage/tag-list':{
      name:'相册管理-标签标签列表',
      component: dynamicWrapper(app, ['tag-list'], () => import('../routes/PhotoManage/TagList')),
    },
    // 概述
    '/overview/real-time-data':{
      name:'概述-实时数据',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Overview/RealTimeData')),
    },
    // 用户
      '/users/add-user':{
      name:'用户-新增用户',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Users/AddUser')),
    },
    '/users/active-user':{
      name:'用户-活跃用户',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Users/ActiveUser')),
    },
    '/users/prower-times':{
      name:'用户-启动次数',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Users/ProwerTimes')),
    },
    '/users/version-type':{
      name:'用户-版本分布',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Users/VersionType')),
    },
    // 留存
    '/keep/retention':{
      name:'留存-用户留存',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Keep/Retention')),
    },
    '/keep/action-keep':{
      name:'留存-动作留存',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Keep/ActionKeep')),
    },
    // 反馈
    '/feedBack/user-feed-back':{
      name:'反馈-用户反馈',
      component: dynamicWrapper(app, ['user-feedback'], () => import('../routes/FeedBack/UserFeedback')),
    },
    '/feedBack/feedback-details/:id':{
      name:'反馈-用户反馈-详情',
      component: dynamicWrapper(app, ['user-feedback'], () => import('../routes/FeedBack/FeedbackDetails')),
    },
    // 付费
    '/pay/pay-state':{
      name:'付费-付费概述',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Pay/PayState')),
    },
    // 存储
    '/save/save-state':{
      name:'存储-存储概述',
      component: dynamicWrapper(app, ['add-user'], () => import('../routes/Save/SaveState')),
    },
    '/save/memory-space':{
      name:'存储-存储空间',
      component: dynamicWrapper(app, ['memory-space'], () => import('../routes/Save/MemorySpace')),
    },
    '/save/save-content':{
      name:'存储-存储内容',
      component: dynamicWrapper(app, ['list','add-user','memory-space'], () => import('../routes/Save/SaveContent')),
    },
    '/save/user-save':{
      name:'存储-用户存储',
      component: dynamicWrapper(app, ['list','add-user','memory-space'], () => import('../routes/Save/UserSave')),
    },
    // 终端
    '/terminal/terminal-device':{
      name:'终端-终端设备',
      component: dynamicWrapper(app, ['terminal','add-user'], () => import('../routes/Terminal/TerminalDevice')),
    },
    '/terminal/terminal-network':{
      name:'终端-终端网络',
      component: dynamicWrapper(app, ['terminal','add-user'], () => import('../routes/Terminal/TerminalNetwork')),
    },
    '/terminal/areal-distribute':{
      name:'终端-地域分布',
      component: dynamicWrapper(app, ['terminal','add-user'], () => import('../routes/Terminal/ArealDistribute')),
    },
    '/terminal/user-terminal':{
      name:'终端-用户终端',
      component: dynamicWrapper(app, ['terminal','add-user'], () => import('../routes/Terminal/UserTerminal')),
    },
    // 协议
    '/agreement/notice':{
      name:'协议-公告',
      component: dynamicWrapper(app, ['notice'], () => import('../routes/Agreement/Notice')),
    },
    // 资料
    '/datum/relevancy':{
      name:'资料-事物关联',
      component: dynamicWrapper(app, ['relevancy'], () => import('../routes/Datum/Relevancy')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
