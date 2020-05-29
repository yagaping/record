import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { notification, Input, Button, Popconfirm } from 'antd';
import WangeDitor from 'wangeditor';
import styles from './ContentEditor.less';
const { TextArea } =  Input;

export default class ContentEditor extends Component {

  // props
  static propTypes = {
    onChange: PropTypes.func,
    htmlData: PropTypes.string,
  };

  // defaultProps
  static defaultProps = {
    onChange: () => {},
    htmlData: '',
  };

  // state
  state = {
    initDataSuccess: false,
  };

  componentDidMount() {
    // 创建编辑器 并 设置 html
    this.createEditor();
    this.setHtml(this.props);
    
  };
  // componentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    // 对比 html 是否需要更新
    if (nextProps.htmlData!=this.props.htmlData && !sessionStorage.getItem('formatText')) {
      return false;
    }
    // 更新 html
    this.setHtml(nextProps);
    sessionStorage.removeItem('formatText');
    return true;
  };
  
  componentWillMount() {
    this.setHtml(this.props);
  };

  // 设置 html
  setHtml({ htmlData, onChange }) {
   
    // 获取 editor
    const editor = this.editor;

    if (editor == undefined) {
      return;
    }

    // 判断 editor 是否初始化完成
    if (!editor) {
      new Error('editor 为初始化!');
    }
    // 设置默认 html
    if (htmlData) {
      const rule = /(\<video\s*(.|\n)*\<\/video\>)|(onload\s*=\s*\"([^\"])*\")|(\<audio\s*(.|\n)*\<\/audio\>)/g;
      htmlData = htmlData.replace(rule,'');
      if(htmlData.lastIndexOf('audio')!=-1||htmlData.lastIndexOf('vedio')!=-1){
        htmlData += '&nbsp';
      }
      editor.txt.html(htmlData);
      this.setState({first:2});
    }else{
      editor.txt.html('');
    }
  }

  getImgs(){
    let editorElemContent = this.refs.editorElemContent;
    let imgs = editorElemContent.getElementsByTagName('img');
    let come = false;
    const _this = this;
    
    if(imgs.length){

        editorElemContent.getElementsByTagName('div')[0].onscroll = function(){
          let viewImg = document.getElementById('viewImg');
              if(viewImg){
                viewImg.remove();
              }
        }
        for(let i=0;i<imgs.length;i++){
          (function(i){
           
            imgs[i].onmouseover = function(e){
              const self = this;
              let viewImg = document.getElementById('viewImg');
              if(viewImg){
                viewImg.remove();
              }
              come = false;
              viewImg = document.createElement('a');
              viewImg.id = 'viewImg';
              viewImg.style.cssText = "line-height:30px;height:30px;width:100px;position:absolute;background:rgba(0,0,0,.5);color:#efefef;text-align:center;";
              viewImg.style.top = this.offsetTop - editorElemContent.getElementsByTagName('div')[0].scrollTop + parseInt(this.clientHeight/2) - 15 + 'px';
              viewImg.style.left = this.offsetLeft + parseInt(this.clientWidth/2) - 50 + 'px';
              viewImg.innerHTML = '设为封面';
              editorElemContent.appendChild(viewImg);
              viewImg.onmouseover = function(e){
                e.stopPropagation();
                come = true;
              }
              viewImg.onclick = function(){
                _this.props.setViewImg(self.src);
              }
            }
            imgs[i].onmouseout = function(e){
              let viewImg = document.getElementById('viewImg');
              setTimeout(function(){
                if(viewImg && !come){
                  viewImg.remove();
                }
              },200)
              
            }
          })(i);
          
        }
      
    }
    
  }

  // 创建 editor
  createEditor() {
    const { onChange } = this.props;
    const editorElemToolsElement = this.refs.editorElemTools;
    const editorElemContentElement = this.refs.editorElemContent;
    const editor = new WangeDitor(editorElemToolsElement, editorElemContentElement);
    let code;
    const _this = this;
    // 上传图片
    editor.customConfig.uploadImgServer = 'work-api/work/uploadFile';
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgHooks = {
      
      error: function (xhr, editor) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        code = xhr.status;
    },
      customInsert: function (insertImg, result, editor) {
        // 插入图片
       insertImg(result.result);
     }
    }
    editor.customConfig.customAlert  = function (text) {
      if(code == 403){
        notification.info({
          message: '提示信息',
          description: '没有操作权限！',
        });
      }
      if( code == 401 || code == 8888 ){
        _this.props.dispatch({
          type: 'login/logout',
        })
      }
    };
    // zIndex
    editor.customConfig.zIndex = 10;

    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      
      this.html = html;
      onChange(html);
    };

    // 编辑菜单
    editor.customConfig.menus = [
      'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'list',  // 列表
    'justify',  // 对齐方式
    'image',  // 插入图片
    'undo',  // 撤销
    'redo'  // 重复
    ]

    // 穿件 editor
    editor.create();

    // 将 editor 保存到 this
    this.editor = editor;
  }

  render() {
    
    const { className, editStyle, style, setViewImg } = this.props;
    let styleType = '';
    // 通过点击图片获取方法
    if(this.refs.editorElemContent && setViewImg){
      this.getImgs();
    }
    
    if(style === 0){
      styleType = styles.writeNews;
    }
    return (
        <div className={`${styles.container} ${className} ${styleType}`}>
          <div ref="editorElemTools" className={styles.editorTools}></div>
          <div ref="editorElemContent" className={styles.editorContent}></div>
        </div>
    );
  }
}