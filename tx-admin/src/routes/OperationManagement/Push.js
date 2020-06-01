import React, { PureComponent } from 'react';
import {
    Form,
    Card,
    Button,
    Select,
    Input,
    Row,
    Col,
    message
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const { Option } = Select;
const _PUSH = {
  1:'经期推送',
  2:'彩票推送',
  3:'新股发行推送',
  4:'新股申购推送',
};
@connect(({ editionList, loading }) => ({
    editionList,
    loading: loading.models.editionList,
}))
@Form.create()
export default class Push extends PureComponent {
  constructor(props){
    super(props)
    this.state={

    }
    this.handlePush = this.handlePush.bind(this);
  }

    componentDidMount() {
        
    }
    handlePush (e) {
      e.preventDefault();
      const { form } = this.props;
      const { dispatch } = this.props;
      form.validateFields((err,values) => {
        const { type, phone } = values;
        if(err) return;
        dispatch({
          type:'editionList/handlePush',
          payload:{
            type,
            mobiles:phone
          },
          callback:res=>{
            if(res.code===0){
              message.success('推送成功')
            }else{
              message.error('推送失败');
            }
          }
        })
      })
    }
    renderPush = () => {
      const { getFieldDecorator } = this.props.form;
      return (
                <Form onSubmit={this.handlePush}>
                  <Form.Item label="手机号">
                    {getFieldDecorator('phone',{
                       rules: [
                        { required: true, message: '请输入手机号码' },
                        {
                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号'
                        }
                      ],
                      initialValue:''
                    })(
                        <Input placeholder="请输入手机号" maxLength={11}/>
                    )}
                    </Form.Item>
                    <Form.Item label="类型">
                    {getFieldDecorator('type',{
                      rules: [{ required: true, message: '请选择推送类型' }],
                      initialValue:''
                    })(
                      <Select>
                        <Option value='' key={0}>请选择推送类型</Option>
                        {
                          Object.keys(_PUSH).map(item=> <Option key={item} value={item}>{_PUSH[item]}</Option>)
                        }
                      </Select>
                    )}
                    </Form.Item>
                    <Form.Item style={{textAlign:'center'}}>
                      <Button type="primary" htmlType="submit">
                        推送
                      </Button>
                    </Form.Item>
                </Form>
              )
    }
    render() {
        return(
            <PageHeaderLayout title={'推送'}>
                <Card bordered={false}>
                  <Row>
                    <Col xs={24} span={24} md={{span:12,offset:6}}>
                      { this.renderPush() }
                    </Col>
                  </Row>
                </Card>
            </PageHeaderLayout>
        )
    }
}