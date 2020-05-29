import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '系统管理',
    icon: 'dashboard',
    path: 'systemManagement',
    children: [
      {
        name: '后台账号列表',
        path: 'account-list',
      },
      {
        name: '角色管理',
        path: 'role-management',
      },
      {
        name: '权限管理',
        path: 'authority-management',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: '修改密码',
        path: 'change-pwd',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '卡片管理',
    icon: 'form',
    path: 'cardManagement',
    children: [
      {
        name: '基础设置',
        path: 'basicSetup',
      },
      {
        name: '天气管理',
        path: 'weather-manage',
      },
      {
        name: '节日节气管理',
        // authority: 'admin',
        path: 'festival-manage',
      },
      {
        name: '头条管理',
        // authority: 'admin',
        path: 'headline-manage',
      },
      {
        name: '彩票管理',
        // authority: 'admin',
        path: 'lottery-manage',
      },
      {
        name: '新股管理',
        // authority: 'admin',
        path: 'newStock-manage',
      },
    ],
  },
  {
    name: '广告管理',
    icon: 'table',
    path: 'advertisement',
    children: [
      {
        name: '广告位管理',
        path: 'advertisement-position',
      },
      // {
      //   name: '标准列表',
      //   path: 'basic-list',
      // },
      // {
      //   name: '卡片列表',
      //   path: 'card-list',
      // },
      // {
      //   name: '搜索列表',
      //   path: 'search',
      //   children: [
      //     {
      //       name: '搜索列表（文章）',
      //       path: 'articles',
      //     },
      //     {
      //       name: '搜索列表（项目）',
      //       path: 'projects',
      //     },
      //     {
      //       name: '搜索列表（应用）',
      //       path: 'applications',
      //     },
      //   ],
      // },
    ],
  },
  {
    name: '用户管理',
    icon: 'profile',
    path: 'usermanagement',
    children: [
      {
        name: '用户列表',
        path: 'user-list',
      },
      // {
      //   name: '高级详情页',
      //   path: 'advanced',
      //   authority: 'admin',
      // },
    ],
  },
  {
    name: '客服管理',
    icon: 'check-circle-o',
    path: 'customer-service',
    children: [
      {
        name: '反馈列表',
        path: 'feedback-list',
      },
      // {
      //   name: '失败',
      //   path: 'fail',
      // },
    ],
  },
  {
    name: '地址链接管理',
    // icon: 'check-circle-o',
    path: 'address-link',
    children: [
      {
        name: '短地址分组管理',
        path: 'short-address-manage',
      },
      {
        name: '短地址管理',
        path: 'short-address',
      },
    ],
  },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //     {
  //       name: '触发异常',
  //       path: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
];

const _Index = {
  name: '首页',
  icon: 'home',
  path: 'indexPage',
  // chidren: [],
}

function formatter(data, parentPath = '/', parentAuthority, index) {
  // if(!index){   //增加首页标签
  //   data && data.unshift(_Index);
  // }
  //
  return data && data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority,true);
    }
    if (item.menuLevel >= 2) {   //隐藏三级菜单
      result.children = [];
    }
    return result;
  });
}

export const getMenuData = (menuData) => formatter(menuData);
