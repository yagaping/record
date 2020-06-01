import 'rc-drawer-menu/assets/index.css';
import React,{ PureComponent } from 'react';
import { message, Button } from 'antd';
import styles from './index.less';

export default class Ueditor extends PureComponent {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    // 初始化ueditor编辑器

    this.ueditor && this.ueditor.destroy();
    const _this = this;
    this.mark = false;
    this.come = 1;
    this.ueditor = UE.getEditor(this.props.id);
    this.ueditor.ready(function(){
      this.setContent(_this.props.content);
      
    })
    this.ueditor.addListener('contentChange',function(){
        let text = this.getContent();
        _this.props.richText(text);
        // 存草稿
          if(text && !_this.mark){
            localStorage.setItem('draft',text);
          }
    })
    
  }
 
  componentDidUpdate(props){
    // 重启编辑，置空值
    if(this.come == 1){
      this.come = 2;
      return ;
    }
    if(this.props.modalVisible){
      if(this.mark){
        this.ueditor.setContent(this.props.content);
      }
      this.mark = false;
    }else{
      this.mark = true;
    }
  }
  componentWillUnmount(){
    // 删除编辑器
    this.ueditor && this.ueditor.destroy();
  }
  // 恢复草稿
  readDraft = () => {
    let text = localStorage.getItem('draft');
    if(text){
      this.ueditor.setContent(text);
    }else{
      message.info('草稿箱没内容！');
    }
    
  }
  render(){
    const { width,height, id, isShow } = this.props;
    let w = width ? `${width}px` : '100%';
    let h = height ? `${height}px` : '400px';
    return (
      <div>
       <div id={ id } style={{height:`${h}`,width:`${w}`}}></div>
      { 
        this.props.draft && <Button type="primary" style={{marginTop:15}} onClick={this.readDraft}>读草稿</Button>
      }
      </div>
    )
  }
}