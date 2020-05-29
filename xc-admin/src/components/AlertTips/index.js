import React, { PureComponent } from 'react';
import { Modal } from 'antd';
class AlertTips extends PureComponent {


  render() {
    const { alertTips:{title, visible, html},onOk,onCancel  } = this.props;
    return (
      <Modal
          title={title}
          visible={visible}
          maskClosable={false}
          destroyOnClose={true}
          onOk={onOk}
          onCancel={onCancel}
        >
         <p>{html}</p>
      </Modal>
    );
  }
}

export default AlertTips;
