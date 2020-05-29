
import React, { PureComponent,createClass} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Modal, Button, Dropdown, Menu, Divider, DatePicker, Spin, Radio } from 'antd';
import styles from './FormalContent.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts';
import DataSet from '@antv/data-set';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(state => ({
  formalContent: state.formalContent,
}))
class FormalContent extends PureComponent{
  state = {
    legendData: [],
    legendBlock: false,
    type:1, //1全部 2人工 3机器
  }
	componentDidMount() {
    this.contentType();
	}
  //查询分类统计数
  contentType = () => {
    this.props.dispatch({
      type:'formalContent/queryContentType',
      payload:{
        type:0,
      },
    });
  }
  // 数据Dom
  htmlData = () => {
    const { formalContent } = this.props;
    const {data:{formalData, people, machine,
      head, video, inter, ask, talk
    }} = formalContent;
    if(JSON.stringify(formalContent.data)=='{}'){
      return null;
    }
    return (
      <div className={styles.group}>
        <Row>
          <Col span={6} offset={-18}>
            <div className={styles.box}>
              <h3>正式内容</h3>
              <p>{formalData}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <div className={styles.box}>
              <h3>人工通过</h3>
              <p>{people}</p>
            </div>
          </Col>
          <Col span={6} offset={-12}>
            <div className={styles.box}>
              <h3>机器通过</h3>
              <p>{machine}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <div className={styles.box}>
              <h3>头条</h3>
              <p>{head.sum}</p>
              <div className={styles.p2}>人工 {head.people+'('+head.peoplePct+')'}<Divider type="vertical" />机器 {head.machine+'('+head.machinePct+')'}</div>
              
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.box}>
              <h3>视频</h3>
              <p>{video.sum}</p>
              <div className={styles.p2}>人工 {video.people+'('+video.peoplePct+')'}<Divider type="vertical" />机器 {video.machine+'('+video.machinePct+')'}</div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.box}>
              <h3>娱乐</h3>
              <p>{inter.sum}</p>
              <div className={styles.p2}>人工 {inter.people+'('+inter.peoplePct+')'}<Divider type="vertical" />机器 {inter.machine+'('+inter.machinePct+')'}</div>  
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.box}>
              <h3>问答</h3>
              <p>{ask.sum}</p>
              <div className={styles.p2}>人工 {ask.people+'('+ask.peoplePct+')'}<Divider type="vertical" />机器 {ask.machine+'('+ask.machinePct+')'}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={-18}>
            <div className={styles.box}>
              <h3>段子</h3>
              <p>{talk.sum}</p>
              <div className={styles.p2}>人工 {talk.people+'('+talk.peoplePct+')'}<Divider type="vertical" />机器 {talk.machine+'('+talk.machinePct+')'}</div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  // picDom
  picData = () => {
    const { Html } = Guide;
    const { DataView } = DataSet;
    const { data:{selectAll, selectPeople, selectMachine} } = this.props.formalContent;
    const { type } = this.state;
    if(!selectAll||!selectPeople||!selectMachine){
      return null;
    }
    const data = 
      type == 1  
      ? selectAll 
      : type == 2 ? selectPeople : selectMachine;
    let number = 0;
    let text = 
      type == 1
      ? '全部'
      : type == 2 ? '人工' : '机器';
      for(let i=0;i<data.length;i++){
        number+= data[i].count;
      }
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
      });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    } 
  const html = `<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">${text}<br><span style="color:#262626;font-size:2.5em">${number}</span></div>` ;
    return (
      <Chart height={500} data={dv} scale={cols} padding={[ 80, 100, 80, 80 ]} forceFit style={{width:'50%'}}>
        <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
        <Axis name="percent" />
        <Legend 
            useHtml={true}
            position='right'
            containerTpl='<div class="g2-legend"><table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;width:200px"></table></div>'
            itemTpl={
              (value, color, checked, index) => {
                const obj = dv.rows[index];
                checked = checked ? 'checked' : 'unChecked';
                return '<tr class="g2-legend-list-item item-' + index + ' ' + checked +
                  '" data-value="' + value + '" data-color=' + color +
                  ' >' +
                  '<td style="border: none;padding:0;"><i class="g2-legend-marker" style="background-color:' + color + ';"></i>' +
                  '<span class="g2-legend-text">' + value + '</span></td>' +
                  '<td style="text-align: right;border: none;padding:0;padding-left:10px;">' + obj.count + '</td>' +
                  '</tr>';
              }
            }
            offsetX={15}
            g2-legend={{
              marginLeft: '100px',
              marginTop: '-107px'
            }}
            g2-legend-list={{
              border: 'none'
            }}
          />
        <Tooltip 
          showTitle={false} 
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>' 
          />
        <Guide >
          <Html position ={[ '50%', '50%' ]} html={html} alignX='middle' alignY='middle'/>
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color='item'
          tooltip={['item*percent',(item, percent) => {
            percent = (percent * 100).toFixed(2) + '%';
            return {
              name: item,
              value: percent
            };
          }]}
          style={{lineWidth: 1,stroke: '#fff'}}
          >
          <Label content='percent' formatter={(val, item) => {
              return item.point.item + ': ' + val;}} />
        </Geom>
      </Chart>
    );
  }
  // 改变饼图数据
  onChange = (e) => {
    this.setState({
      type:e.target.value,
    });
  }
	render(){
		return (
			<PageHeaderLayout>
					<Card bordered={false}>
              {this.htmlData()}
              <div className={styles.pic}>
                <div className={styles.title}>
                  <p>内容占比</p>
                  <Divider />
                </div>
                <RadioGroup onChange={this.onChange} defaultValue="1">
                  <RadioButton value="1">全部内容</RadioButton>
                  <RadioButton value="2">人工内容</RadioButton>
                  <RadioButton value="3">机器内容</RadioButton>
                </RadioGroup>
                {this.picData()}
              </div>
					</Card>
				</PageHeaderLayout>
			);
		}
};
export default FormalContent;   
