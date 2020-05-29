import React, { PureComponent,createClass} from 'react';
import { connect } from 'dva';
import { Card, DatePicker, Spin, Button } from 'antd';
import styles from './NewsAudit.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';

const { RangePicker } = DatePicker; 

@connect(state => ({
  newsAudit: state.newsAudit,
}))
class NewsAudit extends PureComponent{
	state = {
		startDate:null,
		endDate:null,
	};
	componentWillMount(){
		let today = moment().format('YYYY-MM-DD');
		let lart30 = moment().subtract('days', 29).format('YYYY-MM-DD');
		this.setState({
			startDate:lart30,
			endDate:today,
		});
	}
	componentDidMount() {
		const { dispatch } = this.props;
		const {startDate,endDate} = this.state;
		dispatch({
			type: 'newsAudit/query',
			payload: {
			},
		});
		dispatch({
			type: 'newsAudit/byDate',
			payload: {
				beginDay:startDate,
				endDay:endDate,
			},
		})
	}
	// 获取各时间段数据
	doData = (data,t) => {
		if(!data){
				return;
		}
		for(let i=0; i<data.length;i++){
				if(data[i].newsGroup == t){
						return data[i].count;
				}
		}
	}
	// 通过日期筛选数据
	onChange = (e) => {
		let startDate = moment(e[0]).format('YYYY-MM-DD');
		let endDate = moment(e[1]).format('YYYY-MM-DD');
		this.setState({
				startDate,
				endDate,
		});
	}
	// 点击查询
	byDate = () => {
		const { dispatch } = this.props;
		const {startDate, endDate} = this.state;
		const _this = this;
		dispatch({
			type: 'newsAudit/byDate',
			payload: {
				beginDay:startDate,
				endDay:endDate,
			},
			callback:(res) => {
				if(res.code == 0){
					_this.setState({
						startDate,
						endDate,
					});
				}
			}
		})
	}
	// 转换年月日
	forMoment = (time) =>{
		let dataFormat;
		let date
		dataFormat = 'YYYY年MM月DD日';
		date = moment(moment(time)).format(dataFormat);
		return date;
	}
	render(){
		const { list, queryList, loading } = this.props.newsAudit;
		const { successData, errorData} = list;
		const querySucc = queryList.successData;
		const queryError = queryList.errorData;
		const { startDate, endDate } = this.state;
		const dateFormat = 'YYYY年MM月DD日';
		return (
			<PageHeaderLayout>
					<Card bordered={false}>
						{/* <Spin spinning={false}></Spin> */}
							<div className={styles.newsAudit}>
								{/* {this.ddHtml()} */}
								<Spin spinning={loading}>
								<dl>
									<dt>内容管理</dt>
									<dd>
										<RangePicker onChange={this.onChange}  defaultValue={[moment(startDate, dateFormat),moment(endDate, dateFormat)]} format={dateFormat}/>
										<Button type="primary" onClick={this.byDate}>查询</Button>
									</dd>
									<dd>
										<em>本日审核：</em>
										<span>{this.forMoment(successData.curDay)}</span>
										<span>头条：（通过：{this.doData(successData.curDayList,0)}，不通过：{this.doData(errorData.curDayList,0)}）</span>
										<span>娱乐：（通过：{this.doData(successData.curDayList,1)}，不通过：{this.doData(errorData.curDayList,1)}）</span>
										{/* <span>段子：{this.doData(todayDay,4)}</span>
										<span>问答：{this.doData(todayDay,5)}</span> */}
										<span>视频：（通过：{this.doData(successData.curDayList,20)}，不通过：{this.doData(errorData.curDayList,20)}）</span>
										<span>体育：（通过：{this.doData(successData.curDayList,8)}，不通过：{this.doData(errorData.curDayList,8)}）</span>
										<span>科技：（通过：{this.doData(successData.curDayList,7)}，不通过：{this.doData(errorData.curDayList,7)}）</span>
									</dd>
									<dd>
										<em>本周审核：</em>
										<span>{this.forMoment(successData.weekDay) +' - '+ this.forMoment(new Date())}</span>
										<span>头条：（通过：{this.doData(successData.weekDayList,0)}，不通过：{this.doData(errorData.weekDayList,0)}）</span>
										<span>娱乐：（通过：{this.doData(successData.weekDayList,1)}，不通过：{this.doData(errorData.weekDayList,1)}）</span>
										{/* <span>段子：{this.doData(thisWeek,4)}</span>
										<span>问答：{this.doData(thisWeek,5)}</span> */}
										<span>视频：（通过：{this.doData(successData.weekDayList,20)}，不通过：{this.doData(errorData.weekDayList,20)}）</span>
										<span>体育：（通过：{this.doData(successData.weekDayList,8)}，不通过：{this.doData(errorData.weekDayList,8)}）</span>
										<span>科技：（通过：{this.doData(successData.weekDayList,7)}，不通过：{this.doData(errorData.weekDayList,7)}）</span>
									</dd>
									<dd>
										<em>本月审核：</em>
										<span>{ this.forMoment(successData.monthFirstDay)+' - '+ this.forMoment(new Date())}</span>
										<span>头条：（通过：{this.doData(successData.monthDayList,0)}，不通过：{this.doData(errorData.monthDayList,0)}）</span>
									<span>娱乐：（通过：{this.doData(successData.monthDayList,1)}，不通过：{this.doData(errorData.monthDayList,1)}）</span>
										{/* <span>段子：{this.doData(thisMonth,4)}</span>
										<span>问答：{this.doData(thisMonth,5)}</span> */}
										<span>视频：（通过：{this.doData(successData.monthDayList,20)}，不通过：{this.doData(errorData.monthDayList,20)}）</span>
										<span>体育：（通过：{this.doData(successData.monthDayList,8)}，不通过：{this.doData(errorData.monthDayList,8)}）</span>
										<span>科技：（通过：{this.doData(successData.monthDayList,7)}，不通过：{this.doData(errorData.monthDayList,7)}）</span>
									</dd>
									<dd>
										<em>上月审核：</em>
										<span>{this.forMoment(successData.beforeMonthFirstDay) + ' - '+this.forMoment(successData.beforeMonthEndDay)}</span>
										<span>头条：（通过：{this.doData(successData.beforeMonthDayList,0)}，不通过：{this.doData(errorData.beforeMonthDayList,0)}）</span>
										<span>娱乐：（通过：{this.doData(successData.beforeMonthDayList,1)}，不通过：{this.doData(errorData.beforeMonthDayList,1)}）</span>
										{/* <span>段子：{this.doData(beforeMonth,4)}</span>
										<span>问答：{this.doData(beforeMonth,5)}</span> */}
										<span>视频：（通过：{this.doData(successData.beforeMonthDayList,20)}，不通过：{this.doData(errorData.beforeMonthDayList,20)}）</span>
										<span>体育：（通过：{this.doData(successData.beforeMonthDayList,8)}，不通过：{this.doData(errorData.beforeMonthDayList,8)}）</span>
										<span>科技：（通过：{this.doData(successData.beforeMonthDayList,7)}，不通过：{this.doData(errorData.beforeMonthDayList,7)}）</span>
									</dd>
									<dd>
										<em>筛选日期：</em>
										<span>{this.forMoment(startDate) +' - '+ this.forMoment(endDate)}</span>
									<span>头条：（通过：{this.doData(querySucc.customList,0)}，不通过：{this.doData(queryError.customList,0)}）</span>
										<span>娱乐：（通过：{this.doData(querySucc.customList,1)}，不通过：{this.doData(queryError.customList,1)}）</span> 
									 	<span>视频：（通过：{this.doData(querySucc.customList,20)}，不通过：{this.doData(queryError.customList,20)}）</span>
										<span>体育：（通过：{this.doData(querySucc.customList,8)}，不通过：{this.doData(queryError.customList,8)}）</span>
										<span>科技：（通过：{this.doData(querySucc.customList,7)}，不通过：{this.doData(queryError.customList,7)}）</span>
									</dd>
								</dl>
								</Spin>
							</div>
					</Card>
				</PageHeaderLayout>
			);
		}
};
export default NewsAudit;   
