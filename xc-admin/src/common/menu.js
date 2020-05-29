const menuData = [{
  name: '系统管理',
  icon: 'smile-o',
  path: 'system',
  children: [
    {
      name: '菜单管理',
      path: 'admin/menu-setting',
    }, {
    name: '用户列表',
    path: 'admin/user-list',
  }, {
    name: '权限管理',
    path: 'admin/user-limit',
  }, {
    name: '项目角色',
    path: 'admin/project-role',
  }, {
    name: '账户管理',
    path: 'admin/user-manage',
  },{
    name: '修改密码',
    path: 'admin/user-setPwd',
  }, {
    name: '登录日志',
    path: 'admin/login-log',
  }, {
    name: '操作日志',
    path: 'admin/do-log',
  }],
},{
  name:'平台分析',
  icon:'folder',
  path:'platform',
  children:[{
    name:'用户反馈',
    path:'back-feed',
  }]
},
// 米橙相册
{
  name:'相册管理',
  icon:'profile',
  path:'photoManage',
  children:[{
    name:'支付记录列表',
    path:'pay-list',
  }]
}];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}
// JSON.parse(localStorage.getItem('menuList'))||
export const getMenuData = () => formatter(JSON.parse(localStorage.getItem('menuList'))||menuData);

