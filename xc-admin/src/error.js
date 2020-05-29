import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { Modal } from 'antd';
const error = (e, dispatch) => {

  if (e.name === 401) {
    dispatch(routerRedux.push('/user/login'));
    return;
  }
  if (e.name === 401) {
    dispatch(routerRedux.push('/exception/403'));
    return;
  }else if(e.name === 403){
    Modal.warning({
      title: '提示信息',
      content: '没有访问权限！',
    });
  }
  if (e.name <= 504 && e.name >= 500) {
    dispatch(routerRedux.push('/exception/500'));
    return;
  }
  if (e.name >= 404 && e.name < 422) {
    dispatch(routerRedux.push('/exception/404'));
    return;
  }
  if(e.name === 88888 ){
    Modal.warning({
      title: '提示信息',
      content: '需要登录!',
    });
    Cookie.remove('USER_INFO');//删除登录cookie
    dispatch(routerRedux.push('/user/login'));
    return;
  }
};

export default error;
