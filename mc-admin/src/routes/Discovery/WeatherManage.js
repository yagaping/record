import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Icon, Row, Col, Button, Upload, message, Tabs, Card
} from 'antd';
import WeatherAlarm from './WeatherAlarm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModuleIntroduce from '../../components/ModuleIntroduce';
import styles from './Card.less';
const TabPane = Tabs.TabPane;
const weatherType = ["晴天","阴天","多云","雾霾","风","雨","暴雨","雷阵雨","小雪","大雪","雨夹雪","小雨","中雨"];
const sizeArray = ["ios_1","android_1","ios_3","android_2","ios_2"];
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
@connect(({ weatherManage, loading }) => ({
  weatherManage,
  loading: loading.models.weatherManage,
}))
export default class WeatherList extends PureComponent {
  state = {
      index: '0',
      typeName: '暴雨',
      id: '1',
      dateState: 'datetime',
      fileList_ios1: [],
      fileList_ios2: [],
      fileList_ios3: [],
      fileList_android1: [],
      fileList_android2: [],
      fileListNight_ios1: [],
      fileListNight_ios2: [],
      fileListNight_ios3: [],
      fileListNight_android1: [],
      fileListNight_android2: [],
      modal_ios1: {key: 'ios_1', img: ''},
      modal_ios2: {key: 'ios_2', img: ''},
      modal_ios3: {key: 'ios_3', img: ''},
      modal_android1: {key: 'android_1', img: ''},
      modal_android2: {key: 'android_2', img: ''},
      modalNight_ios1: {key: 'ios_1', img: ''},
      modalNight_ios2: {key: 'ios_2', img: ''},
      modalNight_ios3: {key: 'ios_3', img: ''},
      modalNight_android1: {key: 'android_1', img: ''},
      modalNight_android2: {key: 'android_2', img: ''},
      uploading: false,
      mode: 'top',
      weatherList: [],
      tabs1Content: true,
      activeKey: '1',
  }

