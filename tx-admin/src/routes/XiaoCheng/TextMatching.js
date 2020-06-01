import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    message,
    Card,
    Button,
    Input,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const { TextArea } = Input;
@connect(({ textMatch, loading }) => ({
    textMatch,
    loading: loading.models.textMatch,
}))
@Form.create()
export default class TextMatching extends PureComponent {
    state = {
        loading: false,
        transformValue: '',
        inputText: ''
    }

    componentDidMount() {
       this.refs.textArea.focus();
    }

    inputChange = (e) => {
        const { value } = e.target;
        this.setState({ inputText: value });
        // message.success(value)
    }

    transform = () => {
        if(!this.state.inputText) return message.error('请先输入文本!!!');
        this.setState({ loading: true });
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            dispatch({
                type: 'textMatch/textMatch',
                payload: this.state.inputText,
                callback: (res) => {
                    if(res) {
                        if(res.code == '0') {
                            let _value;
                            if(typeof(res.data) == 'object') {
                                _value = JSON.stringify(res.data) 
                            }else { 
                                _value =  res.data;
                            }
                            this.setState({ transformValue: _value, loading: false});
                            message.success(res.message);
                        }else {
                            message.error(res.message || '服务器错误');
                            this.setState({ loading: false })
                        }
                    }
                }
            });
        });
    }

    render() {
        const { transformValue, loading } = this.state;//this.props.textMatch || [];
        return(
            <div>
                <Row style={{display: 'flex'}}>
                    <Col span={8} >
                        <TextArea rows={30} style={{resize: 'none'}} ref="textArea" onChange={this.inputChange} placeholder="请输入..."/>
                    </Col>
                    <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button type="primary" onClick={() => this.transform()} loading={loading}>转化</Button>
                    </Col>
                    <Col span={8}>
                        <TextArea rows={30} disabled style={{resize: 'none'}} value={transformValue}/>
                    </Col>
                </Row>
            </div>
        )
    }
}