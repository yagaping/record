import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewsContentVideoTable from '../../components/NewsContentVideoTable';
import NewsContentVideoModal from '../../components/NewsContentVideoModal';
import styles from './NewsList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const MODAL_TYPE = {
  ADD: 'add',
  MODIFY: 'modify',
};

@connect(state => ({
  newsContentList: state.newsContentList,
}))
@Form.create()
export default class newsContentVideoList extends PureComponent {
  state = {
    modalTitle: '标题',
    modalType: MODAL_TYPE.ADD, // add modify
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    newsModifyData: {},
    newsAddData: {},
    searchNewsId: 0,
    searchIndex: 0,
    searchSize: 10,
    newsListQuery: null,
  };

  componentDidMount() {
    // 查询 job list
    this.queryContentList();
  }

  queryContentList() {
    const { dispatch } = this.props;
    const { params } = this.props.match;
    dispatch({
      type: 'newsContentList/query',
      payload: {
        params: {
          newsId: params.newsId,
          index: this.state.searchIndex,
          size: this.state.searchSize,
        },
      },
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'newsContentList/query',
      payload: {
        params: {
          newsId: this.props.match.params.newsId,
          index: this.state.searchIndex,
          size: this.state.searchSize,
        },

      },
    });
  }

  handleTableOperation = (row) => {
    const query = {
      index: this.state.searchIndex,
      size: this.state.searchSize,
      newsId: this.state.searchNewsId,
      newsListQuery: this.state.newsListQuery,
    };
    const editLink = (<Link to={{ pathname: `/news/news-content-video-edit/${row.newsContentVideoId}`, query }}>编辑</Link>);
    // const editUrl = `/news/news-content-video-edit/${row.newsContentVideoId}`;
    const moreMenu = (
      <Menu>
        <Menu.Item>
          {editLink}
        </Menu.Item>
        {/*<Menu.Item>*/}
          {/*<a*/}
            {/*rel="noopener noreferrer"*/}
            {/*onClick={this.handleNewsRemove.bind(this, row)}*/}
          {/*>*/}
            {/*删除*/}
          {/*</a>*/}
        {/*</Menu.Item>*/}
      </Menu>
    );

    return (
      <div>
        <Divider type="vertical" />
        <Dropdown overlay={moreMenu}>
          <a className="ant-dropdown-link">
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }

  // 查询
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      const { params } = this.props.match;
      dispatch({
        type: 'newsContentList/query',
        payload: {
          params: {
            newsId: params.newsId,
            index: this.state.searchIndex,
            size: this.state.searchSize,
          },
        },
      });
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;

    const { params } = this.props.match;

    this.state.searchIndex = (current - 1);
    this.state.searchSize = pageSize;
    dispatch({
      type: 'newsContentList/query',
      payload: {
        params: {
          newsId: params.newsId,
          index: this.state.searchIndex,
          size: this.state.searchSize,
        },
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'jobList/fetch',
      payload: {},
    });
  }

  handleModalModifyShow = (row) => {
    const { dispatch } = this.props;
    const { newsId, contentType, newsType } = row;

    dispatch({
      type: 'newsList/queryNewsContentArticleByNewsId',
      payload: {
        newsId,
        contentType,
        newsType,
      },
    });

    this.setState({
      modalTitle: '修改',
      modalVisible: true,
      newsModifyData: row,
      modalType: MODAL_TYPE.MODIFY,
    });
  }
  handleNewsRemove = (row) => {
    this.props.dispatch({
      type: 'newsList/remove',
      payload: {
        newsId: row.newsId,
      },
      callback: () => {
        // 查询 job list
        this.queryContentList();
      },
    });
  }

  handleModalModify = (newValues, oldValue) => {
    // 修改需要注意：后台有 两属性不一致.
    this.props.dispatch({
      type: 'jobList/modify',
      payload: {
        body: {
          ...newValues,
          schedulerId: oldValue.id,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryContentList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  // modal 操作
  handleModalAdd = (newValues) => {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsContentList/addVideo',
      payload: {
        body: {
          ...newValues,
          ...params,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryContentList();
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleModalAddShow = () => {
    this.setState({
      modalTitle: '添加 视频新闻内容',
      modalVisible: true,
      modalType: MODAL_TYPE.ADD,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('newsType', { initialValue: '-1' })(
                <Select style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="0">头条</Option>
                  <Option value="1">娱乐</Option>
                  <Option value="2">笑话</Option>
                  <Option value="3">国际</Option>
                  <Option value="4">段子</Option>
                  <Option value="5">问答</Option>
                  <Option value="20">视频</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  handleGoBack = () => {
    if (this.state.newsListQuery === null || this.state.newsListQuery === undefined) {
      this.props.history.push({
        pathname: '/news/news-list',
      });
    } else {
      this.props.history.push({
        pathname: '/news/news-list',
        query: this.state.newsListQuery,
      });
    }
  };
  render() {
    const { newsContentList } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType } = this.state;
    const { newsModifyData, newsAddData } = this.state;
    this.state.searchNewsId = this.props.match.params.newsId;

    const { query } = this.props.location;
    if (query !== undefined) {
      this.state.newsListQuery = this.props.location.query;

      this.state.searchIndex = query.index;
      this.state.searchSize = query.size;
      if (query.newsListQuery !== undefined) {
        this.state.newsListQuery = query.newsListQuery;
      }
      this.props.location.query = undefined;
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {/*{this.renderForm()}*/}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleGoBack}>
                返回
              </Button>
              <Button icon="plus" type="primary" onClick={this.handleModalAddShow}>
                新建
              </Button>

            </div>
            <NewsContentVideoTable
              selectedRows={selectedRows}
              loading={newsContentList.loading}
              data={newsContentList.data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              operation={this.handleTableOperation}
              onTableChange={this.handleTableChange}
            />
          </div>
        </Card>

        <NewsContentVideoModal
          title={modalTitle}
          modalVisible={modalVisible}
          handleOK={this.handleModalAdd}
          handleCancel={() => this.handleModalVisible()}
          newsData={modalType === MODAL_TYPE.ADD ? newsAddData : newsModifyData}
        />
      </PageHeaderLayout>
    );
  }
}
