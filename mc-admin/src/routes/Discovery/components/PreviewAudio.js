import React, { Component } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import {
 Form,
 Popover,
 Modal,
} from 'antd';
const FormItem = Form.Item;
@Form.create()
export default class PreviewAudio extends Component {
  constructor(props){
    super(props);
  }
    state = {
      visible:false,
    };

    handleOk = () => {

    }
    handleCancel = () => {
      this.props.handleCancel()
    }
    renderProview = () => {
      const { previewData } = this.props;
      const { author, title, content, describe, audioUrl, audioImg, thumbnail } = previewData;
      const formItemLayout = {
        labelCol: {
          span: 2 
        },
        wrapperCol: {
          span: 21 
        }
      };
      return (
        <div>
          <FormItem {...formItemLayout} label="配音">
            {author ? author : '--'}
          </FormItem>
          <FormItem {...formItemLayout} label="标题">
            {title ? title : '--'}
          </FormItem>
          <FormItem {...formItemLayout} label="内容">
          {
            content ? <TextArea value={content} autosize={{minRows: 2, maxRows:30}} /> : '--'
          }
              
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
              {describe ? describe : '--'}
          </FormItem>
          <FormItem {...formItemLayout} label="图标">
              {audioImg ? <Popover placement="rightTop" content={<img src={audioImg} width="200"/>}><img width='100' src={audioImg} /></Popover> : '--'}
          </FormItem>
          <FormItem {...formItemLayout} label="封面">
              {thumbnail ? <Popover placement="rightTop" content={<img src={thumbnail} width="200"/>}><img width='100' src={thumbnail} /></Popover> : '--'}
          </FormItem>
          <FormItem {...formItemLayout} label="音频">
           { audioUrl ? <audio src={audioUrl} controls/> : '--'}
          </FormItem>
        </div>
      )
    }
    render() {
        const { modalVisiblePreview } = this.props;
        return (
            <Modal
              visible={modalVisiblePreview}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              destroyOnClose
              centered
              title='预览'
              footer={null}
              width={800}
            >
              { this.renderProview() }
            </Modal>
        );
    }
}
