import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
export default class Line extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 20, 60, 40],
      titleMap,
      borderWidth = 2,
      data,
      xAxis,
    } = this.props;

    const fields = [];
    for(let i in titleMap) {
        fields.push(titleMap[i])
    }

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          for(let key in newRow) {
            newRow[titleMap[key]] = newRow[key];
          }
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: fields, // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const cols = {
        // dayInt: {
            range: [ 0, 0.99 ],
        // }
    }

    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name={xAxis} />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom type="line" position={`${xAxis}*value`} size={borderWidth} color="key" />
            <Geom type='point' position={`${xAxis}*value`} size={4} shape={'circle'} color={'key'} style={{ stroke: '#fff', lineWidth: 1}} />
          </Chart>
        </div>
      </div>
    );
  }
}
