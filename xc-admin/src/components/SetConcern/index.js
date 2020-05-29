import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Select, Modal,Input,Checkbox, Form,Spin, Icon, Upload, DatePicker  } from 'antd';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
export default class SetConcern extends PureComponent {
  state = {
    disabled:false,
  };
  componentDidUpdate(prevProps){
    if(prevProps.state.type != this.props.state.type){
      this.setState({
        disabled:false,
      });
    }
  }
  // 选择已有事件
  handleType = ( e ) => {
    this.setState({
      disabled:e.target.checked,
    }, () => {
      this.props.form.validateFields(['name','type','viceTitle','showImg','selectTime'], { force: true });
    });
  }
  //确认提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
    
      if(!err){
        const { name, check, type, viceTitle, showImg, selectTime, selectTime2 } = values;
        const params = {};
       // 上传图片失败
        if(showImg && showImg[0].response.code!=0){
          this.props.form.setFields({
            showImg:{
              value:showImg,
              errors:[new Error(showImg[0].response.message)]
            },
          });
          return;
        }
       
        if(!check){
          params.name = name;
          params.viceTitle = viceTitle;
          params.selectTime = selectTime;
          params.showImg = showImg[0].response.result;
        }else{
          params.type = type;
          params.selectTime2 = selectTime2;
        }
        onOk(params);
      }
      
    })
  }
  // 取消
  handleCancel = () => {
    this.setState({
      disabled:false,
    });
    this.props.onCancel();
  }
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if(e){
      let data = e.fileList;
      this.props.state.showImg = data;
    
      return data;
    }
  }
  render() {
    const { type, form, loading, state } = this.props;
    const { visible, showImg }  = state;
    const { disabled } = this.state;
    let viceTitleBool = disabled;
    let title,eventTit,viceTit,checkTit;
   
    switch(state.type){
      case 1:
        title = '添加至关注';
        eventTit = '关注事件名';
        viceTit = '副标题';
        checkTit = '已有事件';
        break;
      case 2:
        viceTitleBool = true;
        title = '添加至专题';
        eventTit = '专题名';
        viceTit = '副标题';
        checkTit = '已有专题';
        break;
    }
    const { getFieldDecorator } = form;
    const cssTxt = {
      width:"520px",
      maxHeight:'399px',
      height:'399px',
      left:'-24px',
      top:'-79px',
      zIndex:'11',
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          maskClosable={false}
          destroyOnClose={true}
        >
        <Spin size="large" spinning={loading} style={cssTxt}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label={eventTit}
            >
            {getFieldDecorator('name', {
               initialValue:'',
               rules: [{ required: !disabled, message: `请输入${eventTit}名`, whitespace: true }],
            })(
              <Input disabled={disabled} placeholder={'请输入'+eventTit+'名'}/>
            )}
            </FormItem>
            <FormItem
              label='副标题'
            >
            {getFieldDecorator('viceTitle', {
               initialValue:'',
               rules: [{ required:!viceTitleBool, message: '请输入副标题', whitespace: true }],
            })(
              <Input disabled={disabled} placeholder="输入副标题"/>
            )}
            </FormItem>
            <FormItem
              label='时间'
              style={{display:state.type==1?'block':'none'}}
            >
            {getFieldDecorator('selectTime', {
               initialValue:null,
               rules: [{ type:'object',required:!viceTitleBool, message: '请选择时间'}],
            })(
              <DatePicker 
              disabled={disabled}
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择时间"
              />
            )}
            </FormItem>
            <FormItem
              label='主图'
            >
            {getFieldDecorator('showImg', {
               valuePropName: 'fileList',
               getValueFromEvent: this.normFile,
               rules: [{ type:'array',required: !disabled, message: '请上传主图', whitespace: true }],
            })(
              <Upload
                action="/work-api/work/uploadImg"
                name="file"
                data={{type:4}}
                listType="picture-card"
                showUploadList={{showPreviewIcon:false}}
                disabled={disabled}
                style={{background:disabled?'#f5f5f5':'#fafafa'}}
              >
                {showImg.length >= 1 ? null : uploadButton}
              </Upload>
            )}
            </FormItem>
            <FormItem
            style={{marginBottom:0}}
            >
            {getFieldDecorator('check', {
               valuePropName:'checked',
            })(
              <Checkbox onChange={this.handleType}>{checkTit}</Checkbox>
            )}
            </FormItem>
            <FormItem
            style={{display:disabled?'block':'none'}}
            >
            {getFieldDecorator('type', {
               initialValue:'',
               rules: [{ required: disabled, message: `请选择${checkTit}名`}],
            })(
              <Select>
               {
                 type.map(item => {
                    return <Option key={item.id} value={item.id}>{item.title}</Option>;
                  })
                }
              </Select>
            )}
            </FormItem>
            <FormItem
              label='时间'
              style={{display:disabled&&state.type==1?'block':'none'}}
            >
            {getFieldDecorator('selectTime2', {
               initialValue:null,
               rules: [{ type:'object',required:disabled&&state.type==1?true:false, message: '请选择时间'}],
            })(
              <DatePicker 
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择时间"
              />
            )}
            </FormItem>
          </Form>
          </Spin>
        </Modal>
        
    );
  }
}

