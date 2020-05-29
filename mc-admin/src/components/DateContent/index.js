import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete, DatePicker } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

export default class  DateContent extends PureComponent {
  static defaultProps = {
    getOneMonthData: () => {},
    queryOneDay: () => {},
    dateData: {},
  };
  static propTypes = {
    queryOneDay: PropTypes.func,
    getOneMonthData: PropTypes.func,
    dateData: PropTypes.object,
  };
  state = {
    compareDate:moment().format('YYYY-MM')
  }
  startToEnd( date ){
    let startTime, endTime,
    year = date.year(),
    month = date.month()+1,
    monthSum = date.daysInMonth();
    month = month >= 10 ? month : '0' + month;
    startTime = year + '-' + month + '-01';
    endTime = year + '-' + month + '-' + monthSum;
    return { startTime, endTime }
  }
  // 日期面板改变
  panelChange = (date, type) => {
    if( type === 'date' ){
      let obj = this.startToEnd( date );
      this.props.getOneMonthData( obj.startTime, obj.endTime );
      this.setState({
        compareDate:moment(date).format('YYYY-MM')
      })
    }
  }
  // 选择日期
  dateChange = ( date, value ) => {
    const { compareDate } = this.state;
    if(moment(date).format('YYYY-MM') !== compareDate){
      let obj = this.startToEnd( date );
      this.props.getOneMonthData( obj.startTime, obj.endTime );
      this.setState({
        compareDate:moment(date).format('YYYY-MM')
      })
    }
    this.props.queryOneDay(value);
  }
  render() {
    const { dateData, type } = this.props;

    return (
      <div className={styles.dateCan}>
        <DatePicker
          popupStyle={{width:500}}
          open
          allowClear={false}
          getCalendarContainer={trigger => trigger.parentNode}
          onPanelChange={this.panelChange}
          onChange={this.dateChange}
          dateRender={ current => {
            let dom
            let date = current.date();
            let date2 = moment(current).format('YYYY-MM-DD');
            if( type === 'beauty'){
              
              let rd = dateData[date2] ? dateData[date2].rundu ? <em>{ dateData[date2].rundu }</em> : '-' : '-';
              let gx = dateData[date2] ? dateData[date2].guoxue ? <em>{dateData[date2].guoxue}</em> : '-' : '-';
              let dz = dateData[date2] ? dateData[date2].duanzi ? <em>{dateData[date2].duanzi}</em> : '-' : '-';
              dom = (<p className={styles.typeName}>
                      润读 {rd}<br/>
                      国学 {gx}<br/>
                      段子 {dz}
                    </p>)
            }else if( type === 'recommend' ){
              if( dateData.recommendNumList ){
                let num = dateData.recommendNumList[date2] ? <em>{dateData.recommendNumList[date2]}</em> : '-';
                dom = (
                  <p className={styles.typeName}>
                    推荐 {num}
                  </p>
                )
              }
              
            } 
            
            return (
              <div className="ant-calendar-date" style={{fontSize:20}}>
                <div>{date}</div>
                { dom }
              </div>
            );
          }}
        />
      </div>
    );
  }
}
