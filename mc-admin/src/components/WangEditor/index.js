import 'rc-drawer-menu/assets/index.css';
import React,{PureComponent, Component} from 'react';
import { message } from 'antd';
import styles from './index.less';
import WangEditor2 from 'wangeditor';
import { fullscreen } from './wangEditor-fullscreen-plugin.js';

export default class WangEditor extends PureComponent {
  componentDidMount(){
    const _this = this;
    this.mark = true;
    this.come = 1;
    this.editor = new WangEditor2(this.refs.editor);
    this.editor.customConfig.onchange = (html) =>{
      if(this.verification(html) || this.props.type) {
        if(_this.props.replaceLabel) {
            //将富文本中的加粗替换成b标签，便于移动端解析
          html = html.replace(/<span style="font-weight: bold;">|<span style="font-weight: 700;">/g, "<b>");
          html = html.replace(/<\/span>/,"</b>");
          //替换div标签
          html = html.replace(/<\/div>/ig, "</p>");
          html = html.replace(/<div>/ig, "<p>");
          _this.props.richText(html);
        }else {
          _this.props.richText(html);
        }
      }else {
        _this.props.richText();
      }
    }
    this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;  //限制大小2M
    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    this.editor.customConfig.pasteFilterStyle = false     //关闭掉粘贴样式的过滤
    this.editor.customConfig.menus = this.props.replaceLabel ? 
    [
      'bold',  // 粗体
      'image',  // 插入图片
    ] 
    :
    [
      'head',  // 标题
      'bold',  // 粗体
      // 'fontSize',  // 字号
      // 'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      // 'backColor',  // 背景颜色
      'link',  // 插入链接
      // 'list',  // 列表
      'justify',  // 对齐方式
      // 'quote',  // 引用
      // 'emoticon',  // 表情
      'image',  // 插入图片
      // 'table',  // 表格
      // 'video',  // 插入视频
      // 'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#0091FF',
      '#ffffff'
    ]
    // 创建编辑器
    this.editor.create();
    // 初始化html
    this.editor.txt.html(_this.props.content);
    fullscreen.init(this.refs.editor);   //全屏
  }
  //验证图片文本之间是否回车换行
  verification = (html) => {
    if(html && html.indexOf('<img') > -1) {
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = html.match(imgReg);
      let imgPosition, imgStrLength;
      for (let i = 0; i < arr.length; i++) {
        imgPosition = html.indexOf(arr[i]);   //图片在文本位置
        imgStrLength = arr[i].length;     //图片img字符串标签长度
        if(html.charAt(imgPosition - 1) == '>'  && html.charAt(imgPosition + imgStrLength) == '<') {  //图片前后没有文本  自成一个段落
          return true;
        }else {
          return false;
        }
      }
    }else {
      return true;
    }
  }
  componentDidUpdate(props){
  
    // 重启编辑，置空值
    if(this.come == 1){
        this.come = 2;
        // this.mark = false;
        return ;
    }
    if(this.props.modalVisible){
      if(this.mark){
        this.editor.txt.html(this.props.content);
      }
      this.mark = false;
    }else{
      this.mark = true;
    }
  }

  render(){
    return (
        <div ref='editor'></div>
    )
  }
}