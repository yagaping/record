import React from 'react';
import { connect } from 'dva';
import {
    Row, Col, Table, Switch, Button, message, Tabs, Card
} from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const { TabPane } = Tabs;
function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
  ) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
      return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
      return 'upward';
    }
}
  
let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moverow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: 'move' };
    
    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }
    
    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

let BodyRow1 = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moverow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: 'move' };
    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};
  
const rowSource = {
    beginDrag(props) {
        return {
        index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moverow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        sourceClientOffset: monitor.getSourceClientOffset(),
    }))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);

BodyRow1 = DropTarget('row', rowTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        sourceClientOffset: monitor.getSourceClientOffset(),
    }))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow1)
);


@connect(({ timeCard, loading }) => ({
    timeCard,
    loading: loading.models.timeCard,
}))
class DragSortingTable extends React.Component {
    state = {
        data: [],    
        data1: [],
        uploading: false,
        canSave: false
      }
    components = {
        body: {
            row: BodyRow,
        },
    }

    components1 = {
        body: {
            row: BodyRow1,
        },
    }

    moverow = (dragIndex, hoverIndex) => {
        if(!this.state.canSave) return message.error('请先点击编辑按钮');
        const { data } = this.state;
        const dragRow = data[dragIndex];
        const tartRow = data[hoverIndex];
        dragRow.sort = hoverIndex;
        tartRow.sort = dragIndex;
        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
        //更换位置后 给sort赋值  待优化
        let dataTransArr = [];
        let dataTrans = {};
        this.state.data && this.state.data.map((item,i) => {
            item.sort = i;
            dataTrans = item;
            dataTransArr.push(dataTrans);
        });
        this.setState({
            data: dataTransArr,
        });
    }

