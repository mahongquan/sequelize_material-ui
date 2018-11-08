import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Client from './Client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ItemEdit from './ItemEdit'
import update from 'immutability-helper';
var _ = require('lodash');
class DlgItems extends Component {
  mystate = {
    start:0,
    limit:5,
    baoxiang:"",
    logined: false,
    search:""
  }
   state = {
      items: [],
      start:0,
      total:0,
      search:"",
      start_input:1,
      showModal: false,
      error:"",
      lbls:[],
      values:[],
      newPackName: '',
      newname:"",
      auto_value: '',
      auto_items:[],
      auto_loading: false,
  }
  shouldComponentUpdate(nextProps, nextState) {

    if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
       return true
    } else {
       return false
    }
  }
  close=()=>{
    console.log("close");
    this.setState({ showModal: false });
  }
  open=()=>{
   this.setState({ showModal: true });
   this.loaddata();
  }
  loaddata=()=>{
   Client.get("/rest/Item",
      { start:this.mystate.start,
        limit:this.mystate.limit,
        query:this.mystate.search,
      }, 
      (contacts2) => {
        console.log(contacts2);
        this.setState({
          items: contacts2.data, //.slice(0, MATCHING_ITEM_LIMIT),
          total:contacts2.total,
          start:this.mystate.start
        });
        this.mystate.total=contacts2.total;
    });
  }
  handlePrev = (e) => {
    this.mystate.start=this.mystate.start-this.mystate.limit;
    if(this.mystate.start<0) {this.mystate.start=0;}
    //this.setState({start:start});
    this.loaddata();
  };
  handlePackItemChange = (idx,contact) => {
    console.log(idx);
    const contacts2=update(this.state.items,{[idx]: {$set:contact}});
    console.log(contacts2);
    this.setState({items:contacts2});
  };
  handleNext = (e) => {
    this.mystate.start=this.mystate.start+this.mystate.limit;
    if(this.mystate.start>this.mystate.total-this.mystate.limit) 
        this.mystate.start=this.mystate.total-this.mystate.limit;//total >limit
    if(this.mystate.start<0)
    {
      this.mystate.start=0;
    }
    this.loaddata();
  };
  jump=()=>{
    this.mystate.start=parseInt(this.state.start_input,10)-1;
    if(this.mystate.start>this.mystate.total-this.mystate.limit) 
        this.mystate.start=this.mystate.total-this.mystate.limit;//total >limit
    if(this.mystate.start<0)
    {
      this.mystate.start=0;
    }
    this.loaddata();
  };
  handlePageChange= (e) => {
    this.setState({start_input:e.target.value});
  };
  handleSearchChange = (e) => {
    this.mystate.search=e.target.value;
    this.setState({search:this.mystate.search});
  };
  search = (e) => {
    this.mystate.start=0;
    this.loaddata();
  };
  handleEdit=(idx)=>{
    this.refs.dlg.open2(idx);
  }
  mapfunc=(contact, idx) => {
      if (!contact.image || contact.image==="")
        return (<TableRow key={idx} >
          <TableCell>{contact.id}</TableCell>
          <TableCell>{contact.bh}</TableCell>
          <TableCell><a onClick={()=>this.handleEdit(idx)}>{contact.name}</a></TableCell>
          <TableCell>{contact.guige}</TableCell>
          <TableCell>{contact.danwei}</TableCell>
          <TableCell></TableCell>
        </TableRow>);
      else
        return (<TableRow key={idx} >
          <TableCell>{contact.id}</TableCell>
          <TableCell>{contact.bh}</TableCell>
          <TableCell><a onClick={()=>this.handleEdit(idx)}>{contact.name}</a></TableCell>
          <TableCell>{contact.guige}</TableCell>
          <TableCell>{contact.danwei}</TableCell>
          <TableCell><img alt="no" src={"/media/"+contact.image} width="100" height="100"></img></TableCell>
        </TableRow>);
  }
  render=()=>{
    const contactRows = this.state.items.map(this.mapfunc);
    var hasprev=true;
    var hasnext=true;
    let prev;
    let next;
    //console.log(this.mystate);
    //console.log(this.state);
    if(this.state.start===0){
      hasprev=false;
    }
    //console.log(this.state.start+this.mystate.limit>=this.state.total);
    if(this.state.start+this.mystate.limit>=this.state.total){

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
          <Dialog open={this.state.showModal} onClose={this.close} >
              <DialogTitle>备件</DialogTitle>
            <DialogContent>
              <ItemEdit ref="dlg" parent={this} />
              <input type="text" value={this.state.search}  placeholder="" onChange={this.handleSearchChange} />
              <Button id="id_bt_search" className="btm btn-info" onClick={this.search}>搜索</Button>
               <Table responsive bordered condensed><TableHead>
               <TableRow>
               <TableCell>ID</TableCell>
               <TableCell>编号</TableCell>
               <TableCell>名称</TableCell>
               <TableCell>规格</TableCell>
               <TableCell>单位</TableCell>
               <TableCell>图片</TableCell>
               </TableRow></TableHead><TableBody id="contact-list">{contactRows}</TableBody></Table>
              {prev}
              <label id="page">{this.state.start+1}../{this.state.total}</label>
              {next}
              <input maxLength="6" size="6" onChange={this.handlePageChange} value={this.state.start_input} />
              <Button id="page_go"  className="btn btn-info" onClick={this.jump}>跳转</Button>
           </DialogContent>
      </Dialog>
    );
  }
};
export default DlgItems;