import React from 'react';
import ReactDOM from 'react-dom';
import models from "./data/models";
// const fs = require('fs');
const path = require('path');
// function fileExist(p) {
//   if (fs.existsSync(p)) {
//     return true;
//   }
//   return false;
// }
function link(where, module_name) {
  // body...
  var thelink = document.createElement('link');
  thelink.setAttribute('rel', 'stylesheet');
  var file1 = path.join(where, module_name);
  thelink.setAttribute('href', file1);
  document.head.appendChild(thelink);
}
function getWhere() {
  let path = window.require('electron').ipcRenderer.sendSync('getpath');
  let where;
  if (path === '.') {
    where = '..';
  } else {
    where = '../..';
  }
  return where;
}
let module_name = './mui/App';
let where = getWhere();
// link(where, 'node_modules/bootstrap/dist/css/bootstrap.min.css');
link('./bs', './autosuggest.css');
link(where, 'node_modules/react-datetime/css/react-datetime.css');
let App = require(module_name).default;
console.log(models);
window.models=models;
models.sequelize.sync().then(
  ()=>{
    ReactDOM.render(<App models={models} />, document.getElementById('root'));
  }
);
