import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Icon, Divider, Layout, content } from 'antd';
import logo from '../assets/logo.svg';


class Home extends PureComponent {
  componentDidMount() {
    
  }
  render() {
    return (
      <Row type='flex' align='middle' justify='center' style={{height:'calc(100vh - 260px)'}}>
        <Col>
          <img src={logo} />
          <p style={{fontSize:18}}> Welcome to 米橙相册后台</p>
        </Col>
      </Row>
    );
  }
}

export default Home;
