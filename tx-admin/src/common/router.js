import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import request from '../utils/request';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/indexPage': {
      component: dynamicWrapper(app, [], () => import('../routes/IndexPage/IndexPage')),
    },
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
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

    //时光
    '/cardManagement/time-card': {
      name: '时光卡片',
      component: dynamicWrapper(app, ['timeCard'], () => import('../routes/Time/Time')),
    },
    //发现
    '/discover/discover-module-management': {
      name: '模块管理',
      component: dynamicWrapper(app, ['discoveryCenter'], () => import('../routes/Discovery/DiscoveryCenter')),
    },
    //事件提醒
    '/discover/event-reminder': {
      name: '事件列表',
      component: dynamicWrapper(app, ['eventList', 'eventNotify', 'eventNotifyCount', 'eventName'], () => import('../routes/Discovery/EventList')),
    },
    //生日提醒
    '/discover/birthday-reminder': {
      name: '祝福语列表',
      component: dynamicWrapper(app, ['birthdayRemind'], () => import('../routes/Discovery/BirthdayRemind')),
    },
    //WiFi提醒
    // '/discover/birthday-reminder': {
    //   name: '祝福语列表',
    //   component: dynamicWrapper(app, ['bless'], () => import('../routes/CardManagement/BlessingList')),
    // },
    //位置提醒
    '/discover/location-reminder': {
      name: '地图',
      component: dynamicWrapper(app, ['positionRemind'], () => import('../routes/Discovery/PositionRemind') ),
    },
    //规律生活
    // '/discover/location-reminder': {
    //   name: '地图',
    //   component: dynamicWrapper(app, ['map'], () => import('../routes/PositionRemind/Map.js') ),
    // },
    //任务清单
    // '/discover/location-reminder': {
    //   name: '地图',
    //   component: dynamicWrapper(app, ['map'], () => import('../routes/PositionRemind/Map.js') ),
    // },
    //经期管家
    '/discover/menstrual-housekeeper': {
      name: '经期小贴士',
      component: dynamicWrapper(app, ['period'], () => import('../routes/Discovery/Period')),
    },
    //记账
    // '/shorthand-managment/shorthand-list': {
    //   name: '速记列表',
    //   component: dynamicWrapper(app, ['shortList'], () => import('../routes/ShortHand/ShortList.js') ),
    // },
    //速记
    '/discover/shorthand-list': {
      name: '速记列表',
      component: dynamicWrapper(app, ['shortHand'], () => import('../routes/Discovery/ShortHand') ),
    },
     //便签
    // '/discover/shorthand-list': {
    //   name: '速记列表',
    //   component: dynamicWrapper(app, ['shortList'], () => import('../routes/ShortHand/ShortList.js') ),
    // },
    //美记
    // '/discover/shorthand-list': {
    //   name: '速记列表',
    //   component: dynamicWrapper(app, ['shortList'], () => import('../routes/ShortHand/ShortList.js') ),
    // },
    //天气
    '/discover/weather': {
      name: '天气背景',
      component: dynamicWrapper(app, ['weatherManage','weatherAlarm', 'weatherType'], () => import('../routes/Discovery/WeatherManage')),
    },
    //万年历
    '/discover/perpetual-calendar': {
      name: '节日节气',
      component: dynamicWrapper(app, ['festivalManageNew-Master', 'festivalManage'], () => import('../routes/Discovery/FestivalManageNew-Master')),
    },
    '/discover/festival-edit': {
      name: '节日节气编辑',
      component: dynamicWrapper(app, ['festivalManage'], () => import('../routes/Discovery/FestivalManageEdit')),
    },
    '/discover/new-festival-edit': {
      name: '新节日节气编辑',
      component: dynamicWrapper(app, ['festivalManage'], () => import('../routes/Discovery/FestivalManageEditNew')),
    },
    //涨知识
    '/discover/rising-knowledge': {
      name: '笑一笑',
      component: dynamicWrapper(app, ['happySmile','dailyReadingKnowledge','wellKnownSaying','story','poetry','idiom','word','uploadVideo','historyList'], () => import('../routes/Discovery/HappySmile')),
    },
     //美听
    '/discover/bea-listening': {
      name: '美听',
      component: dynamicWrapper(app, ['beautifulListening'], () => import('../routes/Discovery/BeautifulListening')),
    },
    //推荐
    '/discover/recommend': {
      name: '美听',
      component: dynamicWrapper(app, ['beautifulListening'], () => import('../routes/Discovery/Recommend')),
    },


    //小橙
    //智能菜单配置
    '/naranjito/Intelligence-list': {
      name: '智能菜单',
      component: dynamicWrapper(app, ['intelligenceList'], () => import('../routes/XiaoCheng/IntelligenceList')),
    },
    //信息分类树
    '/naranjito/infoTree-list': {
      name: '信息分类树',
      component: dynamicWrapper(app, ['infoTree'], () => import('../routes/XiaoCheng/InfoTree')),
    },
    //地图树形数据结构
    '/naranjito/mapTree-list': {
      name: '地图树形数据结构',
      component: dynamicWrapper(app, ['mapTree'], () => import('../routes/XiaoCheng/MapTree')),
    },
    //非关系地图列表
    '/naranjito/nonRelational-list': {
      name: '非关系地图列表',
      component: dynamicWrapper(app, ['nonRelationalList'], () => import('../routes/XiaoCheng/NonRelationalList')),
    },
    //词组
    '/naranjito/phrase': {
      name: '词组录入',
      component: dynamicWrapper(app, ['phraseEntry', 'infoTree', 'synonym'], () => import('../routes/XiaoCheng/PhraseEntry.js') ),
    },
    //文本识别
    '/naranjito/text-recognition': {
      name: '文本识别验证',
      component: dynamicWrapper(app, ['textVerify', 'infoTree', 'textRecognition', 'textExamine', 'dataTemplate', 'textMatch', 'textMatchList'], () => import('../routes/XiaoCheng/TextExamine.js') ),
    },
    //自然语言
    '/naranjito/natural-language': {
      name: '自然语言文本识别',
      component: dynamicWrapper(app, ['naturalLan', 'naturalLanClassify'], () => import('../routes/XiaoCheng/NaturalLanDiscern')),
    },
    //测试人员管理
    '/naranjito/manage-tester': {
      name: '测试人员管理',
      component: dynamicWrapper(app, ['manageTester'], () => import('../routes/XiaoCheng/ManageTester.js') ),
    },


    //用户管理
    '/customer-service/user-list': {
      name: '用户列表',
      component: dynamicWrapper(app, ['userList', 'eventNotify'], () => import('../routes/UserManagement/UserList')),
    },
    '/usermanagement/user-edit': {
      name: '用户编辑',
      component: dynamicWrapper(app, ['userEdit'], () => import('../routes/UserManagement/UserEdit')),
    },
    '/customer-service/statistics-list': {
      name: '用户统计',
      component: dynamicWrapper(app, ['userStatistics'], () => import('../routes/UserManagement/UserStatistics')),
    },
    '/customer-service/send-message': {
      name: '群发管理',
      component: dynamicWrapper(app, ['userStatistics'], () => import('../routes/UserManagement/SendMessage')),
    },
    '/customer-service/user-online': {
      name: '用户启停',
      component: dynamicWrapper(app, ['userOnline'], () => import('../routes/UserManagement/UserOnline')),
    },
    '/customer-service/user-blacklist': {
      name: '米橙客服群发黑名单',
      component: dynamicWrapper(app, ['userOnline'], () => import('../routes/UserManagement/UserBlacklist')),
    },
    '/customer-service/send-version': {
      name: '手动版本号群发',
      component: dynamicWrapper(app, ['userStatistics'], () => import('../routes/UserManagement/SendVersion')),
    },
    '/customer-service/fixed-version': {
      name: '版本号群发',
      component: dynamicWrapper(app, ['userStatistics'], () => import('../routes/UserManagement/FixedVersion')),
    },
    '/customer-service/user-message-stop': {
      name: '用户关键信息停用',
      component: dynamicWrapper(app, ['userOnline'], () => import('../routes/UserManagement/UserMessageStop')),
    },
    //运营管理
    '/operate/advertisement-position': {
      name: '广告位管理',
      component: dynamicWrapper(app, ['advertise'], () => import('../routes/OperationManagement/Advertising')),
    },
    '/advertisement/advertisement-edit': {
      name: '广告位编辑',
      component: dynamicWrapper(app, ['advertise'], () => import('../routes/OperationManagement/AdvertiseEdit')),
    },
    '/operate/payment-list': {
      name: '支付列表',
      component: dynamicWrapper(app, ['payment'], () => import('../routes/OperationManagement/Payment')),
    },
    '/operate/feedback-list': {
      name: '反馈管理',
      component: dynamicWrapper(app, ['feedback','module_Name'], () => import('../routes/OperationManagement/FeedbackList')),
    },
    '/operate/edition-list': {
      name: '软件版本',
      component: dynamicWrapper(app, ['editionList'], () => import('../routes/OperationManagement/EditionList.js') ),
    },
    '/operate/mc-customer': {
      name: '米橙客服',
      component: dynamicWrapper(app, ['editionList'], () => import('../routes/OperationManagement/McCustomer.js') ),
    },
    '/operate/push': {
      name: '推送',
      component: dynamicWrapper(app, ['editionList'], () => import('../routes/OperationManagement/Push.js') ),
    },

    // PC
    '/pcmanage/update-resource': {
      name:'更新资源',
      component: dynamicWrapper(app, ['pcmanage'], () => import('../routes/PcManage/UpdateResource.js') ),
    },

    // 软件管理 、 项目
    '/softWare/soft': {
      name:'项目',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/Soft.js') ),
    },
    // 项目版本
    '/softWare/soft-version': {
      name:'项目',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftVersion.js') ),
    },

    // 米橙iOS
    '/softWare/soft-mc-ios': {
      name:'米橙iOS',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftMcIos.js') ),
    },
     // 米橙Android
     '/softWare/soft-mc-and': {
      name:'米橙Android',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftMcAnd.js') ),
    },
     // 米橙window
     '/softWare/soft-mc-win': {
      name:'米橙iOS',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftMcWin.js') ),
    },
     // 相册iOS
     '/softWare/soft-xc-ios': {
      name:'相册iOS',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftXcIos.js') ),
    },
     // 相册Android
     '/softWare/soft-xc-and': {
      name:'相册Android',
      component: dynamicWrapper(app, ['softWare'], () => import('../routes/SoftWare/SoftXcAnd.js') ),
    },

    //系统管理
    '/systemManagement/shortAddress-management': {
      name: '短地址列表',
      component: dynamicWrapper(app, ['shortAddress', 'shortGroup', 'shortAddressGroup'], () => import('../routes/SystemManagement/ShortAddress.js')),
    },
    //软件日志
    '/systemManagement/journal-management': {
      name: '统计日志',
      component: dynamicWrapper(app, ['log', 'commonLog', 'module', 'incident', 'pageManage', 'module_Name'], () => import('../routes/SystemManagement/CommonLog.js')),
    },
    //后台账号
    '/systemManagement/backstage-account': {
      name: '账号列表',
      component: dynamicWrapper(app, ['account', 'roleData', 'role', 'permission', 'menuManagement', 'authority' ], () => import('../routes/SystemManagement/AccountList')),
    },
    '/systemManagement/change-pwd': {
      name: '修改密码',
      component: dynamicWrapper(app, ['changePwd'], () => import('../routes/SystemManagement/ChangePwd')),
    },
    // 文章系统
    '/articleManage/list': {
      name: '文章列表',
      component: dynamicWrapper(app, ['article' ], () => import('../routes/ArticleManage/List')),
    },

    // '/cardManagement/festival-manage': {
    //   name: '节日节气管理',
    //   component: dynamicWrapper(app, ['festivalManage'], () => import('../routes/Discovery/FestivalManage')),
    // },
    // //匹配模板
    // '/text-recognition/template-matching': {
    //   name: '匹配模板',
    //   component: dynamicWrapper(app, ['templateMatching','module_Name1'], () => import('../routes/TextRecognition/TemplateMatching')),
    // },
    // //文本识别模板
    // '/text-recognition/textRecognition-template': {
    //   name: '文本识别模板',
    //   component: dynamicWrapper(app, ['textRecognitionTemplate'], () => import('../routes/TextRecognition/TextRecognitionTemplate')),
    // },
    
   
    // //测试管理
    // '/test-management/test-module': {
    //   name: '测试模块',
    //   component: dynamicWrapper(app, ['testModule', 'account'], () => import('../routes/TestManagement/TestModule')),
    // },
    // '/test-management/test-case': {
    //   name: '测试用例',
    //   component: dynamicWrapper(app, ['testCase'], () => import('../routes/TestManagement/TestCase.js')),
    // },
   
  };
  // Get name from ./menu.js or just set it in the router data.
  // const menuData = getFlatMenuData(getMenuData()); //菜单
  const menuData = getFlatMenuData([]);   //后台获取菜单
 
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
