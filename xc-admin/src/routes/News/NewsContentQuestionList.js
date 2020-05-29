import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AnswerLayout from '../../layouts/AnswerLayout';
import NewsContentQuestionTable from '../../components/NewsContentQuestionTable';
import NewsContentAnswerTable from "../../components/NewsContentAnswerTable";
import NewsContentAnswerModal from '../../components/NewsContentAnswerModal';
import NewsContentQuestionModal from '../../components/NewsContentQuestionModal';
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
export default class NewsContentAnswerList extends PureComponent {
  state = {
    modalTitle: '标题',
    modalType: MODAL_TYPE.ADD, // add modify
    modalQuestionType: MODAL_TYPE.ADD, // question add modify
    modalVisible: false,
    modalQuestionVisible: false,
    selectedRows: [],
    formValues: {},
    newsModifyData: {},
    newsQuestionModifyData: {},
    newsAddData: {},
    newsQuestionAddData: {},
    searchContentAbstract: '',
    searchStatus: 0,
    searchIndex: 0,
    searchSize: 10,
    searchNewsId: 0,
    newsListQuery: null,
    editorContentEditorData: "",
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

    dispatch({
      type: 'newsContentList/queryAnswerList',
      payload: {
        newsId: params.newsId,
        status: this.state.searchStatus,
        index: this.state.searchIndex,
        size: this.state.searchSize,
        contentAbstract: this.state.searchContentAbstract,
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
    let operItem = null;
    if (row.status === 0) {
      operItem = (
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleNewsRemove.bind(this, row, 1)}
          >
            删除
          </a>
        </Menu.Item>
      );
    } else if (row.status === 1) {
      operItem = (
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleNewsRemove.bind(this, row, 0)}
          >
            恢复
          </a>
        </Menu.Item>
      );
    }

    const query = {
      index: this.state.searchIndex,
      contentAbstract: this.state.searchContentAbstract,
      status: this.state.searchStatus,
      size: this.state.searchSize,
      newsId: this.state.searchNewsId,
      newsListQuery: this.state.newsListQuery,
      newsContentAnswer: row,
    };
    const imageLink = (<Link to={{ pathname: `/news/question-answer-image-list/${row.newsContentAnswerId}`, query }}>图片</Link>);
    const videoLink = (<Link to={{ pathname: `/news/question-answer-video-list/${row.newsContentAnswerId}`, query }}>视频</Link>);
    const editLink = (<Link to={{ pathname: `/news/news-content-edit/${row.newsContentAnswerId}`, query }}>修改</Link>);
    const moreMenu = (
      <Menu>
        <Menu.Item>
          {/*<a*/}
            {/*rel="noopener noreferrer"*/}
            {/*onClick={this.handleModalModifyShow.bind(this, row)}*/}
          {/*>*/}
            {/*修改*/}
          {/*</a>*/}
          {editLink}
        </Menu.Item>
        {operItem}
        <Menu.Item>
          {imageLink}
        </Menu.Item>
        <Menu.Item>
          {videoLink}
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

  handleTableQuestionOperation = (row) => {
    const moreMenu = (
      <Menu>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            onClick={this.handleModalQuestionModifyShow.bind(this, row)}
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

      const { contentAbstract, status } = values;
      this.state.searchContentAbstract = contentAbstract;
      this.state.searchStatus = status;
      this.state.searchIndex = 0;
      const { params } = this.props.match;
      dispatch({
        type: 'newsContentList/queryAnswerList',
        payload: {
          index: this.state.searchIndex,
          newsId: params.newsId,
          contentAbstract,
          status,
          size: this.state.searchSize,
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
      type: 'newsContentList/queryAnswerList',
      payload: {
        index: this.state.searchIndex,
        size: this.state.searchSize,
        contentAbstract: this.state.searchContentAbstract,
        status: this.state.searchStatus,
        newsId: params.newsId,
      },
    });
  };

  handleQuestionTableChange = (pagination, filters, sorter) => {
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
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'jobList/fetch',
      payload: {},
    });
  }

  handleNewsRemove = (row, status) => {
    this.props.dispatch({
      type: 'newsContentList/deleteNewsAnswer',
      payload: {
        id: row.newsContentAnswerId,
        status,
      },
      callback: () => {
        // 查询 job list
        this.queryContentList();
      },
    });
  }

  // modal 操作
  handleModalAdd = (newValues) => {
    this.props.dispatch({
      type: 'newsList/save',
      payload: {
        body: {
          ...newValues,
          content: this.editorContentEditorData,
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

  handleModalModify = (newValues, oldValue, html) => {
    if (this.editorContentEditorData === undefined) {
      this.editorContentEditorData = html;
    }
    // 修改需要注意：后台有 两属性不一致.
    this.props.dispatch({
      type: 'newsContentList/modifyNewsAnswer',
      payload: {
        body: {
          content: this.editorContentEditorData,
          ...newValues,
          newsContentAnswerId: oldValue.newsContentAnswerId,
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

  handleModalModifyShow = (row) => {
    this.setState({
      modalTitle: '修改',
      modalVisible: true,
      newsModifyData: row,
      modalType: MODAL_TYPE.MODIFY,
    });
  }

  //question modal
  handleModalQuestionAdd = (newValues) => {
    const { params } = this.props.match;
    this.props.dispatch({
      type: 'newsContentList/addQuestion',
      payload: {
        body: {
          ...newValues,
          newsId: params.newsId,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryContentList();
      },
    });
    this.setState({
      modalQuestionVisible: false,
    });
  }

  handleModalQuestionModify = (newValues, oldValue) => {
    // 修改需要注意：后台有 两属性不一致.
    this.props.dispatch({
      type: 'newsContentList/modifyNewsQuestion',
      payload: {
        body: {
          ...newValues,
          newsContentQuestionId: oldValue.newsContentQuestionId,
          triggerExpression: newValues.triggerValue,
        },
      },
      callback: () => {
        // query list
        this.queryContentList();
      },
    });
    this.setState({
      modalQuestionVisible: false,
    });
  }

  handleModalQuestionVisible = (flag) => {
    this.setState({
      modalQuestionVisible: !!flag,
    });
  }

  handleModalQuestionAddShow = () => {
    this.setState({
      modalTitle: '添加 新闻',
      modalQuestionVisible: true,
      modalQuestionType: MODAL_TYPE.ADD,
    });
  }

  handleModalQuestionModifyShow = (row) => {
    this.setState({
      modalTitle: '修改',
      modalQuestionVisible: true,
      newsQuestionModifyData: row,
      modalQuestionType: MODAL_TYPE.MODIFY,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    const { query } = this.props.location;
    if (query !== undefined) {
      this.state.searchIndex = query.index;
      this.state.searchSize = query.size;
      this.state.searchContentAbstract = query.contentAbstract;
      this.state.searchStatus = query.status;

      if (query.newsListQuery !== undefined) {
        this.state.newsListQuery = query.newsListQuery;
      }
      this.props.location.query = undefined;
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="摘要">
              {getFieldDecorator('contentAbstract', { initialValue: this.state.searchContentAbstract })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: this.state.searchStatus })(
                <Select style={{ width: '100%' }}>
                  <Option value={-1}>全部</Option>
                  <Option value={0}>正常</Option>
                  <Option value={1}>删除</Option>
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
  handleContentEditorChange = (html, text, formatText) => {
    // this.setState({editorContentEditorData: html});
    this.editorContentEditorData = html;
  };
  render() {
    const { newsContentList } = this.props;
    const { selectedRows, modalVisible, modalTitle, modalType, modalQuestionType } = this.state;
    const { modalQuestionVisible } = this.state;
    const { newsModifyData, newsAddData, newsQuestionModifyData, newsQuestionAddData } = this.state;
    this.state.searchNewsId = this.props.match.params.newsId;
    if (this.props.location.query !== undefined) {
      this.state.newsListQuery = this.props.location.query;
    }
    return (
      <PageHeaderLayout>
        <AnswerLayout>
          <Card bordered={false}>
            <div style={{margin: '-20px 0px 10px -20px'}}><h2><b>问答问题</b></h2></div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {/*{this.renderForm()}*/}
              </div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={this.handleGoBack}>
                  返回
                </Button>
                <Button icon="plus" type="primary" onClick={this.handleModalQuestionAddShow}>
                  新建
                </Button>

              </div>
              <NewsContentQuestionTable
                selectedRows={selectedRows}
                loading={newsContentList.loading}
                data={newsContentList.data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                operation={this.handleTableQuestionOperation}
                onTableChange={this.handleQuestionTableChange}
                query={this.state}
                newsListQuery={this.state.newsListQuery}
              />
            </div>
          </Card>
        </AnswerLayout>
        <NewsContentQuestionModal
          title={modalTitle}
          modalVisible={modalQuestionVisible}
          handleOK={modalQuestionType === MODAL_TYPE.ADD ? this.handleModalQuestionAdd : this.handleModalQuestionModify}
          handleCancel={() => this.handleModalQuestionVisible()}
          newsData={modalQuestionType === MODAL_TYPE.ADD ? newsQuestionAddData : newsQuestionModifyData}
        />
        <div style={{ height: '50px' }}>&nbsp;</div>
        <AnswerLayout>
          <Card bordered={false}>
            <div style={{margin: '-20px 0px 50px -20px'}}><h2><b>问答答案</b></h2></div>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                {this.renderForm()}
              </div>
              <div className={styles.tableListOperator}>
                {/*<Button icon="plus" type="primary" onClick={this.handleModalAddShow}>*/}
                  {/*新建*/}
                {/*</Button>*/}

              </div>
              <NewsContentAnswerTable
                selectedRows={selectedRows}
                loading={newsContentList.loading}
                data={newsContentList.answerData}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                operation={this.handleTableOperation}
                onTableChange={this.handleTableChange}
                query={this.state}
              />
            </div>
          </Card>
        </AnswerLayout>
        <NewsContentAnswerModal
          title={modalTitle}
          modalVisible={modalVisible}
          handleOK={modalType === MODAL_TYPE.ADD ? this.handleModalAdd : this.handleModalModify}
          handleCancel={() => this.handleModalVisible()}
          newsData={modalType === MODAL_TYPE.ADD ? newsAddData : newsModifyData}
          handleContentEditorChange={this.handleContentEditorChange}
        />
      </PageHeaderLayout>
    );
  }
}
