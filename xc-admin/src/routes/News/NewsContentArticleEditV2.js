import React, { Component } from 'react';
import { Row } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ContentEditor from "../../components/ContentEditor/ContentEditor";
import styles from './NewsContentArticleEditV2.less';

@connect(state => ({
  newsEdit: state.newsEdit,
}))
export default class NewsContentArticleEdit extends Component {
  render() {
    <PageHeaderLayout>
      123
    </PageHeaderLayout>
  }
}
