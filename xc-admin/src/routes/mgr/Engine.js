import React, { PureComponent,createClass} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Switch, DatePicker,Card } from 'antd';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts';
import DataSet from '@antv/data-set';
import moment from 'moment';
import u39 from './u39.png';
import styles from './Engine.less';

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
@connect(state => ({
  contentMgr: state.contentMgr,
}))
export default class Engine extends PureComponent{

  state = {
    beginDay:null,
    endDay:null,
  };

  componentDidMount(){
     this.querySwitch();
     this.typeNumber();
     this.chartData();
     }

   // 计算多少天前的日期
    historyDate(day){
      var date1 = new Date(),
      time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
      var date2 = new Date(date1);
      date2.setDate(date1.getDate()+day);
      var month = (date2.getMonth()+1) > 9 ?(date2.getMonth()+1):'0'+(date2.getMonth()+1);
      var day = date2.getDate() > 9 ? date2.getDate() :'0' + date2.getDate();
      var time2 = date2.getFullYear()+"-"+month+"-"+day;
      return time2;
    }

  // 查询机器审核数、其他分类统计数 
  querySwitch = () => {
    this.props.dispatch({
      type:'contentMgr/queryCountInfo',
      payload:{},
    });
  }

  // 分类统计数
  typeNumber = () => {
    this.props.dispatch({
      type:'contentMgr/querytypeNumber',
    });
  }

  //图表数据
  chartData = (type) => {
    let dateType = 0;
    if(type){
      dateType = type || this.props.contentMgr.dateType;
    }
    let day = 0;
    switch(dateType){
      case 0:
        day = 0;
        break;
      case 1:
        day = -7;
        break;
      case 2:
        day = -30;
        break;
      case 3:
        day = -365;
        break;
    }
    let beginDay = this.historyDate(day);
    let endDay = this.historyDate(0);
    this.setState({
      beginDay,
      endDay,
    });
    this.props.dispatch({
      type:'contentMgr/queryChartData',
      payload:{
        dateType,
        beginDay,
        endDay,
      }
    });
  }
  
  handleSelectDate = (date) => {
    this.chartData(date);
  }

  // 开关
  onChange = (type,checked) => {
    switch(type){
      case 0:
        let allSwitch = checked ? 0 : 1;
        this.props.dispatch({
            type:'contentMgr/updateByAllSwitch',
            payload:{
              allSwitch,
            }
        });
        break;
      case 1:
          let sensitiveSwitch = checked ? 0 : 1;
          this.props.dispatch({
            type:'contentMgr/updateBySensitiveSwitch',
            payload:{
              sensitiveSwitch,
            }
          });
        break;
      case 2:
        let keywordSwitch = checked ? 0 : 1;
        this.props.dispatch({
          type:'contentMgr/updateByKeywordSwitch',
          payload:{
            keywordSwitch,
          }
        });
        break;
      case 3:
        let wrongSwitch = checked ? 0 : 1;
        this.props.dispatch({
          type:'contentMgr/updateByWrongSwitch',
          payload:{
            wrongSwitch,
          }
        });
        break;
    }
  }

  //选择日期
  handleChange = (date, dateString) => {
    this.setState({
      dateType:4,
      beginDay:dateString[0],
      endDay:dateString[1],
    });
    const dateType = 4;
    const beginDay = dateString[0];
    const endDay = dateString[1];
    this.props.dispatch({
      type:'contentMgr/queryChartData',
      payload:{
        dateType,
        beginDay,
        endDay,
      }
    });
  } 

  renderDateNodes = () => {
    const { dateType } = this.props.contentMgr;
    const dateConfig = [
      {
        value: 0,
        text: '日',
      }, {
        value: 1,
        text: '周',
      }, {
        value: 2,
        text: '月',
      }, {
        value: 3,
        text: '全年',
      }
    ];
    
    return dateConfig.map(item => {
      return (
        <a 
          key={item.value}
          className={item.value === dateType ? styles.sel : ''}
          href="javascript:void(0)" 
          onClick={this.handleSelectDate.bind(this, item.value)}
        >
          {item.text}
        </a>
      )
    });
  }

  render(){
    const { allSwitch, sensitiveSwitch, keywordSwitch, wrongSwitch, data,
      typeNum:{ successCount, 
        allHub, 
        imgVideo,
        keywordSuccessCount, 
        wrongSuccessCount },
      fields } = this.props.contentMgr;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    
    dv.transform({
        type: 'fold',
        fields: fields,
        key:'时间',
        value:'审核数',
    });
   
    const RenderDateNodes = this.renderDateNodes();
    const { beginDay, endDay } = this.state;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.engine}>
            <Row>
              <Col span={6} offset={-18}>
                <div className={styles.robot + ' ' + styles.box}>
                  <div className={styles.robotInfo}>
                    <img src={u39} />
                    <div className={styles.sum}>
                      <h3>机器通过</h3>
                      <p>{successCount||'--'}</p>
                    </div>
                  </div>
                  
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className={styles.robot + ' ' + styles.box}>
                  <div className={styles.count}>
                    <h3>完整性嗅探</h3>
                    <p>{allHub||'--'}</p>
                  </div>
                  <div className={styles.switch}>
                    <Switch checked={allSwitch} onChange={this.onChange.bind(this,0)} checkedChildren='开' unCheckedChildren='关'/>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.robot + ' ' + styles.box}>
                  <div className={styles.count}>
                    <h3>图片/视频</h3>
                    <p>{imgVideo||'--'}</p>
                  </div>
                  <div className={styles.switch}>
                    <Switch checked={sensitiveSwitch} onChange={this.onChange.bind(this,1)} checkedChildren='开' unCheckedChildren='关'/>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.robot + ' ' + styles.box}>
                  <div className={styles.count}>
                    <h3>关键词过滤</h3>
                    <p>{keywordSuccessCount||'--'}</p>
                  </div>
                  <div className={styles.switch}>
                    <Switch checked={keywordSwitch} onChange={this.onChange.bind(this,2)} checkedChildren='开' unCheckedChildren='关'/>
                  </div>
                  <Link to={{pathname:'/mgr/mgr-filter'}} className={styles.set}>设置</Link>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.robot + ' ' + styles.box} style={{marginRight:0}}>
                  <div className={styles.count}>
                    <h3>文字纠错</h3>
                    <p>{wrongSuccessCount||'--'}</p>
                  </div>
                  <div className={styles.switch}>
                    <Switch checked={wrongSwitch} onChange={this.onChange.bind(this,3)} checkedChildren='开' unCheckedChildren='关'/>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.chart}>
            <div className={styles.chartTitle}>
              <div className={styles.name}>机器审核报表</div>
              <div className={styles.selDate}>
                {RenderDateNodes}
                <RangePicker
                  onChange={this.handleChange}
                  value={beginDay&&[moment(beginDay, dateFormat), endDay&&moment(endDay, dateFormat)]}
                  format={dateFormat}
                />
              </div>
            </div>
            <Chart height={400} data={dv} forceFit>
              <Legend />
              <Axis name="时间" />
              <Axis name="审核数" />
              <Tooltip inPlot={true} crosshairs={false} position={'bottom'} />
              <Geom type='intervalStack' position="时间*审核数" color={'name'} style={{stroke: '#fff',lineWidth: 1}}/>
            </Chart>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
