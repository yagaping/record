import React, { Component } from 'react';
import {
    Icon,
    Row,
    Col,
    Button
} from 'antd';
import styles from './index.less';
export default class UploadVideo extends Component{
    render() {
        const { changePath, upload, loading, src, cancleUpload } = this.props;
        let preview = <video src={src} controls style={{width: 200,height: 200}}/>
        return(
            <div>
                <Row>
                    <Col  className={styles.colWrap} >
                        <div>
                            <label className={styles.input} >选择文件
                                <input className={styles.inputBtn} type='file' accept='video/*' onChange={changePath}/>
                            </label>
                        </div>
                        <div>
                            {/* <button onClick={cancleUpload}>取消</button> */}
                            <Button type='primary' loading={loading} onClick={upload} style={{marginLeft:20}}>上传</Button>
                        </div>
                    </Col>
                </Row>
                <Row className={styles.videoWrap}>
                    <Col>{src ? preview : null}</Col>
                </Row>
            </div>
        )
    }
}