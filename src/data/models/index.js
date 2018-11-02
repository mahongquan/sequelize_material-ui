'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db_path = path.join(__dirname, '..', 'data.sqlite');
config.storage = db_path;
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
class models {
  static sequelize = sequelize;
  static Sequelize = Sequelize;
  static get_Contact = async function(data, callback) {
    var start = data.start;
    var limit = data.limit;
    let search = '',
      filter_danwei = '';
    if (data.filter_danwei) {
      filter_danwei = data.filter_danwei;
    }
    if (data.search) search = data.search;
    var baoxiang = '';
    if (data.baoxiang) {
      baoxiang = data.baoxiang;
    }
    var w = {};
    if (data.yiqibh && data.yiqibh != '') {
      w.yiqibh = {
        [Sequelize.Op.like]: '%' + data.yiqibh + '%',
      };
    }
    if (search != '') {
      w.hetongbh = {
        [Sequelize.Op.like]: '%' + search + '%',
      };
    }
    if (filter_danwei != '') {
      w.yonghu = {
        [Sequelize.Op.like]: '%' + filter_danwei + '%',
      };
    }
    if (baoxiang != '') {
      w.baoxiang = {
        [Sequelize.Op.like]: '%' + baoxiang + '%',
      };
    }
    console.log(w);
    var result= await models.Contact.findAndCountAll({
      where: w,
      offset: start,
      limit: limit,
      order: [['yujifahuo_date', 'DESC']],
    });
    console.log(result);
    var total = result.count;
    var contacts = result.rows;
    callback({
      data: contacts,
      total: total,
    });
  };
}
fs.readdirSync(__dirname)
  .filter(function(file) {
    return file.indexOf('.') !== 0 && file !== 'index.js';
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});
export default models;
