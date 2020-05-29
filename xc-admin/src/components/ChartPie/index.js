
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
import DataSet from "@antv/data-set";
import styles from './index.less';

export default class ChartPie extends PureComponent{

  render(){
    const { chartPie:{data,sum,title, top} } = this.props; 
    const { DataView } = DataSet;
    const { Html } = Guide;
    let offsetY = top || -110;
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = parseInt(val * 100) + "%";
          return val;
        }
      }
    };

    return (
          <div>
            <Chart
              height={520}
              data={dv}
              scale={cols}
              padding={['auto', 150, 'auto', 'auto']}
              // forceFit
            >
              <Coord type={"theta"} radius={0.75} innerRadius={0.8} />
              <Axis name="percent" />
              <Legend
                position="right"
                offsetY={offsetY}
                offsetX={0}
                useHtml={true}
                itemTpl={(value, color, checked, index) => {
                  const obj = dv.rows[index];
                  checked = checked ? "checked" : "unChecked";
                  let html = `<li class="g2-legend-list-item item-${index} ${checked}" data-color="${color}" data-value="${value}" style="cursor: pointer;font-size: 14px;padding:5px 0">
                    <i class="g2-legend-marker" style="width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:10px;background-color: ${color};"></i>
                    <span class="class="g2-legend-text">${value}</span>
                    <span style="display:inline-block;margin-left:5px;font-size:12px;color:#eae6e6">|</span>
                    <span style="display:inline-block;margin-left:15px;">${parseInt(obj.percent*100)+'%'}</span>
                    <span style="display:inline-block;margin-left:25px;">${obj.count}</span>
                    </li>`
                  return html;
                }}
              />
              <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
              />
              <Guide>
                <Html
                  position={["50%", "50%"]}
                  html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">${title}<br><span style="color:#262626;font-size:2em">${sum}</span></div>`}
                  alignX="middle"
                  alignY="middle"
                />
              </Guide>
              <Geom
                type="intervalStack"
                position="percent"
                color="item"
              >
              </Geom>
            </Chart>
          </div>
      )
  }
}
