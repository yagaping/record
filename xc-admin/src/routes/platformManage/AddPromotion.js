import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import { connect } from 'dva';
import { 
  Card, 
  Form, 
  Input, 
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  Table,
  Icon,
  Upload,
  Modal,
  message,
  InputNumber,
  Spin,
} from 'antd';
import NewsType from '../../components/NewsType';
import styles from './AddPromotion.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const _TYPE={
  '0':'单张小图',
  '1':'单张大图',
  '2':'多张小图',
}
const _IMTTIPS = ['113*88','343*196','113*88'];
@Form.create()
@connect(state => ({
  platformManage: state.platformManage,
}))
export default class AddPromotion extends Component{
  state = {
    dic_title:'添加推广',
    previewImage: '',
    fileLength:1,
    id:0,
    fileList:[
    ],
    formValue:{
      type:'0',
    },
    checkFileBool:false,
    checkFileTxt:'',
  };

  componentDidMount(){
    const id = this.props.match.params.type||0;
    this.setState({id});
    if(id!='0'){
      this.props.dispatch({
        type:'platformManage/itemData',
        payload:{
          id,
        },
        callback:(res)=>{
          const startTime = res.startTime?moment(res.startTime).format('YYYY-MM-DD HH:mm:ss'):null;
          const endTime = res.endTime?moment(res.endTime).format('YYYY-MM-DD HH:mm:ss'):null;
          const formValue = {
            type:res.type+'',
            title:res.title,
            viceTitle:res.viceTitle,
            label:res.label+'',
            position:res.position,
            mode:res.mode+'',
            range:res.range+'', 
            sort:res.sort,
            frequency:res.frequency+'',
            startTime,
            link:res.link,
            endTime,
          }
          const fileArr = res.imageUrl.split(',');
          const fileList = [];
          let fileLength = 1;
          const dic_title = '编辑推广';
          if(fileArr){
            let len = fileArr.length
            for(let i=0;i<len;i++){
              fileList.push({
                uid:'file-'+i,
                name:'file'+i,
                status:'done',
                url:fileArr[i],
              });
            }
            fileLength = len;
          }
          this.setState({
              formValue:{...formValue},
              dic_title,
              fileList,
              fileLength,
          });
        }
      });
    }
  }


