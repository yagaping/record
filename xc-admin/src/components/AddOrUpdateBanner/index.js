import React, { Component } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Row, 
  Col, 
  Select, 
  Switch,
  Upload,
  Icon,
  DatePicker,
} from 'antd';
import moment from 'moment';
import styles from './index.less';
import NumericInput from '../../components/NumericInput';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const {Option} = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@Form.create()
export default class AddOrUpdateBanner extends Component {

  state = {
    tips:false,
    tipsText:'',
    imgTips:{
      tips1:{
        text:'',
        bool:false,
      },
      tips2:{
        text:'',
        bool:false,
      },
      tips3:{
        text:'',
        bool:false,
      }
    },
    fileList:[],
  }

  // 上传图片改变事件
  handleChange1 = (e) => {
    const { imgTips } = this.state;
    let tips1 = {
      text:'',
      bool:false,
    };
    this.setState({
      imgTips:{
        ...imgTips,
        tips1,
      }
    });
    this.props.data.banner['item1'] = e.fileList;
 
    if(e.fileList.length){
      if(e.fileList[0].response && e.fileList[0].response.code != 0){
        tips1 = {
          text:e.fileList[0].response.message,
          bool:true,
        }
        
      }
    }
    this.setState({ 
      imgTips:{
        ...imgTips,
        tips1,
      }
    });
    
  }

  // 上传图片改变事件
  handleChange2 = (e) => {
    const { imgTips } = this.state;
    let tips2 = {
      text:'',
      bool:false,
    };
    this.setState({
      imgTips:{
        ...imgTips,
        tips2,
      }
    });

    this.props.data.banner['item2'] = e.fileList;

    if(e.fileList.length){
      if(e.fileList[0].response && e.fileList[0].response.code != 0){
        tips2 = {
          text:e.fileList[0].response.message,
          bool:true,
        }
        
      }
    }
    this.setState({ 
      imgTips:{
         ...imgTips,
         tips2,
       }
     });
  }

  // 上传图片改变事件
  handleChange3 = (e) => {
    const { imgTips } = this.state;
    let tips3 = {
      text:'',
      bool:false,
    };
    this.setState({
      imgTips:{
        ...imgTips,
        tips3,
      }
    });

    this.props.data.banner['item3'] = e.fileList;

    if(e.fileList.length){
      if(e.fileList[0].response && e.fileList[0].response.code != 0){
        tips3 = {
          text:e.fileList[0].response.message,
          bool:true,
        }
        
      }
    }
    this.setState({ 
      imgTips:{
        ...imgTips,
        tips3,
      }
    });
  }
  
  // 输入数字
  handleNumber = (value) => {
    const { setFieldsValue} = this.props.form;
    setFieldsValue({'countDown':value});
    // this.setState({ value });
    
  }

  // 选择设备
  handleDevice = (e) => {
    
    this.props.data.device = e;

  }