  fetchImg = (state,typeName) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'weatherManage/queryWeather',
      payload: {
        typeName: typeName,
        state: state,
        sizeArray: sizeArray,
      },
      callback: (res) => {
          if(res && res.code == '0'){
                const urlArray = res.data.urlArray;
                const fileList_ios1 = [];
                const fileList_ios2 = [];
                const fileList_ios3 = [];
                const fileList_android1 = [];
                const fileList_android2 = [];
                const fileListNight_ios1 = [];
                const fileListNight_ios2 = [];
                const fileListNight_ios3 = [];
                const fileListNight_android1 = [];
                const fileListNight_android2 = [];
                urlArray.length > 0 && urlArray.forEach((value,index,array) => {
                    if(value.indexOf('datetime/ios_1') >= 0) {
                        let obj = {};
                        obj.uid = -1*Math.random();
                        obj.url = value;
                        fileList_ios1.push(obj);
                    }
                    if(value.indexOf('datetime/ios_2') >= 0) {
                        let obj4 = {};
                        obj4.uid = -1*Math.random();
                        obj4.url = value;
                        fileList_ios2.push(obj4);
                    }
                    if(value.indexOf('datetime/ios_3') >= 0) {
                        let obj2 = {};
                        obj2.uid = -1*Math.random();
                        obj2.url = value;
                        fileList_ios3.push(obj2);
                    }
                    if(value.indexOf('datetime/android_1') >= 0) {
                        let obj1 = {};
                        obj1.uid = -1*Math.random();
                        obj1.url = value;
                        fileList_android1.push(obj1);
                    }
                    if(value.indexOf('datetime/android_2') >= 0) {
                        let obj3 = {};
                        obj3.uid = -1*Math.random();
                        obj3.url = value;
                        fileList_android2.push(obj3);
                    }
                    if(value.indexOf('night/ios_1') >= 0) {
                        let objNight = {};
                        objNight.uid = -1*Math.random();
                        objNight.url = value;
                        fileListNight_ios1.push(objNight);
                    }
                    if(value.indexOf('night/ios_2') >= 0) {
                        let objNight4 = {};
                        objNight4.uid = -1*Math.random();
                        objNight4.url = value;
                        fileListNight_ios2.push(objNight4);
                    }
                    if(value.indexOf('night/ios_3') >= 0) {
                        let objNight2 = {};
                        objNight2.uid = -1*Math.random();
                        objNight2.url = value;
                        fileListNight_ios3.push(objNight2);
                    }
                    if(value.indexOf('night/android_1') >= 0) {
                        let objNight1 = {};
                        objNight1.uid = -1*Math.random();
                        objNight1.url = value;
                        fileListNight_android1.push(objNight1);
                    }
                    if(value.indexOf('night/android_2') >= 0) {
                        let objNight3 = {};
                        objNight3.uid = -1*Math.random();
                        objNight3.url = value;
                        fileListNight_android2.push(objNight3);
                    }
                })
                this.setState({
                    weatherList: res.data.weatherList,
                    fileList_ios1: fileList_ios1,
                    fileList_ios2: fileList_ios2,
                    fileList_ios3: fileList_ios3,
                    fileList_android1: fileList_android1,
                    fileList_android2: fileList_android2,
                    fileListNight_ios1: fileListNight_ios1,
                    fileListNight_ios2: fileListNight_ios2,
                    fileListNight_ios3: fileListNight_ios3,
                    fileListNight_android1: fileListNight_android1,
                    fileListNight_android2: fileListNight_android2,
                    previewImage: fileList_ios1.length > 0 && fileList_ios1[0].url || '',
                    previewVisible: true,
                    previewImageNight: fileListNight_ios1.length > 0 && fileListNight_ios1[0].url || '',
                    previewVisibleNight: true,
                })
        }else{
            message.error(res && res.message || '服务器错误')
        }
      }
    });
  }
  componentDidMount() {
    this.fetchImg('datetime',this.state.typeName);
  }

  handleCancel = () => this.setState({ previewVisible: false, previewVisibleNight: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handlePreviewNight = (file) => {
    this.setState({
      previewImageNight: file.url || file.thumbUrl,
      previewVisibleNight: true,
    });
  }

  handleUpload = () => {
    const { modal_ios1, modal_ios2, modal_ios3, modal_android1, modal_android2, modalNight_ios1, modalNight_ios2, modalNight_ios3, modalNight_android1, modalNight_android2 } = this.state;
    // if(this.state.dateState == 'datetime' && (modal.img == '' && modal_android1.img == '' && modal_ios3.img == '' && modal_android2.img == '' && modal_ios2.img == '')) {
    //     return message.error('必须上传5张或者更改5张图片');
    // }
    // if(this.state.dateState == 'night' && (modalNight.img == '' && modalNight_android1.img == '' && modalNight_ios3.img == '' && modalNight_android2.img == '' && modalNight_ios2.img == '')) {
    //     return message.error('必须上传5张或者更改5张图片');
    // }
    this.setState({ uploading: true });
    let weatherArray = new Array();
    this.state.dateState == 'datetime' ? weatherArray.push(modal_ios1,  modal_ios2, modal_ios3, modal_android1, modal_android2,) : weatherArray.push(modalNight_ios1, modalNight_ios2, modalNight_ios3, modalNight_android1, modalNight_android2 );
    this.props.dispatch({
        type: 'weatherManage/uploadWeather',
        payload: {
            weatherArray: weatherArray,
            typeName: this.state.typeName,
            type: 'weather',
            state: this.state.dateState,
        },
        callback: (res) => {
            if(res) {
                if(res.code == '0') {
                    this.setState({
                        data: res.data ? res.data : {},
                        uploading: false,
                    });
                    message.success('上传成功');
                }else{
                    this.setState({ uploading: false });
                    message.success('上传失败');
                }
            }
        },
    });
  }

  reset = () => {
    this.setState({
        fileList_ios1: [],
        fileList_ios2: [],
        fileList_ios3: [],
        fileList_android1: [],
        fileList_android2: [],
        fileListNight_ios1: [],
        fileListNight_ios2: [],
        fileListNight_ios3: [],
        fileListNight_android1: [],
        fileListNight_android2: [],
        previewVisible: false,
        previewVisibleNight: false,
    });
  }

  changeLabel = (index, typeName, id) => {
    this.setState({
        index: index,
        typeName: typeName,
        id: id,
        activeKey: '1',
        tabs1Content: true,
        // state: ''
    });
    this.fetchImg('datetime',typeName);
  }

  tabClick = (e) => {
      e == '1'?
        this.setState({
            tabs1Content: true,
            dateState: 'datetime',
            activeKey: '1'
        })
      : 
        this.setState({
            tabs1Content: false,
            dateState: 'night',
            activeKey: '2',
        })

        this.fetchImg(e == '1' ? 'datetime' : 'night', this.state.typeName);
  }

  render() {
    const that = this;
    const { previewVisible, previewVisibleNight, previewImage, previewImageNight, fileList_ios1, fileList_ios2, fileList_ios3, fileList_android1, fileList_android2, fileListNight_ios1, fileListNight_ios2, fileListNight_ios3, fileListNight_android1, fileListNight_android2, uploading, mode  } = this.state;
    const props = {
        img_ios1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList_ios1 }) => {
                const index = fileList_ios1.indexOf(file);
                const newFileList = fileList_ios1.slice();
                newFileList.splice(index, 1);
                return {
                    fileList_ios1: newFileList,
                    // previewVisible: false,
                    modal_ios1: {key: 'ios_1', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList_ios1 }) => ({
                    fileList_ios1: [...fileList_ios1, file],
                    modal_ios1: {key: 'ios_1', img: ''},
                })
            );
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal_ios1: {id: that.state.id, key: 'ios_1', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList_ios1: info.fileList_ios1,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList_ios1,
            accept: "image/*"
        },
        img_ios2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList_ios2 }) => {
                const index = fileList_ios2.indexOf(file);
                const newFileList = fileList_ios2.slice();
                newFileList.splice(index, 1);
                return {
                    fileList_ios2: newFileList,
                    // previewVisible: false,
                    modal_ios2: {key: 'ios_2', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList_ios2 }) => ({
                fileList_ios2: [...fileList_ios2, file],
                modal_ios2: {key: 'ios_2', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal_ios2: {id: that.state.id, key: 'ios_2', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList_ios2: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList_ios2,
            accept: "image/*"
        },
        img_ios3:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList_ios3 }) => {
                const index = fileList_ios3.indexOf(file);
                const newFileList = fileList_ios3.slice();
                newFileList.splice(index, 1);
                return {
                    fileList_ios3: newFileList,
                    // previewVisible: false,
                    modal_ios3: {key: 'ios_3', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList_ios3 }) => ({
                fileList_ios3: [...fileList_ios3, file],
                modal_ios3: {key: 'ios_3', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal_ios3: {id: that.state.id, key: 'ios_3', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList_ios3: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList_ios3,
            accept: "image/*"
        },
        img_android1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList_android1 }) => {
                const index = fileList_android1.indexOf(file);
                const newFileList = fileList_android1.slice();
                newFileList.splice(index, 1);
                return {
                    fileList_android1: newFileList,
                    // previewVisible: false,
                    modal_android1: {key: 'android_1', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList_android1 }) => ({
                fileList_android1: [...fileList_android1, file],
                modal_android1: {key: 'android_1', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal_android1: {id: that.state.id, key: 'android_1', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList_android1: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList_android1,
            accept: "image/*"
        },
        img_android2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList_android2 }) => {
                const index = fileList_android2.indexOf(file);
                const newFileList = fileList_android2.slice();
                newFileList.splice(index, 1);
                return {
                    fileList_android2: newFileList,
                    // previewVisible: false,
                    modal_android2: {key: 'android_2', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList_android2 }) => ({
                fileList_android2: [...fileList_android2, file],
                modal_android2: {key: 'android_2', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal_android2: {id: that.state.id, key: 'android_2', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList_android2: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList_android2,
            accept: "image/*"
        },
    };
    const props1 = {
        img_ios1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight_ios1 }) => {
                const index = fileListNight_ios1.indexOf(file);
                const newFileList = fileListNight_ios1.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight_ios1: newFileList,
                    // previewVisibleNight: false,
                    modalNight_ios1: {key: 'ios_1', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight_ios1 }) => ({
                    fileListNight_ios1: [...fileListNight_ios1, file],
                    modalNight_ios1: {key: 'ios_1', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight_ios1: {id: that.state.id, key: 'ios_1', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight_ios1: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight_ios1,
            accept: "image/*"
        },
        img_ios2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight_ios2 }) => {
                const index = fileListNight_ios2.indexOf(file);
                const newFileList = fileListNight_ios2.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight_ios2: newFileList,
                    // previewVisibleNight: false,
                    modalNight_ios2: {key: 'ios_2', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight_ios2 }) => ({
                    fileListNight_ios2: [...fileListNight_ios2, file],
                    modalNight_ios2: {key: 'ios_2', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight_ios2: {id: that.state.id, key: 'ios_2', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight_ios2: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight_ios2,
            accept: "image/*"
        },
        img_ios3:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight_ios3 }) => {
                const index = fileListNight_ios3.indexOf(file);
                const newFileList = fileListNight_ios3.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight_ios3: newFileList,
                    // previewVisibleNight: false,
                    modalNight_ios3: {key: 'ios_3', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight_ios3 }) => ({
                    fileListNight_ios3: [...fileListNight_ios3, file],
                    modalNight_ios3: {key: 'ios_3', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight_ios3: {id: that.state.id, key: 'ios_3', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight_ios3: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight_ios3,
            accept: "image/*"
        },
        img_android1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight_android1 }) => {
                const index = fileListNight_android1.indexOf(file);
                const newFileList = fileListNight_android1.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight_android1: newFileList,
                    // previewVisibleNight: false,
                    modalNight_android1: {key: 'android_1', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight_android1 }) => ({
                    fileListNight_android1: [...fileListNight_android1, file],
                    modalNight_android1: {key: 'android_1', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight_android1: {id: that.state.id, key: 'android_1', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight_android1: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight_android1,
            accept: "image/*"
        },
        img_android2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight_android2 }) => {
                const index = fileListNight_android2.indexOf(file);
                const newFileList = fileListNight_android2.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight_android2: newFileList,
                    // previewVisibleNight: false,
                    modalNight_android2: {key: 'android_2', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight_android2 }) => ({
                    fileListNight_android2: [...fileListNight_android2, file],
                    modalNight_android2: {key: 'android_2', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight_android2: {id: that.state.id, key: 'android_2', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight_android2: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight_android2,
            accept: "image/*"
        },
    };
    
    const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
    let weatherWrap = [];
    this.state.weatherList.length>0 && this.state.weatherList.forEach((value,index,array) =>{
        const weatherOne = <Button key={index} className={this.state.index == index ? styles.btnBlue : styles.btnNone} onClick={() => this.changeLabel(index,value.typeName,value.id)}>{value.typeName}</Button>;
        weatherWrap.push(weatherOne);
    });
    return (
        <PageHeaderLayout title="天气管理">
            <Card bordered={false} >
                <Tabs
                    defaultActiveKey='1' 
                    tabBarGutter={10} 
                    type='card'
                >
                    <TabPane tab='天气背景图' key='1'>
                        <ModuleIntroduce text={'天气背景图设置'} />
                        <div>
                            <Row style={{marginBottom:24,background: '#fff',padding:12}}>
                                <Col  sm={24} style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                                    <label style={{color:'rgba(0,0,0,0.85)'}}>天气类型:</label>
                                    {weatherWrap}
                                </Col>
                            </Row>
                            <Row style={{marginBottom:24,background: '#fff',paddingTop:60,paddingBottom:60}}>
                                <Col span={12}  style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                                    <div>
                                        {/* <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                                            <Radio.Button value="top">白天</Radio.Button>
                                            <Radio.Button value="left">晚上</Radio.Button>
                                        </Radio.Group> */}
                                        <Tabs
                                        ref="Tab"
                                        defaultActiveKey='1'
                                        activeKey={this.state.activeKey}
                                        tabPosition={mode}
                                        style={{ width: 300 }}
                                        tabBarStyle={{height:60,border:1,textAlign:'center'}}
                                        onTabClick={this.tabClick}
                                        >
                                            <TabPane tab="白天" key="1">
                                                <div className={styles.imgWrap}>
                                                    {previewVisible ? <img alt="example" style={{ width: '100%' }} src={previewImage} /> : null}
                                                    <div className={styles.circle}></div>
                                                </div>
                                            </TabPane>
                                            <TabPane tab="晚上" key="2">
                                                <div className={styles.imgWrap}>
                                                    {previewVisibleNight ? <img alt="example" style={{ width: '100%' }} src={previewImageNight} /> : null}
                                                    <div className={styles.circle}></div>
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                        
                                    </div>
                                    
                                </Col>
                                {
                                    this.state.tabs1Content
                                    ?
                                    <Col span={12} aligin="center">
                                        <Row>
                                            <Col span={12}>
                                                <p>iPhone5</p>
                                                <Upload {...(props.img_ios1)} onPreview={this.handlePreview} 
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileList_ios1.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">640*1136px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                            <Col span={12}>
                                                <p>Andriod非曲面屏</p>
                                                <Upload {...(props.img_android1)} onPreview={this.handlePreview}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileList_android1.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1334px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>iPhone6、7、8、Plus</p>
                                                <Upload {...(props.img_ios2)} onPreview={this.handlePreview}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileList_ios2.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1334px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                            <Col span={12}>
                                                <p>Andriod曲面屏</p>
                                                <Upload {...(props.img_android2)} onPreview={this.handlePreview}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileList_android2.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1500px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <p>iPhoneX</p>
                                                <Upload {...(props.img_ios3)} onPreview={this.handlePreview}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileList_ios3.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1624px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop:150}}>
                                            <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                                                <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                                                <Button  onClick={this.reset}>重置</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    :
                                    <Col span={12} aligin="center">
                                        <Row>
                                            <Col span={12}>
                                                <p>iPhone5</p>
                                                <Upload {...(props1.img_ios1)} onPreview={this.handlePreviewNight}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileListNight_ios1.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">640*1136px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                            <Col span={12}>
                                                <p>Andriod非曲面屏</p>
                                                <Upload {...(props1.img_android1)} onPreview={this.handlePreviewNight}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileListNight_android1.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1334px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>iPhone6、7、8、Plus</p>
                                                <Upload {...(props1.img_ios2)} onPreview={this.handlePreviewNight}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileListNight_ios2.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1334px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                            <Col span={12}>
                                                <p>Andriod曲面屏</p>
                                                <Upload {...(props1.img_android2)} onPreview={this.handlePreviewNight}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileListNight_android2.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1500px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <p>iPhoneX</p>
                                                <Upload {...(props1.img_ios3)} onPreview={this.handlePreviewNight}
                                                showUploadList={{showPreviewIcon:false}}
                                                >
                                                {fileListNight_ios3.length >= 1 ? null : 
                                                    <div>
                                                        <Icon type="plus" />
                                                        <div className="ant-upload-text">750*1624px</div>
                                                    </div>
                                                }
                                                </Upload>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop:150}}>
                                            <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                                                <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                                                <Button  onClick={this.reset}>重置</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab='天气预警' key='2'>
                        <ModuleIntroduce text={'天气预警列表'} />
                        <WeatherAlarm />
                    </TabPane>
                </Tabs>
            </Card>
      </PageHeaderLayout>
    );
  }
}
