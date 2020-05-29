import React, { Component } from 'react';
import {
    Modal,
    Carousel,
    Icon
} from  'antd';
import styles from './index.less'

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.arrowRight}`}
            style={{ ...style, display: "block",zIndex:999,width:32,height:32}}
            onClick={onClick}
        />
    );
}
  
const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.arrowLeft}`}
            style={{ ...style, display: "block",zIndex:999,width:32,height:32 }}
            onClick={onClick}
        />
    );
}



export default class CarouselSelf extends Component{
    constructor(props){
        super(props);
        this.state = {
            showArrow: false
        }
    }
    onCancel = () => {
        this.props.show(false);
        this.setState({ showArrow: false })
    }

    mouse_out = (e) => {
        this.setState({ showArrow: false })
    }

    mouse_over = (e) => {
        if(this.props.imgArray && this.props.imgArray.length > 1) {
            this.setState({ showArrow: true })
        }
    }

    render() {
        const { imgArray, modalVisible } = this.props;
        let arrayList = [];
        imgArray && imgArray.map((item, i) => {
            if(item.type == 3 ) {
                arrayList.push(
                    <div key={i} onMouseOver={this.mouse_over} >
                        <video controls="controls" id="video" width="375" >
                            <source src={'data:video/mp4;base64,'+item.url}></source>
                        </video> 
                    </div>
                )
            }else if(item.type == 2){
                arrayList.push(
                    <div key={i} onMouseOver={this.mouse_over}>
                       <audio controls src={'data:audio/x-wav;base64,'+item.url} />
                    </div>)
            }else if(item.type == 1){
                arrayList.push(
                    <div key={i} onMouseOver={this.mouse_over}>
                        <img src={'data:image/png;base64,'+item.url} style={{width:375}} key={i}/>
                    </div>)
            }else{
                if(/(\.png|\.jpg)/ig.test(item.url)){
                    arrayList.push(
                        <div key={i} onMouseOver={this.mouse_over}>
                            <img src={item.url} style={{width:375}} key={i}/>
                        </div>)
                }else if(/(\.wav)/ig.test(item.url)){
                    arrayList.push(
                        <div key={i} onMouseOver={this.mouse_over}>
                           <audio controls src={item.url} />
                        </div>)
                }else if(/(\.mp4)/ig.test(item.url)){
                    arrayList.push(
                        <div key={i} onMouseOver={this.mouse_over} >
                            <video controls="controls" id="video" width="375" >
                                <source src={item.url}></source>
                            </video> 
                        </div>
                    )
                }
            }
        });
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            arrows: this.state.showArrow,
            slidesToShow: 1,
            slidesToScroll: 1,
            // autoplay: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
        };
        return(
            <Modal
                visible={modalVisible} 
                onCancel={this.onCancel}
                width={423}
                footer={null}
                closable={false}
                style={{overflow:'hidden'}}
            >
                <Carousel {...settings}>
                    {arrayList}
                </Carousel>
            </Modal>
        )
    }
}