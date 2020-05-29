import React, { Component } from 'react';
import { Table, Alert, Badge, Modal, Checkbox } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

export default class UserLimitTable extends Component{
  state = {
    projectId:'',
    jobId:'',
    selectTypeData:this.props.data,
    allRead:false,
    allWrite:false,
    allReadWrite:false,
};
  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps && nextProps.data) {
      this.setState({ selectTypeData: nextProps.data });
    }
  }
  // 选择可读
  handleRead = (row,e) => {
      
    const selectTypeData  = this.props.data;
    let newData = [];
    for(let i=0;i<selectTypeData.length;i++){
         
        if(selectTypeData[i].id == row.id){// 点击一级菜单
            if(e.target.checked){
                row.isRead = 1;
            }else{
                row.isRead = 0;
                row.isWrite = 0;
                this.props.select.allWrite = 0;
            }
            let child = row.children;
            if(child && child.length>0){
                if( row.isRead ){
                    for(let i=0;i<child.length;i++){
                        child[i].isRead = 1;
                    }
                }else{
                    for(let i=0;i<child.length;i++){
                        child[i].isRead = 0;
                        child[i].isWrite = 0;
                    }
                }
                row['children'] = child;
            }
            newData.push(row);
            continue;
        }
        if(row.pid){ //点击二级菜单
            if(row.pid == selectTypeData[i].id){
                let child = selectTypeData[i].children;
                let checkRead = 0;
                let checkWrite = 0;
                for(let j=0;j<child.length;j++){
                    if(child[j].id == row.id){
                        if(e.target.checked){
                            child[j].isRead = 1;
                        }else{
                            child[j].isRead = 0;
                            child[j].isWrite = 0;
                            this.props.select.allWrite = 0;
                        }
                    }
                    if( child[j].isRead == 1 ){
                      checkRead = 1;
                    }
                    if( child[j].isRead == 1 ){
                      checkWrite = 1;
                    }
                }
                if(!checkRead){
                  selectTypeData[i].isWrite = 0;
                }
                selectTypeData[i].isRead = checkRead;
            }
        }
        newData.push(selectTypeData[i]);
    }
    // 判断不存在不选就全选
    let boolParent = true;
    let boolChild = true;
    for(let i=0;i<newData.length;i++){
        if(newData[i].isRead == 0)
        {
          boolParent = false;
            break;
        }
        let child = newData[i].children;
        if(child && child.length>0){
          for(let j=0;j<child.length;j++){
            if(child[j].isRead == 0){
              boolChild = false;
              break;
            }
          }
        }
    }
    if(boolParent && boolChild){
       
      this.props.select.allRead = true;
    }else{
    this.props.select.allRead = false;
    }
    this.setState({
      selectTypeData:newData,
  });
}
// 选择可写
handleWrite = (row,e) => {
    const selectTypeData = this.props.data;
    let newData = [];
    for(let i=0;i<selectTypeData.length;i++){
        if(selectTypeData[i].id == row.id){//选择一级菜单
            if(e.target.checked){
                row.isWrite = 1;
                row.isRead = 1;
            }else{
                row.isWrite = 0;
                row.isRead = 0;
            }
            // 根据一级菜单，二级菜单选中与否
            let child = row.children;
            if(child && child.length>0){
                if( row.isWrite ){
                    for(let i=0;i<child.length;i++){
                        child[i].isWrite = 1;
                        child[i].isRead = 1;
                    }
                }else{
                    for(let i=0;i<child.length;i++){
                        child[i].isWrite = 0;
                        child[i].isRead = 0;
                    }
                }
                row['children'] = child;
            }
            newData.push(row);
            continue;
        }
        if(row.pid){ //点击二级菜单
            if(row.pid == selectTypeData[i].id){
                let child = selectTypeData[i].children;
                let checkRead = 0;
                let checkWrite = 0;
                for(let j=0;j<child.length;j++){
                    if(child[j].id == row.id){
                        if(e.target.checked){
                            child[j].isWrite = 1;
                            child[j].isRead = 1;
                        }else{
                            child[j].isWrite = 0;
                            child[j].isRead = 0;
                        }
                    }
                    if( child[j].isWrite == 1 ){
                      checkWrite = 1;
                    }
                    if( child[j].isRead == 1 ){
                      checkRead = 1;
                    }
                }
                selectTypeData[i].isWrite = checkWrite;
                selectTypeData[i].isRead = checkRead;
            }
        }
        newData.push(selectTypeData[i]);
    }
    // 判断不存在不选就全选=>可写
    let boolParentWrite = true;
    let boolChildWrite = true;
    for(let i=0;i<newData.length;i++){
        if(newData[i].isWrite == 0)
        {
          boolParentWrite = false;
            break;
        }
        let child = newData[i].children;
        if(child && child.length>0){
          for(let j=0;j<child.length;j++){
            if(child[j].isWrite == 0){
              boolChildWrite = false;
              break;
            }
          }
        }
    }
    if(boolParentWrite && boolChildWrite){
      this.props.select.allWrite = true;
    }else{
      this.props.select.allWrite = false;
    }

    // 判断不存在不选就全选=>可读
    let boolParentRead = true;
    let boolChildRead = true;
    for(let i=0;i<newData.length;i++){
        if(newData[i].isRead == 0)
        {
          boolParentRead = false;
            break;
        }
        let child = newData[i].children;
        if(child && child.length>0){
          for(let j=0;j<child.length;j++){
            if(child[j].isRead == 0){
              boolChildRead = false;
              break;
            }
          }
        }
    }
    if(boolParentRead && boolChildRead){
     
      this.props.select.allRead = true;
    }else{
      
      this.props.select.allRead = false;
    }
    this.setState({
      selectTypeData:newData,
    });
}
// 选择可读写
handleReadWrite = (row,e) => {
    const selectTypeData = this.props.data;
    let newData = [];
    for(let i=0;i<selectTypeData.length;i++){
        if(selectTypeData[i].id == row.id){
            if(e.target.checked){
                row.isWrite = 1;
                row.isRead = 1;
            }else{
                row.isWrite = 0;
                row.isRead = 0;
            }
            // 根据一级菜单，二级菜单选中与否
            let child = row.children;
            if(child && child.length>0){
                if( row.isWrite && row.isRead ){
                    for(let i=0;i<child.length;i++){
                        child[i].isWrite = 1;
                        child[i].isRead = 1;
                    }
                }else{
                    for(let i=0;i<child.length;i++){
                        child[i].isWrite = 0;
                        child[i].isRead = 0;
                    }
                }
                row['children'] = child;
            }
            newData.push(row);
            continue;
        }
            if(row.pid){ //点击二级菜单
                if(row.pid == selectTypeData[i].id){
                    let child = selectTypeData[i].children;
                    let check = 0;
                    for(let j=0;j<child.length;j++){
                        if(child[j].id == row.id){
                            if(e.target.checked){
                                child[j].isWrite = 1;
                                child[j].isRead = 1;
                            }else{
                                child[j].isWrite = 0;
                                child[j].isRead = 0;
                            }
                        }
                        if( child[j].isWrite == 1 ){
                            check = 1;
                        }
                    }
                    selectTypeData[i].isWrite = check;
                    selectTypeData[i].isRead = check;
                }
            }
        newData.push(selectTypeData[i]);
    }
    // 判断不存在不选就全选
    let bool = true;
    for(let i=0;i<newData.length;i++){
        if(newData[i].isWrite == 0 || newData[i].isRead == 0)
        {
            bool = false;
            break;
        }
    }
  
    this.setState({
        selectTypeData:newData,
        allRead:bool,
        allWrite:bool,
    });
    this.props.select.allRead = bool;
    this.props.select.allWrite = bool;
}
// 选择全部可读
selectAllRead = (e) => {

    const selectTypeData = this.props.data;
    if(e.target.checked){
        for(let i=0;i<selectTypeData.length;i++){
            selectTypeData[i].isRead = 1;
            const child = selectTypeData[i].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isRead = 1;
                }    
            }
        }
        this.setState({
            selectTypeData,
            allRead:true,
        });
        this.props.select.allRead = true;
    }else{
        for(let k=0;k<selectTypeData.length;k++){
            selectTypeData[k].isRead = 0;
            selectTypeData[k].isWrite = 0;
            const child = selectTypeData[k].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isRead = 0;
                    child[j].isWrite = 0;
                }    
            }
        }
        this.setState({
            selectTypeData,
        });
        this.props.select.allRead = false;
        this.props.select.allWrite = false;
    }
   
    
}
// 选择全部可写
selectAllWrite = (e) => {
    const selectTypeData = this.props.data;
    if(e.target.checked){
        for(let i=0;i<selectTypeData.length;i++){
            selectTypeData[i].isWrite = 1;
            selectTypeData[i].isRead = 1;
            const child = selectTypeData[i].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isWrite = 1;
                    child[j].isRead = 1;
                }    
            }
        }
        this.setState({
            selectTypeData,
            allWrite:true,
        });
        this.props.select.allWrite = true;
        this.props.select.allRead = true;
    }else{
        for(let k=0;k<selectTypeData.length;k++){
            selectTypeData[k].isWrite = 0;
            selectTypeData[k].isRead = 0;
            const child = selectTypeData[k].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isWrite = 0;
                    child[j].isRead = 0;
                }    
            }
        }
        this.setState({
            selectTypeData,
            allWrite:false,
        });
        this.props.select.allWrite = false;
        this.props.select.allRead = false;
    }
   
}
// 选择全部、可读、可写
selectAll = (e) => {
    const selectTypeData = this.props.data;
    if(e.target.checked){
        for(let i=0;i<selectTypeData.length;i++){
            selectTypeData[i].isRead = 1;
            selectTypeData[i].isWrite = 1;
            const child = selectTypeData[i].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isWrite = 1;
                    child[j].isRead = 1;
                }    
            }
        }
        this.setState({
            selectTypeData,
            allRead:true,
            allWrite:true,
        });
        this.props.select.allRead = true;
        this.props.select.allWrite = true;
    }else{
        for(let k=0;k<selectTypeData.length;k++){
            selectTypeData[k].isRead = 0;
            selectTypeData[k].isWrite = 0;
            const child = selectTypeData[k].children;
            if(child && child.length>0){
                for(let j=0;j<child.length;j++){
                    child[j].isWrite = 0;
                    child[j].isRead = 0;
                }    
            }
        }
        this.setState({
            selectTypeData,
            allRead:false,
            allWrite:false,
        });
        this.props.select.allRead = false;
        this.props.select.allWrite = false;
    }
}
// 顶部全选Dom结构
selectAllDom = () => {
    
    const { allRead, allWrite } = this.props.select;
    let all = false;
    if(allRead && allWrite){
        all = true;
    }
    return (
        <div>
            <Checkbox checked={allRead} className={styles.check1} onChange={this.selectAllRead.bind(this)}></Checkbox>
            <Checkbox checked={allWrite} className={styles.check2} onChange={this.selectAllWrite.bind(this)}></Checkbox>
            <Checkbox checked={all} className={styles.check3} onChange={this.selectAll.bind(this)}></Checkbox>
        </div>
    );

}
  render(){
    const { selectTypeData } = this.state;
    const { loading } = this.props;
        const columns=[{
            title:'权限编号',
            key:'title',
            width:260,
            render:(index,row) => {
                return <span>{row.id}</span>;
            }
        },{
            title:'权限描述',
            key:'discrible',
            render:(index,row) => {
                return <div>{row.name}</div>
            }
        },{
            title:'可读',
            key:'read',
            className:'w-150',
            width:150,
            render:(key,row) => {
                let  bool = null;
                if(row.isRead){
                    bool = true;
                }else{
                    bool = false;
                }
                return (
                <div>
                    <Checkbox checked={bool} onChange={this.handleRead.bind(this,row)}></Checkbox>
                </div>
                )
            }
        },{
            title:'可写',
            key:'write',
            className:'w-150',
            width:150,
            render:(key,row) => {
                let  bool = null;
                if(row.isWrite){
                    bool = true;
                }else{
                    bool = false;
                }
                return (
                    <div>
                        <Checkbox checked={bool} onChange={this.handleWrite.bind(this,row)}></Checkbox>
                    </div>
                )
            }
        },{
            title:'可读写',
            key:'read-write',
            className:'w-150',
            width:150,
            render:(key,row) => {
                let  bool = null;
                if(row.isWrite&&row.isRead){
                    bool = true;
                }else{
                    bool = false;
                }
                return (
                    <div>
                        <Checkbox checked={bool} onChange={this.handleReadWrite.bind(this,row)}></Checkbox>
                    </div>
                )
            }
        }];
    return (
      <div className={styles.selectType}>
          <div className={styles.selsctAll}>
              {this.selectAllDom()}
          </div>
          <Table
            rowKey="id"
            pagination={false}
            columns={columns} 
            loading={loading}
            scroll={{ y: 500 }}
            dataSource={selectTypeData}/>
      </div>
    );
    
    
  }
}