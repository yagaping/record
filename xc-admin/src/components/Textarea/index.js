import React, { Component } from 'react';
import { Table, Alert, Badge, Modal } from 'antd';
import { Link } from 'dva/router';
import ContentEditor from '../ContentEditor/ContentEditor';
import styles from './index.less';

export default class Textarea extends Component{
  shouldComponentUpdate (nextProps,nextState){
      return false;
  }
  
  render(){
   const { className, editStyle, htmlData, onChange } = this.props;
    return <ContentEditor {...this.props}  />
  }
}