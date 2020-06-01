import React, { PureComponent, Fragment } from 'react';
import {
    Form,
    message,
    Card,
    Button,
    Input,
    Modal,
    Select,
    Tree
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { Option } = Select;

const CreateForm = Form.create()(props => {
    const { handleModalVisible, modalVisible, getSecondData, form, btn, handleAdd, handleEdit, params, data, secondDom } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
        });
    }

    return(
        <Modal 
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            title={btn == "add" ? "新增" : '修改'}
            width={850}
        >
        {btn == 'add' ? 
            <div>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件">
                    {form.getFieldDecorator('firstId', {
                        // rules: [{ required: true, message: '请输入标题' }],
                        initialValue: '1',
                    })(
                    <Select placeholder='请选择' style={{ width: '100%' }} onChange={(value,opt) => getSecondData(value,opt)}>
                        <Option value='1'>提醒</Option>
                        <Option value='2'>记账</Option>
                    </Select>    
                    )}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件名称">
                    {form.getFieldDecorator('parentId', {
                        initialValue: secondDom.length > 0 ? secondDom[0].props.value : secondDom.props.value,
                    })(
                    <Select style={{ width: '100%' }}>
                        {secondDom}
                    </Select>    
                    )}
                </FormItem>
            </div>
            :
            null
        }
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="事件 描述">
                {form.getFieldDecorator('title', {
                    initialValue: params ? params.title : '',
                })(<Input placeholder='请输入事件名称'/>)}
            </FormItem>
        </Modal>
    )
})
@connect(({ intelligenceList, loading }) => ({
    intelligenceList,
    loading: loading.models.intelligenceList,
}))
@Form.create()
export default class IntelligenceList extends PureComponent {
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [], 
        secondData: [],
        data: [],
    }

    componentDidMount() {
        this.getData();
        this.getSecondData('1');
    }
    //搜索
    getData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'intelligenceList/menuOptionGet',
                payload: {},
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            this.setState({ loading: false, data: res.data })
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false })
                        }
                    }
                }
            });
        });
    }
    //获取二级菜单
    getSecondData = (value,opt) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'intelligenceList/findSubset',
            payload: {
                parentId: value
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.setState({
                            secondData: res.data
                        })
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

    handleModalVisible = (flag, btn) => {
        this.setState({
            modalVisible: !!flag,
            btn: btn,
            params: btn == 'add' ? '' : this.state.params, 
        })
        this.refs.myform.resetFields(['title']);
    }

    //新增数据
    handleAdd = fields => {
        this.props.dispatch({
            type: 'intelligenceList/menuOptionAdd',
            payload: {
                intell: {
                    ...fields
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
    };

    //编辑数据
    handleEdit = fields => {
        const { params } = this.state;
        this.props.dispatch({
            type: 'intelligenceList/menuOptionUpdate',
            payload: {
                intell: {
                    ...fields,
                    id: params.eventKey,
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

    //删除
    treeDelete = (e) => {
        const { params } = this.state;
        this.props.dispatch({
            type: 'intelligenceList/menuOptionDelete',
            payload: {
                intell: {
                    id: params.eventKey,
                }
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

    onExpand = (expandedKeys,e) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        // let firstNodeId,secondNodeId;
        // if(e.node.props.pos.length == 3) { firstNodeId = e.node.props.eventKey};
        // if(e.node.props.pos.length == 5) { secondNodeId = e.node.props.eventKey};
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    }

    onRightClick = (event, node) => {
        if(event.node.props.pos.length != 7) return;    //如果是三级节点右键才有效果
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

    onDragStart = (info) => {
        if(info.node.props.pos.length != 3 ) return false;   
    }
    
    onDragEnter = (info) => {
        if(info.node.props.pos.length != 3 ) return false;  // 如果不是一级菜单  就不做拖拽
        // console.log(info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    }
    
    onDrop = (info) => {
        if(info.node.props.pos.length != 3 || info.dragNode.props.pos.length != 3) return false;  // 如果不是一级菜单  就不做拖拽
        // console.log(info);
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key && item.key.id == key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };
        const data = [...this.state.data];
    
        // Find dragObject
        let dragObj,curId,curSort,targetId,targetSort;
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1);
          dragObj = item;
        });
    
        if (!info.dropToGap) {
          // Drop on the content
          loop(data, dropKey, (item) => {
            item.children = item.children || [];
            // where to insert 示例添加到尾部，可以是随意位置
            item.children.push(dragObj);
            targetId = item.key.id;
            targetSort = item.key.sort;
          });
        } else if (
          (info.node.props.children || []).length > 0 // Has children
          && info.node.props.expanded // Is expanded
          && dropPosition === 1 // On the bottom gap
        ) {
          loop(data, dropKey, (item) => {
            item.children = item.children || [];
            // where to insert 示例添加到尾部，可以是随意位置
            item.children.unshift(dragObj);
          });
        } else {
          let ar;
          let i;
          loop(data, dropKey, (item, index, arr) => {
            ar = arr;
            i = index;
            targetId = arr[0].key.id;
            targetSort = arr[0].key.sort;
          });
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
          } else {
            ar.splice(i + 1, 0, dragObj);
          }
        }
        curId = dragObj.key.id;
        curSort = dragObj.key.sort;
    
        const { dispatch, form } = this.props;
        dispatch({
            type: 'intelligenceList/drag',
            payload: {
                intell:[{id:curId,sort:targetSort},{id:targetId,sort:curSort}]
            },
            callback: (res) => {
                if(res) {
                    if(res.code == '0') {
                        this.getData();
                        message.success('移动成功');
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        });
    }

    render() {
        // const { data } = this.props.intelligenceList;
        const  { secondData, data } = this.state;
        const { form, dispatch } = this.props;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleEdit: this.handleEdit,
            handleModalVisible: this.handleModalVisible,
            getSecondData: this.getSecondData
        };

        const  loop = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode title={item.key.title} key={item.key.id} dataRef={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.title} key={item.id} />;
            });
        }
        
        let secondDom = secondData.length > 0 ? secondData.map(( item, i) => {
            return <Option value={item.id}>{item.title}</Option>
        }) : <Option value=''>暂无</Option>;

        return(
            <PageHeaderLayout title={'智能菜单'}>
                <Card bordered={false}>
                    <ModuleIntroduce text={'APP小橙提示帮助'} />
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                                添加
                            </Button>
                        </div>
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
                            // onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                            onRightClick={this.onRightClick}
                            draggable
                            onDragStart={this.onDragStart}
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            >
                            {Object.keys(data).length > 0 
                                ? 
                                loop(data) 
                                :
                                <TreeNode title="default" key="0-0-0-1" onSelect={() => {}}/>
                            }
                        </Tree>
                        {
                            this.state.showMenu 
                            ? 
                            <ul className={styles.treeMenu} style={{left:this.state.clientX,top:this.state.clientY}} onMouseLeave={(e) => this.mouseUp(e)}>
                                <li onClick={(e) => this.handleModalVisible(true,'edit')}>修改</li>
                                <li onClick={(e) => this.treeDelete(e)}>删除</li>
                            </ul> 
                            : null
                        }
                    </div>
                </Card>
                <CreateForm {...this.state} {...parentMethods} ref="myform" {...data} {...this.props} secondDom={secondDom}/>
            </PageHeaderLayout>
        )
    }
}