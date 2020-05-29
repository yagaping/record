import React, { Component } from 'react';

export default class ModuleIntroduce extends Component {
    render() {
        return(
            <h3 style={{marginBottom: 50}}>{'（模块介绍：'+this.props.text+'）'}</h3>
        )
    }
}