import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Select} from 'antd';
import { Button } from '../../../node_modules/antd/lib/radio';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const {Option} = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
export default class AddReportAlert extends PureComponent {

  // 提交表单
  handleSubmit = () => {
    const { onOk, data } = this.props;
    const { row:{id}} = data;
    this.props.form.validateFields((err, values) => {
      if (!err) { 
       
        onOk(values,id);
      }
    });
  }
  // 选择省
  chagneProvince = (e) => {
    const { selectProvince } = this.props;
    this.props.form.setFieldsValue({
      cityId:'0'
    });
    selectProvince(e);
  }

  alertHtml = () =>{
    const {form, data, provinceData, cityData, typeData } = this.props;
   
    const { getFieldDecorator } = form;
    const { name, domain, proId, cityId, paperTypeId, note, type, encoding, pageMatcher,titleMatcher,contentMatcher,status  } = data.row;
   
    let provinceOption = [];
    let cityOption = [];
    let typeOption = [];
    provinceOption.push(<Option key='-1' value='0'>请选择</Option>);
    cityOption.push(<Option key='-1' value='0'>请选择</Option>);
    typeOption.push(<Option key='-1' value='0'>请选择</Option>);
    if(provinceData){
      for(let i=0;i<provinceData.length;i++){
        provinceOption.push(<Option key={provinceData[i].id} value={provinceData[i].id+''}>{provinceData[i].name}</Option>);
      }
    }
    if(cityData){
      for(let i=0;i<cityData.length;i++){
        cityOption.push(<Option key={cityData[i].id} value={cityData[i].id+''}>{cityData[i].name}</Option>);
      }
    }
    if(typeData){
      for(let i=0;i<typeData.length;i++){
        typeOption.push(<Option key={typeData[i].id} value={typeData[i].id+''}>{typeData[i].name}</Option>);
      }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <FormItem
              label="名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                initialValue:name,
                rules: [{ required: true, message: '请输入名称!', whitespace: true }],
              })(
                <Input  placeholder="输入名称"/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="网址"
              {...formItemLayout}
            >
              {getFieldDecorator('domain', {
                initialValue:domain,
                rules: [{ required: true, message: '请输入网址!', whitespace: true }],
              })(
                <Input  placeholder="输入网址"/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="省"
              {...formItemLayout}
            >
              {getFieldDecorator('proId', {
                initialValue:(proId||0)+'',
              })(
               <Select onChange={this.chagneProvince}>
                 {provinceOption}
               </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="市"
              {...formItemLayout}
            >
              {getFieldDecorator('cityId', {
                initialValue:(cityId||0)+'',
              })(
               <Select>
                 {cityOption}
               </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="分类"
              {...formItemLayout}
            >
              {getFieldDecorator('paperTypeId', {
                initialValue:(paperTypeId||0)+'',
              })(
               <Select>
                 {typeOption}
               </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="编码"
              {...formItemLayout}
            >
              {getFieldDecorator('encoding', {
                initialValue:encoding,
              })(
                <Input  placeholder="输入编码"/>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="描述"
              {...formItemLayout}
            >
              {getFieldDecorator('note', {
                initialValue:note,
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="报纸类型"
              {...formItemLayout}
            >
              {getFieldDecorator('type', {
                initialValue:(type||0)+'',
              })(
               <Select>
                 <Option value='0'>省报</Option>
                 <Option value='1'>市报</Option>
                 <Option value='2'>县报</Option>
                 <Option value='3'>国报</Option>
               </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="版面匹配正则"
              {...formItemLayout}
            >
              {getFieldDecorator('pageMatcher', {
                initialValue:pageMatcher,
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="标题匹配正则"
              {...formItemLayout}
            >
              {getFieldDecorator('titleMatcher', {
                initialValue:titleMatcher,
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="内容匹配正则"
              {...formItemLayout}
            >
              {getFieldDecorator('contentMatcher', {
                initialValue:contentMatcher,
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              label="状态"
              {...formItemLayout}
            >
              {getFieldDecorator('status', {
                initialValue:(status||0)+'',
              })(
               <Select>
                 <Option value='0'>正常</Option>
                 <Option value='1'>连接失败</Option>
                 <Option value='2'>待抓取</Option>
               </Select>
              )}
            </FormItem>
          </Col>
        </Row>
    </Form>
    );
  }
  render() {
    const { data:{visible,title},onCancel} = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        width={800}
      >
        {this.alertHtml()}
      </Modal>
    );
  }
}


