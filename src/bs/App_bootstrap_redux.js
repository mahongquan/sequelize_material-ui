import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TodoActions from './actions'
import React, { Component } from 'react';
import DlgTodos from './DlgTodos';
import {Navbar,Nav,NavItem,MenuItem,DropdownButton,Tooltip,Overlay} from "react-bootstrap";
import update from 'immutability-helper';
import Client from './Client';
import DlgLogin from './DlgLogin';
import ContactEdit2New from './ContactEdit2New';
import DlgWait from './DlgWait';
import DlgFolder from './DlgFolder';
import DlgStat from './DlgStat';
import DlgImport from './DlgImport';
import DlgImportHT from './DlgImportHT';
import DlgCheck from './DlgCheck'
import DlgUrl from './DlgUrl';
import DlgCopyPack from './DlgCopyPack';
import DlgItems from './DlgItems';
import DlgPacks from './DlgPacks';
import DlgDetail from './DlgDetail';

class App extends Component {
  mystate = {
    start:0,
    limit:20,
    total:0,
    baoxiang:"",
    logined: false,
    search:""
  }
   state = {
    search2:"",
    search2tip:"",
    target:null,
    showcontext:false,
    contacts: [],
    limit:10,
    user: "AnonymousUser",
    start:0,
    total:0,
    search:"",
    start_input:1,
    currentIndex:null,
    baoxiang:"",
    showDlgImport:false,
    showDlgEdit:false,
    showDlgDetail:false,
    showDlgTodos:false,
  }
  constructor(props) {
    super(props);
    this.dlgwait = React.createRef();
    this.dlgitems=React.createRef();
    this.dlgurl=React.createRef();
    this.dlgfolder=React.createRef();
    this.dlgcopypack=React.createRef();
    this.dlgcheck=React.createRef();
    this.dlgstat=React.createRef();
    this.dlgpacks=React.createRef();
    this.dlgimport=React.createRef();
    this.dlglogin=React.createRef();
    this.dlgimportHT=React.createRef();
  }
  handleClickFilter = (event) => {
    //console.log(event);
    event.preventDefault();
    event.stopPropagation();
    this.setState({target:event.target,showcontext:true});
    // setTimeout(()=>{
    //         this.setState({showcontext:false});
    //     },5000);
  }
  componentDidMount=() => {
    this.load_data();
    // this.props.actions.loadTodo();
    console.log(this.props);
  }
  load_data=()=>{

    
    Client.contacts(
      { start:this.mystate.start,
        limit:this.mystate.limit,
        search:this.mystate.search,
        baoxiang:this.mystate.baoxiang,
      }, 
      (contacts) => {
        var user=contacts.user;
        if(user===undefined){
          user="AnonymousUser"
        }
        this.props.actions.loadTodo(contacts.data);
        // this.mystate.total=contacts.total;//because async ,mystate set must before state;
        // this.setState({
        //   contacts: contacts.data, //.slice(0, MATCHING_ITEM_LIMIT),
        //   limit:this.mystate.limit,
        //   user: user,
        //   total:contacts.total,
        //   start:this.mystate.start
        // });
      },(error)=>{
          // console.log(typeof(error));
          if(error instanceof SyntaxError){
            this.openDlgLogin();
          }
      }
     );
  };
  handleContactChange = (idx,contact) => {
    console.log(idx);
    let contacts2
    if (idx!=null){
      contacts2=update(this.props.todos,{[idx]: {$set:contact}});
      console.log(contacts2);
    }
    else{
      contacts2=update(this.props.todos,{$unshift: [contact]});
    }
    this.setState({contacts:contacts2});
  };
  handleUserChange = (user) => {
    if (user === "AnonymousUser") {
      this.setState({
        logined: false
      });
    } else {
      this.setState({
        logined: true
      });
    }
    this.setState({
      user: user,
      contacts: [], //slice(0, MATCHING_ITEM_LIMIT),
    });
    this.load_data();
  };
  handleLogout = () => {
    console.log("logout");
    Client.logout((data) => {
      console.log("logout" + data);
      this.setState({
        logined: false,
        user: "AnonymousUser",
        total:0,
        start:0,
      });
      this.handleUserChange(this.state.user);
    });
  };
  handleSearchChange = (e) => {
    this.mystate.search=e.target.value;
    this.setState({search:this.mystate.search});
  };
  handleSearch2Change=(e)=>{
    this.setState({search2:e.target.value});
  }
  handlePrev = (e) => {
    this.mystate.start=this.mystate.start-this.mystate.limit;
    if(this.mystate.start<0) {this.mystate.start=0;}
    this.load_data();
  };
  search = (e) => {
    this.mystate.start=0;
    this.load_data();
  };
  jump=()=>{
    this.mystate.start=parseInt(this.state.start_input,10)-1;
    if(this.mystate.start>this.mystate.total-this.mystate.limit) 
        this.mystate.start=this.mystate.total-this.mystate.limit;//total >limit
    if(this.mystate.start<0)
    {
      this.mystate.start=0;
    }
    this.load_data();
  };
  handlePageChange= (e) => {
    this.setState({start_input:e.target.value});
  };

