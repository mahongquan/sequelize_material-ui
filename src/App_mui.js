import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DialogExampleSimple from './DialogExampleSimple';
import DialogImportStandard from './DialogImportStandard';
import ContactEdit from './ContactEdit';
import update from 'immutability-helper';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});
class SimpleMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (value) => {
    this.setState({ anchorEl: null });
    this.props.click_menu(value);
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <span>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <ArrowDropDownIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={()=>{
            this.handleClose(0);
          }}>详细</MenuItem>
          <MenuItem onClick={()=>{
            this.handleClose(1);
          }}>资料文件夹</MenuItem>
          <MenuItem onClick={()=>{
            this.handleClose(2);
          }}>核对备料计划</MenuItem>
        </Menu>
      </span>
    );
  }
}
// class SimpleSelect extends React.Component {
//   state = {
//     age: '',
//     name: 'hai',
//   };

//   handleChange = event => {
//     console.log(event);
//     this.setState({ [event.target.name]: event.target.value });
//   };
//   onClick = () => {
//     console.log('click');
//   };
//   render() {
//     // const { classes } = this.props;

//     return (
//       <Select
//         value="baoxiang"
//         onChange={this.handleChange}
//         inputProps={{
//           name: 'age',
//           id: 'age-simple',
//         }}
//       >
//         <MenuItem value="" onClick={this.onClick}>
//           <em>None</em>
//         </MenuItem>
//         <MenuItem value={10} onClick={this.onClick}>
//           Ten
//         </MenuItem>
//         <MenuItem value={20} onClick={this.onClick}>
//           Twenty
//         </MenuItem>
//         <MenuItem value={30} onClick={this.onClick}>
//           Thirty
//         </MenuItem>
//       </Select>
//     );
//   }
// }

// SimpleSelect.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// var SimpleSelectStyle = withStyles(styles)(SimpleSelect);
const theme = createMuiTheme({
  typography: {
    // In Japanese the characters are usually larger.
    fontSize: 16,
  },
  palette: {
    primary: blue,
  },
});
// console.log(darkBaseTheme);
// console.log(getMuiTheme(darkBaseTheme));

