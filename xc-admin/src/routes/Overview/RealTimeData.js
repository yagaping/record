import React, { PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Divider, DatePicker,Icon, Form, Select, Spin } from 'antd';
import moment from 'moment';

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

import styles from '../PhotoManage.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker  } = DatePicker;
const FORMAT = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  addUser: state.addUser,
}))
export default class RealTimeData extends PureComponent{
  state = {
    list:{},
    platform:0,
  }
  componentDidMount(){
    this.queryRealData();
  }
  queryRealData = () => {
    const { dispatch } = this.props;
    const { platform } = this.state;
    const _this = this;
    dispatch({
      type:'addUser/queryRealData',
      payload:{
        mobilePlatform:platform,
      },
      callback:(res)=>{
        if((res.code == 0 || res.code == 1)&&res.result){
            const { result } = res;
            _this.setState({list:result})
        }
      }
    })
  }
  // 选择平台
  handleValue = (val) => {
    this.setState({platform:val},()=>{
      this.queryRealData();
    })
  }
  render(){
    const {addUser:{loading} } = this.props;
    const { list, platform } = this.state;
    return (
      <PageHeaderLayout>
          <div className={styles.realWarp}>
            <div className={styles.realpt}>
              <span>平台：</span>
              <Select style={{width:110}} value={platform} onChange={this.handleValue}>
                <Option value={0}>全部</Option>
                <Option value={2}>iOS</Option>
                <Option value={1}>Android</Option>
              </Select>
            </div>
            <Spin spinning={loading}>
              <Row gutter={24}>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>新增用户</h4>
                    <h3>{list.userNew == 0 ? 0 : list.userNew ||'--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userNew-list.yesterdayUserNew>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                        </span>
                      <span>{list.yesterdayUserNew == 0 ? '100' : parseInt(Math.abs(list.userNew-list.yesterdayUserNew)/list.yesterdayUserNew*100) || '--'}%</span>
                      </p>
                    <Divider />
                    <div>累计用户 {list.userTotal||'--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>活跃用户</h4>
                    <h3>{list.userAct == 0 ? 0 : list.userAct||'--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userAct-list.yesterdayUserAct>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      {list.yesterdayUserAct == 0 ? '100' : parseInt(Math.abs(list.userAct-list.yesterdayUserAct)/list.yesterdayUserAct*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserAct||'--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>新增付费</h4>
                    <h3>{list.userPay == 0 ? 0 : list.userPay||'--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userPay-list.yesterdayUserPay>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      { list.yesterdayUserPay == 0 ? '100' : parseInt(Math.abs(list.userPay-list.yesterdayUserPay)/list.yesterdayUserPay*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserPay||'--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>付费金额￥</h4>
                    <h3>{list.userTotalPay == 0 ? 0 : list.userTotalPay||'--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userTotalPay-list.yesterdayUserTotalPay>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      {list.yesterdayUserTotalPay == 0 ? '100' : parseInt(Math.abs(list.userTotalPay-list.yesterdayUserTotalPay)/list.yesterdayUserTotalPay*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserTotalPay || '--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>新增照片</h4>
                    <h3>{list.userPhoto == 0 ? 0 : list.userPhoto ||'--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userPhoto-list.yesterdayUserPhoto>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      {list.yesterdayUserPhoto == 0 ? '100' : parseInt(Math.abs(list.userPhoto-list.yesterdayUserPhoto)/list.yesterdayUserPhoto*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserPhoto || '--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>新增视频</h4>
                    <h3>{list.userVidoe == 0 ? 0 : list.userVidoe || '--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userVidoe-list.yesterdayUserVideo>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      {list.yesterdayUserVideo == 0 ? '100' : parseInt(Math.abs(list.userVidoe-list.yesterdayUserVideo)/list.yesterdayUserVideo*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserVideo || '--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>启动次数</h4>
                    <h3>{list.userStart == 0 ? 0 : list.userStart || '--'}</h3>
                    <p>
                      <span>昨日此时</span>
                      <span className={styles.upOrDown}>
                        {list.userStart-list.yesterdayUserStart>0?<Icon type="caret-up" />:<Icon type="caret-down" />}
                      </span>
                      <span>
                      { list.yesterdayUserStart == 0 ? '100' : parseInt(Math.abs(list.userStart-list.yesterdayUserStart)/list.yesterdayUserStart*100) || '--'}%
                      </span>
                    </p>
                    <Divider />
                    <div>平均此时 {list.weekUserStart || '--'}</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.realCan}>
                    <h4>存储用量</h4>
                    <h3>{ list.userSpaceSize == 0 ? 0 : Math.floor(list.userSpaceSize/1024/1024/1024*100)/100 || '--'}GB</h3>
                  </div>
                </Col>
              </Row>
            </Spin>
          </div>
			</PageHeaderLayout>
    )
  }
}
