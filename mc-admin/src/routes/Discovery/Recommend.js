import React, { PureComponent, Fragment } from 'react';
import {
    Form,
    message,
    Icon,
    Table, 
    Modal,
    Popconfirm,
    Popover,
    Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
import UploadFile from '../../components/UploadFile';
import styleBtn from './BeautifulListening.less';
import { secondsToDate } from '../../utils/utils';
import DateContent from '../../components/DateContent';
const FormItem = Form.Item;


const CreateForm = Form.create()(props => {
    const { 
        handleModalVisible,
        recommendYes,
        modalVisible,
        getImgUrl, 
        fileList, 
        setFileList, 
        loading, 
    } = props;
    
    return(
        <Modal 
            visible={modalVisible}
            onOk={recommendYes}
            onCancel={handleModalVisible}
            title='推荐'
            confirmLoading={loading}
            keyboard={false}
            maskClosable={false}
        >
          <FormItem wrapperCol={{ offset:0 }}>
              <UploadFile getImgUrl={getImgUrl} fileList={fileList} setFileList={setFileList}/>
          </FormItem>
        </Modal>
    )
})
@connect(({ beautifulListening, loading }) => ({
    beautifulListening,
    loading: loading.models.beautifulListening,
}))
@Form.create()
export default class Recommend extends PureComponent {
    constructor(props){
        super(props);
        this.date = null;
    }
    state = {
        page: 1,
        pageSize: 10,
        loading: false,
        modalVisible: false,
        audioImg:'',
        thumbnail:'',
        fileList:[],
        detailFileList: [],
        data: null,
        audioUrl: '',
        clickType: '',   //全部
    }
    
    componentDidMount() {
        this.queryOneDay();
        this.getOneMonthData();
    }

    // 获取一个月日期发布内容数
    getOneMonthData = ( startTime, endTime ) => {
        startTime = startTime ? startTime : moment().startOf('month').format('YYYY-MM-DD');
        endTime = endTime ? endTime : moment().endOf('month').format('YYYY-MM-DD');
        const { dispatch } = this.props;
        this.setState({
          startTime,
          endTime
        })
        dispatch({
            type:'beautifulListening/getOneMonthData2',
            payload:{
                startTime,
                endTime,
            }
        })
    }

    // 查询一天发布的内容
    queryOneDay = ( date=moment().format('YYYY-MM-DD'),  obj={ page:0, pageSize:10 } ) => {
        this.date = true;
        const { dispatch } = this.props;
        let params = {
            page:obj.page,
            pageSize:obj.pageSize,
            publishTime:date
        }
        this.props.form.resetFields();
        this.setState({ 
            clickType: '',
            title: '',
            isPublish: '',
            date,
            ...params
        },()=>{
            dispatch({
                type:'beautifulListening/queryOneDay2',
                payload:{
                    ...params
                }
            })
        });
       
    }

    //pagination 点击分页
    onClick(current, pageSize) {
        const { date } = this.state;
        this.setState({ page: current, pageSize: pageSize},()=>{
            if(this.date){
                this.queryOneDay( date , { page: current, pageSize: pageSize });
                return;
            }
        });
    }


    // 设置封面图
    setFileList = ( obj ) => {
        this.setState({
            fileList:obj
        })
    }

    // 获取上传设置封面图base64
    getImgUrl = (url) => {
        this.setState({
            audioImg:url,
        })
    }

    // 推荐
    isRecommend = ( row ) => {
      this.setState({modalVisible:true,remomendItem:row})
    }
    // 确定推荐
    recommendYes = () => {
      const { remomendItem, audioImg, date, page, pageSize, startTime, endTime } = this.state;
      const { dispatch } = this.props;
      if( remomendItem ){
        if( !audioImg ){
          message.info('请选择图片');
          return
        }
        dispatch({
          type:'beautifulListening/recommend',
          payload:{
            audioRecommend:{
              recommendTime:moment(remomendItem.publishTime).format('YYYY-MM-DD'),
              imgUrl:audioImg,
              audioId:remomendItem.id
            }
          },
          callback:res => {
            if(res.code === 0){
              this.handleModalVisible();
              this.queryOneDay(date, { page, pageSize });
              this.getOneMonthData( startTime, endTime);
            }else{
              message.error( res.message );
            }
          }
        })
      }
    }
    // 关闭推荐弹框
    handleModalVisible = () => {
      this.setState({
        modalVisible:false,
        audioImg:'',
        fileList:[],
        remomendItem:null
      })
    }
    // 取消推荐
    cancelRecommend = ( row ) => {
      const { id } = row;
      const {  date, page, pageSize, startTime, endTime } = this.state;
      this.props.dispatch({
        type:'beautifulListening/unRecommend',
        payload:{
            audioId:id,
        },
        callback: res => {
          if(res.code === 0){
            message.success('取消成功');
            this.queryOneDay(date, { page, pageSize });
            this.getOneMonthData( startTime, endTime);
          }else{
            message.error(res.message);
          }
        }
      })
    }
    // 播放音频
    audioClick = ( url ) => {
        const _this = this;
        if(!url){
            _this.refs.audio.pause();
        }
        this.setState({
            audioUrl:url,
        },()=>{
            _this.refs.audio.onended = function(){
               _this.setState({
                    audioUrl:null
               })
            }
        })
    }
   
    render() {
        const { dataList, total } = this.props.beautifulListening && this.props.beautifulListening.data2.data.pageRet;
        const  { page, pageSize, loading, audioUrl } = this.state;

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '分类',
            dataIndex: 'typeName',
            key: 'typeName',
            render: value => {
                return(<span>{value||'--'}</span>)
            }
          }, {
            title: '图标',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (value, row, index) => {
                const content = (<img src={value} width={300}/>)
                return (
                    <div>
                        {value ? 
                        <Popover placement='rightTop' key={index} content={content}>
                            <div style={{width:'50px',height:'50px'}}><img width="50" height="50" src={value}/></div>
                        </Popover>
                        :
                        '--'
                        }
                    </div>
                )
            }
          }, {
            title: '音频',
            dataIndex: 'audioUrl',
            key: 'audioUrl',
            render: (value) => {
                let bool = false;
                if(audioUrl == value && !this.state.modalVisible){
                    bool = true;
                }
                return(
                    <div>
                        {bool ? <Icon className={styles.audioBtn}  onClick={this.audioClick.bind(this,null)} type="pause-circle" /> 
                        :
                        <Icon className={styles.audioBtn} onClick={this.audioClick.bind(this,value)} type="play-circle" />
                        }
                    </div>
                )
            }
          },{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
          },{
              title:'描述',
              key:'describe',
              dataIndex:'describe',
              render: value => {
                let text = value 
                ? 
                <Tooltip title={ value }>
                    <div className={styles.describe}>{ value }</div>
                </Tooltip> 
                : 
                '--';
                return text;
              }
          },{
            title: '配音',
            dataIndex: 'author',
            key: 'author',
          },{
            title: '时长',
            dataIndex: 'time',
            key: 'time',
            render: value => {
                return(<span>{value ? secondsToDate(value) : '--'}</span>)
            }
          }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (value, row, index) => {
                return(<span>{value ? moment(value).format('YYYY-MM-DD') : '--'}</span>)
            }
          }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (value, row, index) => {
                let dom = !row.isRecommend 
                ? <a href="javascript:;" onClick={( ) => this.isRecommend( row )}>推荐</a>
                : (
                  <Popconfirm
                  title="确定取消推荐?"
                  onConfirm={()=>this.cancelRecommend(row)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:;" style={{color:'red'}}>取消</a>
                </Popconfirm>
                )
                return(
                    <Fragment>
                        { dom }
                    </Fragment>
                )
            }
          }];
        const pagination = {
            total: total,
            defaultCurrent: page,
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
              this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        };
        const events = { 
          handleModalVisible:this.handleModalVisible,
          recommendYes:this.recommendYes,
          getImgUrl:this.getImgUrl, 
          setFileList:this.setFileList, 
          };
        return(
                <div>
                  <div className={styles.tableList}>
                      <div className={styleBtn.tableAndDate}>
                          <div className={styleBtn.table}>
                              <Table
                                  className={styles.myTable}
                                  style={{backgroundColor:'white',marginTop:16}}
                                  columns={columns} 
                                  dataSource={dataList} 
                                  pagination={pagination}
                                  loading={loading}
                                  rowKey='id'
                              />
                          </div>
                          <div className={styleBtn.date} ref="showDate">
                            <DateContent  
                              dateData={this.props.beautifulListening.recomendData}
                              getOneMonthData={ this.getOneMonthData }
                              queryOneDay={ this.queryOneDay }
                              type="recommend"
                            />
                          </div>
                      </div>
                  </div>
                  {/* 推荐 */}
                  <CreateForm {...events} { ...this.state } />
                  {/* 音频 */}
                  <audio ref='audio' autoPlay={this.state.modalVisible ? false : true} src={audioUrl} />
                </div>
        )
    }
}