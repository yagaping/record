import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    DatePicker,
    Button,
    Table, 
    Modal,
    Input,
    Select, 
    Divider
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

@connect(({ dataTemplate, loading }) => ({
  dataTemplate,
  loading: loading.models.dataTemplate,
}))
@Form.create()
export default class TextCount extends PureComponent {

    componentDidMount() {
        this.getData();
    }
    state = {
      page:1,
      pageSize:10,
      time:null
    }
    // 查询
    getData = () => {
      const { dispatch,form } = this.props;
      const { page, pageSize } = this.state;
      form.validateFields((err,values)=>{
        const { time } = values;
        let beginDate = null,
            endDate = null;
        if( time && time.length ){
          beginDate = moment(time[0]).format('YYYY-MM-DD');
          endDate = moment(time[1]).format('YYYY-MM-DD')
        }
        dispatch({
          type:'dataTemplate/queryTextCount',
          payload:{
            page,
            pageSize,
            beginDate,
            endDate,
          },
        })
      })
    }

    // 重置
    reset = () => {
      const { form } = this.props;
      form.resetFields();
      this.setState({
        page:1,
        pageSize:10,
        time:null
      },()=>{
        this.getData();
      })
  
    }
     // 分页改变
     onPageChange = (pagination) => {
      const { dispatch } = this.props;
      const { type, searchWords } = this.state;
      const { current, pageSize } = pagination;
      this.setState({
          page:current,
          pageSize,
      });
   
  }
    // 搜索结构
    renderForm() {
      const { time, } = this.state;
      const { getFieldDecorator } = this.props.form;
      return (
      <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={4} sm={24}>
                  <FormItem label="时间">
                      {getFieldDecorator('time',{
                          initialValue: time
                      })(
                        <RangePicker
                          format="YYYY-MM-DD"
                        />
                      )}
                  </FormItem>
              </Col>
              <Col md={4} sm={24} >
                    <span style={{ marginBottom: 24 }}>
                        <Button type="primary" onClick={this.getData}>
                        查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                        重置
                        </Button>
                    </span>
                </Col>
          </Row>
      </Form>
      );
  }

  handlePage = (size, page) => {
      this.setState({
        pageSize:page,
        page:size
      },()=>{
        this.getData();
      })
    }
    render() {
   
        const { textCount:{ data:{dataList, total}}, loading } = this.props.dataTemplate;
        const { page, pageSize } = this.state;
        const pagination = {
          total: total,
          defaultCurrent: page,
          current: page,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
          onShowSizeChange: (current, pageSize) => {
            this.handlePage(current, pageSize)
          },
          onChange:(current, pageSize) => {
              this.handlePage(current, pageSize)
          },
        };
        const columns = [{
          title:'时间',
          key:'date',
          dataIndex:'date',
          render:key=>{
            let text = '--';
            if(key){
              text = moment(key).format('YYYY-MM-DD');
            }
            return text;
          }
        },{
          title:'事件提醒（小橙）',
          key:'xRemind',
          dataIndex:'xRemind'
        },{
          title:'事件提醒（提醒）',
          key:'remind',
          dataIndex:'remind'
        },{
          title:'事件提醒（总数）',
          key:'remindTotal',
          dataIndex:'remindTotal'
        },{
          title:'生日提醒（小橙）',
          key:'xBrithday',
          dataIndex:'xBrithday'
        },{
          title:'生日提醒（生日）',
          key:'brithday',
          dataIndex:'brithday'
        },{
          title:'生日提醒（总数）',
          key:'brithdayTotal',
          dataIndex:'brithdayTotal'
        },{
          title:'记账（小橙）',
          key:'xTally',
          dataIndex:'xTally'
        },{
          title:'记账（记账）',
          key:'tally',
          dataIndex:'tally'
        },{
          title:'记账（总数）',
          key:'tallyTotal',
          dataIndex:'tallyTotal'
        },{
          title:'总数',
          key:'total',
          dataIndex:'total'
        }
        ];
        return(
            <div>
              <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <Table 
                      className={styles.myTable}
                      style={{backgroundColor:'white',marginTop:16}}
                      columns={columns} 
                      dataSource={dataList} 
                      onChange={this.onPageChange}
                      pagination={pagination}
                      loading={loading}
                      rowKey='id'
                  />
              </div>
            </div>
        )
    }
}