import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { Link } from 'dva/router';

const { Option } = Select;
class NewsType extends PureComponent {

  render() {
    const { onChange, value, width, type} = this.props;
    return (
      <Select onChange={onChange} value={value} style={{width:width||'100%'}}>
        {!type?<Option value={-1}>全部</Option>:''}
        <Option value={0}>推荐</Option>
        <Option value={20}>视频</Option>
        <Option value={1}>娱乐</Option>
        <Option value={7}>科技</Option>
        <Option value={8}>体育</Option>
        <Option value={9}>军事</Option>
        <Option value={10}>财经</Option>
        <Option value={14}>汽车</Option>
        <Option value={15}>本地</Option>
        <Option value={11}>海外科技</Option>
        <Option value={12}>海外体育</Option>
        <Option value={13}>海外财经</Option>
      </Select>
    );
  }
}

export default NewsType;
