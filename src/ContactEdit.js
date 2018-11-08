import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import UsePacks from './UsePacks';
import TextField from '@material-ui/core/TextField';
import Autosuggest from 'react-autosuggest';
import update from 'immutability-helper';
var moment = require('moment');
function toDateStr(d) {
  var m = d.getMonth() + 1;
  return d.getFullYear() + '-' + m + '-' + d.getDate();
}
export default class ContactEdit extends React.Component {
  state = {
    scroll: 'paper',
    shenhe: null,
    yiqixinghao: "",
    hetongbh: null,
    id: null,
    baoxiang: null,
    yonghu: null,
    tiaoshi_date: null,
    channels: "",
    yiqibh: null,
    addr: null,
    yujifahuo_date: null,
    yiqixinghao_items: ['CS-2800', 'ON-3000'],
    channels_items: ['2C+1S', '2O'],
    bg: {},
  };
  componentWillReceiveProps(nextProps) {
    if(!this.props.open && nextProps.open){
      this.onShow(nextProps.index);
    }
    else if(this.props.open && !nextProps.open)
    {
      this.onHide();
    }
  }
  onShow=(idx)=>{
    this.open2(idx);
  }
  onHide=()=>{
  }
  open2=(idx)=>{
    console.log("open2");
    console.log(idx);
    this.setState({bg:{}});
    this.parent=this.props.parent;
    this.index=idx;
    if (this.index==null){
      this.old={
        yujifahuo_date:moment().format("YYYY-MM-DD"),
        tiaoshi_date:moment().format("YYYY-MM-DD"),
        addr:"",
        channels:"",
        baoxiang:"",
        hetongbh:"",
        shenhe:"",
        yonghu:"",
        yiqibh:"",
        yiqixinghao:""
      };
      this.setState({hiddenPacks:true});
    }
    else{
      this.old=this.parent.state.contacts[this.index].dataValues;
      this.setState({hiddenPacks:false});
    }
    this.old.dianqi=this.old.dianqi || "";
    this.old.jixie=this.old.jixie || "";
    this.old.redao=this.old.redao || "";
    this.old.hongwai=this.old.hongwai || "";
    
    this.old.channels=this.old.channels || "";
    this.old.detail=this.old.detail || "";
    this.old.addr=this.old.addr || "";
    this.setState(this.old);
    console.log(this.old);
  }
  yiqixinghao_change = value => {};
  yiqixinghao_select = data => {
    console.log('selected');
    console.log(data);
    this.setState({ yiqixinghao: data });
  };
  channels_change = value => {};
  channels_select = data => {
    console.log('selected');
    console.log(data);
    //this.addrow(data.value);
    this.setState({ channels: data });
  };
  setdata = contact => {
    console.log(contact);
    var arr2 = contact.yujifahuo_date.split('-');
    var date2 = new Date(arr2[0], parseInt(arr2[1], 10) - 1, arr2[2]);
    arr2 = contact.tiaoshi_date.split('-');
    var date1 = new Date(arr2[0], parseInt(arr2[1], 10) - 1, arr2[2]);
    this.old = contact;
    this.setState({
      open: true,
      yujifahuo_date: date2,
      yonghu: contact.yonghu,
      yiqixinghao: contact.yiqixinghao,
      addr: contact.addr,
      hetongbh: contact.hetongbh,
      shenhe: contact.shenhe,
      tiaoshi_date: date1,
      id: contact.id,
      yiqibh: contact.yiqibh,
      baoxiang: contact.baoxiang,
      channels: contact.channels,
    });
  };
  handleOpen = () => {
    console.log('open');
    this.contact_idx = this.props.contact;
    this.parent = this.props.parent;
    var contact = this.parent.state.contacts[this.contact_idx];
    if (contact == null) {
      contact = {};
    }
    this.setdata(contact);
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = e => {
    console.log('change');
    // e.target.inputStyle={
    //   width: '50%',
    //   margin: '0 auto',
    //   border: '2px solid #FF9800',
    //   backgroundColor: '#ffd699',
    // };
    console.log(e.target.value);
    if (this.old[e.target.name] === e.target.value) {
      const bg2 = update(this.state.bg, {
        [e.target.name]: { $set: '#ffffff' },
      });
      //this.state.bg[e_target_name]="#ffffff";
      //console.log("equal");
      this.setState({ bg: bg2 });
    } else {
      const bg2 = update(this.state.bg, {
        [e.target.name]: { $set: '#8888ff' },
      });
      //this.state.bg[e_target_name]="#ffffff";
      //console.log("equal");
      this.setState({ bg: bg2 });
    }
    switch (e.target.name) {
      case 'baoxiang':
        this.setState({ baoxiang: e.target.value });
        break;
      case 'yonghu':
        this.setState({ yonghu: e.target.value });
        break;
      case 'addr':
        this.setState({ addr: e.target.value });
        break;
      case 'channels':
        this.setState({ channels: e.target.value });
        break;
      case 'yiqixinghao':
        this.setState({ yiqixinghao: e.target.value });
        break;
      case 'yiqibh':
        this.setState({ yiqibh: e.target.value });
        break;
      case 'shenhe':
        this.setState({ shenhe: e.target.value });
        break;
      case 'yujifahuo_date':
        this.setState({ yujifahuo_date: e.target.value });
        break;
      case 'tiaoshi_date':
        this.setState({ tiaoshi_date: e.target.value });
        break;
      case 'hetongbh':
        this.setState({ hetongbh: e.target.value });
        break;
      default:
        break;
    }
  };
  handleSave = data => {
    var url = '/rest/Contact';
    let newdate;
    let newdate2;
    newdate = toDateStr(this.state.yujifahuo_date);
    newdate2 = toDateStr(this.state.tiaoshi_date);
    var data1 = update(this.state, {
      tiaoshi_date: { $set: newdate2 },
      yujifahuo_date: { $set: newdate },
    });

    Client.postOrPut(url, data1, res => {
      this.setdata(res.data);
      this.setState({ bg: {} });
      this.parent.handleContactChange(this.contact_idx, res.data);
    });
  };
  handleClear = () => {
    console.log('clear');
    this.setState({
      yujifahuo_date: '',
      yonghu: '',
      yiqixinghao: '',
      addr: '',
      hetongbh: '',
      shenhe: '',
      tiaoshi_date: '',
      id: '',
      yiqibh: '',
      baoxiang: '',
      channels: '',
    });
  };
  handleCopy = () => {
    console.log('clear');
    this.setState({
      id: '',
    });
  };
  tiaoshi_date_change = (e, d) => {
    this.setState({ tiaoshi_date: d });
  };
  yujifahuo_date_change = (e, d) => {
    this.setState({ yujifahuo_date: d });
  };

  render() {
    const customContentStyle = {
      width: '100%',
      maxWidth: 'none',
    };
    //var m1 = new Date(this.state.yujifahuo_date.replace(/-/,"/"));
    //var m2 = new Date(this.state.tiaoshi_date.replace(/-/,"/"));
    return (
        <Dialog
          fullScreen
          scroll={this.state.scroll}
          open={this.props.open}
          onClose={this.props.close}
        >
          <table>
            <tbody>
              <tr>
                <td>ID:</td>
                <td>
                  <TextField
                    type="text"
                    id="id"
                    name="id"
                    disabled={true}
                    value={this.state.id}
                  />
                </td>
                <td>
                  <label>用户单位:</label>
                </td>
                <td>
                  <TextField
                    type="text"
                    id="yonghu"
                    name="yonghu"
                    value={this.state.yonghu}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>客户地址:</td>
                <td>
                  <TextField
                    type="text"
                    id="addr"
                    name="addr"
                    value={this.state.addr}
                    onChange={this.handleChange}
                  />
                </td>
                <td>通道配置:</td>
                <td>
                  <Autosuggest
                    inputProps={{
                      id: 'channels-autocomplete',
                      style: { backgroundColor: this.state.bg.channels },
                      value: this.state.channels,
                      onChange: this.channels_change,
                    }}
                    suggestions={[
                      '1O(低氧)',
                      '1O(高氧)',
                      '1O(低氧)+2N',
                      '1C(低碳)+2S',
                      '1C(高碳)+2S',
                      '2C+1S(低硫)',
                      '2C+1S(高硫)',
                      '2C+2S',
                      '2O+2N',
                      '2O',
                    ]}
                    getSuggestionValue={item => item}
                    onSuggestionSelected={this.channels_select}
                    onSuggestionsFetchRequested={() => {}}
                    onSuggestionsClearRequested={() => {}}
                    renderSuggestion={item => <span>{item}</span>}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>仪器型号:</label>
                </td>
                <td>
                  <Autosuggest
                    inputProps={{
                      id: 'yiqixinghao-autocomplete',
                      style: { backgroundColor: this.state.bg.yiqixinghao },
                      value: this.state.yiqixinghao,
                      onChange: this.yiqixinghao_change,
                    }}
                    suggestions={[
                      'CS-1011C',
                      'CS-2800',
                      'CS-3000',
                      'CS-3000G',
                      'HD-5',
                      'N-3000',
                      'O-3000',
                      'OH-3000',
                      'ON-3000',
                      'ON-4000',
                      'ONH-3000',
                    ]}
                    getSuggestionValue={item => item}
                    onSuggestionsFetchRequested={() => {}}
                    onSuggestionsClearRequested={() => {}}
                    onSuggestionSelected={this.yiqixinghao_select}
                    renderSuggestion={item => <span>{item}</span>}
                  />
                </td>
                <td>
                  <label>仪器编号:</label>
                </td>
                <td>
                  <TextField
                    type="text"
                    id="yiqibh"
                    name="yiqibh"
                    value={this.state.yiqibh}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>包箱:</label>
                </td>
                <td>
                  <TextField
                    type="text"
                    id="baoxiang"
                    name="baoxiang"
                    value={this.state.baoxiang}
                    onChange={this.handleChange}
                  />
                </td>
                <td>审核:</td>
                <td>
                  <TextField
                    id="shenhe"
                    name="shenhe"
                    value={this.state.shenhe}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>入库时间:</label>
                </td>
                <td>
                  <TextField
                    type="date"
                    locale="zh-Hans"
                    onChange={this.yujifahuo_date_change}
                    value={this.state.yujifahuo_date}
                  />
                </td>
                <td>调试时间:</td>
                <td>
                  <TextField
                    type="date"
                    locale="zh-Hans"
                    onChange={this.tiaoshi_date_change}
                    value={this.state.tiaoshi_date}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>合同编号:</label>
                </td>
                <td>
                  <TextField
                    type="text"
                    id="hetongbh"
                    name="hetongbh"
                    value={this.state.hetongbh}
                    onChange={this.handleChange}
                  />
                </td>
                <td>方法:</td>
                <td>
                  <TextField
                    type="text"
                    id="method"
                    name="method"
                    disabled={true}
                    value={this.state.method}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <Button variant="outlined" onClick={this.handleSave}>
              保存
            </Button>
            <Button variant="outlined" onClick={this.handleClear}>
              清除
            </Button>
            <Button variant="outlined" onClick={this.handleCopy}>
              复制
            </Button>
            <UsePacks contact_id={this.state.id} />
            <Button variant="outlined" onClick={this.props.close}>
              取消
            </Button>
          </div>
        </Dialog>
    );
  }
}
