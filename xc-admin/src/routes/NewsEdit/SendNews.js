import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Spin, Tabs, Popconfirm  } from 'antd';
import styles from './SendNews.less';
import SendNewsPage from '../../components/SendNewsPage';
import SendImgsPage from '../../components/SendImgsPage';


const FormItem = Form.Item;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
@Form.create()
@connect(state => ({
  sendNews: state.sendNews,
}))
export default class SendNews extends PureComponent{
  
  state = {
    tabKey:'1',
  } 
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'sendNews/resetNews',
    });
    dispatch({
      type:'sendNews/resetWriteNews',
    });
    if(localStorage.getItem('someNews') && localStorage.getItem('someNews') != 'undefined'){
      let someNews = JSON.parse(localStorage.getItem('someNews'));
      let tabKey;
      let disabled;
      if(someNews.contentType == 0){
        tabKey = '1';
        disabled = 2;
      }else if(someNews.contentType == 1){
        tabKey = '2';
        disabled = 1;
      }
      dispatch({
        type:'sendNews/initialize',
        payload:{
          ...someNews,
        },
      });
      this.setState({
        tabKey,
        disabled,
      });
      
    }
   
  }
  componentWillUnmount(){
    localStorage.removeItem('someNews');
    localStorage.removeItem('searchData');
  }
  // 切换table菜单
  handleTab = (e) => {
    
    this.setState({tabKey:e});
  }
  //编辑文本框新闻
  changeText = (text) =>{
    const { dispatch } = this.props;
 
    dispatch({
      type:'sendNews/changeText',
      payload:{
        text,
      },
    });
  } 
  // 更新显示预览
  updateView = (textObj) => {
    const { dispatch } = this.props;
    dispatch({
      type:'sendNews/updateView',
      payload:{
        ...textObj
      },
    });
  }
  // 重置新闻数据
  resetNews = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'sendNews/resetNews',
    });
  }
  resetWriteNews = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'sendNews/resetWriteNews',
    });
  }
  // 更新预览发布图集
  updateViewImage = (textObj) => {
    const { dispatch } = this.props;
    dispatch({
      type:'sendNews/updateViewImage',
      payload:{
        ...textObj
      },
  })
}
  render(){
    const { dispatch, sendNews ,history } = this.props;
    const {  title, editData, phoneSimulator, phoneSimulatorImg, viewNewsData, viewImageData } = sendNews;
    const { tabKey, disabled } = this.state;
    let bool = disabled ? disabled : false;
    return (
      <PageHeaderLayout>
          <div className={styles.sendNews}>
            <Tabs activeKey={tabKey} animated={false} onChange={this.handleTab}>
              <TabPane tab="发布新闻" key={'1'} disabled={bool&&bool==1?true:false}>
                <SendNewsPage 
                  editData={editData}
                  dispatch={dispatch}
                  title={title}
                  viewNewsData={viewNewsData}
                  resetNews={this.resetNews}
                  changeText={this.changeText}
                  updateView={this.updateView}
                  phoneSimulator={phoneSimulator}
                  history={history}
                />
              </TabPane>
              <TabPane tab="发布图集" key={'2'} disabled={bool&&bool==2?true:false}>
                <SendImgsPage 
                  dispatch={dispatch}
                  phoneSimulator={phoneSimulatorImg}
                  viewImageData={viewImageData}
                  resetWriteNews={this.resetWriteNews}
                  updateViewImage={this.updateViewImage}
                  history={history}
                />
              </TabPane>
            </Tabs>
          </div>
			</PageHeaderLayout>
    )
  }
}
