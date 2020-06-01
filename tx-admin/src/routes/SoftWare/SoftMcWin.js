import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import VersionList from './components/VersionList';
const _group = '米橙';
const _platform = 3;
@connect(({ softWare, loading }) => ({
  softWare,
  loading: loading.models.softWare,
}))
@Form.create()
export default class SoftMcWin extends PureComponent {
  state = {

  };
  componentDidMount() {
    
  }
  render() {
    return (
      <PageHeaderLayout title={'米橙Windows'}>
        <Card bordered={false}>
          <VersionList 
            _platform={_platform}
            _group={_group}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}