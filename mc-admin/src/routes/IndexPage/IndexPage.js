import React, { PureComponent } from 'react';

export default class IndexPage extends PureComponent{
  render() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%'}}>
           <h1>欢迎进入米橙管理系统</h1>
        </div>   
    );
  }
}
