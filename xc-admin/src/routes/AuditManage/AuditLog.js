import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Spin} from 'antd';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import styles from './AuditLog.less';
const FormItem = Form.Item;
const formatDate = 'YYYY-MM-DD';
@Form.create()
@connect(state => ({
  auditManage: state.auditManage,
}))
export default class AuditLog extends PureComponent{
  state = {
    startTime:null,
    endTime:null,
    value:'',
  };

  componentDidMount(){
    this.queryLog();
  }
  //查询数据
  queryLog = () => {
    const { dispatch } = this.props;
    const { startTime, endTime } = this.state;
    dispatch({
      type:'auditManage/queryLogData',
      payload:{
        startTime,
        endTime,
      },
    });
  } 

  //开始日期限制
  disabledStartDate = (startValue) => {
    const endValue = this.state.endTime;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  }
  // 结束日期限制
  disabledEndDate = (endValue) => {
    const startValue = this.state.startTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startTime', value);
  }

  onEndChange = (value) => {
    this.onChange('endTime', value);
  }

    // 搜索Dom结构
    searchData = () => {
      const { form } = this.props;
      const { startTime, endTime} = this.state;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={this.handleSubmit}>
              <dl className={styles.searchLayout}>
                
              <dd style={{width:'220px'}}>
                  <FormItem 
                  disabledDate={this.disabledStartDate}
                  label="开始日期"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  >
                    {getFieldDecorator('startTime', { initialValue:startTime })(
                      <DatePicker style={{width:'100%'}} 
                        disabledDate={this.disabledStartDate}
                        onChange={this.onStartChange}
                      />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'220px'}}>
                  <FormItem 
                  label="结束日期"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  >
                    {getFieldDecorator('endTime', { initialValue:endTime })(
                      <DatePicker style={{width:'100%'}} 
                        disabledDate={this.disabledEndDate}
                        onChange={this.onEndChange}
                      />
                    )}
                  </FormItem>
                </dd>
                <dd style={{width:'160px'}}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </dd>
            </dl>
          </Form>
      );
    }

      // 搜索
      handleSubmit = (e) => {
        if (e) e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields((err, values) => {
        
          const startTime = values.startTime ? moment(values.startTime).format(formatDate) : null;
          const endTime = values.endTime ? moment(values.endTime).format(formatDate) : null;
        
          this.setState({
            startTime,
            endTime,
          });
          dispatch({
            type:'auditManage/queryLogData',
            payload:{
              startTime,
              endTime,
            },
          });
        })
        
      }
      // 重置搜索
    handleFormReset = () => {
      const { dispatch, form } = this.props;
      const { tabId } = this.state;
      form.resetFields();
      this.setState({
        startTime:null,
        endTime:null,
      });
      dispatch({
        type:'auditManage/queryLogData',
        payload:{
          startTime:null,
          endTime:null,
        },
      });
    }
  // 表格内容
  tableData = () => {
    const { logList } = this.props.auditManage;
    const startTime = this.state.startTime ? moment(this.state.startTime).format(formatDate) :
    '--';
    const endTime = this.state.endTime ? moment(this.state.endTime).format(formatDate) : 
    '--';
    return (
      <table className={styles.table}>
        <thead className="ant-table-thead">
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th colSpan={2}>任务</th>
            <th>推荐</th>
            <th>娱乐</th>
            <th>科技</th>
            <th>体育</th>
            <th>军事</th>
            <th>财经</th>
            <th>汽车</th>
            <th style={{width:148}}>开始时间</th>
            <th style={{width:148}}>结束时间</th>
            <th>总计</th>
          </tr>
        </thead>

        {
          logList.map( item => {
            let sum1 = 0;
            let sum2 = 0;
            let sum3 = 0;
            for(let o in item.data.status1){
                sum1 += item.data.status1[o];
            }
            for(let o in item.data.status2){
              sum2 += item.data.status2[o];
            }
            for(let o in item.data.status3){
              sum3 += item.data.status3[o];
            }
            
            return (
            <tbody className="ant-table-tbody" key={item.index}>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td rowSpan={3}>{item.index}</td>
                <td rowSpan={3}>{item.name}</td>
                <td rowSpan={2}>审核</td>
                <td>通过</td>
                <td>{item.data.status1.type_0}</td>
                <td>{item.data.status1.type_1}</td>
                <td>{item.data.status1.type_7}</td>
                <td>{item.data.status1.type_8}</td>
                <td>{item.data.status1.type_9}</td>
                <td>{item.data.status1.type_10}</td>
                <td>{item.data.status1.type_14}</td>
                <td rowSpan={3}>{startTime}</td>
                <td rowSpan={3}>{endTime}</td>
                <td>{sum1}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>未通过</td>
                <td>{item.data.status2.type_0}</td>
                <td>{item.data.status2.type_1}</td>
                <td>{item.data.status2.type_7}</td>
                <td>{item.data.status2.type_8}</td>
                <td>{item.data.status2.type_9}</td>
                <td>{item.data.status2.type_10}</td>
                <td>{item.data.status2.type_14}</td>
                <td>{sum2}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td colSpan={2}>发布</td>
                <td>{item.data.status3.type_0}</td>
                <td>{item.data.status3.type_1}</td>
                <td>{item.data.status3.type_7}</td>
                <td>{item.data.status3.type_8}</td>
                <td>{item.data.status3.type_9}</td>
                <td>{item.data.status3.type_10}</td>
                <td>{item.data.status3.type_14}</td>
                <td>{sum3}</td>
              </tr>
            </tbody>
            )
          })
        }
      </table>  
    );
  }
  handleChange = (value) => {
    this.setState({
      value,
    });
  }
  prompt = () => {

  }
  render(){
    const { loading } = this.props.auditManage;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <div className={styles.logPage}>
            {this.searchData()}
            <Spin spinning={loading}>
              {this.tableData()}
            </Spin>
          </div>
        </Card>
			</PageHeaderLayout>
    )
  }
}
