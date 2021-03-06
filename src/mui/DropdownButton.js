import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
export default class SimpleMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (value) => {
    this.setState({ anchorEl: null });
    // this.props.click_menu(value);
  };

  render() {
    const { anchorEl } = this.state;
    let cs=this.props.children.map((c,idx)=>{
      // console.log(c);
      return  (<MenuItem key={idx} onClick={() =>{
        c.props.onClick();
        this.setState({ anchorEl: null });
      }}>{c.props.children}</MenuItem>);
    });
    return (
      <span>
        <Button   color="inherit" 
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
        <Typography color="inherit">
          {this.props.title}
        </Typography>
          <ArrowDropDownIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {cs}
        </Menu>
      </span>
    );
  }
}