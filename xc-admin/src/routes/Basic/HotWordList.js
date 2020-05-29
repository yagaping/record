import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Table, Row, Col, Button, Menu, Dropdown, Icon, Divider, Modal, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import HotWordSave from './HotWordSave';
// import styles from './HotWord.less';

const HOT_WORD_CONSTANTS = {
  STATE_RELEASE: 0,
  STATE_NOT_RELEASE: 1,
};

@connect(state => ({
  hotWord: state.hotWordList,
}))
export default class HotWordList extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'hotWordList/query',
    });
  }

  handleSaveModalShow = () => {
    this.props.dispatch({
      type: 'hotWordList/changeSaveModalVisible',
      payload: {
        visible: true,
      },
    });
  };

  handleRemove = (rowData) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: `您确定要删除 "${rowData.word}" 吗？`,
      content: '操作后数据将被删除.',
      onOk() {
        dispatch({
          type: 'hotWordList/remove',
          payload: {
            id: rowData.id,
          },
        });
      },
      onCancel() {
        
      },
    });
  };

  handleReleaseChange = (rowData, releaseState) => {
    const { dispatch } = this.props;
    const dispatchType = HOT_WORD_CONSTANTS.STATE_RELEASE
    === releaseState ? 'hotWordList/release' : 'hotWordList/notRelease';
    dispatch({
      type: dispatchType,
      payload: {
        id: rowData.id,
      },
    });
  };

  HotWordTable = () => {
    const { hotWord } = this.props;
    const Menus = (rowData) => {
      let releaseText;
      let releaseState;
      if (rowData.state === HOT_WORD_CONSTANTS.STATE_RELEASE) {
        releaseText = '取消发布';
        releaseState = HOT_WORD_CONSTANTS.STATE_NOT_RELEASE;
      } else {
        releaseText = '发布';
        releaseState = HOT_WORD_CONSTANTS.STATE_RELEASE;
      }

      const editUrl = `/basic/hot-word/${rowData.id}/edit`;
      return (
        <Menu>
          <Menu.Item>
            <a onClick={this.handleReleaseChange.bind(
              this, rowData, releaseState)}
            >
              {releaseText}
            </a>
          </Menu.Item>
          <Menu.Item>
            <Link to={editUrl}>编辑</Link>
          </Menu.Item>
          <Menu.Item>
            <a onClick={this.handleRemove.bind(this, rowData)}>删除</a>
          </Menu.Item>
        </Menu>
      );
    };

    const MoreBtn = (rowData) => {
      return (
        <Dropdown overlay={Menus(rowData)}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };

    const columns = [{
      title: '热词',
      dataIndex: 'word',
      key: 'word',
      render: (text, rowData) => {
        const wordTypes = ['', 'hot'];
        return (
          <Badge count={wordTypes[rowData.type]}>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Badge>
        );
      },
    }, {
      title: '链接地址',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        const stateArray = ['发布', '未发布', '已删除'];
        return (
          <div>{stateArray[text]}</div>
        );
      },
    }, {
      title: '操作',
      key: 'operation',
      render: (rowData) => {
        const editUrl = `/basic/hot-word/${rowData.id}/edit`;

        return (
          <div>
            <Link to={editUrl}>编辑</Link>
            <Divider type="vertical" />
            <MoreBtn {...rowData} />
          </div>
        );
      },
    },
    ];

    const rowKey = 'id';
    const dataSource = hotWord.list;

    const pagination = {
      defaultCurrent: 0,
      defaultPageSize: 10,
      total: hotWord.total,
      showTotal: (total) => {
        return `一共 ${total} 条`;
      },
    };

    return (
      <Table
        rowKey='sort'
        dataSource={dataSource}
        columns={columns}
        loading={hotWord.loading}
        pagination={pagination}
      />
    );
  };

  render() {
    const { HotWordTable } = this;
    return (
      <PageHeaderLayout>
        <Card>
          <Row>
            <Col lg={3} md={5} sm={6}>
              <Link to="/basic/hot-word/add">
                <Button type="primary" style={{ width: '100%', marginBottom: 8 }} icon="plus" onClick={this.handleSaveModalShow}>
                  添加
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <Card>
          <HotWordTable />
        </Card>
      </PageHeaderLayout>
    );
  }
}