  // 开关
  handleSwitch = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      'label':e,
    });
  }

  // 弹框内容
  alertHtml = () =>{
    const { getFieldDecorator } = this.props.form;
    const { data:{ date, productType, type, banner, url, device, label, countDown } } = this.props;
    const { imgTips:{tips1,tips2,tips3} } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <FormItem
              label="日期"
              {...formItemLayout}
            >
              {getFieldDecorator('date', {
                initialValue:date,
                rules: [{ type: 'array', required: true, message: '选择日期!' }],
              })(
                <RangePicker showTime={true} format={'YYYY-MM-DD HH:mm:ss'}/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="所属产品"
              {...formItemLayout}
            >
              {getFieldDecorator('productType', {
                initialValue:productType,
                rules: [{ required: true, message: '请输入产品类型!', whitespace: true }],
              })(
                <Input  placeholder="输入产品类型"/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="类型"
              labelCol={{span:4}}
              wrapperCol={{span:5}}
            >
              {getFieldDecorator('type', {
                initialValue:type,
                rules: [{ required: true, message: '请选择类型!'}],
              })(
               <Select>
                 <Option value='0'>网页类型</Option>
                 <Option value='1'>应用类型</Option>
               </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="设备"
              {...formItemLayout}
            >
              {getFieldDecorator('device', {
                initialValue:device,
                rules: [{ required: true, message: '请选择设备！' }],
              })(
               <Select onChange={this.handleDevice}>
                 <Option value='2'>全部</Option>
                 <Option value='0'>IOS</Option>
                 <Option value='1'>Android</Option>
               </Select> 
              )}
            </FormItem>
          </Col>
          <Col>
           <Row className={styles.boxItem}>
             <Col style={{textAlign:'right'}} span={4}>启动图：</Col>
             <Col span={20} className={styles.imgList}>
             <div className={styles.box}>
              <Upload
                action="work-api/screenAdvertising/upload"
                listType="picture-card"
                accept=".jpg,.png,.gif"
                name='file'
                data={{range:device,type:1}}
                showUploadList={{showPreviewIcon:false}}
                fileList={banner['item1']}
                onChange={this.handleChange1}
              >
                 {banner['item1'].length >= 1 ? null : uploadButton}
              </Upload>
              <p className={styles.tips}>(750*1118)</p>
              <p className={tips1.bool?styles.show:styles.hide}>{tips1.text}</p>
              </div>
              <div className={styles.box} style={{left:122,display:device==1?'none':'block'}}>
              <Upload
                action="work-api/screenAdvertising/upload"
                listType="picture-card"
                accept=".jpg,.png,.gif"
                name='file'
                data={{range:device,type:0}}
                showUploadList={{showPreviewIcon:false}}
                fileList={banner['item2']}
                onChange={this.handleChange2}
              >
                 {banner['item2'].length >= 1 ? null : uploadButton}
              </Upload>
              <p className={styles.tips}>(750*1340)</p>
              <p className={tips2.bool?styles.show:styles.hide}>{tips2.text}</p>
              </div>
              <div className={styles.box} style={{left:device==1?'122px':'244px',display:device==0?'none':'block'}}>
              <Upload
                action="work-api/screenAdvertising/upload"
                listType="picture-card"
                accept=".jpg,.png,.gif"
                name='file'
                data={{range:device,type:2}}
                showUploadList={{showPreviewIcon:false}}
                fileList={banner['item3']}
                onChange={this.handleChange3}
              >
                 {banner['item3'].length >= 1 ? null : uploadButton}
              </Upload>
              <p className={styles.tips}>(720*1224)</p>
              <p className={tips3.bool?styles.show:styles.hide}>{tips3.text}</p>
              </div>
              
             </Col>
           </Row>
          </Col>
          <Col>
            <FormItem
              label="开关"
              {...formItemLayout}
            >
              {getFieldDecorator('label', {
                initialValue: 'checked'
              })(
                <Switch defaultChecked={label ? true : false} onChange={this.handleSwitch}/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="倒计时"
              labelCol={{span:4}}
              wrapperCol={{span:5}}
            >
              {getFieldDecorator('countDown', {
                initialValue:countDown,
                rules: [{ required: true, message: '请输入倒计时！' }],
              })(
              //  <Input type='number' />
              <NumericInput onChange={this.handleNumber}/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="跳转"
              {...formItemLayout}
            >
              {getFieldDecorator('url', {
                initialValue:url,
                rules: [{ required: true, message: '请输入跳转URL!', whitespace: true }],
              })(
               <Input placeholder='输入跳转URL' />
              )}
            </FormItem>
          </Col>
        </Row>
    </Form>
    );
  }
  // 确认添加、修改
  handleSubmit = (e) => {
    e.preventDefault();
    const { data:{id,banner,device}, addNewsItem} = this.props;
   
    const { imgTips } = this.state;
    let isError = false;
    let isEmpty = false;
  
    if(device == 2){
      for(let t in imgTips){
        if(imgTips[t].bool == true){
          isError = true;
        }
      }
      // 图片没上传完
     if(!banner['item1'].length){
      imgTips['tips1'].bool = true;
      imgTips['tips1'].text = '请上传图片';
      isEmpty = true;
     }
     if(!banner['item2'].length){
      imgTips['tips2'].bool = true;
      imgTips['tips2'].text = '请上传图片';
      isEmpty = true;
     }
     if(!banner['item3'].length){
      imgTips['tips3'].bool = true;
      imgTips['tips3'].text = '请上传图片';
      isEmpty = true;
     }
    //  上传错误
    if(banner['item1'].length&&banner['item1'][0].status != 'done'){
      imgTips['tips1'].bool = true;
      imgTips['tips1'].text = '上传图片失败';
      isError = true;
    }
    if(banner['item2'].length&&banner['item2'][0].status != 'done'){
      imgTips['tips2'].bool = true;
      imgTips['tips2'].text = '上传图片失败';
      isError = true;
    }
    if(banner['item3'].length&&banner['item3'][0].status != 'done'){
      imgTips['tips3'].bool = true;
      imgTips['tips3'].text = '上传图片失败';
      isError = true;
    }
    }else if(device == 0){
      // 图片服务器上传错误
      if(imgTips['tips1'].bool == true || imgTips['tips2'].bool == true){
        isError = true;
      }
      // 图片没上传
      if(!banner['item1'].length){
        imgTips['tips1'].bool = true;
        imgTips['tips1'].text = '请上传图片';
        isEmpty = true;
       }
       if(!banner['item2'].length){
        imgTips['tips2'].bool = true;
        imgTips['tips2'].text = '请上传图片';
        isEmpty = true;
       }
      //  图片上传失败
      if(banner['item1'].length&&banner['item1'][0].status != 'done'){
        imgTips['tips1'].bool = true;
        imgTips['tips1'].text = '上传图片失败';
        isError = true;
      }
      if(banner['item2'].length && banner['item2'][0].status != 'done'){
        imgTips['tips2'].bool = true;
        imgTips['tips2'].text = '上传图片失败';
        isError = true;
      }
    }else if(device == 1){
      if(imgTips['tips1'].bool == true || imgTips['tips3'].bool == true){
        isError = true;
      }
      if(!banner['item1'].length){
        imgTips['tips1'].bool = true;
        imgTips['tips1'].text = '请上传图片';
        isEmpty = true;
       }
       if(!banner['item3'].length){
        imgTips['tips3'].bool = true;
        imgTips['tips3'].text = '请上传图片';
        isEmpty = true;
       }
      //  图片上传深失败
       if(banner['item1'].length&&banner['item1'][0].status != 'done'){
        imgTips['tips1'].bool = true;
        imgTips['tips1'].text = '上传图片失败';
        isError = true;
      }
      if(banner['item3'].length&&banner['item3'][0].status != 'done'){
        imgTips['tips3'].bool = true;
        imgTips['tips3'].text = '上传图片失败';
        isError = true;
      }
    }
   
    this.props.form.validateFields((err, values) => {
      
      if (!err && !isError && !isEmpty) {
        let url;
        let arr = [];
        if(device == 2){
          arr.push(banner['item1'][0].response.result);
          arr.push(banner['item2'][0].response.result);
          arr.push(banner['item3'][0].response.result);
        }else if(device == 0){
          arr.push(banner['item1'][0].response.result);
          arr.push(banner['item2'][0].response.result);
        }else if(device == 1){
          arr.push(banner['item1'][0].response.result);
          arr.push(banner['item3'][0].response.result);
        }
        url = arr.join(',');
        const params = {
          ...values,
          id,
        };
        this.setState({
          imgTips:{
            tips1:{
              text:'',
              bool:false,
            },
            tips2:{
              text:'',
              bool:false,
            },
            tips3:{
              text:'',
              bool:false,
            }
          },
        });
       
        addNewsItem(params,url);
      }
    });
  }
  // 取消弹框
  handleCancel = () => {
      this.setState({
        imgTips:{
          tips1:{
            text:'',
            bool:false,
          },
          tips2:{
            text:'',
            bool:false,
          },
          tips3:{
            text:'',
            bool:false,
          }
        },
      });
 
      this.props.onCancel();
  }
  render() {
    const { data:{visible,title}} = this.props;
    
    return (
      <Modal
        title={title}
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width={600}
      >
        {this.alertHtml()}
      </Modal>
    );
  }
}