  // 提交表单数据
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { id } = this.state;
    const _this = this;
    form.validateFields((err, fieldsValue) => {
      if(err) return;
      let startTime = null;
      let endTime = null;
      const { fileLength, imgError, fileList } = this.state;
      const fileArr = [];

      if(fieldsValue.time.length&&(fieldsValue.time[0]&&fieldsValue.time[1])){
        startTime = fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss');
      }
      const params = {
        ...fieldsValue,
        startTime,
        endTime,
      };
      
      // 判断信息填完整才能提交
      // for(let i in params){
      //   if(!params[i]&&i!='label'){
      //     message.info('请完善信息再提交！');
      //     return;
      //   }
      // }
      // 判断文件是否上传
      if(fileList.length){
       
        if(fileLength==3){
          if(fileList.length!=3){
            // message.info('请传完3张图片！');
            _this.setState({
              checkFileBool:true,
              checkFileTxt:'请传完3张图片！',
            });
            return;
          }
        }
        if(imgError){
          return;
        }
      }else{
        // message.info('请上传图片或视频！');
        _this.setState({
          checkFileBool:true,
          checkFileTxt:'请上传图片或视频！',
        });
        return;
      }
      // 上传的文件
      for(let i=0;i<fileList.length;i++){
        let url = '';
        if(fileList[i].status!='done'){
          // message.info('图片上传数量不对！');
          _this.setState({
            checkFileBool:true,
            checkFileTxt:'图片上传失败！',
          });
          return ;
        }
        if(fileList[i].response){
          url = fileList[i].response.result.message;
        }
        if(fileList[i].url){
          url = fileList[i].url;
        }
          fileArr.push(url);
      }
      dispatch({
        type:'platformManage/promotionSubmit',
        payload:{
          ...params,
          id,
          urls:fileArr,
        },
        callback:(res) => {
          const _this = this;
          if(res.code == 0){
            message.success('提交成功！');
            setTimeout(function(){
              _this.props.history.push({
                pathname: '/platformManage/promotion-manage'
              });
            },1000)
           
          }else{
            message.error(res.message);
          }
         
        }
      });
    })
  }
  // 取消
  handleCancel = () => {
    this.props.history.push({
      pathname: '/platformManage/promotion-manage',
    });
  }
  // 上传
  handleChange = ({fileList }) => {
    this.setState({
      imgError:'',
    });
    if(fileList.length){
      for(let i=0;i<fileList.length;i++){  
          if(fileList[i].response && fileList[i].response.code !== 0){
            this.setState({
              imgError:fileList[i].response.message,
            });
          }
        }
    }
    this.setState({ fileList,checkFileBool:false });
    
  } 
  // 选择形式
  changeType = (e) => {
    this.state.formValue.type = e;
    if(e == 2){
      this.setState({
        fileLength:3,
      });
    }else{
      this.setState({
        fileLength:1,
      });
    }
  }

  // 验证时间
  checkTime = (rule, value, callback) => {
    if(!value[0]||!value[1]){
      callback('请选择时间');
    }
    callback();
  }

  // 选择分组
  handleNewsType = (e) => {
    const { setFieldsValue } = this.props.form;
    this.state.formValue.position = e;
    setFieldsValue({'position':e})
  }

  // 表单内容Dom
  renderAddForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props.platformManage;
    const { fileList, previewVisible, previewImage, fileLength,
      formValue:{ type, title, viceTitle, label, position, mode,
        range, startTime, endTime, sort, frequency, link },
        checkFileBool,checkFileTxt,imgError
       } = this.state;
    const formItemLayout = {
      labelCol: { 
        md:{span: 5}, 
        lg:{span:5},
      },
      wrapperCol: { 
        md:{ span: 10},
        lg:{span:7},
       },
    };
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let time1 = startTime ? moment(startTime,dateFormat):null;
    let time2 = endTime ? moment(endTime,dateFormat):null;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (  
      <Spin spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="形式"
            >
            {getFieldDecorator('type', {
              initialValue:type,
              rules:[
                {
                  required:true,message:'请选择形式',
                }
              ],
            })(
              <Select onChange={this.changeType}>
                <Option value="0">单张小图</Option>
                <Option value="1">单张大图</Option>
                <Option value="2">多张小图</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', {
              initialValue:title,
              rules:[
                {
                  required:true,message:'请输入标题'
                }
              ],
            })(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="副标题"
          >
            {getFieldDecorator('viceTitle', {
              initialValue:viceTitle,
              rules:[
                {
                  required:true,message:'请输入副标题'
                }
              ],
            })(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <Row style={{marginBottom:3}}>
            <Col md={5} lg={5} className={styles.label}>
              上传图片或视频：
            </Col>
            <Col md={10} lg={7}>
              <div className={styles.clearfix}>
                <Upload
                  action="work-api/work/upload"
                  accept=".jpg,.png,.gif"
                  name={'file'}
                  data={{type:2}}
                  listType="picture-card"
                  disabled={imgError?true:false}
                  fileList={fileList}
                  showUploadList={{showPreviewIcon:false}}
                  onChange={this.handleChange}
                >
                  {fileList.length >= fileLength ? null : uploadButton}
                </Upload>
                <span className={styles.tips}>(上传图片尺寸：{_IMTTIPS[type]})</span>
                <span className={styles.error} style={{display:imgError?'block':'none'}}>{imgError}</span>
              </div>
              <div className={checkFileBool?styles.show:styles.hide}>
                {checkFileTxt}
              </div>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="广告链接"
          >
            {getFieldDecorator('link', {
              initialValue:link,
              rules:[
                {
                  required:true,message:'请输入广告链接'
                }
              ],
            })(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<span>标签<em className={styles.col9}>可选</em></span>}
          >
            {getFieldDecorator('label', {
              initialValue:label,
            })(
              <TextArea rows={4}/>
            )}
            </FormItem>
            <FormItem
            {...formItemLayout}
            label="位置"
            >
            {getFieldDecorator('position', {
              initialValue:position,
              rules:[
                {
                  required:true,message:'请选择位置',
                }
              ],
            })(
              <NewsType onChange={this.handleNewsType}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="模式"
            >
            {getFieldDecorator('mode', {
              initialValue:mode,
              rules:[
                {
                  required:true,message:'请选择模式',
                }
              ],
            })(
              <Select >
                <Option value="0">CPA</Option>
                <Option value="1">CPS</Option>
                <Option value="2">CPC</Option>
                <Option value="3">CPM</Option>
                <Option value="4">CPD</Option>
                <Option value="5">CPT</Option>
                <Option value="6">CPI</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="范围"
            >
            {getFieldDecorator('range', {
              initialValue:range,
              rules:[
                {
                  required:true,message:'请选择范围',
                }
              ],
            })(
              <Select >
                <Option value="0">IOS</Option>
                <Option value="1">Android</Option>
                <Option value="2">全部</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="时间"
            >
            {getFieldDecorator('time', {
              initialValue:[time1, time2],
              rules:[
                {
                  validator:this.checkTime,
                }
              ],
            })(
              <RangePicker 
                style={{width:'100%'}}
                format="YYYY-MM-DD HH:mm:ss" 
                showTime
                placeholder={['开始时间', '结束时间']}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="排序号"
            >
            {getFieldDecorator('sort', {
              initialValue:sort,
              rules:[
                {
                  required:true,message:'请输入排序号',
                }
              ],
            })(
              <Input type="number"  />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="频率"
            >
            {getFieldDecorator('frequency', {
              initialValue:frequency,
              rules:[
                {
                  required:true,message:'请选择频率',
                }
              ],
            })(
              <Select >
                <Option value="0">8条内容一次</Option>
                <Option value="1">16条内容一次</Option>
                <Option value="2">32条内容一次</Option>
                <Option value="3">64条内容一次</Option>
                <Option value="4">128条内容一次</Option>
              </Select>
            )}
          </FormItem>
          <Row>
            <Col md={5} lg={5}></Col>
            <Col  md={10} lg={7} className={styles.btn}>
              <Button type="primary" htmlType='submit' size='large'>提交</Button>
              <Button onClick={this.handleCancel} size='large'>取消</Button>
            </Col>
          </Row>
        </Form>
      </Spin>
      )
  }

  render(){
    const { dic_title } = this.state;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.titleDic}>{dic_title}</div>
          <div className={styles.form}>
            {this.renderAddForm()}
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
