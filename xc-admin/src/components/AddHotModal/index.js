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
import NewsType from '../../components/NewsType';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const {Option} = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
@Form.create()
export default class AddHotModal extends Component {

  state = {

  }

    // 确定添加热门
    onSubmit = () => {
      const { handelHot, form:{validateFields} } = this.props;
      validateFields((err, values) => {
        if(!err){
          handelHot(values);
        }
      })
    }
    // 热门新闻弹框内容
    hotDom = () => {
      const { form:{getFieldDecorator}, hotIconList  } = this.props;
      const sethotNews = 0;
      let markIcon = null;
      return (
        <div>
          <Form onSubmit={this.onSubmit}>    
              <FormItem
                label='热门标题'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                {getFieldDecorator('hotTitle', { 
                  initialValue: '', 
                  rules: [{ required: true, message: '请输入热门标题', whitespace: true }],
                })(
                  <Input placeholder="请输入热门标题" />
                )}
              </FormItem>  
              <FormItem
                label='新闻类型'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}
              >
                {getFieldDecorator('sethotNews', { 
                  initialValue: sethotNews, 
                })(
                  <NewsType type='1'/>
                )}
              </FormItem>
              <FormItem
                label='标识'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}
              >
                {getFieldDecorator('markIcon', { 
                  initialValue: markIcon, 
                })(
                  <Select>
                    {
                      hotIconList.map( item => {
                        return (<Option value={item.label+','+item.image} key={item.id}>{item.label}</Option>);
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Form>
          </div>
      );
    }

  render() {
    const { newsHot, handelHotCancel } = this.props;
    const { visible, } = newsHot;
    return (
      <Modal
        title='热门新闻'
        visible={visible}
        onOk={this.onSubmit}
        onCancel={handelHotCancel}
        destroyOnClose={true}
        maskClosable={false}
      >
        {this.hotDom()}
      </Modal>
    );
  }
}


