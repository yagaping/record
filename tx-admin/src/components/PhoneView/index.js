import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

export default class PhoneView extends PureComponent {
    constructor(props) {
        super(props);
    }

    createHtml = (phoneContent) => {
        return {__html: phoneContent};
    }
        
    onCancel = () => {
        this.props.showPhone(false)
    }

    render() {
        const { phoneModalVisible, phoneTitle, phoneYear, phoneContent } = this.props;
        return(
            <Modal
                visible={phoneModalVisible}
                onCancel={this.onCancel}
                width={375}
                footer={null}
                closable={false}
            >
                <div className={styles.wraper}>
                    <p className={styles.title}>{phoneTitle}</p>
                    <p className={styles.year}>{phoneYear ? phoneYear+'年前' : '今年'}</p>
                    <div 
                        dangerouslySetInnerHTML={this.createHtml(phoneContent)} 
                        className={styles.phoneWraper}
                    >
                    </div>
                </div>
            </Modal>
        )
    }
}
