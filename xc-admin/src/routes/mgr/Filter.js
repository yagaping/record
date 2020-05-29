import React, { PureComponent,createClass} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, Input , Button, Spin } from 'antd';
import styles from './Filter.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
@connect(state => ({
  contentMgr: state.contentMgr,
}))
export default class Filter extends PureComponent{
  
  state = {
    submitWord:'',
  }
  componentDidMount(){
      this.queryFiterWord();
  }

  queryFiterWord = () => {
      this.props.dispatch({
        type:'contentMgr/queryKeyWord',
        payload:{},
        callback:(res)=>{
         
          this.setState({
            submitWord:res.keyword,
          });
        }
      })
  }
  handleSubmit = () => {
    
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      const values = {...fieldsValue};
      const { word } = values;
      dispatch({
        type:'contentMgr/modifyKeyWord',
        payload:{
          keyword:word,
        },
        callback:(res) => {
          this.queryFiterWord();
        }
      });
    })
  }

  FilterLayout(){
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props.contentMgr;
    return (
      <Spin spinning={loading}>
      <Form onSubmit={this.handleSubmit}>
        <div className={styles.filter}>
          <div className={styles.title}>过滤关键词</div>
          <div className={styles.content}>
            <FormItem label="">
              {getFieldDecorator('word', { initialValue: this.state.submitWord })(
                 <TextArea onPressEnter={this.handleSubmit} placeholder="请输入过滤关键词" />
              )}
            </FormItem>
          </div>
        </div>
        <div className={styles.btn}>
          <Button type="primary" size="large" htmlType="submit">提交</Button>
        </div>
      </Form>
      </Spin>
    );
  }

  render(){
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          {this.FilterLayout()}
        </Card>
			</PageHeaderLayout>
    )
  }
}
