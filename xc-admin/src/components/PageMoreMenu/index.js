import React, { PureComponent } from 'react';
import {  Row, Col, Input, message, Icon } from 'antd';
import styles from './index.less';

export default class PageMoreMenu extends PureComponent {

	state = {
		loading:false,
	};

	componentDidMount() {
		
	}
	// 弹框
	handleModel = (data) => {
		const { onAlert } = this.props;
		onAlert( data );
	}

	ddHtml = () => {
		const data = this.props.data;
		let html = [];
	
		for(let i=0;i<data.length;i++){
			html.push(
				<dd key={i}>
					<div className={styles.menu}>
						<div className={styles.imgTitle}>
							<img src={data[i].imgUrl} />
							<h3>{data[i].title}</h3>
						</div>
						<div className={styles.url}>
							<p>{data[i].httpUrl}</p>
						</div>
					</div>
					<a href="javascript:void(0)" className={styles.edit}><Icon type="form"
					onClick={this.handleModel.bind(this,data[i])} /></a>
				</dd>
			);
		}
		return html;
	};

	render() {
		const { data } = this.props;
		return (
      <div className={styles.moreMenu}>				
				<dl>
					<dt>更多</dt>
					{this.ddHtml()}
				</dl>
				
			</div>
		);
	}
}