
import React, { PureComponent, Component } from 'react';
import { Table, Alert, Badge, Modal } from 'antd';
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
import styles from './index.less';

export default class ChartBar extends PureComponent{

  render(){
    const { data:{ barData }} = this.props;
    const cols = {
      sales: {
        tickInterval: 20,
      }
    };
    return (
          <div>
            <Chart height={400} data={barData} scale={cols} forceFit padding={'auto'}>
              <Axis name="x" 
              />
              <Axis name="y" />
              <Tooltip/>
              <Geom type="interval" position="x*y" 
                tooltip={['x*y', (x, y) => {
                  return {
                    name: '启动数',
                    title:x,
                    value: y
                  };
                }]}
              />
            </Chart>
          </div>
      )
  }
}
