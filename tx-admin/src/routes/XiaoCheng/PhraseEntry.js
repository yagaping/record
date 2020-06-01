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
    Divider,
    Popconfirm,
    TreeSelect,
    Tabs
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import FuzzyMatching from './FuzzyMatching';
import Synonym from './Synonym';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, handleAdd, handleEdit, params, treeData, modalTreeId, modalTreeValue, onModalTreeChange, onModalTreeSelect } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            if(modalTreeId == 0) return message.error('请选择分组')
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "添加" : '编辑'}
            width={550}
        >
            {
                btn == 'add' 
                ?
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分组">
                    <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        treeData={treeData}
                        value={modalTreeValue}
                        dropdownStyle={{ maxHeight: 500, overflow: 'auto', }}
                        placeholder="请选择"
                        onChange={onModalTreeChange}
                        // onSelect={onModalTreeSelect}
                        treeNodeFilterProp="title" 
                    />
                </FormItem>
                : null
            }
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词1">
                {form.getFieldDecorator('words1', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words1 : '',
                })(<TextArea placeholder="请输入同义词1" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词2">
                {form.getFieldDecorator('words2', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words2 : '',
                })(<TextArea placeholder="请输入同义词2" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词3">
                {form.getFieldDecorator('words3', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words3 : '',
                })(<TextArea placeholder="请输入同义词3" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词4">
                {form.getFieldDecorator('words4', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words4 : '',
                })(<TextArea placeholder="请输入同义词4" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词5">
                {form.getFieldDecorator('words5', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words5 : '',
                })(<TextArea placeholder="请输入同义词5" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词6">
                {form.getFieldDecorator('words6', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words6 : '',
                })(<TextArea placeholder="请输入同义词6" autosize/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同义词7">
                {form.getFieldDecorator('words7', {
                    // rules: [{ required: true, message: '请输入事件同义词' }],
                    initialValue: params ? params.words7 : '',
                })(<TextArea placeholder="请输入同义词7" autosize/>)}
            </FormItem>
           
        </Modal>
    )
})
@connect(({ phraseEntry, infoTree, loading }) => ({
    phraseEntry,
    infoTree,
    loading: loading.models.phraseEntry,
}))
@Form.create()
export default class PhraseEntry extends PureComponent {
    constructor(props){
        super(props);
        //从（信息分类树）树节点跳到该页面  
        const prevParams = props && props.location || '';
        const modalTreeValue = prevParams && prevParams.params ? prevParams.params.node.props.dataRef.name : '';
        const modalTreeId = prevParams && prevParams.id ? prevParams.id : 0;
        this.state = {
            page: 1,
            pageSize: 10,
            loading: false,
            modalVisible: prevParams && prevParams.params ? true : false, //则显示弹框，并给选择树赋默认值
            btn: prevParams && prevParams.params ? 'add' : '',     
            selectedKeys: [],
            modalTreeValue: modalTreeValue,  //弹框里树的值
            modalTreeId: modalTreeId,   //弹框里树的id
            treeValue: '',       //搜索框里树的值
            treeId: 0,             //搜索框里树的id,默认为0表示全部
            treeData: [{}]
        }
    }

    componentDidMount() {
        this.getData();
        this.getTree();
    }

    getTree = () => {
        const {form, dispatch} = this.props;
        this.setState({ loading: true });
        dispatch({
            type: 'infoTree/treeList',
            payload: {
                object: {}
            },
            callback: (res) => {
                if(res) {
                    if(res.code =='0') {
                        const data = res.data;
                        const renderTreeNodes = (data) => {
                            return data.map((item,i) => {
                                if(item.children) {
                                    renderTreeNodes(item.children);
                                }
                                item.title = item.name;
                                item.key = item.id;
                                item.value = String(item.id);
                                return item;
                            })
                        }
                        renderTreeNodes(data)
                        this.setState({ treeData: data });
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
                this.setState({ loading: false });
            }
        });
    }

    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            const values = {
                page: this.state.page,
                pageSize: this.state.pageSize,
                type: this.state.treeId ? parseInt(this.state.treeId) : 0,   //0默认全部
                wordType: 0
            };
            dispatch({
                type: 'phraseEntry/getPhraseList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ loading: false });                   
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
        this.setState({ loading: true, treeValue: '' });
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
            type: 'phraseEntry/getPhraseList',
            payload: {
                page: 1,
                pageSize: 10,
                type: 0,
                wordType: 0
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
        
        const { treeData,  treeValue } = this.state;
        return (
        <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                    <FormItem label="请选择分组">
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            value={treeValue}
                            dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                            treeData={treeData}
                            placeholder="请选择"
                            onChange={this.onTreeChange}
                            // onSelect={this.onTreeSelect}
                            treeNodeFilterProp="title" 
                            // allowClear
                        />
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
                type: this.state.treeId ? parseInt(this.state.treeId) : 0,   //0默认全部
                wordType: 0
            };
            dispatch({
                type: 'phraseEntry/getPhraseList',
                payload: values,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            // this.setState({ page: 1, loading: false })
                        }else {
                            message.error(res.message || '服务器错误');
                            // this.setState({ loading: false })
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
            id: params ? params.id : null,
            modalTreeValue: btn ? (btn == 'add' ? '' : params.rbsCategoryTreeName) : ''     //编辑时设置树的值
        });
        this.refs.myform.resetFields();
    };

    //新增
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'phraseEntry/addPhraseList',
            payload: {
                object: {
                    ...fields,
                    type: parseInt(this.state.modalTreeId),
                    wordType: 0
                    // extend_json: {}
                }
                
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

    //编辑
    handleEdit = (fields) => {
        this.props.dispatch({
            type: 'phraseEntry/updatePhraseList',
            payload: {
                object: {
                    ...fields,
                    id: this.state.id,
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    }
    //删除
    showDeleteConfirm = (id) => {
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'phraseEntry/deletePhraseList',
            payload: {
                id: id,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    //设置搜索框的tree
    onTreeChange = (value, label, extra) => {
        this.setState({ 
            treeValue: label[0],
            treeId: value
        });
    }

    onTreeSelect = (value, node, extra) => {
        this.setState({ treeId: node.props.id });
    }

    //设置弹框里的tree
    onModalTreeChange = (value, label, extra) => {
        this.setState({ 
            modalTreeValue: label[0],
            modalTreeId: value
        });
    }

    onModalTreeSelect = (value, node, extra) => {
        this.setState({ modalTreeId: node.props.id });
    }

    render() {
        const { dataList, total } = this.props.phraseEntry && this.props.phraseEntry.data || [];
        // const { data } = this.props.infoTree;
        const  { page, pageSize, loading, treeData } = this.state;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '分组',
            dataIndex: 'rbsCategoryTreeName',
            key: 'rbsCategoryTreeName',
            render: (value, row, index) => {
                return(<span key={index}>{value ? value : ''}</span>)
            }
          }, {
            title: '同义词1',
            dataIndex: 'words1',
            key: 'words1',
          }, {
            title: '同义词2',
            dataIndex: 'words2',
            key: 'words2',
          }, {
            title: '同义词3',
            dataIndex: 'words3',
            key: 'words3',
          }, {
            title: '同义词4',
            dataIndex: 'words4',
            key: 'words4',
          }, {
            title: '同义词5',
            dataIndex: 'words5',
            key: 'words5',
          }, {
            title: '同义词6',
            dataIndex: 'words6',
            key: 'words6',
          }, {
            title: '同义词7',
            dataIndex: 'words7',
            key: 'words7',
          }, {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              render: (value, row, index) => {
                    return(
                        <Fragment key={index}>
                            <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row.id)}>
                                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
                            </Popconfirm>
                        </Fragment>
                    ) 
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
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
            onModalTreeChange: this.onModalTreeChange,
            onModalTreeSelect: this.onModalTreeSelect,
            renderTreeNodes: this.renderTreeNodes
        };

        return(
            <PageHeaderLayout title={'词组'}>
                <Card bordered={false}>
                    <Tabs
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        tabBarStyle={{marginBottom: 50}} 
                        type='card'
                    >
                        <TabPane tab='词组录入' key='1'>
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
                                    rowKey='id'
                                />
                            </div>
                        </TabPane>
                        <TabPane tab='词组录入模糊匹配' key='2'>
                            <FuzzyMatching />
                        </TabPane>
                        <TabPane tab='近义词列表' key='3'>
                            <Synonym />
                        </TabPane>
                    </Tabs>
                </Card>
                <CreateForm {...this.state} {...parentMethods} treeData={treeData} ref="myform"/>
            </PageHeaderLayout>
        )
    }
}