import { notification } from 'antd';
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
});
const isSuccess = (response) => {
  if (!response) {
    return false;
  }
  if (response.code === 0) {
    return true;
  }
  return false;
};

const notificationError = (response) => {
  notification.error({
    message: `请求错误 ${response.code}`,
    description: response.message,
  });
};

export {
  isSuccess,
  notificationError,
};
