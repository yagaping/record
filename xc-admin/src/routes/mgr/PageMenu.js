import React, { PureComponent,createClass} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Row, Col, Switch, Card, Form, Modal,
  Input, Spin,
  Upload } from 'antd';
import PageMoreMenu from '../../components/PageMoreMenu';
import styles from './PageMenu.less';

const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  pageMenu: state.pageMenu,
}))
export default class PageMenu extends PureComponent{
  state = {
    visible:false,
    data:null,
  };
  componentDidMount(){
     this.pageMoreMenu();
  }
  // 查询更多页面菜单
  pageMoreMenu = () => {
    this.props.dispatch({
      type:'pageMenu/quyerPageMoreMenu',
      payload:{},
      callback:(res) => {
        const list = res.headerInfo;
        const { data } = this.state;
        if(data){
          for(let i=0;i<list.length;i++){
            if(list[i].cId === data.cId){
              let dataUpdate = {
                  ...data,
                  imgUrl:list[i].logoUrl,
              }
              this.setState({
                data:dataUpdate
              });
              break;
            }
          }
        }
      }
    });
  }
  // 上传图片
	handleChange = (cId,info) => {
		if (info.file.status === 'uploading') {
			this.setState({
				loading: true,
      })
      return;
    }
    if (info.file.status === 'done') {
      this.pageMoreMenu();
			this.setState({
        loading: false,
      })
    }
  }
  //修改菜单提交
  handleModel = (data) => {
      this.setState({
        visible:true,
        data,
      });
  }
  // 弹框中的内容
  formHtml = () => {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.state;
    if( data ){
      return (
        <Form>
          <div className={styles.modalBox}>
            <div className={styles.modal_title}>
              <Upload
                name={'icon-image'}
                data={{cId:data.cId}}
                action={"/app-api/navigation/uploadIcon"} 
                showUploadList={false} 
                onChange={this.handleChange.bind(this,data.cId)}>
                <img src={data.imgUrl}/>
              </Upload>
              <FormItem 
                style={{marginBottom:0}}>
                {getFieldDecorator('title', { initialValue: data.title })(
                  <Input placeholder=""/> 
                )}
              </FormItem>
            </div>
            <div className={styles.modal_url}>
            <FormItem 
              style={{marginBottom:0}}>
              {getFieldDecorator('httpUrl', { initialValue: data.httpUrl })(
                  <Input placeholder=""/> 
              )}
            </FormItem>
          </div>
        </div>
      </Form>  
      );
    }
  }
  // 确认修改
	handleOk = () => {
		const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      const values = {...fieldsValue};
      const { title, httpUrl } = values;
      const { cId } = this.state.data;
      dispatch({
        type:'pageMenu/modifyMoreMenu',
        payload:{
          cId:cId,
          name:title,
          linkUrl:httpUrl,
        },
        callback:() => {
          this.pageMoreMenu();
          this.setState({visible:false});
        }
      });
    })
	}
	// 取消弹框
	handleCancel = () => {
		this.setState({visible:false});
	}

  render(){ 
   const { moureList, loading } = this.props.pageMenu;
    return (
      <PageHeaderLayout>
				<Card bordered={false}>
          <Spin spinning={loading}>
            <PageMoreMenu data={moureList} 
            onAlert={this.handleModel}
            />
          </Spin>
          <Modal
            title="菜单编辑"
            destroyOnClose={true}
            maskClosable={false}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            { this.formHtml() }
          </Modal>
          
        </Card>
			</PageHeaderLayout>
    )
  }
}
