import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Form, message, Card, Radio, DatePicker, Button, Table, Input, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const fileType = ['文字', '声音','图片','视频'];
const colorType = ['无', '红', '橙', '蓝', '绿'];

@connect(({ shortHand, loading }) => ({
  shortHand,
  loading: loading.models.shortHand,
}))
@Form.create()
export default class ShortHand extends PureComponent {
  state = {
    page: 1,
    pageSize: 10,
    loading: false,
    modalVisible: false,
    source_url: ''
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        memberId: fieldsValue.member_id ? fieldsValue.member_id : '',
        page: 1,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortHand/findAll',
        payload: values,
        callback: res => {
          if(res){
            if (res.code == '0') {
              this.setState({ page: 1, loading: false });
            } else {
              message.error(res && res.message || '服务器错误');
              this.setState({ loading: false });
            }
          }
        },
      });
    });
  };

  reset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'shortHand/findAll',
      payload: {
        memberId: '',
        page: 1,
        pageSize: 10,
      },
      callback: res => {
        if(res) {
          if (res.code == '0') {
            this.setState({ page: 1, pageSize:10, loading: false });
          } else {
            message.error((res.message) || '服务器错误');
            this.setState({ loading: false });
          }
        }
      },
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { btn } = this.state;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="用户ID">
              {getFieldDecorator('member_id')(<Input placeholder="请输入用户ID" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" onClick={this.getData}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.reset()}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  onClick(current, pageSize) {
    this.setState({ page: current, pageSize: pageSize, loading: true });
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        memberId: fieldsValue.member_id ? fieldsValue.member_id : '',
        page: current,
        pageSize: pageSize,
      };
      dispatch({
        type: 'shortHand/findAll',
        payload: values,
        callback: res => {
          if(res) {
            if (res.code == '0') {
              // this.setState({ page: 1, loading: false })
            } else {
              message.error((res.message) || '服务器错误');
              // this.setState({ loading: false })
            }
          }
          this.setState({ loading: false });
        },
      });
    });
   
  }

  handleModalVisible = (flag, row) => {
    this.setState({
      modalVisible: !!flag,
      source_url: row ? row.content : '',
      file_type: row ? row.file_type : '',
    });
  }
  render() {
    const { dataList, total } = this.props.shortHand && this.props.shortHand.data;
    const { page, pageSize, loading } = this.state;
    const columns = [
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        width: 400,
        render: (value, row, index) => {
           if(row.file_type == '1') {
            return(<span key={index} className={styles.audioColor}>{value}</span>)
          }else if(row.file_type == '2') {
            return(<span key={index} className={styles.imgColor}>{value}</span>)
          }else if(row.file_type == '3') {
            return(<span key={index} className={styles.videoColor}>{value}</span>)
          }else{
            return(<span key={index}>{value}</span>)
          }
          // if(row.file_type == '1') {
          //   return(
          //     <div>
          //       <p>{row.soundText}</p>
          //       <audio controls="controls" key={index}>
          //         <source src={value}></source>
          //       </audio>
          //     </div>
          //   )
          // }else if(row.file_type == '2') {
          //   return(
          //     <div key={index}>
          //       <img src={value} width='50' onClick={() => {this.handleModalVisible(true, row)}}/>
          //     </div>
          //   )
          // }else if(row.file_type == '3') {
          //   return(
          //     <div key={index}>
          //       <video controls="controls" loop="loop" id="video" width="100" height="60" onPlay={() => this.handleModalVisible(true, row)}>
          //         <source src={value}></source>
          //       </video>
          //     </div>
          //   )
          // }else{
          //   return(
          //     <span key={index}>{value}</span>
          //   )
          // }
        }
      },
      {
        title: '用户ID',
        dataIndex: 'member_id',
        key: 'member_id',
        render: (value, row, index) => {
          return <span key={index}>{value}</span>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (value, row, index) => {
          return <span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (value, row, index) => {
          return <span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '最后更新时间',
        dataIndex: 'last_time',
        key: 'last_time',
        render: (value, row, index) => {
          return <span key={index}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '颜色类型',
        dataIndex: 'colorType',
        key: 'colorType',
        render: (value, row, index) => {
          return <span key={index}>{colorType[value]}</span>;
        },
      },
      // {
      //   title: '文件类型',
      //   dataIndex: 'file_type',
      //   key: 'file_type',
      //   render: (value, row, index) => {
      //     return <sapn key={index} onClick={() => this.handleModalVisible(true)}>{fileType[value]}</sapn>;
      //   },
      // },
      {
        title: '本地同步状态',
        dataIndex: 'syn_state',
        key: 'syn_state',
        render: (value, row, index) => {
          return <span key={index}>{value == '1' ? '同步' : '未同步'}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, row, index) => {
          return <span key={index}>{value == '1' ? '删除' : '正常'}</span>;
        },
      },
    ];
    const pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        this.onClick(current, pageSize);
      },
      onChange: (current, pageSize) => {
        this.onClick(current, pageSize);
      },
    };
    return (
      <PageHeaderLayout title={'速记列表'}>
        <Card bordered={false}>
          <ModuleIntroduce text={'APP速记'} />
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              style={{ backgroundColor: 'white', marginTop: 16 }}
              columns={columns}
              dataSource={dataList}
              pagination={pagination}
              rowKey='key'
              loading={loading}
            />
          </div>
          <Modal visible={this.state.modalVisible} footer={null} onCancel={() => this.handleModalVisible(false)} width={460} >
              {
                this.state.file_type == '3' ? 
                <video controls="controls" loop="loop" id="video" width="400" autoPlay>
                  <source src={this.state.source_url}></source>
                </video> 
                :
                <img src={this.state.source_url} width="380"/>
              }
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
