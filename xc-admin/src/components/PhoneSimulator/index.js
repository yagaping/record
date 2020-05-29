import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { convertHtmlToText } from '../FormatText';
import moment from 'moment';

const TIMEFORMAT = 'MM-DD HH:mm';
export default class PhoneSimulator extends PureComponent {

	componentDidUpdate() {
		this.renderIframeHtml();
	}
	renderIframeHtml() {

		const { html, socuse, time, title } = this.props;
		const rule = /(onload\s*=\s*\"(.*)\")/g;
		let htmlDom = html.replace(rule,'');
		let getTime = time ? moment(time).format(TIMEFORMAT) :moment(+new Date()).format(TIMEFORMAT);
		const content = `<section class="messge">
			<div class="tw_tit">${title}</div>
			<div class="v_time">
				<span>${socuse}</span>
				<em>${getTime}</em>
			</div>
			<div class="tw_info">
				${htmlDom}
			</div>
		</section>`;

		setTimeout(()=>{
			const iframeElement = this.refs.iframe;
			if(iframeElement){
				iframeElement.contentWindow.document.body.innerHTML = content;
			}
		},500)

	
	}

	handleOnLoad = () => {

		const { socuse, time, title, html } = this.props;
		const rule = /(onload\s*=\s*\"(.*)\")/g;
		let htmlDom = html.replace(rule,'');
		let getTime = time ? moment(time).format(TIMEFORMAT) : moment(+new Date()).format(TIMEFORMAT);
		const content = `<section class="messge">
		<div class="tw_tit">${title}</div>
		<div class="v_time">
			<span>${socuse}</span>
			<em>${getTime}</em>
		</div>
		<div class="tw_info">
			${htmlDom}
		</div>
	</section>`;


		let iframeElement = this.refs.iframe;
		setTimeout(function(){
			iframeElement.contentWindow.document.body.innerHTML = content;
		},30);

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
				<iframe id={`viewIframe`} onLoad={this.handleOnLoad} className={styles.iframe} ref="iframe" src="phone-simulator.html">
				</iframe>
			</div>
		);
	}
}