var host = '';
class App extends Component {
  mystate = {
    start: 0,
    limit: 10,
    total: 0,
    baoxiang: '',
    logined: false,
    search: '',
  };
  state = {
    contacts: [],
    limit: 10,
    user: 'AnonymousUser',
    start: 0,
    total: 0,
    search: '',
    start_input: 1,
    currentIndex: null,
    baoxiang: '',
    open: false,
    anchorEl: null,
    open_edit:false,
  };
  componentDidMount = () => {
    this.load_data();
  };
  load_data = () => {
    this.props.models.get_Contact(
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
        this.mystate.total=contacts.total;//because async ,mystate set must before state;
        this.setState({
          contacts: contacts.data, //.slice(0, MATCHING_ITEM_LIMIT),
          limit:this.mystate.limit,
          user: user,
          total:contacts.total,
          start:this.mystate.start
        });
      },(error)=>{
          // console.log(typeof(error));
          console.log(error)
          if(error instanceof SyntaxError){
            this.openDlgLogin();
          }
          else{
            this.setState({connect_error:true});
          }
      }
     );
  };
  handleTest = () => {
    //const contact2=update(this.state.contacts[this.state.selected],{baoxiang: {$set: "test"}});
    // console.log("handleTest");
    //console.log(contact2);
    //var one=this.state.contacts[this.state.selected];
    var idx = this.state.selected;
    console.log(idx);
    const contacts2 = update(this.state.contacts, {
      [idx]: { baoxiang: { $set: 'test111' } },
    });
    console.log(contacts2);
    //this.state.contacts[this.state.selected].baoxiang="test";
    this.setState({ contacts: contacts2 });
    //this.forceUpdate();
  };
  handleContactChange = (idx, contact) => {
    console.log(idx);
    const contacts2 = update(this.state.contacts, { [idx]: { $set: contact } });
    console.log(contacts2);
    this.setState({ contacts: contacts2 });
  };
  oncontactClick = key => {
    console.log('click row');
    console.log(key);
    this.setState({ selected: key });
  };
  handleImportStandard = () => {
    console.log('import row');
  };
  handleUserChange = user => {
    if (user === 'AnonymousUser') {
      this.setState({
        logined: false,
      });
    } else {
      this.setState({
        logined: true,
      });
    }
    this.setState({
      user: user,
      contacts: [], //slice(0, MATCHING_ITEM_LIMIT),
    });
    this.componentDidMount();
  };
  handleTouchTap = event => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };
  showlogin = () => {
    console.log('showlogin');
    var data = {
      username: 'mahongquan',
      password: '333333',
    };
    this.onLoginSubmit(data);
  };
  handleLogin = () => {
    console.log('login');
    Client.login_index(data => {
      //console.log(data.csrf_token);
      // const cookies = new Cookies();

      // cookies.set('csrftoken', this.state.csrf_token, { path: '/' });
      this.showlogin();
    });
  };
  handleLogout = () => {
    console.log('logout');
    Client.logout(data => {
      console.log('logout' + data);
      this.setState({
        logined: false,
        user: 'AnonymousUser',
      });
      this.handleUserChange(this.state.user);
    });
  };
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  handleSearchChange = e => {
    this.mystate.search = e.target.value;
    this.setState({ search: this.mystate.search });
    this.load_data();
  };
  handlePrev = e => {
    this.mystate.start = this.mystate.start - this.mystate.limit;
    if (this.mystate.start < 0) {
      this.mystate.start = 0;
    }
    this.load_data();
  };
  search = e => {
    this.mystate.start = 0;
    this.load_data();
  };
  jump = () => {
    this.mystate.start = parseInt(this.state.start_input, 10) - 1;
    if (this.mystate.start > this.mystate.total - this.mystate.limit)
      this.mystate.start = this.mystate.total - this.mystate.limit; //total >limit
    if (this.mystate.start < 0) {
      this.mystate.start = 0;
    }
    this.load_data();
  };
  handlePageChange = e => {
    this.setState({ start_input: e.target.value });
  };

  onDetailClick = contactid => {
    console.log(contactid);
    window.open(
      host + '/parts/showcontact/?id=' + contactid,
      'detail',
      'height=800,width=800,resizable=yes,scrollbars=yes'
    );
  };
  handleNext = e => {
    this.mystate.start = this.mystate.start + this.mystate.limit;
    if (this.mystate.start > this.mystate.total - this.mystate.limit)
      this.mystate.start = this.mystate.total - this.mystate.limit; //total >limit
    if (this.mystate.start < 0) {
      this.mystate.start = 0;
    }
    this.load_data();
  };

  onLoginSubmit = data => {
    console.log(data);
    Client.login(data.username, data.password, res => {
      if (res.success) {
        this.setState({
          logined: true,
        });
        this.setState({
          user: data.username,
        });
        this.handleUserChange(this.state.user);
      }
    });
  };
  inputChange = e => {
    console.log(this.refs.input);
    console.log(this.refs.style);
    var style = getComputedStyle(this.refs.input, null);
    console.log(style);
    this.setState({ test_input: e.target.value });
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleSearchKeyPress = e => {
    console.log(e);
  };
  click_menu_contact=(idx,value)=>{
    console.log(idx +","+value);
  }
  edit_contact=(idx)=>{
    console.log("edit"+idx);
    this.show_edit(idx);
  }
  xinyiqi=()=>{
    this.show_edit(null);
  }
  show_edit=(idx)=>{
    this.setState({open_edit:true,selected:idx});
  }
  close_edit=()=>{
    this.setState({open_edit:false}); 
  }
  render() {
    const contactRows = this.state.contacts.map((contact, idx) => (
      <TableRow key={idx}>
        <TableCell>{contact.id}</TableCell>
        <TableCell>{contact.hetongbh}</TableCell>
        <TableCell>{contact.yonghu}</TableCell>
        <TableCell>{contact.baoxiang}</TableCell>
        <TableCell>
          <Button onClick={
            ()=>{this.edit_contact(idx);
          }}>{contact.yiqibh}</Button>
          <SimpleMenu click_menu={(value)=>{
            this.click_menu_contact(idx,value);
          }}/>
        </TableCell>
      </TableRow>
    ));
    var hasprev = true;
    var hasnext = true;
    let prev;
    let next;
    console.log(this.mystate);
    console.log(this.state);
    if (this.state.start === 0) {
      hasprev = false;
    }
    console.log(this.state.start + this.state.limit >= this.state.total);
    if (this.state.start + this.state.limit >= this.state.total) {
      hasnext = false;
    }
    if (hasprev) {
      prev = (
        <Button variant="outlined" onClick={this.handlePrev}>
          前一页
        </Button>
      );
    } else {
      prev = null;
    }
    if (hasnext) {
      next = (
        <Button variant="outlined" onClick={this.handleNext}>
          后一页
        </Button>
      );
    } else {
      next = null;
    }
    const { anchorEl } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
           <ContactEdit open={this.state.open_edit}
                close={this.close_edit}
                title="新仪器"
                index={this.state.selected}
                parent={this}
          />
          <Toolbar>
            <DialogExampleSimple
              title="登录"
              disabled={this.state.logined}
              onLoginSubmit={this.onLoginSubmit}
            />
            <TextField
              id="id_search"
              type="text"
              placeholder="Search instrument..."
              value={this.state.searchValue}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleSearchKeyPress}
            />
            <div>
              <DialogImportStandard
                title="导入标样"
                disabled={this.state.logined}
                onLoginSubmit={this.onLoginSubmit}
              />
            </div>
            <div>
              <Button variant="outlined" onClick={this.xinyiqi}>新仪器</Button>
            </div>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>合同编号</TableCell>
                <TableCell>用户单位</TableCell>
                <TableCell>包箱</TableCell>
                <TableCell>仪器编号</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{contactRows}</TableBody>
          </Table>
          {prev}
          <label id="page">
            {this.state.start + 1}../{this.state.total}
          </label>
          {next}
          <TextField
            style={{width:"50px"}}
            maxLength="6"
            size="6"
            onChange={this.handlePageChange}
            value={this.state.start_input}
          />
          <Button
            id="page_go"
            variant="outlined"
            className="btn btn-info"
            onClick={this.jump}
          >
            跳转
          </Button>
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;
