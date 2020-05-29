import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Card,
    message,
    Form,
    Switch,
    Tabs,
    Button
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './discoveryCenter.less';
import ModuleIntroduce from '../../components/ModuleIntroduce';
const { TabPane } = Tabs;

@connect(({ discoverCenter, loading }) => ({
    discoverCenter,
    loading: loading.models.discoverCenter
}))
@Form.create()

export default class DiscoveryCenter extends PureComponent {
    state = {
        cardData: [],
        uploading: false,
        resetLoading: false,
        canSave: false,
        activeKey: 1
    }

    componentDidMount() {
        this.getCard(2);  //默认ios
    }

    componentWillUnmount() {
        localStorage.removeItem('initialData')
    }

    getCard = (sys) => {
        this.props.dispatch({
            type: 'discoveryCenter/findCard',
            payload: {
                system: sys
            },
            callback: res => {
                if(res) {
                    if(res.code === 0) {
                        this.setState({
                            cardData: res.data
                        });
                        localStorage.setItem('initialData',JSON.stringify(res.data));
                    }else {
                        message.error(res.message || '服务器错误');
                    }
                }
            }
        })
    }

    tabChange = e => {
        if(e == 1) this.getCard(2)
        if(e == 2) this.getCard(1)
        this.setState({ canSave: false, activeKey: e })   //切换时将按钮操作功能关闭
        this.refs.list.initialData();
    }

    toSave = () => {
        this.cardSave();   //改变组的排序
        this.iconSave();    //改变卡片排序 状态
    }

    iconSave = () => {
        this.setState({uploading: true})
        const { dispatch } = this.props;
        dispatch({
            type: 'discoveryCenter/updateIcon',
            payload: { discoverTabList: this.refs.list.getFinalData() },
            callback: res => {
                if(res) {
                    if(res.code === 0) {
                        message.success('修改成功');
                    }else {
                        message.error(res.message || '服务器错误')
                    }
                    this.setState({uploading: false})
                }
            }
        })
    }

    cardSave = () => {
        this.props.dispatch({
            type: 'discoveryCenter/updateCard',
            payload: { list: this.refs.list.getFinalGroupSort() },
            callback: res => {
                if(res) {
                    if(res.code === 0) {

                    }else {
                        message.error(res.message || '服务器错误')
                    }
                }
            }
        })
    }

    reset = () => {
        this.setState({ resetLoading: true })
        const { dispatch } = this.props;
        dispatch({
            type: 'discoveryCenter/updateIcon',
            payload: { discoverTabList: this.refs.list.initialData() },
            callback: res => {
                if(res) {
                    if(res.code === 0) {
                        this.setState({ cardData: JSON.parse(localStorage.getItem('initialData')) })
                        message.success('重置成功');
                    }else {
                        message.error(res.message || '服务器错误')
                    }
                    this.setState({resetLoading: false})
                }
            }
        })

        dispatch({
            type: 'discoveryCenter/updateCard',
            payload: { list: this.refs.list.initialGroupSort() },
            callback: res => {
                if(res) {
                    if(res.code === 0) {

                    }else {
                        message.error(res.message || '服务器错误')
                    }
                }
            }
        })

    }

    startEdit = () => {
        this.setState({ canSave: true })
    }

