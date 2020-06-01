import React, { Component, PureComponent } from 'react';
import styles from './index.less';
import icon from '../../assets/map_icon.png';
import moment from 'moment'
const styleOptions = {
    fillColor:"pink",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,       //边线透明度，取值范围0 - 1。
    fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
const color = ['#40aa24','#2891ff','#f54336','#ff9f3a','#cb6df0','#ff7290'];
const icon_size = 6;  //引入的地图icon为6个
export default class Map extends Component{
    componentDidMount(){
        this.renderMap()
    }
    //初始化地图的方法
    renderMap = () =>{
        window.map = new BMap.Map("container"); // 创建Map实例
        map.centerAndZoom('深圳', 13); // 初始化地图,设    置中心点坐标和地图级别
        map.setCurrentCity("深圳"); // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    }
    //获取所有的点
    getPoint = (pointArr, PositionRemindPage) => {
        // const newpointArr = this.translateBaiduCoordinate(pointArr);
        for (let i = 0; i < pointArr.length; i++) {
            const point = new BMap.Point(pointArr[i].longitude,pointArr[i].latitude);
            console.log('point.lng:'+point.lng + 'point.lat:' + point.lat)
            for(let j = 0; j < PositionRemindPage.length; j++) {
                //如果相等，则将点的图片颜色和提醒范围颜色保持一致
                if(pointArr[i].remindId == PositionRemindPage[j].id ) {
                    let pos = j % icon_size;     //memberId相等时，记录提醒范围的颜色位置 icon_size个一组，超过icon_size个循环   
                    const myIcon = new BMap.Icon(icon, new BMap.Size(18, 26), {
                        anchor: new BMap.Size(0, 26),
                        imageOffset: new BMap.Size(-18*pos,-22)   //图标所用的图片相对于可视区域的偏移值
                    })
                    const marker = new BMap.Marker(point, {icon:myIcon});
                    map.addOverlay(marker)
                }else {
                    map.addOverlay(new BMap.Marker(point));  //默认图标
                }
            }
        }
    }
    //获取所有的提醒范围
    getCircle = (PositionRemindPage) => {
        const remindType = ['到达','离开','到达或者离开'];
        for (let i = 0; i < PositionRemindPage.length; i++) {
            const point = new BMap.Point(PositionRemindPage[i].longitude,PositionRemindPage[i].latitude);
            const distance = PositionRemindPage[i].distance;
            styleOptions.strokeColor = color[i % icon_size];   //边线颜色。
            const polygon = new BMap.Circle(point,distance,styleOptions);
            const myIcon = new BMap.Icon(icon, new BMap.Size(10, 22), {
                anchor: new BMap.Size(0, 22),
                imageOffset: new BMap.Size(-10*(i % icon_size),0)   //icon_size个一组，超过icon_size个循环   
            })
            const marker = new BMap.Marker(point, {icon: myIcon});
            map.addOverlay(polygon);
            map.addOverlay(marker);   //显示中心点
            const opts = {
                width : 300,     // 信息窗口宽度
                height: 100,     // 信息窗口高度
                title : '<h3">'+PositionRemindPage[i].introduce+'<span style="font-size: 14px">('+remindType[PositionRemindPage[i].type]+')</span></h3>', // 信息窗口标题
                // enableMessage:true,//设置允许信息窗发送短息
                // message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
            }
            const content = `<div>
                <p>地址：${PositionRemindPage[i].position}</p>
                <p>创建时间：${moment(PositionRemindPage[i].createTime).format("YYYY-MM-DD HH:mm:ss")}</p>
            </div>`;
            const infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
            marker.addEventListener("click", function(){          
                map.openInfoWindow(infoWindow,point); //开启信息窗口
            });
        }
    }
    //转换其他坐标为百度坐标
    translateBaiduCoordinate = (pointPre) => {
        let coordinateArr = [], coordinateObj = {}, pointLater = null;
        for (let i = 0; i < 10; i++) {   //一次最多转换10个坐标
            coordinateObj = {lng: pointPre[i].longitude, lat: pointPre[i].latitude}
            coordinateArr.push(coordinateObj)
        }
        const convertor = new BMap.Convertor();
        console.log(coordinateArr)
        convertor.translate(coordinateArr, 1, 5, function (data) {
            console.log(data.points)
            if(data.status === 0) {
                pointLater = data.points
            }
        });
        return  pointLater
    }

    //清除覆盖物
    clear = () => {
        map.clearOverlays();        
    }

    shouldComponentUpdate(nextProps,nextState) {
        return nextProps.flag !== this.props.flag;
    }
    
    render(){
        const { PositionRecordPage, PositionRemindPage } = this.props;
        const pointArr = PositionRecordPage ? PositionRecordPage.records : [];
        if(pointArr.length > 0) this.getPoint(pointArr, PositionRemindPage)
        if(PositionRecordPage && PositionRemindPage.length > 0) this.getCircle(PositionRemindPage);
        return(
            <div>
                <div id="container" className={styles.myMap}></div>
            </div>
        )
    }
}