import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Input,
    Modal,
    Badge,
    Radio
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, addOrEditor, params } = props;
    const okHandle = () => {
        form.validateFields((err, values) => {
            if (err) return;
            form.resetFields();
            addOrEditor(values);
        });
    }
    const checkPwd = ( rules, value, callback ) => {
        if(value){
            if(value.length >= 8 && value.length <= 16){
                callback()
            }
            callback('请输入8-16位密码')
        }
        callback()
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "添加" : '编辑'}
            width={650}
        >
            <FormItem label="昵称">
                {form.getFieldDecorator('m_nickName', {
                    rules: [{ required: true, message: '请输入昵称' }],
                    initialValue: params ? params.nickName : '',
                })(<Input placeholder="请输入昵称"/>)}                 
            </FormItem>
            <FormItem label="米橙号">
                {form.getFieldDecorator('m_uniqueNumber', {
                    rules: [{ required: true, message: '请输入米橙号' }],
                    initialValue: params ? params.uniqueNumber : '',
                })(<Input placeholder="请输入米橙号"/>)}                 
            </FormItem>
            {
              btn == 'add' && (
                <Fragment>
                  <FormItem label="手机号">
                      {form.getFieldDecorator('m_mobile', {
                          rules: [
                            { required: true, message: '请输入手机号码' },
                            {
                             pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
                            }
                          ],
                          initialValue: params ? params.mobile : '',
                      })(<Input placeholder="请输入手机号" maxLength={11}/>)}
                  </FormItem>
                  <FormItem label="密码">
                      {form.getFieldDecorator('m_password', {
                          rules: [
                              { required: true, message: '请输入密码' },
                              { validator: checkPwd }
                            ],
                          initialValue: params ? params.password : '',
                      })(<Input placeholder="请输入密码" type="password" maxLength={16}/>)}
                  </FormItem>
                </Fragment>
              )
            }
            <FormItem label="通知音文本">
                {form.getFieldDecorator('bpText', {
                    initialValue: params ? params.bpText : '',
                })(
                    <TextArea rows={4}/>
                )}
            </FormItem>
            <FormItem label="显示在通讯录">
                {form.getFieldDecorator('isShow', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.isShow : 1,
                })(
                    <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
            </FormItem>
            <FormItem label="是否可回复">
                {form.getFieldDecorator('isReply', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.isReply : 1,
                })(
                    <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
            </FormItem>
            <FormItem label="是否可拉黑，删除朋友">
                {form.getFieldDecorator('isBlacklist', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.isBlacklist : 1,
                })(
                    <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
            </FormItem>
        </Modal>
    )
})
@connect(({ editionList, loading }) => ({
    editionList,
    loading: loading.models.editionList,
}))
@Form.create()
export default class McCustomer extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        uniqueNumber: '',
        nickName: ''
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, values ) => {
            const {  nickName, uniqueNumber } = values;
            const { page, pageSize } = this.state;
            dispatch({
                type: 'editionList/queryCustomer',
                payload: {
                    page,
                    pageSize,
                    nickName,
                    uniqueNumber
                }
            });
        });
    }

    reset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
          page: 1,
          pageSize: 10,
          uniqueNumber: '',
          nickName: ''
        },() => this.getData() )
    }

    renderSearch() {
        const { getFieldDecorator } = this.props.form;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="昵称">
                    {getFieldDecorator('nickName',{
                      initialValue:''
                    })(
                        <Input placeholder="请输入昵称查询"/>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="米称号">
                    {getFieldDecorator('uniqueNumber',{
                      initialValue:''
                    })(
                        <Input placeholder="请输入米称号查询"/>
                    )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24} >
                    <span style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                        重置
                        </Button>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }
    
    //pagination 点击分页
    onClick(current, pageSize) {
        this.setState({ page: current, pageSize: pageSize },() => this.getData());
    }

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : this.state.btn,
            params: params ? params : null, 
            userId:params ? params.userId : null, 
        });
        this.refs.myform.resetFields();
    };

    //新增、编辑
    addOrEditor = (values) => {
      const { btn, userId, params } = this.state;
      const {
        isShow,
        isReply,
        bpText,
        isBlacklist
      } = values;
      let obj = {
            customers: {
              nickName:values.m_nickName,
              uniqueNumber:values.m_uniqueNumber,
              mobile:values.m_mobile,
              password:values.m_password,
              bpText,
              isShow,
              isReply,
              isBlacklist
              }
          }
      let url = 'addCustomer';
      if( btn == 'edit' ){
        url = 'updateCustomer';
        obj.customers.userId = userId;
        if(params && params.uniqueNumber == obj.customers.uniqueNumber){
            obj.customers.uniqueNumber = null;
        }
      }
        this.props.dispatch({
            type: `editionList/${url}`,
            payload: {
              ...obj
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success(`${ btn=='add' ? '新增' : '编辑'}成功`);
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
          });
          this.setState({ modalVisible: false });
    }
    render() {
        const { loading, editionList  } = this.props;
        const { data:{ dataList, total} } = editionList;
        const  { page, pageSize } = this.state;
        const columns = [{
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
          },  {
            title: '用户昵称',
            dataIndex: 'nickName',
            key: 'nickName',
          }, {
            title: '米橙号',
            dataIndex: 'uniqueNumber',
            key: 'uniqueNumber',
          },{
              title:'通知音文本',
              dataIndex:'bpText',
              key:'bpText',
              render:key => key || '--'
          },{
            title: '显示通讯',
            dataIndex: 'isShow',
            key: 'isShow',
            render: key => key ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />
          }, {
            title: '是否可以回复',
            dataIndex: 'isReply',
            key: 'isReply',
            render: key => key ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />
          }, {
            title: '是否可拉黑,删除朋友',
            dataIndex: 'isBlacklist',
            key: 'isBlacklist',
            render: key => key ? <Badge status="success" text="是" /> : <Badge status="default" text="否" />
          },{
              title: '操作',
              key: 'operation',
              width:80,
              render: row => {
                return <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
              }
          }];
        const pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
              this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        };

        const parentMethods = {
            addOrEditor: this.addOrEditor,
            handleModalVisible: this.handleModalVisible,
        };

        return(
            <PageHeaderLayout title={'米橙客服'}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSearch()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                                添加
                            </Button>
                        </div>
                        <Table 
                            className={styles.myTable}
                            style={{backgroundColor:'white',marginTop:16}}
                            columns={columns} 
                            dataSource={dataList} 
                            pagination={pagination}
                            loading={loading}
                            rowKey='userId'
                        />
                    </div>
                </Card>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
            </PageHeaderLayout>
        )
    }
}