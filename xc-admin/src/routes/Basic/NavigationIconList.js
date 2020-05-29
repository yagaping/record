import React, { Component } from 'react';
import { Card, Button, Icon, List } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './NavigationIconList.less';
import Ellipsis from '../../components/Ellipsis';

const ListItem = List.Item;

@connect(state => ({
  navigationIconList: state.navigationIconList,
}))
export default class NavigationIconList extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'navigationIconList/query',
    });
  }

  render() {
    const { loading, list } = this.props.navigationIconList;
    return (
      <PageHeaderLayout
        title="导航图标"
        content="导航图标分为两个部分 [导航] 和 [优选]，可以选择优秀或推广的图标链接推送到优选，app 首页就会显示。"
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item => (item ? (
              <ListItem key={item.id}>
                <Card hoverable className={styles.card} actions={[<a>编辑</a>, <a>删除</a>]}>
                  <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={item.iconUrl} />}
                    title={<a href="#">{item.iconText}</a>}
                    description={(
                      <a href={item.linkUrl} target="_blank">
                        <Ellipsis className={styles.item} lines={3}>{item.linkUrl}</Ellipsis>
                      </a>
                    )}
                  />
                </Card>
              </ListItem>
              ) : (
                <ListItem>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新的推荐
                  </Button>
                </ListItem>
              )
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
