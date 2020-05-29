import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import moment from 'moment';
import styles from './index.less';
const TIMEFORMAT = 'MM-DD HH:mm';
export default class PhoneVideoView extends PureComponent {

	componentWillMount(){
		const {newsGroup, code } = this.props;
		if(code == 2 && newsGroup == 20){
			Modal.error({
				title: '提示消息',
				content: '视频授权失败',
				okText:'确定',
			});
		}
	}
	componentDidUpdate() {
		this.renderIframeHtml();
		
	}
	renderIframeHtml(){
		const { socuse, time, title, html, videoUrl } = this.props;
    const newsGroup = this.props.newsGroup;
    let getTime = time ? moment(time).format(TIMEFORMAT) : moment(+new Date()).format(TIMEFORMAT);
		let content = '';
		let videoFileUrl;
    if(newsGroup === 20){
			videoFileUrl = videoUrl;
      content = `<section>
        <div class="video_warp">
					<video controls name="media" controls width="100%" autoplay>
						<source  src="${videoFileUrl}" type="video/mp4">
					</video>
        </div>
      </section>
      <section class="messge">
        <div class="v_text">${title}</div>
        <div class="come"><span>${socuse}</span><span>创建时间：${getTime}</span></div>
			</section>`;
		}else if(newsGroup === 0){
			let array = this.props.html ; 
			let len = array.length;
			content += `<section class="messge">
					<div class="tw_tit">${title}</div>
			</section>`;
			for(var i=0;i<len;i++){
					content += `<section class="messge">
						<div class="viewImg">
							<img src="${array[i].imageUrl}"/>
							<p>${i+1}/${len} ${array[i].describe}</p>
						</div>
				</section>`;
			}
			
		}else{
			let array = this.props.html ; 
			let len = array.length;
			content = `<section class="messge">
			<div class="tw_tit">${title}</div>
			<div class="v_time">
				<span>${socuse}</span>
				<em>${getTime}</em>
			</div>
			<div class="number">${len}回答</div>
			</section>`;
			for(var i=0;i<len;i++){
				content += `
				<div class="infomation">
					<section>
						<div class="top">`;
				if(array[i].user){
					content += `<div class="hd">
						<img src="${array[i].user.avatarUrl}" />
						<h3>${array[i].user.nickName}</h3>
					</div></div>`;
				}else{
					content += `<div class="hd">
						<img src="./m-hd.png" />
						<h3>匿名</h3>
					</div></div>`;
				}		
				content += `<div class="tw_info">
						${array[i].content}
						</div>
						</section>
				</div>`;
				
			}
    }
		
		setTimeout(()=>{
			const iframeElement = this.refs.iframe;
			if(iframeElement){
				iframeElement.contentWindow.document.body.innerHTML = content;
			}
		},500)
	}

	handleOnLoad = () => { 
    const { socuse, time, title, html } = this.props;
    const newsGroup = this.props.newsGroup;
    let getTime = time ? moment(time).format(TIMEFORMAT) : moment(+new Date()).format(TIMEFORMAT);
		let content = '';
		let videoFileUrl;
    if(newsGroup === 20){
			const {authAccess, videoUrl} = this.props;
			if(authAccess === 1){
					// 需要授权才能播放
					if(videoUrl.indexOf('toutiao.com') > -1) {
						videoFileUrl = html;
					}else{
						videoFileUrl = videoUrl;
					}
			}else{
				videoFileUrl = videoUrl;
			}
      content = `<section>
        <div class="video_warp">
					<video controls name="media" controls width="100%" autoplay>
						<source  src="${videoFileUrl}" type="video/mp4">
					</video>
        </div>
      </section>
      <section class="messge">
        <div class="v_text">${title}</div>
        <div class="come"><span>${socuse}</span><span>创建时间：${getTime}</span></div>
			</section>`;
		}else if(newsGroup === 0){
			let array = this.props.html ; 
			let len = array.length;
			content += `<section class="messge">
					<div class="tw_tit">${title}</div>
			</section>`;
			for(var i=0;i<len;i++){
					content += `<section class="messge">
						<div class="viewImg">
							<img src="${array[i].imageUrl}"/>
							<p>${i+1}/${len} ${array[i].describe}</p>
						</div>
				</section>`;
			}
			
		}else{
			let array = this.props.html ; 
			let len = array.length;
			content = `<section class="messge">
			<div class="tw_tit">${title}</div>
			<div class="v_time">
				<span>${socuse}</span>
				<em>${getTime}</em>
			</div>
			<div class="number">${len}回答</div>
			</section>`;
			for(var i=0;i<len;i++){
				content += `
				<div class="infomation">
					<section>
						<div class="top">`;
				if(array[i].user){
					content += `<div class="hd">
						<img src="${array[i].user.avatarUrl}" />
						<h3>${array[i].user.nickName}</h3>
					</div></div>`;
				}else{
					content += `<div class="hd">
						<img src="./m-hd.png" />
						<h3>匿名</h3>
					</div></div>`;
				}		
				content += `<div class="tw_info">
						${array[i].content}
						</div>
						</section>
				</div>`;
				
			}
    }
		
		setTimeout(()=>{
			const iframeElement = this.refs.iframe;
			if(iframeElement){
				iframeElement.contentWindow.document.body.innerHTML = content;
			}
			
		},500)
			
		// 渲染 iFrame 内容
    this.renderIframeHtml();
		
	}
	render() {
		const clsString = classNames(styles.phoneSimulator);
		const { viewUrl, className } = this.props;
		return (
			<div className={`${clsString} ${className}`}>
				<div className={styles.headerStatusTab}>
					<img className={styles.statusImg} src='https://os.alipayobjects.com/rmsportal/VfVHYcSUxreetec.png' />
				</div>
				<div className={styles.urlContainer}>
					<div className={styles.urlText}>{viewUrl}</div>
				</div>
				<iframe id={`viewIframe`} onLoad = {this.handleOnLoad} className={styles.iframe} ref="iframe" src="phone-simulator.html">
				</iframe>
			</div>
		);
	}
}