  onDetailClick=(contactid)=>{
    // console.log(contactid);
    // window.open(host+"/parts/showcontact/?id="+contactid, "detail", 'height=800,width=800,resizable=yes,scrollbars=yes');
    this.setState({showDlgDetail:true,contactid:contactid});
  }
  handleNext = (e) => {
    this.mystate.start=this.mystate.start+this.mystate.limit;
    if(this.mystate.start>this.mystate.total-this.mystate.limit) 
        this.mystate.start=this.mystate.total-this.mystate.limit;//total >limit
    if(this.mystate.start<0)
    {
      this.mystate.start=0;
    }
    this.load_data();
  };
  onSelectBaoxiang=(e) => {
    this.mystate.start=0;
    this.mystate.baoxiang=e;
    this.setState({baoxiang:e});
    this.load_data();
  }
  auto_change=(event, value)=>{
    console.log("auto_change");
    if (value.length>1)
    {
      this.setState({ auto_value:value, auto_loading: true });
      Client.get("/rest/Pack",{search:value} ,(items) => {
          this.setState({ auto_items: items.data, auto_loading: false })
      });
    }
    else{
      this.setState({ auto_value:value, auto_loading: false });
    };
  }
  onLoginSubmit= (data) => {
    // console.log(data);
    Client.login(data.username, data.password, (res) => {
      if (res.success) {
        this.setState({
          logined: true,
        });
        this.setState({
          user: data.username
        });
        this.handleUserChange(this.state.user);
      }
    });
  };
  handleEdit=(idx)=>{
    this.setState({showDlgEdit:true,currentIndex:idx});
    //this.setState({});
    //this.refs.contactedit.open2(idx);

  }
  //<button onClick={()=>this.opendlgurl("/rest/updateMethod",this,idx,contact.id)}>更新方法</button>
  //<button onClick={()=>this.opendlgwait(contact.id)}>全部文件</button>
  opendlgwait=(contactid)=>{
    this.dlgwait.current.open(contactid); 
  }
  handleContactChange2= (contact) => {
    var idx=this.currentIndex;
    console.log(idx);
    let contacts2
    if (idx!=null){
      contacts2=update(this.props.todos,{[idx]: {$set:contact}});
      console.log(contacts2);
    }
    else{
      contacts2=update(this.props.todos,{$unshift: [contact]});
    }
    this.setState({contacts:contacts2});
  };
  opendlgurl=(url,parent,idx,data)=>{
    this.currentIndex=idx;
    this.dlgurl.current.open(url,data,this.handleContactChange2); 
  }
  openDlgItems=()=>{
    this.dlgitems.current.open();
  }
  opendlgfolder=(contactid)=>{
   this.dlgfolder.current.open(contactid); 
  }
  opendlgcheck=(contactid,yiqibh)=>{
   this.dlgcheck.current.open(contactid,yiqibh); 
  }
  openDlgPacks=()=>{
    this.dlgpacks.current.open();
  }
  openDlgCopyPack=()=>{
    this.dlgcopypack.current.open();
  }
  openDlgStat=()=>{
    this.dlgstat.current.open();
  }
  openDlgLogin=()=>{
    // console.log("openDlgLogin");
    this.dlglogin.current.open();
  }
  openDlgImport=()=>{
    //this.refs.dlgimport.open();
    this.setState({showDlgImport:true});
  }
  openDlgImportHT=()=>{
    this.dlgimportHT.current.open();
  }
  onFilterDW =()=>{
        console.log("filter dw");
  }
  closeFilter=()=>{
    this.setState({showcontext:false});
  }
  render() {
    //console.log("render=========================");
    console.log(this.props);
    console.log(this.state);

    const contactRows = this.props.todos.map((contact, idx) => (
      <tr key={idx} >
        <td>{contact.id}</td>
        
        <td>
          {contact.yonghu}
        </td>
        <td>{contact.addr}</td>
        <td>{contact.hetongbh}</td>
        <td>
          <a onClick={()=>this.handleEdit(idx)}>{contact.yiqibh}</a>
          <DropdownButton title="" id="id_dropdown3">
            <MenuItem onSelect={() => this.onDetailClick(contact.id)}>详细</MenuItem>
            <MenuItem onSelect={()=>this.opendlgurl("/rest/updateMethod",this,idx,{id:contact.id})}>更新方法</MenuItem>
            <MenuItem onSelect={()=>this.opendlgwait(contact.id)}>全部文件</MenuItem>
            <MenuItem onSelect={()=>this.opendlgcheck(contact.id,contact.yiqibh)}>核对备料计划</MenuItem>
            <MenuItem onSelect={()=>this.opendlgfolder(contact.id)}>资料文件夹</MenuItem>
           
          </DropdownButton>
        </td>
        <td>{contact.yiqixinghao}</td><td>{contact.channels}</td>
        <td>{contact.baoxiang}</td>
        <td>{contact.yujifahuo_date}</td>
        
        <td>{contact.method}</td>
       </tr>
    ));
    // const tooltipdw = (
    //       <Tooltip id="tooltipdw"><strong>dw</strong></Tooltip>
    //     );
    var hasprev=true;
    var hasnext=true;
    let prev;
    let next;
    //console.log(this.mystate);
    //console.log(this.state);
    if(this.state.start===0){
      hasprev=false;
    }
    //console.log(this.state.start+this.state.limit>=this.state.total);
    if(this.state.start+this.state.limit>=this.state.total){

      hasnext=false;
    }
    if (hasprev){
      prev=(<a onClick={this.handlePrev}>前一页</a>);
    }
    else{
      prev=null;
    }
    if(hasnext){
      next=(<a onClick={this.handleNext}>后一页</a>);
    }
    else{
      next=null;
    }
    return (
<div id="todoapp" className="table-responsive">
    <Overlay target={this.state.target} 
        container={this} show={this.state.showcontext}  placement="bottom">
        <Tooltip id="tooltip1" >
            <input type="text" value={this.state.search2}  placeholder={this.state.search2tip} onChange={this.handleSearch2Change} />
            <button onClick={this.closeFilter}>close</button>
        </Tooltip>
    </Overlay>
    <DlgItems ref={this.dlgitems} />
    <DlgPacks ref={this.dlgpacks} />
    <DlgCopyPack ref={this.dlgcopypack} />
    <DlgStat ref={this.dlgstat} />
    <DlgImport showModal={this.state.showDlgImport} handleClose={()=>{
      this.setState({showDlgImport:false});
    }} />
    <DlgImportHT ref={this.dlgimportHT} parent={this} />
    <DlgCheck ref={this.dlgcheck} />
    <DlgFolder ref={this.dlgfolder} />
    <DlgWait ref={this.dlgwait} />
    <DlgUrl ref={this.dlgurl} />

    <DlgLogin ref={this.dlglogin} onLoginSubmit={this.onLoginSubmit} />
    <DlgDetail  contactid={this.state.contactid} showModal={this.state.showDlgDetail} 
      handleClose={()=>{
        this.setState({showDlgDetail:false});
    }} />
    <DlgTodos showModal={this.state.showDlgTodos} close={()=>{
      this.setState({showDlgTodos:false});
    }}/> 
    <ContactEdit2New showModal={this.state.showDlgEdit} 
      handleClose={()=>{
        this.setState({showDlgEdit:false});
      }}
      parent={this}   index={this.state.currentIndex} title="编辑"  />
    <Navbar className="navbar-inverse">
    <Navbar.Header>
      <Navbar.Brand>
        <a>装箱单</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">合同</NavItem>
      <NavItem eventKey={2} href="#" onClick={this.openDlgPacks}>包</NavItem>
      <NavItem eventKey={3} href="#" onClick={this.openDlgItems}>备件</NavItem>
      <NavItem eventKey={4} href="#" onClick={this.openDlgCopyPack}>复制包</NavItem>
      <NavItem eventKey={5} href="#" onClick={this.openDlgStat}>统计</NavItem>
      <NavItem eventKey={5} href="#" onClick={()=>{
        this.setState({showDlgTodos:true});
      }}>待办</NavItem>
    </Nav>
  </Navbar>
    <div style={{display:"flex",alignItems:"center"}}>
       <DropdownButton title={this.state.user} id="id_dropdown1">
          <li hidden={this.state.user!=="AnonymousUser"}>
          <a onClick={this.openDlgLogin}>登录</a>
          </li>
          <li  hidden={this.state.user==="AnonymousUser"} >
            <a onClick={this.handleLogout}>注销</a>
          </li>
       </DropdownButton>
       <div className="input-group" style={{width:"250px"}}>
     
      <input type="text" className="form-control" value={this.state.search}  placeholder="合同 or 仪器编号 or 客户" onChange={this.handleSearchChange} />
       <span className="input-group-btn">
        <button className="btn btn-info" type="button" onClick={this.search}>搜索<span className="glyphicon glyphicon-search" aria-hidden="true"></span></button>
      </span>
    </div>
       
       <button  style={{margin:"0px 10px 0px 10px"}}  className="btn btn-primary" onClick={()=>this.handleEdit(null)}>新仪器</button>
       <button className="btn btn-info" onClick={this.openDlgImport}>导入标样</button>
       <button  style={{margin:"0px 10px 0px 10px",display:"none"}}  className="btn btn-primary" onClick={this.openDlgImportHT}>导入合同</button>
    </div>
<table className="table-condensed table-bordered"><thead><tr><th>ID</th>
<th><span onClick={this.handleClickFilter}>客户单位</span>
</th>
<th>客户地址</th><th>合同编号</th>
<th><span onClick={this.handleClickFilter}>仪器编号</span></th>
<th>仪器型号</th><th>通道配置</th>
<th>包箱<DropdownButton title="" id="id_dropdown2">
      <MenuItem onSelect={() => this.onSelectBaoxiang("")}>*</MenuItem>
      <MenuItem onSelect={() => this.onSelectBaoxiang("马红权")}>马红权</MenuItem>
      <MenuItem onSelect={() => this.onSelectBaoxiang("陈旺")}>陈旺</MenuItem>
      <MenuItem onSelect={() => this.onSelectBaoxiang("吴振宁")}>吴振宁</MenuItem>
    </DropdownButton>
</th>
<th>入库时间</th><th>方法</th></tr></thead><tbody id="contact-list">{contactRows}</tbody>
</table>
{prev}<label id="page">{this.state.start+1}../{this.state.total}</label>{next}
<input maxLength="6" size="6" onChange={this.handlePageChange} value={this.state.start_input} />
<button id="page_go"  className="btn btn-info" onClick={this.jump}>跳转</button>
<div style={{minHeight:"200px"}}></div>
  </div>
    );
  }
}
const mapStateToProps = state => ({
   todos: state.todos
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

