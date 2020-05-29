import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewsContentPictureTable from '../../components/NewsContentPictureTable';
import NewsContentPictureModel from '../../components/NewsContentPictureModal';
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
export default class NewsContentPictureList extends PureComponent {
  state = {
    modalTitle: '标题',
    modalType: MODAL_TYPE.ADD, // add modify
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    newsModifyData: {},
    newsAddData: {},
    searchTitle: '',
    searchNewsType: -1,
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
        params,
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
      type: 'jobList/fetch',
      payload: params,
    });
  }

  handleTableOperation = (row) => {
    const moreMenu = (
      <Menu>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModalModifyShow.bind(this, row)}
          >
            修改
          </a>
        </Menu.Item>
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
            index: 0,
            newsId: params.newsId,
          },
        },
      });
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const { params } = this.props.match;
    dispatch({
      type: 'newsContentList/query',
      payload: {
        params: {
          index: (current - 1),
          size: pageSize,
          newsId: params.newsId,
        },
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { params } = this.props.match;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'newsContentList/query',
      payload: {
        params,
      },
    });
  }

  handleModalModifyShow = (row) => {
    this.setState({
      modalTitle: '修改',
      modalVisible: true,
      newsModifyData: row,
      modalType: MODAL_TYPE.MODIFY,
    });
  }

  handleModalModify = (newValues, oldValue) => {
    // 修改需要注意：后台有 两属性不一致.
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsContentList/saveOrUpdateNewsArticlePicture',
      payload: {
        values: {
          ...newValues,
          params,
          newsContentPictureId: oldValue.newsContentPictureId,
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
      type: 'newsContentList/saveOrUpdateNewsArticlePicture',
      payload: {
        values: {
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
      modalTitle: '添加 新闻',
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
    if (this.props.location.query === null || this.props.location.query === undefined) {
      this.props.history.push({
        pathname: '/news/news-list',
      });
    } else {
      this.props.history.push({
        pathname: '/news/news-list',
        query: this.props.location.query,
      });
    }
  };
  render() {
    const { newsContentList } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType } = this.state;
    const { newsModifyData, newsAddData } = this.state;
    const addUrl = '/news/news-add';
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
            <NewsContentPictureTable
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

        <NewsContentPictureModel
          title={modalTitle}
          modalVisible={modalVisible}
          handleOK={modalType === MODAL_TYPE.ADD ? this.handleModalAdd : this.handleModalModify}
          handleCancel={() => this.handleModalVisible()}
          newsData={modalType === MODAL_TYPE.ADD ? newsAddData : newsModifyData}
        />
      </PageHeaderLayout>
    );
  }
}
