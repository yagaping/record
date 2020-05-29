import React, { PureComponent } from 'react';
import { Input } from 'antd';
import styles from './index.less';

export default class NumericInput extends PureComponent{
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  }

  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange({ value: value.slice(0, -1) });
    }
    if (onBlur) {
      onBlur();
    }
  }
  
  render(){
    return <Input
            {...this.props}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
  }
}