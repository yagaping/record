import Cookie from 'js-cookie';

// cookie 保存用户信息 （userInfo）
const USER_INFO_KEY = 'USER_INFO';
const setCookieUserInfo = (val) => {
  Cookie.set(USER_INFO_KEY, val);
};

const getCookieUserInfo = () => {
  try {
    const cookieValue = Cookie.get(USER_INFO_KEY);
    return JSON.parse(cookieValue);
  } catch (e) {
    return null;
  }
};

// 导出常用的 信息
export {
  setCookieUserInfo,
  getCookieUserInfo,
};
