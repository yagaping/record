import React, { PureComponent } from 'react';
import { Table, Row, Col } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './index.less';
const FORMAT = 'YYYY-MM-DD';
export default class UserTrend extends PureComponent{
  componentDidMount(){

  }
  render(){
    const { data:{list,userList,title,title2,column,column2,loading} } = this.props;
    return (
      <div className={styles.table}>
        <Row>
          <Col style={{paddingBottom:30}}>
            <div className={styles.title}>{title}</div>
            <Table
              dataSource={list}
              columns={column}
              rowKey="id"
              pagination={false}
              loading={loading}
            />
          </Col>
          
          { userList ?
            <Col>
              <div className={styles.title}>{title2}</div>
              <Table
                  dataSource={userList}
                  columns={column2}
                  rowKey="id"
                  pagination={false}
                  loading={loading}
                />
            </Col>:null
          }
        </Row>
      </div>
    )
  }
}