const Group = require('./Group');
const Cell = require('./Cell');
const utils = require('../utils');

function Template (name) {
  this.name = name || '模板名';
  this.creator = '';
  this.createAt = new Date().valueOf();
  this.desc = '';
  this.table = [];
  this._groupIndex = 0;
}

Template.prototype.insertGroup = function(group) {
  group.index = this._groupIndex;
  this._groupIndex++;

  this.table.push(group);
  return this;
}
Template.prototype.insertCell = function(cell) {
  this.table.push(cell);
  return this;
}
Template.prototype.getCells = function() {
  let list = [];
  for (let cell of this.table) {
    if(cell instanceof Cell) {
      list.push(cell)
    }else if(cell instanceof Group) {
      list = list.concat(cell.getCells());
    }else {
      throw new TypeError('unknown template type:', cell);
    }
  }

  return list;
}
Template.prototype.removeCell = function(cell) {
  for (var i = 0; i < this.table.length; i++) {
    let _cell = this.table[i];
    if(_cell instanceof Cell) {
      if(_cell === cell) {
        this.table.splice(i, 1);
        break;
      }
    }else if(_cell instanceof Group) {
      _cell.removeCell(cell);
    }
  }

  return this;
}

Template.prototype.eval = function() {
  let cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    if(cell.func === 'value') {
      let name = cell.name;
      let value = cell.value || cell.default;
      data[name] = value
    }
  }

  for (var i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if(cell.func === 'expression') {
      try {
        let t = utils.parseExpression(cell.default, data);
        cells[i].value = eval(t);
      }catch (err) {
        cells[i].value = '数据错误';
        console.error('数据解析错误', cell.value, err);
      }
    }
  }
  return this;
}

Template.prototype.getData = function() {
  let cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    let name = cell.name;
    let value = cell.value;
    if(!value && cell.func === 'value') {
      value = cell.default;
    }
    data[name] = value
  }
  return data;
}
Template.prototype.setData = function(obj) {
  let cells = this.getCells();
  for (let cell of cells) {
    let name = cell.name;
    if(obj[name]) {
      cell.value = obj[name];
    }
  }
  return this.eval();
}

module.exports = Template;
