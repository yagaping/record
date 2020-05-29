import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button,  Checkbox, Row, Col, Divider, Radio, Modal } from 'antd';
import styles from './index.less';
const RadioGroup = Radio.Group;
// TODO: 添加逻辑

class EditSend extends PureComponent {
  static props = {
    newsType: PropTypes.number,
    onRelease: PropTypes.func,
  }

  componentDidMount(){
  }
  
  onChange = (e) => {
    const val = e.target.value;
    this.setState({
      value:val
    });
  }

  onSend = (e) => {
    const { onRelease, newsType } = this.props;
    if (newsType === '') {
      Modal.error({
        title: '提示消息',
        content: '请选择一个类型!',
      });
    }

    if (onRelease) {
      onRelease(newsType);
    }
  }

  render() {
    const { newsType } = this.props;
    let defaultVal = {
      value: newsType
    };
    // console.log(defaultVal);
    const plainOptions = [
      {label: '头条',value: 0},
      {label: '娱乐',value: 1},
      {label: '段子',value: 4},
      // {label: '问答',value: '5'},
      // {label: '视频',value: '20'},
    ];

    return (
      <div className={styles.newsType}>
        <h3>点击选项卡，同时推送到头条内容内与问答内容内</h3>
        <div className={styles.radios}>
          <RadioGroup onChange={this.onChange} value={newsType}>
            <Radio value={0}>头条</Radio>
            <Radio value={1}>娱乐</Radio>
            <Radio value={4}>段子</Radio>
          </RadioGroup>
        </div>
        <div className={styles.send}>
          <Button type="primary" onClick={this.onSend}>发布</Button>
        </div>
      </div>
    );
  }
}
export default EditSend;
