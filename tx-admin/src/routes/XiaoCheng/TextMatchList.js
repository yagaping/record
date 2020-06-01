import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Table, 
    Modal,
    Select,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, params } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            //下拉框不进行修改时  给下拉框进行id赋值
            // if(btn == "edit") {
            //     if(fieldsValue.fedUinfo == updateContent[params.fedUinfo]) {
            //         fieldsValue.fedUinfo = params.fedUinfo
            //     }
            // }
            form.resetFields();
            handleAdd(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={"添加"}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文本内容">
                {form.getFieldDecorator('text', {
                    rules: [{ required: true, message: '请输入版本号' }],
                    initialValue: '',
                })(<TextArea placeholder="请输入版本号" rows={4}/>)}                 
            </FormItem>
        </Modal>
    )
})
@connect(({ textMatchList, loading }) => ({
    textMatchList,
    loading: loading.models.textMatchList,
}))
@Form.create()
export default class TextMatchList extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'textMatchList/queryTextMatch',
                payload: {
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    ...fieldsValue,
                },
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false })
                        }
                    }
                }
            });
        });
    }

    reset = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'textMatchList/queryTextMatch',
            payload: {
                page: 1,
                pageSize: 10,
                source: ''
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({ page: 1, pageSize: 10, loading: false })
                    }else {
                        message.error(res.message || '服务器错误');
                        this.setState({ loading: false })
                    }
                }
            }
        });
    }

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { btn } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="文本来源">
                    {getFieldDecorator('source',{
                        initialValue: "",
                    })(
                        <Select placeholder="请选择文本来源">
                            <Option value="0" key="0">速记</Option>
                            <Option value="1" key="1">手动添加</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="是否识别">
                    {getFieldDecorator('typeKey',{
                        initialValue: "1",
                    })(
                        <Select placeholder="请选择识别结果">
                            <Option value="0" key="0">是</Option>
                            <Option value="1" key="1">否</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24}>
                    <FormItem label="是否匹配">
                    {getFieldDecorator('resultKey',{
                        initialValue: "1",
                    })(
                        <Select placeholder="请选择匹配结果">
                            <Option value="0" key="0">是</Option>
                            <Option value="1" key="1">否</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col md={4} sm={24} >
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
        this.setState({ page: current, pageSize: pageSize, loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: current,
                pageSize: pageSize,
                ...fieldsValue
            };
            dispatch({
                type: 'textMatchList/queryTextMatch',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                        }else {
                            message.error(res.message || '服务器错误');
                        }
                    }
                    this.setState({ loading: false });
                }
            });
        });
    }

      //添加弹框
    handleModalVisible = (flag, btn, params) => {
        this.setState({ 
            modalVisible: !!flag,
            btn: btn ? btn : null,
            params: params ? params : null, 
            id: params ? params.id : null
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'textMatchList/addTextMatch',
            payload: {
                ...fields
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('添加成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
            });
            this.setState({ modalVisible: false });
    }

    render() {
        const { dataList, total } = this.props.textMatchList && this.props.textMatchList.data;
        const  { page, pageSize, loading, modalVisible } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '文本来源',
            dataIndex: 'source',
            key: 'source',
            render: (value, row, index) => {
                return(<span>{value == '0' ? '速记' : '手动添加'}</span>)
            }
          }, {
            title: '文本内容',
            dataIndex: 'text',
            key: 'text',
            width: 400
          }, {
            title: '识别类型',
            dataIndex: 'identifyType',
            key: 'identifyType',
          }, {
            title: '识别结果',
            dataIndex: 'identifyResult',
            key: 'identifyResult',
          }, {
            title: '匹配结果',
            dataIndex: 'matchResult',
            key: 'matchResult',
            width: 400
          }, {
            title: '文本来源ID',
            dataIndex: 'sourceKey',
            key: 'sourceKey',
          }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''}</span>)
            }
          }
        //   , {
        //       title: '操作',
        //       dataIndex: 'operation',
        //       key: 'operation',
        //       render: (value, row, index) => {
        //         return(
        //             <Fragment key={index}>
        //                 <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
        //                 <Divider type="vertical" />
        //                 <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row.id)}>
        //                     <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
        //                 </Popconfirm>
        //             </Fragment>
        //         ) 
        //       }
          
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
              this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        };

        const parentMethods = {
            handleAdd: this.handleAdd,
            // handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
        };

        return(
            <div>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderForm()}</div>
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
                    />
                </div>
                <CreateForm {...this.state} {...parentMethods} ref="myform"/>
            </div>
        )
    }
}