    render() {
        return(
            <PageHeaderLayout title='发现中心'>
                <Card bordered={false} >
                    <Tabs 
                        defaultActiveKey='1' 
                        tabBarGutter={10} 
                        // tabBarStyle={{marginBottom: 50}} 
                        type='card'
                        onChange={this.tabChange.bind(this)}
                    >
                        <TabPane tab='iOS' key='1'>
                           
                        </TabPane>
                        <TabPane tab='Android' key='2'>
                            
                        </TabPane>

                    </Tabs>
                    <ModuleIntroduce text={'对APP的发现模块进行拖拽排序，点击编辑进入操作状态'} />
                    <div className={styles.phoneWrap}>
                        <List 
                            ref='list'
                            data={this.state.cardData} 
                            canSave={this.state.canSave}
                            activeKey={this.state.activeKey}
                        />
                    </div>
                    <div style={{justifyContent:'center',display:'flex',marginTop: 50}} span={24}>
                        <Button type="primary" onClick={() => {this.startEdit()}} style={{marginRight:20}}>编辑</Button>
                        <Button type="primary" onClick={() => {this.toSave()}} style={{marginRight:20}} loading={this.state.uploading} disabled={!this.state.canSave}>保存</Button>
                        <Button onClick={() => {this.reset()}} loading={this.state.resetLoading} disabled={!this.state.canSave}>重置</Button>
                    </div>
                </Card>
                
            </PageHeaderLayout>
        )
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardListParams: [],
            cardArray: [{groupName: "提醒", groupSort: 1}, {groupName: "记录", groupSort: 2}, {groupName: "公共", groupSort: 3}]
        };
    } 
    //icon拖拽
    iconDragStart = (e) => {
        this.dragged = e.currentTarget;
    }

    iconDragEnd = (e) => {
        if(!this.props.canSave) return message.error('请先点击编辑按钮');
        const data = this.state.newData || this.props.data;   //第一次操作取this.props  后面取this.state
        if(this.over.tagName.toUpperCase() !== 'LI') return;  //如果目标对象不是Li 不能拖拽
        //获取数据
        const from = JSON.parse(this.dragged.dataset.item);
        const to = JSON.parse(this.over.dataset.item);
        // if(from.groupName !== to.groupName) return;      //如果不是一组 不能拖拽

        /**遍历排序开始 重新组成新的数据 ArrayList */
        data.length > 0 && data.map(item => {
            
                item.list.map(l => {   
                    if(from.groupName == to.groupName) {  //同一组数据 交换sort
                        if(l.id == from.id) {
                            l.sort = to.sort
                        }
                        if(l.id == to.id) {
                            l.sort = from.sort
                        }
                    }else{
                         //不同组交换名称
                        if(l.id == from.id) {
                            l.name = to.name;
                        }
                        if(l.id == to.id) {
                            l.name = from.name;
                        }
                    }
                })
                //根据sort重新排序
                item.list.sort((a, b) => (a.sort - b.sort))
        })

        /**遍历排序 */
        console.log(data)
        this.setState({ newData: data })
    }

    iconDrover = (e) => {
        e.preventDefault();
        this.over = e.target;
    }
    //卡片拖拽
    cardDragStart = (e) => {
        this.dragged = e.currentTarget;
    }

    cardDragEnd = (e) => {
        if(!this.props.canSave) return message.error('请先点击编辑按钮');
        const data = this.state.newData || this.props.data;   //第一次操作取this.props  后面取this.state
        if(this.over.tagName.toUpperCase() !== 'P') return
        //获取数据
        const fromCard = this.dragged.parentNode.childNodes[1].childNodes;   //获取当前LIST
        const fromCardSort = JSON.parse(fromCard[0].dataset.item).groupSort;    //获取当前card的groupSort
        const fromCardName = JSON.parse(fromCard[0].dataset.item).groupName;    //获取当前card的groupName

        const toCard = this.over.parentNode.childNodes[1].childNodes;   //获取目标LIST
        const toCardSort = JSON.parse(toCard[0].dataset.item).groupSort;     //获取目标card的groupSort
        const toCardName = JSON.parse(toCard[0].dataset.item).groupName;     //获取目标card的groupName

        let cardArray = [];
         /**遍历排序开始 重新组成新的数据 ArrayList */
        data.length > 0 && data.map(item => {
            let cardObj = {};
            if(item.groupName == fromCardName) {
                item.groupSort = toCardSort;
                item.list.map(l => {
                    l.groupSort = toCardSort;
                })
            }
            if(item.groupName == toCardName) {
                item.groupSort = fromCardSort;
                item.list.map(l => {
                    l.groupSort = fromCardSort;
                })
            }
            //记录card顺序  给后台
            cardObj.groupName = item.groupName;
            cardObj.groupSort = item.groupSort;
            cardArray.push(cardObj)
        })
        //Card排序  根据遍历的每个list里面的groupSort排序
        data.sort((a, b) => (a.groupSort - b.groupSort))
        /**遍历排序结束 */

        console.log('cardArray:'+cardArray)
        this.setState({ 
            cardArray,
            newData: data, 
        })
    }

    cardDrover = (e) => {
        e.preventDefault();
        this.over = e.target;
    }

    /**systemType等于1是android独有项  2是ios独有项 3是公共项 */

    switchChange = (row, checked) => {
        const data = this.state.newData || this.props.data;   //第一次操作取this.props  后面取this.state
        /**遍历排序开始 */
        data.length > 0 && data.map(item => {
            if(item.groupName == row.groupName) {  //判断属于哪一组数据
                item.list.map(l => {    
                    if(l.id == row.id) {
                        //ios
                        if(this.props.activeKey == '1') {
                            //关闭
                            if(!checked) {
                                //ios独有项
                                if(row.systemType == '2') {
                                    l.systemType = 0
                                }
                                //ios，android共有项
                                if(row.systemType == '3') {
                                    l.systemType = 1
                                }
                            }
                            //打开
                            if(checked) {
                                //ios独有项
                                if(row.systemType == '0') {
                                    l.systemType = 2
                                }
                                //ios，android共有项
                                if(row.systemType == '1') {
                                    l.systemType = 3
                                }
                            }
                        }

                        //android
                        if(this.props.activeKey == '2') {
                            //关闭
                            if(!checked) {
                                //android独有项
                                if(row.systemType == '1') {
                                    l.systemType = 0
                                }
                                //ios，android共有项
                                if(row.systemType == '3') {
                                    l.systemType = 2
                                }
                            }
                            //打开
                            if(checked) {
                                //android独有项
                                if(row.systemType == '0') {
                                    l.systemType = 1
                                }
                                //ios，android共有项
                                if(row.systemType == '2') {
                                    l.systemType = 3
                                }
                            }
                        }

                    }
                })
            }
        })
        /**遍历排序结束 */

        this.setState({ newData: data })
    }

    getFinalData = () => {
        const that = this;
        let finalData = [];
        that.state.newData.map(item => {
            finalData =  finalData.concat(item.list)
        })
        return finalData
    }

    getFinalGroupSort = () => {
        const that = this;
        return that.state.cardArray
    }

    //重置初始化数据
    initialData = () => {
        this.setState({ 
            newData: null,
        });
        let finalData = [];
        JSON.parse(localStorage.getItem('initialData')).map(item => {
            finalData =  finalData.concat(item.list);
        })
        return finalData
    }

    initialGroupSort = () => {
        return ([{groupName: "提醒", groupSort: 1}, {groupName: "记录", groupSort: 2}, {groupName: "公共", groupSort: 3}])
    }

    render() {
        const cardList = (this.state.newData ? this.state.newData : this.props.data).map((item, i) => {
            return (
                <div key={i} className={styles.wrap} >
                    <p 
                        className={styles.title}
                        draggable='true'
                        onDragStart={this.cardDragStart.bind(this)} 
                        onDragEnd={this.cardDragEnd.bind(this)}
                        onDragOver={this.cardDrover.bind(this)}
                    >
                        {item.groupName}
                    </p>
                    <ul className={styles.card} onDragOver={this.iconDrover.bind(this)}>
                        {item.list.map((card, j) => {
                            let checked = (this.props.activeKey == '1' && (card.systemType == '2' || card.systemType == '3' )) || (this.props.activeKey == '2' && (card.systemType == '1' || card.systemType == '3' ));
                            return(
                                <li 
                                    key={card.id} 
                                    data-item={JSON.stringify(card)}
                                    className={styles.function} 
                                    onDragStart={this.iconDragStart.bind(this)} 
                                    onDragEnd={this.iconDragEnd.bind(this)}
                                    draggable='true'
                                >
                                    {card.name}
                                    <Switch 
                                        key={card.id} 
                                        checkedChildren="开" 
                                        unCheckedChildren="关" 
                                        checked={checked}
                                        style={{position:'absolute',top:0,right:0}} 
                                        onChange={this.switchChange.bind(this,card)}
                                        size="small"
                                        disabled={!this.props.canSave}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        })
        return(
            <div style={{paddingTop: 20}}>
                {cardList}
            </div>
        )
    }
}