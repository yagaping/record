import React, { PureComponent } from 'react';
import {
    Form,
    message,
    Card,
    Input,
    Modal,
    Tree,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, form, btn, treeAdd, treeChange, params } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            btn == "add" ? treeAdd(fieldsValue) : treeChange(fieldsValue);
        });
    }
    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "新增" : '修改'}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节点名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入节点名称' }],
                    initialValue: btn == "edit" ? params.dataRef.name : '',
                })(<Input placeholder="请输入节点名称"/>)}                 
            </FormItem>
        </Modal>
    )
})
@connect(({ mapTree, loading }) => ({
    mapTree,
    loading: loading.models.mapTree,
}))
@Form.create()
export default class MapTree extends PureComponent {
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
    }

    onExpand = (expandedKeys) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    }

    onSelect = (selectedKeys, info) => {
        // this._link(selectedKeys[0], info);
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const {form, dispatch} = this.props;
        this.setState({ loading: true });
        dispatch({
            type: 'mapTree/mapTreeGet',
            payload: {
                object: {}
            },
            callback: (res) => {
                if(res) {
                    if(res.code =='0') {

                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
                this.setState({ loading: false });
            }
        });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.id} />;
        });
    }

      //跳转
    _link = (id,params) => {
        this.props.dispatch( routerRedux.push({
            pathname: '/text-recognition/phrase-entry',
            params: params,
            id: id
        }
        ));
    }

    
    onRightClick = (event, node) => {
        this.setState({
            params: event.node.props,  //获取当前节点参数
            showMenu: true,
            clientX: event.event.clientX + 'px',
            clientY: event.event.clientY + 'px'
        })
    }

    mouseUp = (e) => {
        this.setState({
            showMenu: false
        });
    }

    handleModalVisible = (flag, btn) => {
        this.setState({
            modalVisible: !!flag,
            btn: btn
        })
        this.refs.myform.resetFields();
    }

    treeDelete = (e) => {
        const { params } = this.state;
        this.props.dispatch({
            type: 'mapTree/mapTreeDelete',
            payload: {
                id: params.dataRef.id,
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('删除成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    //新增
    treeAdd = (fields) => {
        const { params } = this.state;
        this.props.dispatch({
            type: 'mapTree/mapTreeAdd',
            payload: {
                object: {
                    ...fields,
                    parentId: params.dataRef.id,
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

    //编辑数据
    treeChange = fields => {
        const { params } = this.state;
        this.props.dispatch({
            type: 'mapTree/mapTreeUpdate',
            payload: {
                object: {
                    ...fields,
                    id: params.dataRef.id,
                    parentIdPath: params.dataRef.parentIdPath
                }
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('修改成功');
                    }else{
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
        this.setState({ modalVisible: false });
    };

    render() {
        const { data } = this.props.mapTree;
        const parentMethods = {
            treeAdd: this.treeAdd,
            treeChange: this.treeChange,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <PageHeaderLayout title={'地图数据树形结构'}>
                <div>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <Tree
                                showLine
                                // multiple
                                defaultExpandAll
                                // checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                                onRightClick={(e) => this.onRightClick(e)}
                                >
                                {Object.keys(data).length > 0 
                                    ? 
                                    this.renderTreeNodes(data) 
                                    :
                                    <TreeNode title="default" key="0-0-0-1" onSelect={() => {}}/>
                                }
                            </Tree>
                            {
                                this.state.showMenu 
                                ? 
                                <ul className={styles.treeMenu} style={{left:this.state.clientX,top:this.state.clientY}} onMouseLeave={(e) => this.mouseUp(e)}>
                                    <li onClick={() => this.handleModalVisible(true,'add')}>新增</li>
                                    <li onClick={(e) => this.handleModalVisible(true,'edit')}>修改</li>
                                    <li onClick={(e) => this.treeDelete(e)}>删除</li>
                                </ul> 
                                : null
                            }
                        </div>
                    </Card>
                    <CreateForm {...this.state} {...parentMethods} ref="myform"/>
                </div>
            </PageHeaderLayout>
        );
    }
}
  
