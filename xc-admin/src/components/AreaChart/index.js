
import React, { PureComponent, Component } from 'react';
import { Table, Alert, Badge, Modal } from 'antd';
import { Link } from 'dva/router';
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
import styles from './index.less';

export default class AreaChart extends PureComponent{
  componentDidMount(){

  }
  
  render(){
    const { data:{areaData,title} } = this.props;
    let dv = new DataSet.View().source(areaData);
    dv.transform({
      type: "fold",
      fields: [ "startCount"],
      key: "type",
      value: "value"
    });
    let scale = {
      value: {
        formatter: function(val) {
          return val;
        },
        range:[0,1]
      },
    };
    return (
          <div>
            <Chart
              height={300}
              data={dv}
              padding={"auto"}
              scale={scale}
              forceFit
            >
              <Tooltip />
              <Axis/>
              <Geom type="area" position="dateTime*value" color="type" shape="smooth"  size={1}
              tooltip={['dateTime*value', (dateTime, value)=>{
                return {
                  name:title,
                  value:value||'--',
                }
              }]}/>
            </Chart>
          </div>
      )
  }
}