    moverow1 = (dragIndex, hoverIndex) => {
        if(!this.state.canSave) return message.error('请先点击编辑按钮');
        const { data1 } = this.state;
        const dragRow1 = data1[dragIndex];
        const tartRow1 = data1[hoverIndex];
        dragRow1.androidSort = hoverIndex;
        tartRow1.androidSort = dragIndex;
        this.setState(
            update(this.state, {
                data1: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow1]],
                },
            }),
        );
        //更换位置后   重新排序给androidSort赋值  待优化
        let data1TransArr = [];
        let data1Trans = {};
        this.state.data1 && this.state.data1.map((item,i) => {
            item.androidSort = i;
            data1Trans = item;
            data1TransArr.push(data1Trans);
        });
        this.setState({
            data1: data1TransArr,
        });
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeCard/queryCard',
            payload: {},
            callback: (res) => {
                if(res) {
                    if(res.code == '0'){
                        this.setState({
                            data: res.data.tabListIos,
                            data1: res.data.tabListAz,
                        });
                        //存储初始card位置
                        localStorage.setItem('data', JSON.stringify(res.data.tabListIos));  
                        localStorage.setItem('data1', JSON.stringify(res.data.tabListAz));
                    }else{
                        message.error(res.message || '服务器错误')
                    }
                }
            }
        });
    }

    switchChange = (index,checked) => {
        const { data } = this.state;
        const dragRow = data[index];
        dragRow.iosExisFlag = checked ? 1 : 0;
        this.setState(
            update(this.state, {
                data: {
                    $splice: [[index, 1, dragRow]],
                },
            }),
    );
    }

    switchChange1 = (index,checked) => {
        const { data1 } = this.state;
        const dragRow1 = data1[index];
        dragRow1.androidExisFlag = checked ? 1 : 0;
        this.setState(
            update(this.state, {
                data1: {
                    $splice: [[index, 1, dragRow1]],
                },
            }),
    );
    }

    toSave = (btn) => {
        this.setState({ uploading: true });
        const { dispatch } = this.props;
        const { data, data1 } = this.state;
        let newDataArray = [];
        let newData = {}; 
        //相同id  合并ios和android卡片对象 
        data.forEach((value, index, array) => {
            const itemValue = value;
            data1.forEach((value1, index1, array1) => {
                const itemValue1 = value1;
                if(itemValue.id == itemValue1.id){
                    newData = Object.assign(itemValue,itemValue1);
                    newDataArray.push(newData);
                    return newDataArray;
                }
            })
        });
        dispatch({
        type: 'timeCard/changeCard',
        payload: {
            cardList: newDataArray,
        },
        callback: (res) => {
            if(res) {
                if(res.code == '0'){
                    this.setState({ uploading: false });
                    message.success(btn != 'reset' ? '保存成功' : '重置成功');
                }else{
                    message.error(res.message || '服务器错误');  
                }
            }
        }
        });
    }

    reset() {
        this.setState({
            data: JSON.parse(localStorage.getItem('data')),
            data1: JSON.parse(localStorage.getItem('data1')),
        },() => {  this.toSave('reset') });
    }

    tabChange = () => {
        this.setState({ canSave: false })   //切换时将操作功能关闭
    }

    startEdit = () => {
        this.setState({ canSave: true })
    }

    render() {
        const { loading } = this.props;
        const columns = [{
            title: 'iOS 用户',
            dataIndex: 'name',
            key: 'name',
            render: (value, row, index) => 
            <div
                style={{ width: 300, position:'relative', alignItems:'center' }}
                key={index}
            >
                <div style={{display: 'flex',}}>
                    <img src={row.icon ? row.icon : require('../../assets/big_logo.png')}  style={{width: 32, height:32, marginRight: 16}}/>
                    <div style={{display: 'flex',flexDirection: 'column'}}>
                        <span style={{fontSize: 16,textOverflow: 'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 8}}>{row.name}</span>
                        <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>{row.introduce}</span>
                    </div>
                </div>
                <div style={{display:'none'}}>{row.id}{row.sort}</div>
                <Switch 
                    checkedChildren="开"
                    unCheckedChildren="关" 
                    checked={row.iosExisFlag == "1" ? true : false} 
                    style={{position:'absolute',top:0,right:0}} 
                    onChange={this.switchChange.bind(this,row.sort)}
                    disabled={!this.state.canSave}
                />
            </div>,
        }];
        const columns_android = [{
            title: 'Android 用户',
            dataIndex: 'name',
            key: 'name',
            render: (value, row, index) => 
            <div
                style={{ width: 300, position:'relative', alignItems:'center' }}
                key={index}
            >
                <div style={{display: 'flex',}}>
                    <img src={row.icon ? row.icon : require('../../assets/big_logo.png')}  style={{width: 32, height:32, marginRight: 16}}/>
                    <div style={{display: 'flex',flexDirection: 'column'}}>
                        <span style={{fontSize: 16,textOverflow: 'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 8}}>{row.name}</span>
                        <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>{row.introduce}</span>
                    </div>
                </div>
                <div style={{display:'none'}}>{row.id}{row.androidSort}</div>
                <Switch 
                    checkedChildren="开" 
                    unCheckedChildren="关" 
                    checked={row.androidExisFlag == "1" ? true : false} 
                    style={{position:'absolute',top:0,right:0}} 
                    onChange={this.switchChange1.bind(this,row.androidSort)}
                    disabled={!this.state.canSave}
                />
            </div>,
        }];
        return (
            <PageHeaderLayout title="时光卡片">
                <Card bordered={false}>
                    <ModuleIntroduce text={'APP时光卡片拖拽排序'} />
                    <Tabs 
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        tabBarStyle={{marginBottom: 50}} 
                        type="card"
                        onChange={this.tabChange.bind(this)}
                    >
                        <TabPane tab='iOS' key='1'>
                            <Table
                                columns={columns}
                                dataSource={this.state.data}
                                components={this.components}
                                pagination={false}
                                rowKey="id"
                                loading={ loading }
                                onRow={(record, index) => ({
                                    index,
                                    moverow: this.moverow,
                                })}
                                bordered
                            />
                        </TabPane>
                        <TabPane tab='Android' key='2'>
                            <Table
                                columns={columns_android}
                                dataSource={this.state.data1}
                                components={this.components1}
                                pagination={false}
                                onRow={(record, index) => ({
                                    index,
                                    moverow: this.moverow1,
                                })}
                                rowKey="id"
                                loading={ loading }
                                bordered
                            />
                        </TabPane>
                    </Tabs>
                <Row style={{marginTop:50}}>
                    <Col style={{justifyContent:'center',display:'flex'}} span={24}>
                        <Button type="primary" style={{marginRight:20}} onClick={() => this.startEdit()}>编辑</Button>
                        <Button type="primary" onClick={() => {this.toSave()}} style={{marginRight:20}} loading={this.state.uploading} disabled={!this.state.canSave}>保存</Button>
                        <Button onClick={() => {this.reset()}} disabled={!this.state.canSave}>重置</Button>
                    </Col>
                </Row>
                </Card>
            </PageHeaderLayout>
        );
    }
    }
    const Demo = DragDropContext(HTML5Backend)(DragSortingTable);
    export default Demo;
